








module.exports = {
    devServer: {
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