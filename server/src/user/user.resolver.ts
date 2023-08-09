import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { S3Service } from '~/aws/s3.service'
import { CollectionService } from '~/collection/collection.service'
import {
    AwsPresignedPost,
    QueryResolvers,
    MutationResolvers,
    User,
    MutationUpdateUserArgs,
    QueryUserArgs,
    QueryUsersArgs,
    UsersResult,
    UserResolvers,
    MutationIndexWalletArgs,
} from '~/gql/generated'
import { MarketplaceService } from '~/marketplace/marketplace.service'
import { NftService } from '~/nft/nft.service'
import { IContext } from '~/types'
import { AuthError, CustomError, SystemError } from '~/utils/error'

import { IUser } from './user.schema'
import { UserService, UserSorting } from './user.service'

@Resolver('User')
export class UserResolver
    implements Partial<QueryResolvers<IContext> & MutationResolvers<IContext> & UserResolvers<IContext, IUser>>
{
    constructor(
        private readonly userService: UserService,
        private readonly s3Service: S3Service,
        private readonly marketplaceService: MarketplaceService,
        private readonly nftService: NftService,
        private readonly collectionService: CollectionService,
    ) {}

    @Query()
    async me(@Context() ctx: IContext): Promise<User> {
        if (ctx.userPublicKey == null) {
            throw new CustomError(AuthError.Unauthorized)
        }
        const result = await this.userService.getUser(ctx.userPublicKey)
        if (result == null) {
            throw new CustomError(SystemError.InternalServerError)
        }
        return result as unknown as User
    }

    @Query()
    async user(@Context() _ctx: IContext, @Args() args: QueryUserArgs): Promise<User> {
        const result = await this.userService.getUser(args.address)
        if (result == null) {
            throw new CustomError(SystemError.InternalServerError)
        }
        return result as unknown as User
    }

    @Query()
    async users(@Context() _ctx: IContext, @Args() args: QueryUsersArgs): Promise<UsersResult> {
        let sortBy: UserSorting
        switch (args.sorting?.field) {
            case 'NAME':
                sortBy = 'name'
                break
            case 'USERNAME':
                sortBy = 'username'
                break
            case 'ROLE':
                sortBy = 'role'
                break
            case 'LASTLOGIN':
            default:
                sortBy = 'lastLogin'
        }

        const result = await this.userService.listUsers({
            keyword: args.filter?.keyword,
            role: args.filter?.role ?? undefined,
            skip: args.paging?.skip ?? 0,
            limit: args.paging?.limit ?? 20,
            order: args.sorting?.order ?? 'DES',
            sortBy,
        })
        if (result == null) {
            throw new CustomError(SystemError.InternalServerError)
        }
        return result as unknown as UsersResult
    }

    @Mutation()
    async updateUser(@Context() ctx: IContext, @Args() args: MutationUpdateUserArgs) {
        if (ctx.userPublicKey == null) {
            throw new Error('Unauthoried')
        }

        // map null value to undefined
        const param: Partial<IUser> = {
            username: args.input.username ?? undefined,
            name: args.input.name ?? undefined,
        }
        return (await this.userService.updateUser(ctx.userPublicKey, param)) as unknown as User
    }

    @Mutation()
    async updateUserProfileImage(@Context() ctx: IContext): Promise<AwsPresignedPost> {
        if (ctx.userPublicKey == null) {
            throw new CustomError(AuthError.Unauthorized)
        }

        const filename = `user_${ctx.userPublicKey}_profile`
        const result = await this.s3Service.getSignedUploadURL(filename)

        await this.userService.updateUser(ctx.userPublicKey, {
            profileUrl: `${result.url}/${filename}?t=${Date.now()}`,
        })

        return result
    }

    @Mutation()
    async updateUserCoverImage(@Context() ctx: IContext): Promise<AwsPresignedPost> {
        if (ctx.userPublicKey == null) {
            throw new CustomError(AuthError.Unauthorized)
        }

        const filename = `user_${ctx.userPublicKey}_cover`
        const result = await this.s3Service.getSignedUploadURL(filename)

        await this.userService.updateUser(ctx.userPublicKey, {
            coverUrl: `${result.url}/${filename}?t=${Date.now()}`,
        })

        return result
    }

    @Mutation()
    async indexWallet(@Context() ctx: IContext, @Args() args: MutationIndexWalletArgs): Promise<boolean> {
        if (ctx.userPublicKey == null) {
            throw new CustomError(AuthError.Unauthorized)
        }

        await this.userService.indexWallet(args.address)

        return true
    }

    @ResolveField()
    async ownedItems(@Parent() parent: IUser) {
        return await this.nftService.ownedNftCountByOwnerDataLoader.load(parent.address)
    }

    @ResolveField()
    async listed(@Parent() parent: IUser) {
        return await this.marketplaceService.listedNftCountByOwnerDataLoader.load(parent.address)
    }

    @ResolveField()
    async unlisted(@Parent() parent: IUser) {
        const owned = await this.nftService.ownedNftCountByOwnerDataLoader.load(parent.address)
        const listed = await this.marketplaceService.listedNftCountByOwnerDataLoader.load(parent.address)
        return owned - listed
    }

    @ResolveField()
    async estValue(@Parent() parent: IUser) {
        const ownedNfts = await this.nftService.nftsDataLoaderByOwnerAddrsssDataLoader.load(parent.address)

        const resolved = await Promise.all(
            ownedNfts.map((nft) => {
                return nft.collectionAddress != null
                    ? this.collectionService.collectionStatsDataLoader.load(nft.collectionAddress)
                    : undefined
            }),
        )

        return resolved.reduce<number>((acc, curr) => {
            const floor = curr?.floor != null ? parseFloat(curr.floor) : 0
            return acc + floor
        }, 0)
    }

    @ResolveField()
    async discordConnected(@Parent() parent: IUser) {
        return parent.discordId != null
    }

    @ResolveField()
    async twitterConnected(@Parent() parent: IUser) {
        return parent.twitterId != null
    }
}
