const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = merge(commonConfig, {
    devtool: 'source-map',
    mode: 'production',
    optimization: {
        emitOnErrors: false,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true,
                        drop_debugger: true,
                        pure_funcs: ['console.log', 'console.info'],
                    },
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
        ],
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                    priority: 10,
                },
                common: {
                    name: 'common',
                    minChunks: 2,
                    chunks: 'all',
                    priority: 5,
                },
            },
        },
        runtimeChunk: 'single',
        sideEffects: false,
    },
    plugins: [
        // Only enable bundle analyzer when needed
        ...(process.env.ANALYZE === 'true' ? [new BundleAnalyzerPlugin()] : []),
    ],
});
