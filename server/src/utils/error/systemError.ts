import { AppError } from '.'

const InternalServerError: AppError = {
    code: 'SYSTEM_INTERNAL_SERVER_ERROR',
    message: 'Internal Server Error',
    internal: true,
    severity: 'critical',
    status: 500,
}

const NotImplementedError: AppError = {
    code: 'SYSTEM_NOT_IMPLEMENTED_ERROR',
    message: 'Not Implemented',
    internal: true,
    severity: 'warning',
    status: 500,
}

const DatabaseError: AppError = {
    code: 'SYSTEM_DATABASE_ERROR',
    message: 'Database Error',
    internal: true,
    severity: 'critical',
    status: 500,
}

const EnvMissing: AppError = {
    code: 'ENV_MISSING_ERROR',
    message: 'Env missing Error',
    internal: true,
    severity: 'critical',
    status: 500,
}

export const SystemError = {
    InternalServerError,
    NotImplementedError,
    DatabaseError,
    EnvMissing,
}
