import { Order } from '~/gql/generated/graphql'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const instanceOfOrder = (object: any): object is Order => {
    return 'id' in object && 'createdAt' in object && 'nft' in object && 'price' in object
}
