import { GraphQLError } from 'graphql'

export type Severities =
    | 'critical' // caused application shutdown, data loss, data corruption
    | 'error' // errors fatal to operation, require administrator intervention
    | 'warning' // potential cause for bugs and application oddities
    | 'info' // useful information to log - application start / stop
    | 'debug' // use for providing developers with useful information
    | 'trace' // use to trace the calling of specific functions
    | 'app' // use to log application errors such as bad inputs
    | 'silent' // use to silent the log tin test

export type ErrorDetails = {
    message?: string
    path?: string
    expected?: string
    received?: string
}

export type AppError = {
    code: string
    message: string
    status: number
    internal?: boolean
    severity?: Severities
    details?: ErrorDetails[]
}

export class CustomError extends Error {
    internal: boolean
    status: number
    severity: Severities
    originalError?: Error
    details?: ErrorDetails[]
    code: string
    constructor(error: AppError, originalError?: Error) {
        super(error.message)
        this.internal = error.internal ?? true
        this.status = error.status ?? 500
        this.severity = error.severity ?? 'error'
        this.code = error.code
        if (originalError != null) {
            this.originalError = originalError
        }
    }

    addDetails(details: ErrorDetails[] | ErrorDetails) {
        this.details = this.details ?? []
        if (Array.isArray(details)) {
            this.details.push(...details)
            this.message = [this.message, ...details.map((it) => it.message)].join(', ')
        } else {
            this.details.push(details)
            this.message = `${this.message}, ${details.message}`
        }
        return this
    }
}

export type ConstraintDirectiveError = {
    code: string
} & GraphQLError

export * from './genericError'
export * from './inputError'
export * from './authError'
export * from './blockchainError'
export * from './marketplaceError'
export * from './systemError'
export * from './ticketingError'
