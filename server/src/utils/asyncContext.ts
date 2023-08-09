import { randomBytes } from 'crypto'
import { Request } from 'express'
import { createHook, AsyncResource, executionAsyncId } from 'node:async_hooks'

export type RequestContext = {
    logRef?: string
}
const contexts: Record<number, RequestContext> = {}

createHook({
    init: (asyncId, type, triggerAsyncId) => {
        // A new async resource was created
        // If our parent asyncId already had a context object
        // we assign it to our resource asyncId
        if (contexts[triggerAsyncId]) {
            contexts[asyncId] = contexts[triggerAsyncId]
        }
    },
    destroy: (asyncId) => {
        // some cleaning to prevent memory leaks
        delete contexts[asyncId]
    },
}).enable()

export function initContext(req: Request, fn: (ctx: RequestContext) => void) {
    // We force the initialization of a new Async Resource
    const asyncResource = new AsyncResource('REQUEST_CONTEXT')
    return asyncResource.runInAsyncScope(() => {
        // We now have a new asyncId
        const asyncId = executionAsyncId()
        // We assign a new empty object as the context of our asyncId
        contexts[asyncId] = {
            logRef: (req.headers['x-log-ref'] as string) ?? randomBytes(4).toString('hex'),
        }
        return fn(contexts[asyncId])
    })
}

export function getContext() {
    const asyncId = executionAsyncId()
    // We try to get the context object linked to our current asyncId
    // if there is none, we return an empty object
    return contexts[asyncId] || {}
}

export function asyncContext(req: any, res: any, next: (error?: any) => void) {
    initContext(req, (_ctx) => next())
}
