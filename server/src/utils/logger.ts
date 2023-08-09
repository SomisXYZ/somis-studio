/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphQLError } from 'graphql'
import { inspect } from 'util'
import * as winston from 'winston'

import { Injectable, Module } from '@nestjs/common'

import { Severities, ConstraintDirectiveError, InputError, SystemError, CustomError } from '~/utils/error'

import { getContext } from './asyncContext'

const SeveritiesLevelConfig: Record<Severities, number> = {
    silent: 0,
    critical: 1,
    error: 2,
    warning: 3,
    info: 4,
    app: 5,
    debug: 6,
    trace: 7,
}

const levelSym: any = Symbol.for('level')
const splatSym: any = Symbol.for('splat')

export function getErrorFormatter(loggerService: LoggerService): (error: GraphQLError) => GraphQLError {
    return (error: GraphQLError) => {
        const originalError = error.originalError as ConstraintDirectiveError
        if (error.extensions.code === 'GRAPHQL_VALIDATION_FAILED') {
            return new GraphQLError(error.message, {
                nodes: error.nodes,
                source: error.source,
                positions: error.positions,
                path: error.path,
                extensions: {
                    ...error.extensions,
                    code: InputError.InputInvalid.code,
                    // remove duplicated information to avoid confusion
                    exception: undefined,
                },
            })
        } else if (originalError instanceof CustomError) {
            loggerService.log(originalError.severity, originalError.originalError ?? originalError)
            if (originalError.internal) {
                return new GraphQLError(`Internal server error (ref: ${getContext().logRef})`)
            } else {
                return new GraphQLError(
                    originalError.originalError?.message ?? originalError.message ?? error.message,
                    {
                        nodes: error.nodes,
                        source: error.source,
                        positions: error.positions,
                        path: error.path,
                        extensions: {
                            logRef: getContext().logRef,
                            code: originalError.code,
                        },
                    },
                )
            }
        } else {
            // Unexpected Error
            loggerService.error(error)
            return new GraphQLError(`Internal server error (ref: ${getContext().logRef})`)
        }
    }
}

@Injectable()
export class LoggerService {
    winstonLogger: winston.Logger
    constructor() {
        const appsettings = {
            env: process.env.NODE_ENV ?? 'development',
            loglevel: process.env.LOG_LEVEL,
        }

        this.winstonLogger = winston.createLogger({
            format:
                appsettings.env === 'production' || appsettings.env === 'staging'
                    ? winston.format.json()
                    : winston.format.printf((info) => {
                          // remove unwanted symbol
                          const { [levelSym]: _level, [splatSym]: _splat, stack: _stack, ...infoWeNeed } = info
                          return inspect(infoWeNeed, { colors: true, showHidden: false, depth: 5 })
                      }),
            transports: [new winston.transports.Console()],
            levels: SeveritiesLevelConfig,
            level: appsettings.loglevel,
        })

        if (appsettings.env !== 'test') {
            this.winstonLogger.log('info', `Using ${appsettings.env} appsetting, loglevel: ${appsettings.loglevel}`)
        }
    }

    log(severity: Severities, ...objects: any[]) {
        const logRef = getContext().logRef as string
        const [first, second, ...rest] = objects
        const metadata = { ...second }

        if (logRef != null) {
            metadata['logRef'] = logRef
        }
        if (rest.length > 0) {
            metadata['metadata'] = rest
        }

        if (first instanceof Error) {
            this.winstonLogger.log(severity, first.message, {
                ...metadata,
                error: first,
                stack: first.stack?.split('\n'),
            })
        } else {
            this.winstonLogger.log(severity, first, metadata)
        }
    }

    error(...object: any[]) {
        this.log('error', ...object)
    }

    critical(...object: any[]) {
        this.log('critical', ...object)
    }

    app(...object: any[]) {
        this.log('app', ...object)
    }

    trace(...object: any[]) {
        this.log('trace', ...object)
    }

    debug(...object: any[]) {
        this.log('debug', ...object)
    }

    warning(...object: any[]) {
        this.log('warning', ...object)
    }

    info(...object: any[]) {
        this.log('info', ...object)
    }
}

@Module({
    providers: [LoggerService],
    exports: [LoggerService],
})
export class LoggerModule {}
