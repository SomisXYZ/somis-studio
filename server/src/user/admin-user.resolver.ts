import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { S3Service } from '~/aws/s3.service'
import {
    AwsPresignedPost,
    QueryResolvers,
    MutationResolvers,
    User,
    MutationAdminUpdateUserArgs,
    MutationAdminUpdateUserProfileImageArgs,
    MutationAdminUpdateUserCoverImageArgs,
    MutationAdminCreateUserArgs,
    MutationAdminDeleteUserArgs,
} from '~/gql/generated'
import { IContext } from '~/types'
import { CustomError, GenericError } from '~/utils/error'

import { IUser } from './user.schema'
import { UserService } from './user.service'

@Resolver()
export class AdminUserResolver implements Partial<QueryResolvers<IContext> & MutationResolvers<IContext>> {
    constructor(private readonly userService: UserService, private readonly s3Service: S3Service) {}

    @Mutation()
    async adminCreateUser(@Context() _ctx: IContext, @Args() args: MutationAdminCreateUserArgs): Promise<User> {
        return (await this.userService.createUser({
            address: args.input.address,
            name: args.input.name,
            username: args.input.username,
            role: args.input.role ?? 'USER',
            description: args.input.description ?? undefined,
        })) as unknown as User
    }

    @Mutation()
    async adminUpdateUser(@Context() _ctx: IContext, @Args() args: MutationAdminUpdateUserArgs) {
        // map null value to undefined
        const param: Partial<IUser> = {
            username: args.input.username ?? undefined,
            name: args.input.name ?? undefined,
            role: args.input.role ?? undefined,
            description: args.input.description ?? undefined,
        }
        const result = await this.userService.updateUser(args.address, param)
        if (result == null) {
            throw new CustomError(GenericError.NotFound)
        }
        return result as unknown as User
    }

    @Mutation()
    async adminDeleteUser(@Context() _ctx: IContext, @Args() args: MutationAdminDeleteUserArgs): Promise<User> {
        const result = await this.userService.deleteUser(args.address)
        if (result == null) {
            throw new CustomError(GenericError.NotFound)
        }
        return result as unknown as User
    }

    @Mutation()
    async adminUpdateUserProfileImage(
        @Context() _ctx: IContext,
        @Args() args: MutationAdminUpdateUserProfileImageArgs,
    ): Promise<AwsPresignedPost> {
        const { address } = args
        const filename = `user_${address}_profile`
        const result = await this.s3Service.getSignedUploadURL(filename)
        await this.userService.updateUser(address, { profileUrl: `${result.url}/${filename}?t=${Date.now()}` })
        return result
    }

    @Mutation()
    async adminUpdateUserCoverImage(
        @Context() _ctx: IContext,
        @Args() args: MutationAdminUpdateUserCoverImageArgs,
    ): Promise<AwsPresignedPost> {
        const { address } = args
        const filename = `user_${address}_cover`
        const result = await this.s3Service.getSignedUploadURL(filename)
        await this.userService.updateUser(address, { coverUrl: `${result.url}/${filename}?t=${Date.now()}` })
        return result
    }
}
