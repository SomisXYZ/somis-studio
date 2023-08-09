import {
    SuiObjectData,
    getObjectFields,
    getObjectOwner,
    ObjectContentFields,
    SuiObjectResponse,
    ObjectOwner,
} from '@mysten/sui.js'
import {
    OrderBookBidDetail,
    OrderBookDetail,
    OriginBytesCommissionFields,
    OriginBytesInventoryFields,
    OriginBytesListFields,
    OriginBytesNft,
    OriginBytesNftFields,
    OriginBytesOuterNodeValue,
    OriginBytesOuterBidNodeValueFields,
    OriginBytesOuterNodeValueFields,
    OriginBytesOuterBidNodeValue,
    SomisOrderbookAskField,
    SomisOrderBookDetail,
    SomisOrderBookBidDetail,
    SomisBidNodeValue,
    SomisBidNodeFields,
    OriginBytesOrderBookFields,
    OriginBytesV1AsksFields,
    OriginBytesV1BidsFields,
    SomisOrderbookConfig,
    SomisOrderbookConfigFields,
} from './types'

/**
 * Extract domain from object fields
 * @param fields
 * @returns {Record<string, any>}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractDomain(fields: ObjectContentFields | undefined): any[] {
    if (fields == null) {
        return []
    }
    if (Object.prototype.toString.call(fields) === '[object Object]' && 'map' in fields) {
        return fields.map.fields.contents.reduce(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (acc: any, curr: { fields: any }) => [...acc, curr.fields],
            [],
        )
    } else {
        return []
    }
}

/**
 * Parse NFT from object data
 * @param data
 * @returns {OriginBytesNft | undefined}
 * @example
 * const nft = await parseNft(data)
 * @example
 * const { res } = await SuiObjectDataLoader().load(address)
 * const nft = await parseNft(res)
 */
export function parseNft(data: SuiObjectResponse | undefined): OriginBytesNft | undefined {
    if (data == null) {
        return undefined
    }
    const fields = getObjectFields(data) as OriginBytesNftFields
    try {
        const owner = getObjectOwner(data)
        const display = data.data?.display?.data as {
            name?: string
            description?: string
            image_url?: string
            link?: string
        } | null
        const tmpUrl = display?.image_url ?? fields.url
        const imageUrl = tmpUrl && tmpUrl !== '' ? tmpUrl : 'no-image'
        const result = {
            address: fields.id.id,
            name: display?.name ?? fields.name,
            description: display?.description ?? fields.description,
            url: imageUrl,
            owner: getOwnerAddressByObjectOwner(owner) ?? null,
            nftType: data?.data?.type ?? '',
            attributes:
                fields.attributes != null
                    ? (extractDomain(fields.attributes.fields) as {
                          key: string
                          value: string
                      }[])
                    : [],
        }
        return result
    } catch (error) {
        console.log(error)
        return undefined
    }
}

/**
 * Parse list object from object data
 * @param data
 * @returns {OriginBytesListFields | undefined}
 * @example
 * const list = parseListObject(data)
 * @example
 * const { res } = await SuiObjectDataLoader().load(address)
 * const list = parseListObject(res)
 */
export function parseListObject(data: SuiObjectData | undefined): OriginBytesListFields | undefined {
    if (data == null) {
        return undefined
    }
    try {
        return getObjectFields(data) as OriginBytesListFields
    } catch (error) {
        console.log(error)
        return undefined
    }
}

/**
 * Parse inventory object from object data
 * @param data
 * @returns {OriginBytesInventoryFields | undefined}
 * @example
 * const inventory = parseInventoryObject(data)
 * @example
 * const { res } = await SuiObjectDataLoader().load(address)
 * const inventory = parseInventoryObject(res)
 */
export function parseInventoryObject(data: SuiObjectResponse | undefined): OriginBytesInventoryFields | undefined {
    if (data == null) {
        return undefined
    }
    try {
        return getObjectFields(data) as OriginBytesInventoryFields
    } catch (error) {
        console.log(error)
        return undefined
    }
}

export function parseOrderBooksDetail(
    data: SuiObjectResponse[] | undefined,
    id: string,
): OrderBookDetail[] | undefined {
    if (data == null) {
        return undefined
    }
    try {
        const fields = data
            .map((it) => getObjectFields(it))
            .map((it) => it?.value.fields.value) as OriginBytesOuterNodeValue[][]
        const values: OriginBytesOuterNodeValue[] = fields.flatMap((it) => it.flatMap((it) => it))
        const orderBooks = values.map((it) => {
            const { commission, price, nft_id, kiosk_id, ...rest } = getObjectFields(
                it,
            ) as OriginBytesOuterNodeValueFields
            const nftAddress = nft_id
            return {
                ...rest,
                address: id,
                commission: getObjectFields(commission) as OriginBytesCommissionFields,
                price,
                kioskAddress: kiosk_id,
                nftAddress,
            }
        })
        return orderBooks
    } catch (error) {
        console.log(error)
        return undefined
    }
}

