const webpack = require('webpack'),
    reactExternal = {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
    },
    reactDOMExternal = {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom',
    },
    preactExternal = {
        root: 'Preact',
        commonjs2: 'preact',
        commonjs: 'preact',
        amd: 'preact',
    },
    propTypes = {
        commonjs2: 'prop-types',
        commonjs: 'prop-types',
        amd: 'prop-types',
    };

module.exports = {
    entry: {
        'react-preact-modal': './src/index.js'
    },
    externals: {
        'react': reactExternal,
        'preact': preactExternal,
        'react-dom': reactDOMExternal,
        'prop-types': propTypes
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist',
        publicPath: '/',
        libraryTarget: 'umd',
        library: 'ReactPreactModal',
        umdNamedDefine: true
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new webpack.optimize.ModuleConcatenationPlugin()
    ],

    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
        ]
    }
}
