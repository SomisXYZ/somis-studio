import { AppError } from '.'

const VerificationFailed: AppError = {
    code: 'AUTH_VERIFICATION_FAIL',
    message: 'Unable to verify login',
    status: 401,
    internal: false,
    severity: 'app',
}

const Unauthorized: AppError = {
    code: 'AUTH_UNAUTHORIZED',
    message: 'Unauthorized',
    status: 401,
    internal: false,
    severity: 'app',
}

const TokenInvalid: AppError = {
    code: 'AUTH_TOKEN_INVALID',
    message: 'Token invalid',
    status: 401,
    internal: false,
    severity: 'app',
}

const TokenExpired: AppError = {
    code: 'AUTH_TOKEN_EXPIRED',
    message: 'Token Expired',
    status: 401,
    internal: false,
    severity: 'app',
}

const YouAreNotCircler: AppError = {
    code: 'AUTH_YOU_ARE_NOT_CIRCLER',
    message: 'You are not circler',
    status: 401,
    internal: false,
    severity: 'app',
}

const OAuthError: AppError = {
    code: 'AUTH_OAUTH_ERROR',
    message: 'Error when connecting to oauth service',
    status: 401,
    internal: false,
    severity: 'app',
}

export const AuthError = {
    VerificationFailed,
    Unauthorized,
    YouAreNotCircler,
    TokenInvalid,
    TokenExpired,
    OAuthError,
}
