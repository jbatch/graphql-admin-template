const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const PUBLIC_URL = process.env.PUBLIC_URL || '';

module.exports = (env, options) => {
  const config = {
    context: path.resolve(__dirname, 'src'),
    entry: './index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
      contentBase: path.resolve(__dirname, './public'),
      contentBasePublicPath: '/',
      stats: 'errors-only',
      port: 8000,
      compress: true,
      historyApiFallback: true,
      proxy: [
        {
          context: ['/graphql'],
          target: 'http://localhost:4000',
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
      rules: [{ test: /\.tsx?$/, loader: 'ts-loader', exclude: '/node_modules/' }],
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        NODE_ENV: options.mode || 'development',
        PUBLIC_URL: 'http://localhost:8000',
        APP_BASE_PATH: '',
      }),
      new CopyPlugin({
        patterns: [{ from: '../public', to: './' }],
      }),
      new HtmlWebpackPlugin({
        template: '../public/index.ejs',
        filename: './index.html',
        PUBLIC_URL: PUBLIC_URL,
      }),
    ],
  };

  return config;
};
