// @/graphql/fetcher.ts
import { request, Variables } from 'graphql-request'
import { useAuthState } from '~/contexts/auth'
//import { authStore } from '../app'
/**
 * Custom fetcher to append auth token to request.
 *
 * When using `graphql-request` directly with `graphql-codegen` (`fetcher: graphql-request` in codegen.yml),
 * it is required to pass `client` on each query, which is troublesome.
 * Therefore we create a custom fetcher to provide the endpoint directly to simplify code.
 */
const baseUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL ?? 'http://localhost:3000/graphql'
if (!baseUrl) {
    throw new Error('BASE GRAPHQL_URL not defined')
}
export const fetcher = <TData, TVariables extends Variables>(
    query: string,
    variables?: TVariables,
    headers?: HeadersInit,
) => {
    return async () => {
        const sessionToken = useAuthState.getState().jwt
        const _headers = {
            ...headers,
            ...(sessionToken && { Authorization: `Bearer ${sessionToken}` }),
        }

        try {
            const data = await request<TData, TVariables>({
                url: baseUrl,
                document: query,
                variables,
                requestHeaders: _headers,
                // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            } as any)
            // log('fetcher query: ', variables, 'result: ', data)
            return data
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        } catch (e: any) {
            // console.log(e)
            // either handle error globally here, or delegate it to `react-query`'s `onError`
            if (typeof window !== 'undefined' && e.response?.erroers?.[0]?.extensions?.code === 'AUTH_UNAUTHORIZED') {
                console.log('AUTH_UNAUTHORIZED')
                useAuthState.getState().logout()
            }
            // console.log('fetcher error: ', e)
            throw e
        }
    }
}
