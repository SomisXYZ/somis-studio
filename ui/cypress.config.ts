import { defineConfig } from 'cypress'
import webpackPreprocessor from '@cypress/webpack-preprocessor'
import path from 'path'
export default defineConfig({
    video: false,
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
            const options = {
                webpackOptions: {
                    resolve: {
                        alias: {
                            '~/': path.resolve(__dirname, './src'),
                            '@assets': path.resolve(__dirname, './public/assets'),
                        },
                    },
                },
                watchOptions: {},
            }
            on('file:preprocessor', webpackPreprocessor({ typescript: require.resolve('typescript') }))
        },
    },

    viewportHeight: 1080,
    viewportWidth: 1920,

    component: {
        devServer: {
            framework: 'next',
            bundler: 'webpack',
        },
    },
})
