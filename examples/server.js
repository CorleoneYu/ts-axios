const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')
const multipart = require('connect-multiparty')
const path = require('path')
const atob = require('atob')

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
app.use(
  express.static(__dirname, {
    setHeaders(res) {
      res.cookie('XSRF-TOKEN-D', '1234abc')
    }
  })
)

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
router.post('/base/post', function(req, res) {
  res.json(req.body)
})

router.post('/base/buffer', function(req, res) {
  let msg = []
  req.on('data', chunk => {
    if (chunk) {
      msg.push(chunk)
    }
  })
  req.on('end', () => {
    let buf = Buffer.concat(msg)
    res.json(buf.toJSON())
  })
})

// error
router.get('/error/get', function(req, res) {
  if (Math.random() > 0.5) {
    res.json({
      msg: `hello world`
    })
  } else {
    // 服务器错误
    res.status(500)
    res.end()
  }
})
router.get('/error/timeout', function(req, res) {
  setTimeout(() => {
    res.json({
      msg: 'hello world'
    })
  }, 3000)
})

// 泛型
router.get('/extends/user', function(req, res) {
  res.json({
    name: 'lky',
    age: 16
  })
})

// 拦截器
router.get('/interceptor/get', function(req, res) {
  res.json({
    data: 'lky'
  })
})

// config
router.post('/config/post', function(req, res) {
  res.json({
    data: 'lky'
  })
})

// withCredentials
router.get('/more/get', function(req, res) {
  res.json({
    data: 'lky'
  })
})

// 上传文件
app.use(
  multipart({
    uploadDir: path.resolve(__dirname, 'upload-file')
  })
)

router.post('/more/upload', function(req, res) {
  console.log(req.body, req.files)
  res.end('upload success!')
})

// http auth
router.post('/more/post', function(req, res) {
  const auth = req.headers.authorization
  console.log('auth: ', auth);
  const [type, credentials] = auth.split(' ')
  console.log(atob(credentials))
  const [username, password] = atob(credentials).split(':')
  if (type === 'Basic' && username === 'lky' && password === '123456') {
    res.json(req.body)
  } else {
    res.end('UnAuthorization')
  }
})

app.use(router)

const port = process.env.PORT || 8080

module.exports = app.listen(port, () => {
  console.log(`Server work on http://localhost:${port}`)
})
