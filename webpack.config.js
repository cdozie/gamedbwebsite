const resolve = require('path').resolve;
const path = require('path');
var webpack = require('webpack');
const config = {
 entry: __dirname + '/static/js/webscrape.js',
 output:{
      path: resolve(__dirname,'./static/js'),
      filename: 'bundle.js',
    //   publicPath: resolve(__dirname,'/static/js')
},
mode: 'production',

 resolve: {
  extensions: ['.js','.jsx','.css']
 },
 module: {
    rules: [
    {
    test: /\.js$/,
     loader: 'babel-loader',
     exclude: /node_modules/,
     options:{
        presets: ['@babel/react', '@babel/preset-env']
      }
    },  
]
   }
};
module.exports = config;