import { OriginBytesNft } from '~/services/blockChain'

export interface AddressNfts {
    nfts: OriginBytesNft[]
    fetching: boolean
    error: string | undefined
    refresh: () => void
}
