const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');


module.exports = {
    publicPath: process.env.NODE_ENV === 'production'? '/': '/chattingRoom',
    css:{
      modules:true,
      loaderOptions: {
        css: {},
        postcss: {
          plugins: [
            autoprefixer({
              browsers: ['Android >= 4.0', 'iOS >= 7']
            }),
            pxtorem({
              rootValue: 37.5,
              propList: ['*'],
            })
          ]
        }
      }
    },
    devServer: {
      port:5000,
      proxy: {
        '/api': {
            target: 'https://www.loveyyt.cn',
            ws: true,
            changeOrigin: true,
            pathRewrite: {
                '^/api': ''
            }
          }
      }
    }
}