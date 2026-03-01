import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Turbopack (used in `next dev --turbopack`)
    turbopack: {
        rules: {
            '*.graphql': {
                loaders: ['graphql-tag/loader'],
                as: '*.js',
            },
        },
    },
    // Webpack (used in `next build` and `next start`)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webpack(config: any) {
        config.module.rules.push({
            test: /\.graphql$/,
            exclude: /node_modules/,
            use: [{ loader: '@graphql-tools/webpack-loader' }],
        });
        return config;
    },
    experimental: {
        useCache: true,
    },
    images: {
        remotePatterns: [
            new URL('http://magento.local/**'),
            new URL("https://dummyimage.com"),
        ],
    },
};

export default nextConfig;
