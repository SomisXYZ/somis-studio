import { CustomError } from '~/utils/error'

export type Union<A, B> = A & B
export type Union3<A, B, C> = A & B & C

export type Merge<M, N> = Omit<M, keyof N> & N

type _MergeN<T extends readonly any[], Result> = T extends readonly [infer Head, ...infer Tail]
    ? _MergeN<Tail, Merge<Result, Head>>
    : Result

/** Merge N types, properties types from the latter override the ones defined on the former type */
// eslint-disable-next-line @typescript-eslint/ban-types
export type MergeN<T extends readonly any[]> = _MergeN<T, {}>

export interface IContext {
    userPublicKey?: string
    role?: 'USER' | 'ADMIN'
    tokenError?: CustomError
}

export interface DecodedLoginToken {
    attemptPublicKey: string
    signData: string
    storeId?: string
}

export interface DecodedToken {
    publicKey: string
    storeId?: string
    role?: 'USER' | 'ADMIN'
}

export interface Paging {
    skip: number
    limit: number
}

export interface Sorting<E> {
    sortBy: E
    order: 'ASC' | 'DES'
}
