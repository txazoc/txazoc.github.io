---
layout: home
title:  Webpack+React搭建
date:   2020-09-20
tags:   [webpack, react]
---

#### 配置.babelrc

```js
{
    "presets": [
        // es6语法编译为es5语法
        "@babel/preset-env",
        // 支持react
        "@babel/preset-react"
    ],
    "plugins": []
}
```

#### 配置webpack

##### webpack.json

```js
{
    "name": "webpack-react",
    "version": "1.0.0",
    "description": "webpack-react",
    "main": "index.js",
    "author": "tuxiaozhou",
    "license": "ISC",
    // 生产环境依赖
    "dependencies": {
        "react": "^16.8.6",
        "react-dom": "^16.8.6",
        "react-router-dom": "^5.0.1"
    },
    // 开发环境依赖
    "devDependencies": {
        "@babel/core": "^7.4.5",
        "@babel/preset-env": "^7.4.5",
        "@babel/preset-react": "^7.0.0",
        "babel-loader": "^8.0.6",
        "babel-polyfill": "^6.26.0",
        "clean-webpack-plugin": "^3.0.0",
        "css-loader": "^2.1.1",
        "postcss-loader": "^3.0.0",
        "autoprefixer": "^9.6.0",
        "less": "^3.9.0",
        "less-loader": "^5.0.0",
        "html-webpack-plugin": "^3.2.0",
        "style-loader": "^0.23.1",
        "webpack": "^4.33.0",
        "webpack-cli": "^3.3.3",
        "webpack-dev-server": "^3.7.1",
        "webpack-merge": "^4.2.1"
    },
    // npm脚本命令
    "scripts": {
        "start": "webpack-dev-server --open --config webpack.dev.config.js",
        "build": "webpack --config webpack.product.config.js"
    }
}
```

##### webpack.base.config.js

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    // 入口文件
    entry: './src/index.js',
    // 输出文件
    output: {
        filename: 'bundle.[hash].js',
        path: path.join(__dirname, '/dist')
    },
    module: {
        // 配置相应的规则
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader', 'postcss-loader']
        }, {
            test: /\.js[x]?$/,
            use: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.less$/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: { importLoaders: 1 }
                },
                'less-loader'
            ],
        }]
    },
    // 配置相应的插件
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new CleanWebpackPlugin()
    ]
};
```

##### webpack.dev.config.js

```js
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');

module.exports = merge(baseConfig, {
    // 开发模式
    mode: 'development',
    devtool: 'inline-source-map',
    // 配置服务端口和目录
    devServer: {
        contentBase: './dist',
        port: 3000
    }
});
```

##### webpack.product.config.js

```js
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');

module.exports = merge(baseConfig, {
    // 生产模式
    mode: 'production'
});
```

##### postcss.config.js

```js
module.exports = {
    plugins: {
        'autoprefixer': { browsers: 'last 5 version' }
    }
}
```

#### React

##### index.js

```js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.less';

ReactDOM.render(< App />, document.getElementById('root'));
```
