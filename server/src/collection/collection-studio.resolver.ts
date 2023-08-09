import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { S3Service } from '~/aws/s3.service'
import { SqsService } from '~/aws/sqs.service'
import {
    Collection,
    CollectionResolvers,
    MutationResolvers,
    QueryResolvers,
    MutationUpdateCollectionArgs,
    MutationUpdateCollectionImageUrlArgs,
    AwsPresignedPost,
    MutationUpdateCollectionCoverUrlArgs,
    MutationCreateCollectionArgs,
    MutationDeleteCollectionArgs,
    MutationIndexCollectionArgs,
    MutationGetNftUploadImageUrlArgs,
} from '~/gql/generated'
import { MarketplaceService } from '~/marketplace/marketplace.service'
import { IContext } from '~/types'
import { CustomError, GenericError } from '~/utils/error'

import { ICollection } from './collection.schema'
import { CollectionService } from './collection.service'

@Resolver()
export class CollectionStudioResolver
    implements
        Partial<QueryResolvers<IContext> & MutationResolvers<IContext> & CollectionResolvers<IContext, ICollection>>
{
    constructor(
        private readonly collectionService: CollectionService,
        private readonly s3Service: S3Service,
        private readonly sqsService: SqsService,
        private readonly marketService: MarketplaceService,
    ) {}

    @Mutation()
    async createCollection(@Context() ctx: IContext, @Args() args: MutationCreateCollectionArgs): Promise<Collection> {
        const { input } = args
        return this.collectionService.createCollection({
            address: input.address,
            slug: input.slug,
            name: input.name ?? undefined,
            description: input.description ?? undefined,
            orderbook: input.orderbook ?? undefined,
            somisOrderbook: input.somisOrderbook ?? undefined,
            packageModule: input.packageModule ?? undefined,
            type: input.type ?? undefined,
            withdrawPolicy: input.withdrawPolicy ?? undefined,
            bpsRoyaltyStrategy: input.bpsRoyaltyStrategy ?? undefined,
            transferPolicy: input.transferPolicy ?? undefined,
            twitter: input.twitter ?? undefined,
            discord: input.discord ?? undefined,
            website: input.website ?? undefined,
            orderbookType: input.orderbookType ?? undefined,
            collectionObject: input.collectionObject ?? undefined,
            transferAllowlist: input.transferAllowlist ?? undefined,

            owner: ctx.userPublicKey,
            // only admin can whitelist and verify the collection
            whitelisted: ctx.role === 'ADMIN' ? input.whitelisted ?? undefined : undefined,
            verified: ctx.role === 'ADMIN' ? input.verified ?? undefined : undefined,
        }) as unknown as Collection
    }

    @Mutation()
    async updateCollection(@Context() ctx: IContext, @Args() args: MutationUpdateCollectionArgs): Promise<Collection> {
        const { address, input } = args
        await this.collectionService.verifyCollectionOwner(ctx, address)

        const result = await this.collectionService.updateCollection(address, {
            name: input.name ?? undefined,
            description: input.description ?? undefined,
            slug: input.slug ?? undefined,
            orderbook: input.orderbook ?? undefined,
            somisOrderbook: input.somisOrderbook ?? undefined,
            packageModule: input.packageModule ?? undefined,
            type: input.type ?? undefined,
            withdrawPolicy: input.withdrawPolicy ?? undefined,
            bpsRoyaltyStrategy: input.bpsRoyaltyStrategy ?? undefined,
            transferPolicy: input.transferPolicy ?? undefined,
            twitter: input.twitter ?? undefined,
            discord: input.discord ?? undefined,
            website: input.website ?? undefined,
            orderbookType: input.orderbookType ?? undefined,
            collectionObject: input.collectionObject ?? undefined,
            // only admin can whitelist and verify the collection
            whitelisted: ctx.role === 'ADMIN' ? input.whitelisted ?? undefined : undefined,
            verified: ctx.role === 'ADMIN' ? input.verified ?? undefined : undefined,
            transferAllowlist: input.transferAllowlist ?? undefined,
        })

        if (result == null) {
            throw new CustomError(GenericError.NotFound)
        }
        return result as unknown as Collection
    }

    @Mutation()
    async updateCollectionImageUrl(
        @Context() ctx: IContext,
        @Args() args: MutationUpdateCollectionImageUrlArgs,
    ): Promise<AwsPresignedPost> {
        const { address } = args
        await this.collectionService.verifyCollectionOwner(ctx, address)

        const filename = `collection_${address}_image`
        const result = await this.s3Service.getSignedUploadURL(filename)

        await this.collectionService.updateCollection(address, {
            imageUrl: `${result.url}/${filename}?t=${Date.now()}`,
        })
        return result
    }

    @Mutation()
    async updateCollectionCoverUrl(
        @Context() ctx: IContext,
        @Args() args: MutationUpdateCollectionCoverUrlArgs,
    ): Promise<AwsPresignedPost> {
        const { address } = args
        await this.collectionService.verifyCollectionOwner(ctx, address)

        const filename = `collection_${address}_cover`
        const result = await this.s3Service.getSignedUploadURL(filename)

        await this.collectionService.updateCollection(address, {
            coverUrl: `${result.url}/${filename}?t=${Date.now()}`,
        })
        return result
    }

    @Mutation()
    async getNftUploadImageUrl(
        @Context() ctx: IContext,
        @Args() args: MutationGetNftUploadImageUrlArgs,
    ): Promise<AwsPresignedPost> {
        const { address } = args
        await this.collectionService.verifyCollectionOwner(ctx, address)

        const filename = `collection_${address}_nft_${Date.now()}`
        const result = await this.s3Service.getSignedUploadURL(filename)

        return result
    }

    @Mutation()
    async updateCollectionLogoUrl(
        @Context() ctx: IContext,
        @Args() args: MutationUpdateCollectionCoverUrlArgs,
    ): Promise<AwsPresignedPost> {
        const { address } = args
        await this.collectionService.verifyCollectionOwner(ctx, address)

        const filename = `collection_${address}_logo`
        const result = await this.s3Service.getSignedUploadURL(filename)

        await this.collectionService.updateCollection(address, {
            logoUrl: `${result.url}/${filename}?t=${Date.now()}`,
        })
        return result
    }

    @Mutation()
    async deleteCollection(@Context() ctx: IContext, @Args() args: MutationDeleteCollectionArgs): Promise<Collection> {
        const { address } = args
        await this.collectionService.verifyCollectionOwner(ctx, address)

        const result = await this.collectionService.deleteCollection(address)
        if (result == null) {
            throw new CustomError(GenericError.NotFound)
        }

        return result as unknown as Collection
    }

    @Mutation()
    async indexCollection(@Context() ctx: IContext, @Args() args: MutationIndexCollectionArgs): Promise<boolean> {
        const { address } = args
        await this.collectionService.verifyCollectionOwner(ctx, address)
        await this.collectionService.groupCollectionByType({ collectionAddress: address })
        return true
    }

    @Mutation()
    async indexCollectionByContract(
        @Context() ctx: IContext,
        @Args() args: MutationIndexCollectionArgs,
    ): Promise<boolean> {
        const { address } = args
        await this.collectionService.verifyCollectionOwner(ctx, address)
        await this.collectionService.indexCollectionByContract({ collectionAddress: address })
        return true
    }
}
