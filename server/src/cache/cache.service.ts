import DataLoader, { CacheMap } from 'dataloader'

import { Inject, Injectable } from '@nestjs/common'
import { createClient } from '@redis/client'

import { REDIS_CLIENT, REDIS_SUB_CLIENT } from '~/const'

export class LockFail implements Error {
    name = 'LockFail'
    message = 'Lock acquire failed'
}

@Injectable()
export class CacheService {
    prefix: string
    constructor(
        @Inject(REDIS_CLIENT) private readonly client: ReturnType<typeof createClient>,
        // Redis subscription need to use different TCP connection
        @Inject(REDIS_SUB_CLIENT) private readonly subClient: ReturnType<typeof createClient>,
    ) {
        this.prefix = 'somis-backend'
    }

    prefixKey(key: string) {
        return `${this.prefix}:${key}`
    }

    async set(key: string, value: string, ttl?: number) {
        const prefixedKey = this.prefixKey(key)
        if (ttl != null) {
            await this.client.set(prefixedKey, value, { EX: ttl })
        } else {
            await this.client.set(prefixedKey, value)
        }
    }

    async get(key: string) {
        const prefixedKey = this.prefixKey(key)
        return await this.client.get(prefixedKey)
    }

    async publish(key: string, data: string) {
        const prefixedKey = this.prefixKey(key)
        return await this.client.publish(prefixedKey, data)
    }

    async incrBy(key: string, amount: number, ttl: number) {
        const prefixedKey = this.prefixKey(key)
        // set the key to 0 and set the ttl if the key is not exist
        await this.client.sendCommand(['SET', prefixedKey, '0', 'NX', 'EX', ttl.toString()])
        return await this.client.incrBy(prefixedKey, amount)
    }

    async subscribe(key: string, callback: (data: string) => void) {
        const prefixedKey = this.prefixKey(key)
        await this.subClient.subscribe(prefixedKey, (data: string) => {
            callback(data)
        })
    }

    async lock(key: string, ttl: number) {
        const prefixedKey = this.prefixKey(`lock:${key}`)
        const result = await this.client.sendCommand(['SET', prefixedKey, 'locked', 'NX', 'EX', ttl.toString()])
        if (result == null) {
            throw new LockFail()
        }
    }

    async unlock(key: string) {
        const prefixedKey = this.prefixKey(`lock:${key}`)
        await this.client.del(prefixedKey)
    }

    async unlockAll() {
        await this.unlock('*')
    }

    async mget<K, V>(prefix: string, keys: K[]): Promise<(V | Error | null)[]> {
        const prefixedKeys = keys.map((key) => this.prefixKey(`${prefix}:${String(key)}`))
        const results = await this.client.mGet(prefixedKeys)
        return results.map((result, idx) => {
            if (result != null) {
                if (result === '<null>') {
                    return null
                } else {
                    return JSON.parse(result) as V
                }
            } else {
                return new Error(`miss: ${prefixedKeys[idx]}`)
            }
        })
    }

    async mset<K, V>(prefix: string, keys: K[], values: (V | Error)[], ttl: number) {
        const obj: Record<string, string> = {}
        keys.forEach((key: K, idx: number) => {
            const value = values[idx]
            obj[this.prefixKey(`${prefix}:${String(key)}`)] = value != null ? JSON.stringify(value) : '<null>'
        })

        await this.client.mSet(obj)
        for (const key in obj) {
            await this.client.expire(key, ttl)
        }
    }

    async del(key: string) {
        const prefixedKey = this.prefixKey(key)
        return await this.client.del(prefixedKey)
    }

    async deletePattern(key: string) {
        const prefixedKey = this.prefixKey(key)
        const keys: string[] = []

        // find all the keys match the pattern without blocking the Redis DB
        // https://redis.io/commands/scan/
        for await (const key of this.client.scanIterator({ MATCH: prefixedKey })) {
            if (typeof key === 'string') {
                keys.push(key)
            }
        }
        if (keys.length > 0) {
            // FIXME fix the never type
            await this.client.del(...(keys as never))
        }
    }

    createCachedDataloader<K, V>(
        batchLoadFn: DataLoader.BatchLoadFn<K, V>,
        prefix: string,
        ttl = 180,
    ): DataLoader<K, V> {
        // purge the cache on service restart/redeploy
        this.deletePattern(`${prefix}:*`)
        const wrappedBatchLoadFn: DataLoader.BatchLoadFn<K, V> = async (keys: readonly K[]) => {
            const cachedValues = (await this.mget(prefix, keys as K[])) as ArrayLike<V | Error>
            const notCachedKey = keys.filter((_key, idx) => cachedValues[idx] instanceof Error)
            if (notCachedKey.length > 0) {
                const values = await batchLoadFn(notCachedKey)
                if (ttl > 0) {
                    await this.mset(prefix, notCachedKey as K[], values as (V | Error)[], ttl)
                }
                let i = 0
                return keys.map((key, idx) => {
                    if (cachedValues[idx] instanceof Error) {
                        return values[i++]
                    } else {
                        return cachedValues[idx]
                    }
                })
            } else {
                return cachedValues
            }
        }
        return new DataLoader(wrappedBatchLoadFn, {
            cacheMap: {
                // This is to align the es6 Map interface, the get/set function is done by the wrappedBatchLoadFn above
                get: () => {
                    // noop
                },
                set: () => {
                    // noop
                },
                delete: (key: K) => this.del(`${prefix}:${String(key)}`),
                clear: () => this.deletePattern(`${prefix}:*`),
            } as CacheMap<K, Promise<V>>,
        })
    }
}
