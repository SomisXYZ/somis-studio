import * as fs from 'fs'
const file = './src/gql/generated/graphql.ts'

/**
 * Temporary fix for https://github.com/dotansimha/graphql-code-generator/issues/8517
 */
const transform = async () => {
    fs.readFile(file, 'utf8', (err, data) => {
        console.log(
            'start transform the generated file of issue: https://github.com/dotansimha/graphql-code-generator/issues/8517',
        )
        if (err) {
            console.error(err)
            return
        }

        const sourceCode =
            '(metaData) => fetcher<MeQuery, MeQueryVariables>(MeDocument, {...variables, ...(metaData.pageParam ? {[pageParamKey]: metaData.pageParam} : {})})(),'
        const replaceCode =
            '(metaData) => fetcher<MeQuery, MeQueryVariables>(MeDocument, {...variables, ...(metaData.pageParam ?? {})})(),'
        const sourceCode2 =
            '(metaData) => fetcher<GetAppConfigQuery, GetAppConfigQueryVariables>(GetAppConfigDocument, {...variables, ...(metaData.pageParam ? {[pageParamKey]: metaData.pageParam} : {})})(),'
        const replaceCode2 =
            '(metaData) => fetcher<GetAppConfigQuery, GetAppConfigQueryVariables>(GetAppConfigDocument, {...variables, ...(metaData.pageParam ?? {})})(),'
        const result = data.replace(sourceCode, replaceCode).replace(sourceCode2, replaceCode2)
        fs.writeFile(file, result, 'utf8', function (err) {
            if (err) return console.log(err)
            console.log('done')
        })
    })
}

transform()
