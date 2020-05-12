const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')

const app = express()
const compiler = webpack(WebpackConfig)

// dev 服务
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: '/__build__/',
    stats: {
      colors: true,
      chunks: false
    }
  })
)

// 热更新服务
app.use(webpackHotMiddleware(compiler))

// 静态资源服务
app.use(express.static(__dirname))

// json 解析
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }))

// router
const router = express.Router()
router.get('/simple/get', function(req, res) {
  res.json({
    msg: `hello world`
  })
})
router.get('/base/get', function(req, res) {
  res.json(req.query)
})
app.use(router)

const port = process.env.PORT || 8080

module.exports = app.listen(port, () => {
  console.log(`Server work on http://localhost:${port}`)
})
