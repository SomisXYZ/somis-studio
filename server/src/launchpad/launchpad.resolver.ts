import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { S3Service } from '~/aws/s3.service'
import { SqsService } from '~/aws/sqs.service'
import { CollectionService } from '~/collection/collection.service'
import {
    Launchpad,
    MutationResolvers,
    QueryResolvers,
    MutationCreateLaunchpadArgs,
    MutationUpdateLaunchpadArgs,
    MutationDeleteLaunchpadArgs,
    QueryLaunchpadsArgs,
    QueryLaunchpadArgs,
    LaunchpadsResult,
    AwsPresignedPost,
    MutationUpdateLaunchpadImageArgs,
    MutationUpdateLaunchpadCoverArgs,
    MutationOnMintArgs,
    Collection,
    LaunchpadResolvers,
} from '~/gql/generated'
import { NftService } from '~/nft/nft.service'
import { IContext } from '~/types'
import { CustomError, GenericError } from '~/utils/error'

import { ILaunchpad } from './launchpad.schema'
import { LaunchpadService } from './launchpad.service'

@Resolver('Launchpad')
export class LaunchpadResolver
    implements
        Partial<
            Omit<QueryResolvers<IContext>, 'collection'> &
                MutationResolvers<IContext> &
                LaunchpadResolvers<IContext, ILaunchpad>
        >
{
    constructor(
        private readonly launchpadService: LaunchpadService,
        private readonly s3Service: S3Service,
        private readonly nftService: NftService,
        private readonly collectionService: CollectionService,
        private readonly sqsService: SqsService,
    ) {}

    @Query()
    async launchpads(@Context() _ctx: IContext, @Args() args: QueryLaunchpadsArgs): Promise<LaunchpadsResult> {
        const { filter, paging } = args
        return await this.launchpadService.getLaunchpads({
            keyword: filter?.keyword ?? undefined,
            whitelisted: filter?.whitelisted ?? true,
            owner: filter?.owner ?? undefined,
            skip: paging?.skip ?? undefined,
            limit: paging?.limit ?? undefined,
        })
    }

    @Query()
    async launchpad(@Context() _ctx: IContext, @Args() args: QueryLaunchpadArgs): Promise<Launchpad | null> {
        const { id } = args
        return await this.launchpadService.getLaunchpad({
            id,
        })
    }

    @Mutation()
    async createLaunchpad(@Context() ctx: IContext, @Args() args: MutationCreateLaunchpadArgs): Promise<Launchpad> {
        if (args.input.collectionAddress != null && ctx.role != 'ADMIN') {
            await this.collectionService.verifyCollectionOwner(ctx, args.input.collectionAddress)
        }
        const result = await this.launchpadService.createLaunchpad({
            name: args.input.name ?? undefined,
            category: args.input.category ?? undefined,
            sections: args.input.sections ?? [],
            flags: args.input.flags ?? [],
            launchDate: args.input.launchDate ?? undefined,
            mintPrice: args.input.mintPrice ?? undefined,
            twitter: args.input.twitter ?? undefined,
            discord: args.input.discord ?? undefined,
            website: args.input.website ?? undefined,
            supply: args.input.supply ?? undefined,
            royalty: args.input.royalty ?? undefined,
            listing: args.input.listing ?? undefined,
            venue: args.input.venue ?? undefined,
            venues: args.input.venues ?? [],
            publisher: args.input.publisher ?? undefined,
            metadataStore: args.input.metadataStore ?? undefined,
            borrowPolicy: args.input.borrowPolicy ?? undefined,
            hatchMetadata: args.input.hatchMetadata ?? undefined,
            hatchDate: args.input.hatchDate ?? undefined,
            warehouse: args.input.warehouse ?? undefined,
            market: args.input.market ?? undefined,
            collectionAddress: args.input.collectionAddress ?? undefined,
            zealyXp: args.input.zealyXp ?? undefined,
            zealySubdomain: args.input.zealySubdomain ?? undefined,
            zealyApiKey: args.input.zealyApiKey ?? undefined,
            order: args.input.order ?? undefined,
            owner: ctx.userPublicKey,
            whitelisted: ctx.role === 'ADMIN' ? args.input.whitelisted ?? undefined : undefined,
        })
        return result
    }

    @Mutation()
    async updateLaunchpad(@Context() ctx: IContext, @Args() args: MutationUpdateLaunchpadArgs): Promise<Launchpad> {
        const { id, input } = args
        await this.launchpadService.verifiyLaunchpadOwner(ctx, id)
        if (args.input.collectionAddress != null && ctx.role != 'ADMIN') {
            await this.collectionService.verifyCollectionOwner(ctx, args.input.collectionAddress)
        }
        return await this.launchpadService.updateLaunchpad(id, {
            name: input.name ?? undefined,
            category: input.category ?? undefined,
            sections: input.sections ?? undefined,
            flags: input.flags ?? undefined,
            launchDate: input.launchDate ?? undefined,
            mintPrice: input.mintPrice ?? undefined,
            twitter: input.twitter ?? undefined,
            discord: input.discord ?? undefined,
            website: input.website ?? undefined,
            supply: input.supply ?? undefined,
            royalty: input.royalty ?? undefined,
            listing: args.input.listing ?? undefined,
            venue: args.input.venue ?? undefined,
            venues: args.input.venues ?? undefined,
            warehouse: args.input.warehouse ?? undefined,
            publisher: args.input.publisher ?? undefined,
            metadataStore: args.input.metadataStore ?? undefined,
            borrowPolicy: args.input.borrowPolicy ?? undefined,
            hatchMetadata: args.input.hatchMetadata ?? undefined,
            hatchDate: args.input.hatchDate ?? undefined,
            market: args.input.market ?? undefined,
            collectionAddress: args.input.collectionAddress ?? undefined,
            zealyXp: args.input.zealyXp ?? undefined,
            zealySubdomain: args.input.zealySubdomain ?? undefined,
            zealyApiKey: args.input.zealyApiKey ?? undefined,
            order: args.input.order ?? undefined,
            whitelisted: ctx.role === 'ADMIN' ? args.input.whitelisted ?? undefined : undefined,
        })
    }

    @Mutation()
    async deleteLaunchpad(@Context() ctx: IContext, @Args() args: MutationDeleteLaunchpadArgs): Promise<Launchpad> {
        const { id } = args
        await this.launchpadService.verifiyLaunchpadOwner(ctx, id)
        return await this.launchpadService.deleteLaunchpad(id)
    }

    @Mutation()
    async updateLaunchpadImage(
        @Context() ctx: IContext,
        @Args() args: MutationUpdateLaunchpadImageArgs,
    ): Promise<AwsPresignedPost> {
        const { id } = args
        await this.launchpadService.verifiyLaunchpadOwner(ctx, id)
        const filename = `launchpad_${id}_main`
        const result = await this.s3Service.getSignedUploadURL(filename)

        await this.launchpadService.updateLaunchpad(id, {
            imageUrl: `${result.url}/${filename}?t=${Date.now()}`,
        })
        return result
    }

    @Mutation()
    async updateLaunchpadCover(
        @Context() ctx: IContext,
        @Args() args: MutationUpdateLaunchpadCoverArgs,
    ): Promise<AwsPresignedPost> {
        const { id } = args
        await this.launchpadService.verifiyLaunchpadOwner(ctx, id)
        const filename = `launchpad_${id}_cover`
        const result = await this.s3Service.getSignedUploadURL(filename)

        await this.launchpadService.updateLaunchpad(id, {
            coverUrl: `${result.url}/${filename}?t=${Date.now()}`,
        })
        return result
    }

    @Mutation()
    async updateLaunchpadLogo(
        @Context() ctx: IContext,
        @Args() args: MutationUpdateLaunchpadCoverArgs,
    ): Promise<AwsPresignedPost> {
        const { id } = args
        await this.launchpadService.verifiyLaunchpadOwner(ctx, id)
        const filename = `launchpad_${id}_logo`
        const result = await this.s3Service.getSignedUploadURL(filename)

        await this.launchpadService.updateLaunchpad(id, {
            logoUrl: `${result.url}/${filename}?t=${Date.now()}`,
        })
        return result
    }

    @Mutation()
    async onMint(@Context() ctx: IContext, @Args() args: MutationOnMintArgs): Promise<boolean> {
        const { launchpadId, nftAddress, txId } = args
        const launchpad = await this.launchpadService.getLaunchpad({ id: launchpadId })
        if (launchpad == null) {
            throw new CustomError(GenericError.NotFound)
        }

        await this.nftService.upsertNft(nftAddress, {
            collectionAddress: launchpad.collectionAddress,
            owner: ctx.userPublicKey,
        })

        await this.nftService.createNftEvent({
            nftAddress,
            collectionAddress: launchpad.collectionAddress,
            type: 'MINT',
            newOwner: ctx.userPublicKey,
            price: launchpad.mintPrice,
            createdAt: Date.now(),
            user: ctx.userPublicKey,
            txId,
        })

        await this.sqsService.indexNft(nftAddress, true)
        if (launchpad.collectionAddress) {
            await this.collectionService.collectionItemCountDataLoader.clear(launchpad.collectionAddress)
            await this.collectionService.collectionOwnerCountDataLoader.clear(launchpad.collectionAddress)
            await this.collectionService.collectionsAttributesDataLoader.clear(launchpad.collectionAddress)
        }

        return true
    }

    @ResolveField()
    async totalSales(@Parent() parent: ILaunchpad): Promise<string> {
        if (parent.collectionAddress == null) {
            return '0'
        }
        const itemsCount = await this.collectionService.collectionItemCountDataLoader.load(parent.collectionAddress)
        return (itemsCount * parseFloat(parent.mintPrice ?? '0')).toString()
    }

    @ResolveField()
    async items(@Parent() parent: ILaunchpad): Promise<number> {
        if (parent.collectionAddress == null) {
            return 0
        }
        return await this.collectionService.collectionItemCountDataLoader.load(parent.collectionAddress)
    }

    @ResolveField()
    async owners(@Parent() parent: ILaunchpad): Promise<number> {
        if (parent.collectionAddress == null) {
            return 0
        }
        return await this.collectionService.collectionOwnerCountDataLoader.load(parent.collectionAddress)
    }

    @ResolveField()
    async collection(@Parent() parent: ILaunchpad): Promise<Collection | null> {
        if (parent.collectionAddress == null) {
            return null
        }
        return (await this.collectionService.collectionDataLoader.load(
            parent.collectionAddress,
        )) as unknown as Collection
    }

    @ResolveField()
    async logoUrl(@Parent() parent: ILaunchpad): Promise<string> {
        return parent.logoUrl ?? parent.imageUrl
    }

    @ResolveField()
    async crew3Subdomain(@Parent() parent: ILaunchpad): Promise<string> {
        return parent.zealySubdomain as string
    }
}
