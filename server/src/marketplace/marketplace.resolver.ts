import { Args, Context, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql'

import { SqsService } from '~/aws/sqs.service'
import {
    QueryResolvers,
    OrderResolvers,
    User,
    SubscriptionResolvers,
    QueryOrdersByCollectionArgs,
    OrdersResult,
    SubscriptionSubscribeCollectionOrdersArgs,
    CollectionBidResolvers,
    Nft,
} from '~/gql/generated'
import { NftService } from '~/nft/nft.service'
import { IContext, MergeN } from '~/types'
import { UserService } from '~/user/user.service'
import { CustomError, SystemError } from '~/utils/error'

import { ICollectionBid, IOrder } from './marketplace.schema'
import { MarketplaceService, NftOrderSorting } from './marketplace.service'

@Resolver('Order')
export class MarketplaceResolver
    implements
        MergeN<
            [
                Pick<QueryResolvers<IContext>, 'ordersByCollection'>,
                Pick<OrderResolvers<IContext, IOrder>, 'nft' | 'seller'>,
                Pick<SubscriptionResolvers<IContext>, 'subscribeCollectionOrders'>,
            ]
        >
{
    constructor(
        private readonly marketplaceService: MarketplaceService,
        private readonly userService: UserService,
        private readonly nftService: NftService,
        private readonly sqsService: SqsService,
    ) {}

    @Query()
    async ordersByCollection(@Context() ctx: IContext, @Args() args: QueryOrdersByCollectionArgs) {
        let sortBy: NftOrderSorting
        switch (args.sorting?.field) {
            case 'PRICE':
                sortBy = 'order.priceMist'
                break
            case 'CREATED_AT':
                sortBy = 'order.createdAt'
                break
            default:
                sortBy = 'order.createdAt'
        }

        const result = await this.marketplaceService.getOrdersByCollection({
            collectionAddress: args.collectionAddress,
            skip: args.paging?.skip ?? 0,
            limit: args.paging?.limit ?? 20,
            order: args.sorting?.order ?? 'DES',
            sortBy,
        })
        if (result == null) {
            throw new CustomError(SystemError.InternalServerError)
        }
        return result as unknown as OrdersResult
    }

    @ResolveField()
    async seller(@Parent() parent: IOrder, @Context() _ctx: IContext): Promise<User> {
        return (await this.userService.userDataLoader.load(parent.seller)) as unknown as User
    }

    @ResolveField()
    async nft(@Parent() parent: IOrder, @Context() _ctx: IContext): Promise<Nft> {
        return (await this.nftService.nftsDataLoaderByNftAddressDataLoader.load(parent.nftAddress)) as unknown as Nft
    }

    @Subscription()
    subscribeCollectionOrders(@Args() args: SubscriptionSubscribeCollectionOrdersArgs) {
        return this.marketplaceService.getOrderEventSubscription(args.collectionAddress) as unknown as any
    }
}

@Resolver('CollectionBid')
export class CollectionBidResolver
    implements MergeN<[Pick<CollectionBidResolvers<IContext, ICollectionBid>, 'bidder'>]>
{
    constructor(private readonly userService: UserService) {}
    @ResolveField()
    async bidder(@Parent() parent: ICollectionBid) {
        return (await this.userService.userDataLoader.load(parent.bidder)) as unknown as User
    }
}
