/**
 * Created by chenqu on 2017/9/4.
 */
const path = require('path');
const glob = require('glob');
const rd = require('rd');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 输出配置插件

const HOST = '127.0.0.1'; // 服务器IP
const PORT = 8080; // 端口

const ROOT = process.cwd(); // 运行目录
const SRC = path.join(ROOT, 'src'); // 工作目录
const ENTRY = path.join(SRC, 'entry'); // 入口文件目录
const DIST = path.join(ROOT, 'dist'); // 输出文件目录

const TEMPLATE = 'template/index.html';
const publicPathStr = '/entry/'; // 公共路径字符串
const testStr = /\.js$/; // 校验规则字符串
const outputFilenameStr = '[name].js';

const BABEL_LOADER = 'babel-loader'; // babel加载器
const BABEL_LOADER_ENFORCE = 'pre'; // babel-loader enforce属性
const ESLINT_LOADER = 'eslint-loader'; // eslint-loader加载器

const DEVTOOL = 'eval'; // devTool设置

let webpackConfig = {}; // webpack设置

// 入口文件配置项
const entry = {};
// 产检配置项
let plugins = [];

rd.eachFileFilterSync(ENTRY, testStr, (file) => {
    const lastPortion = path.basename(file, '.js');
    entry[lastPortion] = `./src/entry/${lastPortion}.js`;
    const htmlWebpackPluginItem = new HtmlWebpackPlugin({
        filename: `html/${lastPortion}.html`, // 生成文件位置
        template: TEMPLATE, // 模版文件位置
        chunks: [lastPortion], // 绑定对应打包的JS文件
    });
    plugins = [...plugins, htmlWebpackPluginItem];
});

// 输出配置
const output = {
    path: DIST,
    filename: outputFilenameStr,
    publicPath: publicPathStr,
};

// devTool 配置
const devTool = DEVTOOL;

// module 加载起配置项
const moduleSetting = { rules: [] };
// babel-loader 加载器
const babelLoader = {
    test: testStr,
    include: SRC,
    use: BABEL_LOADER,
};
// eslint-loader 加载器
const eslintLoader = {
    enforce: BABEL_LOADER_ENFORCE,
    test: testStr,
    include: [
        SRC,
    ],
    use: ESLINT_LOADER,
};
moduleSetting.rules = [...moduleSetting.rules, babelLoader, eslintLoader];

// devServer配置
const devServer = {
    hot: true, // 告诉 dev-server 我们在使用 HMR
    contentBase: path.resolve(__dirname, 'src'),
    inline: true,
    historyApiFallback: true,
    stats: 'normal',
    publicPath: '/entry/',
    host: '127.0.0.1',
    port: 8080,
};
webpackConfig = Object.assign(webpackConfig, { entry, output, plugins, devServer, module: moduleSetting });
webpackConfig.devtool = devTool;
module.exports = webpackConfig;
