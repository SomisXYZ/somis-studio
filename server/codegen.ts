import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    overwrite: true,
    generates: {
        './src/gql/generated.ts': {
            schema: './src/**/*.server.graphql',
            plugins: ['add', 'typescript', 'typescript-resolvers'],
            config: {
                enumsAsTypes: true,
                allowParentTypeOverride: true,
                content: ['/* eslint-disable */', '// @ts-ignore'],
            },
        },
    },
}

export default config
