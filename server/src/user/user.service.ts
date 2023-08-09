import DataLoader from 'dataloader'
import { Model, PipelineStage, UpdateQuery } from 'mongoose'

import { Inject, Injectable } from '@nestjs/common'

import { SqsService } from '~/aws/sqs.service'
import { CacheService } from '~/cache/cache.service'
import { USER_MODEL } from '~/const'
import { Paging, Sorting } from '~/types'

import { IUser, IUserRole } from './user.schema'

export type UserSorting = 'name' | 'lastLogin' | 'username' | 'role'

@Injectable()
export class UserService {
    userDataLoader: DataLoader<string, IUser>

    constructor(
        @Inject(USER_MODEL) private readonly userModel: Model<IUser>,
        private readonly cacheService: CacheService,
        private readonly sqsService: SqsService,
    ) {
        this.userDataLoader = cacheService.createCachedDataloader(async (userAddresses) => {
            const users = await this.userModel
                .find({ address: { $in: userAddresses } })
                .lean()
                .exec()
            const map = users.reduce<Record<string, IUser>>((acc, curr) => {
                acc[curr.address] = curr
                return acc
            }, {})

            const result: IUser[] = []

            for (const userAddress of userAddresses) {
                result.push(map[userAddress] ?? { address: userAddress, name: userAddress, username: userAddress })
            }

            return result
        }, 'user-dataloader')
    }

    async listUsers(options: { keyword?: string | null; role?: IUserRole | null } & Sorting<UserSorting> & Paging) {
        const { keyword, role, skip, limit, sortBy, order } = options
        const filters: PipelineStage.FacetPipelineStage[] = []

        if (keyword != null) {
            const expandedKeyword = keyword.replace(' ', '.*')
            filters.push({
                $match: {
                    $or: [
                        {
                            name: {
                                $regex: expandedKeyword,
                                $options: 'i',
                            },
                        },
                        {
                            description: {
                                $regex: expandedKeyword,
                                $options: 'i',
                            },
                        },
                        {
                            address: {
                                $regex: expandedKeyword,
                                $options: 'i',
                            },
                        },
                        {
                            username: {
                                $regex: expandedKeyword,
                                $options: 'i',
                            },
                        },
                    ],
                },
            })
        }

        if (role != null) {
            filters.push({ $match: { role } })
        }

        const result = (await this.userModel.aggregate([
            {
                $facet: {
                    totalItems: [...filters, { $count: 'count' }],
                    items: [
                        ...filters,
                        { $sort: { [sortBy]: order === 'ASC' ? 1 : -1 } } as PipelineStage.Sort,
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
            {
                $project: {
                    stats: false,
                    creators_list: false,
                },
            },
        ])) as { items: IUser[]; totalItems: number }[]

        return result[0]
    }

    async initUser(address: string) {
        const user = await this.userModel
            .findOneAndUpdate({ address }, { address, name: address, username: address }, { upsert: true })
            .lean()

        return user
    }

    async updateUserLastLogin(address: string) {
        await this.userModel.updateOne({ address }, { $set: { lastLogin: Date.now() } }, { upsert: true })
    }

    async getUser(address: string): Promise<IUser> {
        return await this.userDataLoader.load(address)
    }

    async updateUser(address: string, updateQuery: UpdateQuery<IUser>) {
        const result = await this.userModel.findOneAndUpdate({ address }, updateQuery, { upsert: true }).lean().exec()
        await this.userDataLoader.clear(address)
        return result
    }

    async createUser(user: Omit<IUser, 'imageUrl' | 'coverUrl' | 'lastLogin'>): Promise<IUser> {
        return await this.userModel.create(user)
    }

    async deleteUser(address: string) {
        const result = await this.userModel.findOneAndDelete({ address }).lean().exec()
        await this.userDataLoader.clear(address)
        return result
    }

    async findUser(filter: Partial<IUser>) {
        return await this.userModel.findOne(filter).lean().exec()
    }

    async indexWallet(address: string) {
        return await this.sqsService.indexWallet(address)
    }
}
