import { AppError } from '.'

const NftNotWhitelisted: AppError = {
    code: 'MARKETPLACE_NFT_NOT_WHITELISTED',
    message: 'The NFT is not allowed to list',
    internal: false,
    severity: 'app',
    status: 400,
}

const AuctionNotStarted: AppError = {
    code: 'AUCTION_NOT_STARTED',
    message: 'Auction is not started',
    internal: false,
    severity: 'app',
    status: 400,
}

export const MarketplaceError = {
    NftNotWhitelisted,
    AuctionNotStarted,
}
