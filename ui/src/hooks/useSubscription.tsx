import { useCallback, useEffect, useState } from 'react'
import { createClient } from 'graphql-ws'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthState } from '~/contexts/auth'
import { use } from 'chai'

interface Props<P, T> {
    query: string
    params: P
    handler?: (data: T) => Promise<void>
}

export function useSubscription<T>(props: Props<Record<string, unknown>, T>): {
    data: T | null
    setData: (data: T | null) => void
} {
    const { query, params, handler } = props

    const [data, setData] = useState<T | null>(null)

    const { jwt } = useAuthState()

    const queryClient = useQueryClient()

    if (!process.env.NEXT_PUBLIC_GRAPHQL_WS_URL) {
        return { data: null, setData }
    }

    useEffect(() => {
        const client = createClient({
            url: process.env.NEXT_PUBLIC_GRAPHQL_WS_URL ?? '',
            lazy: true,
            connectionParams: () => {
                if (!jwt) {
                    return {}
                }
                return {
                    authorization: `Bearer ${jwt}`,
                }
            },
        })
        const subscription = client.subscribe(
            { query, variables: params },
            {
                next: (value) => {
                    if (value.data) {
                        setData(value.data as unknown as T)
                        handler?.(value.data as unknown as T)
                    } else {
                        console.log('no data')
                    }

                    if (value.errors) {
                        console.log(`error ${value.errors?.[0]?.path?.[0]}: `, value.errors)
                    }
                },
                error: function (error: unknown): void {
                    console.log('error', error)
                },
                complete: function (): void {
                    // no function
                    console.log('complete')
                },
            },
        )

        return () => {
            return subscription()
        }
    }, [jwt])

    return { data: data as T, setData }
}
