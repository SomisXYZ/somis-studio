import { config as awsConfig, S3, SQS } from 'aws-sdk'

import { Module } from '@nestjs/common'

import { S3_PROVIDER, SQS_PROVIDER } from '~/const'
import { CustomError, SystemError } from '~/utils/error'

import { S3Service } from './s3.service'
import { SqsService } from './sqs.service'

@Module({
    providers: [
        {
            provide: S3_PROVIDER,
            useFactory: () => {
                if (process.env.AWS_REGION == null) {
                    throw new CustomError(SystemError.EnvMissing).addDetails({
                        message: 'AWS_REGION is missing in env',
                    })
                }
                if (process.env.AWS_ACCESS_KEY == null) {
                    throw new CustomError(SystemError.EnvMissing).addDetails({
                        message: 'AWS_ACCESS_KEY is missing in env',
                    })
                }

                if (process.env.AWS_SECRET_KEY == null) {
                    throw new CustomError(SystemError.EnvMissing).addDetails({
                        message: 'AWS_SECRET_KEY is missing in env',
                    })
                }
                awsConfig.update({
                    region: process.env.AWS_REGION,
                    accessKeyId: process.env.AWS_ACCESS_KEY,
                    secretAccessKey: process.env.AWS_SECRET_KEY,
                })
                return new S3()
            },
        },
        {
            provide: SQS_PROVIDER,
            useFactory: () => {
                if (process.env.AWS_REGION == null) {
                    throw new CustomError(SystemError.EnvMissing).addDetails({
                        message: 'AWS_REGION is missing in env',
                    })
                }
                if (process.env.AWS_ACCESS_KEY == null) {
                    throw new CustomError(SystemError.EnvMissing).addDetails({
                        message: 'AWS_ACCESS_KEY is missing in env',
                    })
                }

                if (process.env.AWS_SECRET_KEY == null) {
                    throw new CustomError(SystemError.EnvMissing).addDetails({
                        message: 'AWS_SECRET_KEY is missing in env',
                    })
                }
                if (process.env.AWS_SQS_URL == null) {
                    throw new CustomError(SystemError.EnvMissing).addDetails({
                        message: 'AWS_SQS_URL is missing in env',
                    })
                }
                return new SQS({
                    region: process.env.AWS_REGION,
                    credentials: {
                        accessKeyId: process.env.AWS_ACCESS_KEY,
                        secretAccessKey: process.env.AWS_SECRET_KEY,
                    },
                    endpoint: process.env.AWS_SQS_URL,
                })
            },
        },
        S3Service,
        SqsService,
    ],
    exports: [S3Service, SqsService],
})
export class AwsModule {}
