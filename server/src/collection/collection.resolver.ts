import { Args, Context, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { PAGE_LIMIT } from '~/const'
import {
    Collection,
    CollectionAttribute,
    CollectionResolvers,
    CollectionsResult,
    CollectionStatsResolvers,
    MutationResolvers,
    NftEventResult,
    QueryCollectionArgs,
    QueryCollectionEventsArgs,
    QueryCollectionsArgs,
    QueryResolvers,
    Creator,
    CollectionStats,
    QueryCollectionChartDataArgs,
    Candlestick,
    QueryCollectionScatterChartDataArgs,
    CollectionScatterChartData,
    QueryCollectionsByOwnerArgs,
    CollectionBid,
} from '~/gql/generated'
import { IContext } from '~/types'
import { UserService } from '~/user/user.service'
import { CustomError, InputError } from '~/utils/error'

import { ICollection, ICollectionStats } from './collection.schema'
import { CollectionService, CollectionSorting } from './collection.service'

@Resolver('Collection')
export class CollectionResolver
    implements
        Partial<QueryResolvers<IContext> & MutationResolvers<IContext> & CollectionResolvers<IContext, ICollection>>
{
    constructor(private readonly collectionService: CollectionService, private readonly userService: UserService) {}

    @Query()
    async collection(@Context() _ctx: IContext, @Args() args: QueryCollectionArgs): Promise<Collection | null> {
        const { address, addressOrSlug } = args
        const queryKey = addressOrSlug ?? address

        if (queryKey == null) {
            throw new CustomError(InputError.InputInvalid).addDetails({
                message: 'address and slug cannot be null at the same time',
            })
        }

        let result = await this.collectionService.collectionDataLoader.load(queryKey)

        // fallback to use slug
        if (result == null) {
            result = await this.collectionService.collectionBySlugDataLoader.load(queryKey)
        }

        return result as unknown as Collection | null
    }

    @Query()
    async collections(@Context() _ctx: IContext, @Args() args: QueryCollectionsArgs): Promise<CollectionsResult> {
        const { filter, paging, sorting } = args

        let sortBy: CollectionSorting

        switch (sorting?.field) {
            case 'FLOOR':
                sortBy = 'stats.floor'
                break
            case 'VOL24':
                sortBy = 'stats.vol24'
                break
            case 'VOL24_DELTA':
                sortBy = 'stats.vol24Delta'
                break
            case 'TOTAL_VOL':
                sortBy = 'stats.totalVol'
                break
            case 'TOTAL_ITEMS':
                sortBy = 'stats.totalItems'
                break
            case 'NAME':
            default:
                sortBy = 'name'
        }

        return (await this.collectionService.findCollections({
            keyword: filter?.keyword,
            skip: paging?.skip ?? 0,
            limit: paging?.limit ?? PAGE_LIMIT,
            sortBy,
            order: sorting?.order ?? 'ASC',
            verified: filter?.verified,
            whitelisted: filter?.whitelisted ?? true,
        })) as unknown as CollectionsResult
    }

    @Query()
    async collectionsByOwner(@Context() _ctx: IContext, @Args() args: QueryCollectionsByOwnerArgs) {
        const collectionMap = await this.collectionService.ownedCollectionAddresses({ owner: args.owner })
        const arr = [...collectionMap.entries()].sort((a, b) => b[1] - a[1])
        const result = []
        for (const item of arr) {
            const [collectionAddress, count] = item
            const collection = (await this.collectionService.collectionDataLoader.load(
                collectionAddress,
            )) as unknown as Collection
            if (collection != null) {
                result.push({
                    collection,
                    ownedItems: count,
                })
            }
        }

        return result
    }

    @Query()
    async collectionEvents(
        @Context() _ctx: IContext,
        @Args() args: QueryCollectionEventsArgs,
    ): Promise<NftEventResult> {
        const { address, paging } = args

        return (await this.collectionService.findNftEvents({
            address,
            skip: paging?.skip ?? 0,
            limit: paging?.limit ?? PAGE_LIMIT,
        })) as unknown as NftEventResult
    }

    @Query()
    async collectionChartData(
        @Context() _ctx: IContext,
        @Args() args: QueryCollectionChartDataArgs,
    ): Promise<Candlestick[]> {
        const { address, interval, intervalUnit, from, to } = args.input
        if (from > to) {
            throw new CustomError(InputError.InputInvalid).addDetails({ message: 'from need to smaller then to' })
        }
        return await this.collectionService.calculateCollectionChartData({
            address,
            interval,
            intervalUnit,
            from,
            to,
        })
    }

    @Query()
    async collectionScatterChartData(
        @Context() _ctx: IContext,
        @Args() args: QueryCollectionScatterChartDataArgs,
    ): Promise<CollectionScatterChartData[]> {
        const { address, from, to } = args.input
        if (from > to) {
            throw new CustomError(InputError.InputInvalid).addDetails({ message: 'from need to smaller then to' })
        }
        return await this.collectionService.getCollectionScatterChartData({
            address,
            from,
            to,
        })
    }

    @ResolveField()
    async stats(@Parent() parent: ICollection) {
        return (await this.collectionService.collectionStatsDataLoader.load(
            parent.address,
        )) as unknown as CollectionStats
    }

    @ResolveField()
    async attributes(@Parent() parent: ICollection): Promise<CollectionAttribute[]> {
        return await this.collectionService.collectionsAttributesDataLoader.load(parent.address)
    }

    @ResolveField()
    async creators(@Parent() parent: ICollection): Promise<Creator[]> {
        const creators = await this.userService.userDataLoader.loadMany(parent.creators.map((it) => it.address))
        return parent.creators.map((creator, idx) => {
            return {
                user: creators[idx],
                share: creator.share,
            }
        }) as unknown as Creator[]
    }

    @ResolveField()
    async logoUrl(@Parent() parent: ICollection): Promise<string | null> {
        return parent.logoUrl ?? parent.imageUrl ?? null
    }

    @ResolveField()
    async collectionBidStats(@Parent() parent: ICollection) {
        return { items: await this.collectionService.getCollectionBidStats({ collectionAddress: parent.address }) }
    }

    @ResolveField()
    async myCollecitonBid(@Parent() parent: ICollection, @Context() ctx: IContext) {
        return (await this.collectionService.getCollectionBidByUser({
            collectionAddress: parent.address,
            user: ctx.userPublicKey as string,
        })) as unknown as CollectionBid[]
    }
}

@Resolver('CollectionStats')
export class CollectionStatsResolver implements CollectionStatsResolvers<IContext, ICollectionStats> {
    constructor(private readonly collectionService: CollectionService) {}

    @ResolveField()
    async totalItems(@Parent() parent: ICollectionStats) {
        const result = await this.collectionService.collectionItemCountDataLoader.load(parent.collectionAddress)
        return result
    }

    @ResolveField()
    async owners(@Parent() parent: ICollectionStats) {
        return await this.collectionService.collectionOwnerCountDataLoader.load(parent.collectionAddress)
    }

    @ResolveField()
    async listedItem(@Parent() parent: ICollectionStats) {
        return await this.collectionService.collectionListedCountDataLoader.load(parent.collectionAddress)
    }
}
