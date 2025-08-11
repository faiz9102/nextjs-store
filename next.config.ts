import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    turbopack: {
        rules: {
            '*.graphql': {
                loaders: ['graphql-tag/loader'],
                as: '*.js',
            },
        },
    },
    experimental: {
        useCache : true
    },
    images: {
        remotePatterns: [
            new URL('http://magento.local/**'),
            new URL("https://dummyimage.com")
        ],
    },
};

export default nextConfig;
