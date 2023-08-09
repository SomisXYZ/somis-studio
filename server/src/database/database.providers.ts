import * as mongoose from 'mongoose'

import { DATABASE_CONNECTION } from '~/const'
import { CustomError, SystemError } from '~/utils/error'

export const databaseProviders = [
    {
        provide: DATABASE_CONNECTION,
        useFactory: (): Promise<typeof mongoose> => {
            if (process.env.MONGO_URL == null) {
                throw new CustomError(SystemError.EnvMissing).addDetails({
                    message: 'MONGO_URL is missing in env',
                })
            }
            const connectionStr = process.env.MONGO_URL
            return mongoose.connect(connectionStr)
        },
    },
]
