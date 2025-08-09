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
    }
};

export default nextConfig;
