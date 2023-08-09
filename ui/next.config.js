const nextTranslate = require('next-translate')

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        minimumCacheTTL: 120,
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
            {
                protocol: 'http',
                hostname: '**',
            },
        ],
    },
}

module.exports = nextTranslate({
    ...nextConfig,
})
// module.exports = nextConfig
