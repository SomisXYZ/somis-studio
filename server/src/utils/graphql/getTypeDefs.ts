import { readFile } from 'fs'
import glob from 'glob'

export async function getTypeDefs(pattern: string): Promise<string> {
    return new Promise((resolve) => {
        glob(pattern, async (_err, paths) => {
            const promises = paths.map(
                (path) =>
                    new Promise((innerResolve) => {
                        readFile(path, { encoding: 'utf8' }, (_err, result) => {
                            innerResolve(result)
                        })
                    }),
            )
            const files = await Promise.all(promises)
            resolve(files.join('\n'))
        })
    })
}
