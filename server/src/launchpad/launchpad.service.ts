import { randomUUID } from 'crypto'
import { Model, PipelineStage } from 'mongoose'

import { Inject, Injectable } from '@nestjs/common'

import { S3Service } from '~/aws/s3.service'
import { LAUNCHPAD_MODEL } from '~/const'
import { IContext } from '~/types'
import { AuthError, CustomError, GenericError } from '~/utils/error'

import { ILaunchpad } from './launchpad.schema'

@Injectable()
export class LaunchpadService {
    constructor(
        @Inject(LAUNCHPAD_MODEL) private readonly launchpadModel: Model<ILaunchpad>,
        private readonly s3Service: S3Service,
    ) {}

    async getLaunchpad({ id }: { id: string }): Promise<ILaunchpad | null> {
        return await this.launchpadModel.findOne({ id }).lean().exec()
    }

    async getLaunchpads({
        keyword,
        owner,
        whitelisted,
        skip = 0,
        limit = 20,
    }: {
        keyword?: string
        owner?: string
        whitelisted?: boolean
        skip?: number
        limit?: number
    }): Promise<{ totalItems: number; items: ILaunchpad[] }> {
        const filters: PipelineStage.FacetPipelineStage[] = []
        if (keyword != null) {
            filters.push({
                $match: {
                    $or: [
                        { name: { $regex: keyword, $options: 'i' } },
                        { description: { $regex: keyword, $options: 'i' } },
                    ],
                },
            })
        }
        if (owner != null) {
            filters.push({
                $match: {
                    owner: owner,
                },
            })
        }

        if (owner == null && whitelisted) {
            filters.push({
                $match: {
                    whitelisted: true,
                },
            })
        }

        filters.push({
            $addFields: {
                launchDateSort: {
                    $cond: {
                        if: { $not: ['$launchDate'] },
                        then: owner != null ? Number.MAX_VALUE : 0,
                        else: '$launchDate',
                    },
                },
            },
        })

        const result = (await this.launchpadModel.aggregate([
            {
                $facet: {
                    totalItems: [...filters, { $count: 'count' }],
                    items: [
                        ...filters,
                        { $sort: { order: -1, launchDateSort: -1, name: 1 } },
                        { $skip: skip },
                        { $limit: limit },
                    ],
                },
            },
            {
                $addFields: {
                    totalItems: {
                        $arrayElemAt: ['$totalItems', 0],
                    },
                },
            },
            {
                $addFields: {
                    totalItems: {
                        $ifNull: ['$totalItems.count', 0],
                    },
                },
            },
        ])) as { totalItems: number; items: ILaunchpad[] }[]
        return result[0]
    }

    async createLaunchpad(model: Omit<ILaunchpad, 'id' | 'imageUrl' | 'coverUrl' | 'logoUrl'>): Promise<ILaunchpad> {
        const newModel = {
            ...model,
            imageUrl: 'no-image',
            coverUrl: 'no-image',
            logoUrl: 'no-image',
            id: randomUUID(),
        }
        return await this.launchpadModel.create(newModel)
    }

    async updateLaunchpad(id: string, model: Partial<Omit<ILaunchpad, 'id'>>): Promise<ILaunchpad> {
        const result = await this.launchpadModel.findOneAndUpdate({ id }, { $set: model }).lean().exec()
        if (result == null) {
            throw new CustomError(GenericError.NotFound)
        }
        return result
    }

    async deleteLaunchpad(id: string): Promise<ILaunchpad> {
        const result = await this.launchpadModel.findOneAndRemove({ id }).lean().exec()
        if (result == null) {
            throw new CustomError(GenericError.NotFound)
        }
        return result
    }

    async verifiyLaunchpadOwner(ctx: IContext, launchpadId: string) {
        // The GraphQL directive should already make sure user need to login
        if (ctx.userPublicKey == null) {
            throw new CustomError(AuthError.Unauthorized)
        }
        if (ctx.role !== 'ADMIN') {
            const launchpad = await this.getLaunchpad({ id: launchpadId })
            if (launchpad?.owner !== ctx.userPublicKey) {
                throw new CustomError(AuthError.Unauthorized).addDetails({
                    message: 'You are not admin or the owner of the launchpad',
                })
            }
        }
    }
}
