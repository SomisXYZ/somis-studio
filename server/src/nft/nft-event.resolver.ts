import { Args, Context, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql'

import {
    MutationCreateNftEventArgs,
    MutationDeleteNftEventArgs,
    MutationResolvers,
    MutationUpdateNftEventArgs,
    NftEvent,
    NftEventResolvers,
    NftEventType,
    User,
} from '~/gql/generated'
import { MarketplaceService } from '~/marketplace/marketplace.service'
import { IContext } from '~/types'
import { UserService } from '~/user/user.service'
import { CustomError, GenericError, InputError } from '~/utils/error'

import { INftEvent } from './nft.schema'
import { NftService } from './nft.service'

@Resolver('NftEvent')
export class NftEventResolver implements Pick<NftEventResolvers<IContext, INftEvent>, 'originOwner' | 'newOwner'> {
    constructor(private readonly userService: UserService) {}

    @ResolveField()
    async originOwner(@Parent() parent: INftEvent): Promise<User | null> {
        return (parent.originOwner != null
            ? await this.userService.userDataLoader.load(parent.originOwner)
            : null) as unknown as User | null
    }

    @ResolveField()
    async newOwner(@Parent() parent: INftEvent): Promise<User | null> {
        return (parent.newOwner != null
            ? await this.userService.userDataLoader.load(parent.newOwner)
            : null) as unknown as User | null
    }
}

const NftEventValidationMatrix: Record<
    'price' | 'originOwner' | 'newOwner' | 'user' | 'offerId' | 'orderId',
    NftEventType[]
> = {
    price: ['LIST', 'CANCEL_ORDER', 'BUY', 'OFFER', 'CANCEL_OFFER', 'ACCEPT_OFFER'],
    originOwner: ['TRANSFER', 'BURN', 'BUY', 'ACCEPT_OFFER'],
    newOwner: ['MINT', 'TRANSFER', 'BUY', 'ACCEPT_OFFER'],
    user: ['LIST', 'CANCEL_ORDER', 'BUY', 'OFFER', 'CANCEL_OFFER', 'ACCEPT_OFFER'],
    offerId: ['OFFER', 'CANCEL_OFFER', 'ACCEPT_OFFER'],
    orderId: ['LIST', 'CANCEL_ORDER', 'BUY'],
}

@Resolver()
export class AdminNftEventResolver
    implements Pick<MutationResolvers, 'createNftEvent' | 'updateNftEvent' | 'deleteNftEvent'>
{
    constructor(private readonly nftService: NftService, private readonly marketplaceService: MarketplaceService) {}

    private async validateNftEventInput(options: {
        type: NftEventType
        price?: string | null
        newOwner?: string | null
        originOwner?: string | null
        user?: string | null
    }) {
        const { type, price, newOwner, originOwner, user } = options

        const rules = NftEventValidationMatrix

        if (rules.originOwner.includes(type) && originOwner == null) {
            throw new CustomError(InputError.InputInvalid).addDetails({ message: 'OriginOwner is missing' })
        }

        if (rules.newOwner.includes(type) && newOwner == null) {
            throw new CustomError(InputError.InputInvalid).addDetails({ message: 'NewOwner is missing' })
        }

        if (rules.price.includes(type) && price == null) {
            throw new CustomError(InputError.InputInvalid).addDetails({ message: 'Price is missing' })
        }

        if (rules.user.includes(type) && user == null) {
            throw new CustomError(InputError.InputInvalid).addDetails({ message: 'User is missing' })
        }
    }

    @Mutation()
    async createNftEvent(@Context() _ctx: IContext, @Args() args: MutationCreateNftEventArgs): Promise<NftEvent> {
        const nft = await this.nftService.nftsDataLoaderByNftAddressDataLoader.load(args.nftAddress)

        if (nft == null) {
            throw new CustomError(GenericError.NotFound).addDetails({ message: 'NftAddress not found' })
        }

        await this.validateNftEventInput(args.input)

        return (await this.nftService.createNftEvent({
            nftAddress: args.nftAddress,
            collectionAddress: nft.collectionAddress,
            type: args.input.type,
            price: args.input.price ?? undefined,
            originOwner: args.input.originOwner ?? undefined,
            newOwner: args.input.newOwner ?? undefined,
            createdAt: args.input.createdAt ?? Date.now(),
            txId: args.input.txId ?? undefined,
        })) as unknown as NftEvent
    }

    @Mutation()
    async updateNftEvent(@Context() _ctx: IContext, @Args() args: MutationUpdateNftEventArgs): Promise<NftEvent> {
        await this.validateNftEventInput(args.input)

        return (await this.nftService.updateNftEvent(args.id, {
            type: args.input.type,
            price: args.input.price ?? undefined,
            originOwner: args.input.originOwner ?? undefined,
            newOwner: args.input.newOwner ?? undefined,
            createdAt: args.input.createdAt ?? Date.now(),
            txId: args.input.txId ?? undefined,
        })) as unknown as NftEvent
    }

    @Mutation()
    async deleteNftEvent(@Context() _ctx: IContext, @Args() args: MutationDeleteNftEventArgs): Promise<NftEvent> {
        const result = await this.nftService.deleteNftEvent(args.id)
        if (result == null) {
            throw new CustomError(GenericError.NotFound)
        }
        return result as unknown as NftEvent
    }
}
