const Dotenv = require('dotenv-webpack');

module.exports = {
    //...
    plugins: [
        new Dotenv(),
    ],
    resolve: {
        fallback: {
            "path": require.resolve("path-browserify"),
            "os": require.resolve("os-browserify/browser")
        }
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
};
