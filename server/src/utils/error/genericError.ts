import { AppError } from '.'

const NotFound: AppError = {
    code: 'GENERIC_NOT_FOUND',
    message: 'Not Found',
    status: 404,
    internal: false,
    severity: 'app',
}

const StoreNotFound: AppError = {
    code: 'GENERIC_STORE_NOT_FOUND',
    message: 'Store Not Found',
    status: 400,
    internal: false,
    severity: 'app',
}

export const GenericError = { NotFound, StoreNotFound }
