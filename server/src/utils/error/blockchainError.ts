import { AppError } from '.'

const FailToConfirmTx: AppError = {
    code: 'BLOCKCHAIN_FAIL_TO_CONFIRM_TX',
    message: 'Fail to confirm blockchain transaction',
    status: 400,
    internal: false,
    severity: 'warning',
}

const ArweaveUploadFail: AppError = {
    code: 'BLOCKCHAIN_ARWEAVE_UPLOAD_FAIL',
    message: 'Upload to Arweave Failed',
    status: 400,
    internal: false,
    severity: 'warning',
}

const NFTNotBurned: AppError = {
    code: 'BLOCKCHAIN_NFT_NOT_BURNED',
    message: 'NFT is not burned',
    status: 400,
    internal: false,
    severity: 'warning',
}

export const BlockchainError = {
    FailToConfirmTx,
    ArweaveUploadFail,
    NFTNotBurned,
}
