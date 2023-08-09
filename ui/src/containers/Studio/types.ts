export interface PrecreateNft {
    imageUrl: string
    name: string
    description: string
    attributes?: {
        name: string
        value: string
    }[]
    address: string | null
    state: 'inQueue' | 'minting' | 'minted' | 'failed'
}
