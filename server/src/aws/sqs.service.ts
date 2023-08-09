import { SQS } from 'aws-sdk'

import { Inject, Injectable } from '@nestjs/common'

import { SQS_PROVIDER } from '~/const'
import { CustomError, SystemError } from '~/utils/error'

export interface ISqsService {
    indexNft(address: string, force: boolean): Promise<void>
    indexCollection(address: string, force: boolean): Promise<void>
    indexWallet(address: string): Promise<void>
}

@Injectable()
export class SqsService implements ISqsService {
    sqsUrl: string
    constructor(@Inject(SQS_PROVIDER) private readonly sqs: SQS) {
        if (process.env.AWS_SQS_URL == null) {
            throw new CustomError(SystemError.EnvMissing).addDetails({ message: 'AWS_SQS_URL is missing in env' })
        }
        this.sqsUrl = process.env.AWS_SQS_URL
    }

    private async send(command: string) {
        const promise = new Promise((resolve, reject) => {
            this.sqs.sendMessage({ MessageBody: command, QueueUrl: this.sqsUrl }, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })

        return await promise
    }

    async indexNft(address: string, force = false) {
        if (force) {
            await this.send(`nft_force|${address}`)
        } else {
            await this.send(`nft|${address}`)
        }
    }

    async indexCollection(address: string, force = false) {
        if (force) {
            await this.send(`collection_force|${address}`)
        } else {
            await this.send(`collection|${address}`)
        }
    }

    async indexWallet(address: string) {
        await this.send(`wallet|${address}`)
    }

    async restart() {
        await this.send(`restart|0`)
    }
}
