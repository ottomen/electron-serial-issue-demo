const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = () => {
    return {
        entry: {
            main: './src/main.ts',
            preload: './src/preload.ts',
        },
        target: 'electron-main',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].js',
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    include: /src/,
                    use: [{loader: 'ts-loader'}],
                },
            ],
        },
        node: {
            __dirname: false,
            __filename: false,
        },
        externals: [
            nodeExternals({
                allowlist: [/^@?electron/],
            }),
        ],
    };
};
