import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql'

import { SqsService } from '~/aws/sqs.service'
import { CacheService } from '~/cache/cache.service'
import { CollectionService } from '~/collection/collection.service'
import { PAGE_LIMIT } from '~/const'
import {
    Collection,
    MutationIndexNftArgs,
    Nft,
    NftAttribute,
    NftEvent,
    NftEventResult,
    NftResolvers,
    NftResult,
    QueryNftArgs,
    QueryNftEventsArgs,
    QueryNftEventsByCollectionArgs,
    QueryNftsArgs,
    QueryNftsByOwnerArgs,
    QueryResolvers,
    SubscriptionSubscribeNftEventArgs,
    User,
} from '~/gql/generated'
import { MarketplaceService } from '~/marketplace/marketplace.service'
import { IContext, Union } from '~/types'
import { UserService } from '~/user/user.service'

import { INft } from './nft.schema'
import { NftService, NftSorting } from './nft.service'

@Resolver('Nft')
export class NftResolver
    implements Union<Pick<QueryResolvers<IContext>, 'nft' | 'nfts' | 'nftEvents'>, NftResolvers<IContext, INft>>
{
    constructor(
        private readonly nftService: NftService,
        private readonly collectionService: CollectionService,
        private readonly marketplaceService: MarketplaceService,
        private readonly userService: UserService,
        private readonly sqsService: SqsService,
        private readonly cacheService: CacheService,
    ) {}

    @Query()
    async nft(@Context() _ctx: IContext, @Args() args: QueryNftArgs): Promise<Nft | null> {
        return (await this.nftService.nftsDataLoaderByNftAddressDataLoader.load(args.address)) as unknown as Nft | null
    }

    @Query()
    async nfts(@Context() ctx: IContext, @Args() args: QueryNftsArgs): Promise<NftResult> {
        const { collectionAddress, filter, paging, sorting } = args

        let sortBy: NftSorting

        switch (sorting?.field) {
            case 'PRICE':
                sortBy = 'order.priceMist'
                break
            case 'NAME':
            default:
                sortBy = 'name'
        }

        const attributes = filter?.attributes?.reduce<Record<string, string[]>>((acc, curr) => {
            acc[curr.name] = curr.values
            return acc
        }, {})

        return (await this.nftService.findNfts({
            collectionAddress,
            keyword: filter?.keyword ?? undefined,
            listedOnly: filter?.listedOnly ?? undefined,
            maxPrice: filter?.maxPrice != null ? parseFloat(filter?.maxPrice) : undefined,
            minPrice: filter?.minPrice != null ? parseFloat(filter?.minPrice) : undefined,
            attributes,
            skip: paging?.skip ?? 0,
            limit: paging?.limit ?? PAGE_LIMIT,
            order: sorting?.order ?? 'ASC',
            excludeOwner: filter?.excludeOwned ? ctx.userPublicKey : undefined,
            sortBy,
        })) as unknown as NftResult
    }

    @Query()
    async nftsByOwner(@Context() _ctx: IContext, @Args() args: QueryNftsByOwnerArgs): Promise<NftResult> {
        const { owner, paging, sorting, listedFilter, collectionAddress } = args

        let sortBy: NftSorting

        switch (sorting?.field) {
            case 'PRICE':
                sortBy = 'order.priceMist'
                break
            case 'NAME':
            default:
                sortBy = 'name'
        }

        return (await this.nftService.findNfts({
            owner,
            skip: paging?.skip ?? 0,
            limit: paging?.limit ?? PAGE_LIMIT,
            order: sorting?.order ?? 'ASC',
            sortBy,
            unlistedOnly: listedFilter === 'UNLISTED',
            listedOnly: listedFilter === 'LISTED',
            collectionAddress: collectionAddress ?? undefined,
        })) as unknown as NftResult
    }

    @Query()
    async nftEvents(@Context() _ctx: IContext, @Args() args: QueryNftEventsArgs): Promise<NftEventResult> {
        const { address, paging } = args

        return (await this.nftService.findNftEvents({
            address,
            skip: paging?.skip ?? 0,
            limit: paging?.limit ?? PAGE_LIMIT,
        })) as unknown as NftEventResult
    }

    @Subscription()
    subscribeNftEvent(@Args() args: SubscriptionSubscribeNftEventArgs) {
        return this.nftService.getNftEventSubscription(args.nftAddress) as unknown as any
    }

    @Query()
    async nftEventsByCollection(
        @Context() _ctx: IContext,
        @Args() args: QueryNftEventsByCollectionArgs,
    ): Promise<NftEventResult> {
        const { collectionAddress, paging } = args

        return (await this.nftService.findNftEvents({
            collectionAddress,
            skip: paging?.skip ?? 0,
            limit: paging?.limit ?? PAGE_LIMIT,
        })) as unknown as NftEventResult
    }

    @ResolveField()
    async attributes(@Parent() parent: INft): Promise<NftAttribute[]> {
        if (parent.collectionAddress == null) {
            return (
                parent.attributes?.map(({ name, value }) => {
                    return { name, value, items: 1, floor: null, percentage: null }
                }) ?? []
            )
        }
        const collectionAttributes = await this.collectionService.collectionsAttributesDataLoader.load(
            parent.collectionAddress,
        )
        return (
            parent.attributes?.map(({ name, value }) => {
                const attr = collectionAttributes.find((attr) => attr.name === name)
                const pair = attr?.values.find((it) => it.value === value)
                return {
                    name,
                    value,
                    items: pair?.items ?? 1,
                    floor: pair?.floor,
                    percentage: pair?.percentage,
                    lastSale: pair?.lastSale,
                }
            }) ?? []
        )
    }

    @ResolveField()
    async collection(@Parent() parent: INft): Promise<Collection | null> {
        if (parent.collectionAddress == null) {
            return null
        }
        return (await this.collectionService.collectionDataLoader.load(
            parent.collectionAddress,
        )) as unknown as Collection
    }

    @ResolveField()
    async events(@Parent() parent: INft): Promise<NftEvent[]> {
        const result = (
            await this.nftService.findNftEvents({
                address: parent.address,
                skip: 0,
                limit: 10,
            })
        ).items as unknown as NftEvent[]

        return result
    }

    @Mutation()
    async indexNft(@Context() _ctx: IContext, @Args() args: MutationIndexNftArgs): Promise<boolean> {
        const cacheKey = `nft_index_throttle:${args.address}`
        const cached = await this.cacheService.get(cacheKey)
        if (cached != null) {
            return true
        } else {
            await this.sqsService.indexNft(args.address, true)
            await this.cacheService.set(cacheKey, 'true', 3600)
            return true
        }
    }

    @ResolveField()
    async owner(@Parent() parent: INft): Promise<User | null> {
        return (parent.owner != null
            ? await this.userService.userDataLoader.load(parent.owner)
            : null) as unknown as User | null
    }
}
