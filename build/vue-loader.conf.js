const utils = require('./utils')

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: true
  }),
  postcss: [
    require('autoprefixer')({
      browsers: ["iOS >= 8","Android >= 5"]
    }),
    require('postcss-px2rem')({
      remUnit: 75
    })
  ]
}