export function parseOriginbytesV1OrderBooksDetail(data: SuiObjectResponse | undefined): OrderBookDetail[] | undefined {
    if (data == null) {
        return undefined
    }
    try {
        const orderBookFields = getObjectFields(data) as OriginBytesOrderBookFields
        const values = (getObjectFields(orderBookFields.asks) as OriginBytesV1AsksFields).o.flatMap((it) => it.fields.v)
        const orderBooks = values.map((it) => {
            const { commission, price, nft_id, kiosk_id, ...rest } = getObjectFields(
                it,
            ) as OriginBytesOuterNodeValueFields
            const nftAddress = nft_id
            return {
                ...rest,
                address: orderBookFields.id.id,
                commission: commission
                    ? ({
                          beneficiary: commission.fields.beneficiary,
                          cut: commission.fields.cut,
                      } as OriginBytesCommissionFields)
                    : null,
                price,
                kioskAddress: kiosk_id,
                nftAddress,
            }
        })
        return orderBooks
    } catch (error) {
        console.log(error)
        return undefined
    }
}

export function parseOriginbytesV1OrderBookBidsDetail(
    data: SuiObjectResponse | undefined,
): OrderBookBidDetail[] | undefined {
    if (data == null) {
        return undefined
    }
    try {
        const orderBookFields = getObjectFields(data) as OriginBytesOrderBookFields

        const values = (getObjectFields(orderBookFields.bids) as OriginBytesV1BidsFields).o.flatMap((it) => it.fields.v)
        const orderBooks = values.map((it) => {
            const { commission, kiosk, offer, owner, ...rest } = getObjectFields(
                it,
            ) as OriginBytesOuterBidNodeValueFields
            return {
                commission: commission
                    ? ({
                          beneficiary: commission.fields.beneficiary,
                          cut: commission.fields.cut,
                      } as OriginBytesCommissionFields)
                    : null,
                kioskAddress: kiosk,
                offer,
                owner,
            }
        })
        return orderBooks
    } catch (error) {
        console.log(error)
        return undefined
    }
}

export function parseSomisOrderBooksDetail(
    data: SuiObjectResponse[] | undefined,
    id: string,
    config?: SomisOrderbookConfigFields,
): SomisOrderBookDetail[] | undefined {
    if (data == null) {
        return undefined
    }
    try {
        const fields = data
            .map((it) => getObjectFields(it))
            .map((it) => it?.value.fields.value) as OriginBytesOuterNodeValue[][]
        const values: OriginBytesOuterNodeValue[] = fields.flatMap((it) => it.flatMap((it) => it))
        const orderBooks = values.map((it) => {
            const { price, nft_id, seller, ...rest } = getObjectFields(it) as SomisOrderbookAskField
            const nftAddress = nft_id
            return {
                ...rest,
                address: id,
                price,
                seller,
                nftAddress,
                commission:
                    config && config.commission_beneficiary
                        ? {
                              beneficiary: config.commission_beneficiary,
                              cut: config.commission_bps,
                          }
                        : null,
            }
        })
        return orderBooks
    } catch (error) {
        console.log(error)
        return undefined
    }
}

export function parseOrderBookBidsDetail(
    data: SuiObjectResponse[] | undefined,
    id: string,
): OrderBookBidDetail[] | undefined {
    if (data == null) {
        return undefined
    }
    try {
        const fields = data
            .map((it) => getObjectFields(it))
            .map((it) => it?.value.fields.value) as OriginBytesOuterBidNodeValue[][]
        const values: OriginBytesOuterBidNodeValue[] = fields.flatMap((it) => it.flatMap((it) => it))
        const orderBooks = values.map((it) => {
            const { commission, offer, owner, kiosk, ...rest } = getObjectFields(
                it,
            ) as OriginBytesOuterBidNodeValueFields
            return {
                ...rest,
                owner,
                address: id,
                commission: commission ? (getObjectFields(commission) as OriginBytesCommissionFields) : null,
                kioskAddress: kiosk,
                offer,
            }
        })
        return orderBooks
    } catch (error) {
        console.log(error)
        return undefined
    }
}

export function parseSomisOrderBookBidsDetail(
    data: SuiObjectResponse[] | undefined,
    id: string,
): SomisOrderBookBidDetail[] | undefined {
    if (data == null) {
        return undefined
    }
    try {
        const fields = data
            .map((it) => getObjectFields(it))
            .map((it) => it?.value.fields.value) as SomisBidNodeValue[][]
        const values: SomisBidNodeValue[] = fields.flatMap((it) => it.flatMap((it) => it))
        const orderBooks = values.map((it) => {
            const { offer, owner, buyer, ...rest } = getObjectFields(it) as SomisBidNodeFields
            return {
                ...rest,
                owner,
                buyer,
                address: id,
                offer,
            }
        })
        return orderBooks
    } catch (error) {
        console.log(error)
        return undefined
    }
}

export const getOwnerAddressByObjectOwner = (
    owner: ObjectOwner | undefined,
):
    | {
          address: string
          type: 'owner' | 'contract' | 'object' | 'immutable'
      }
    | undefined => {
    if (owner == null) {
        return undefined
    }
    if (typeof owner === 'string') {
        return {
            address: '',
            type: 'immutable',
        }
    }
    if ('AddressOwner' in owner) {
        return {
            address: owner.AddressOwner,
            type: 'owner',
        }
    }
    if ('ObjectOwner' in owner) {
        return {
            address: owner.ObjectOwner,
            type: 'object',
        }
    }
    if ('ContractOwner' in owner) {
        return undefined
    }
    return undefined
}
