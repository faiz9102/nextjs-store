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
};

export default nextConfig;
