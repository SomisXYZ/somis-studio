import { S3 } from 'aws-sdk'

import { Inject, Injectable } from '@nestjs/common'

import { S3_PROVIDER } from '~/const'
import { CustomError, SystemError } from '~/utils/error'

const maxSizeInMb = 20 * 1024 * 1024

@Injectable()
export class S3Service {
    constructor(@Inject(S3_PROVIDER) private readonly s3: S3) {
        if (process.env.S3_BUCKET_NAME == null) {
            throw new CustomError(SystemError.EnvMissing).addDetails({ message: 'S3_BUCKET_NAME is missing in env' })
        }
    }

    async getSignedUploadURL(path: string): Promise<S3.PresignedPost> {
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Fields: {
                key: path,
            },
            Expires: 1000,
            Conditions: [['content-length-range', 0, maxSizeInMb]],
        }

        return await new Promise((resolve, reject) => {
            this.s3.createPresignedPost(params, (err, data) => {
                if (err) {
                    reject(new CustomError(SystemError.InternalServerError, err))
                } else {
                    resolve(data)
                }
            })
        })
    }
}
