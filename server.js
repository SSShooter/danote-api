let mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/danote')
mongoose.Promise = global.Promise
let express = require('express')
let bodyParser = require('body-parser')
let app = express()

let port = process.env.PORT || 8090

var MemoApi = require('./api/memo')
var loginSys = require('./api/loginSys')

// CORS
app.use('/api', function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
  res.header(
    'Access-Control-Allow-Methods',
    'PATCH,PUT,POST,GET,DELETE,OPTIONS'
  )
  next()
})

// 页面文件夹
app.use(express.static('public'))

// 处理请求体
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.use(bodyParser.json())

// 处理session
let session = require('express-session')
app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: 'dddanote'
  })
)
// TODO 数据分页
app.use('/api', loginSys)

// check login
app.use(function(req, res, next) {
  console.log(req.session.userId)
  if (req.session.userId) next()
  else next({ statusCode: 401 })
})

app.use('/api/memo', MemoApi)

app.use((req, res, next) => {
  return next({ statusCode: 404 })
})

// error handler
app.use((err, req, res, next) => {
  err.data = null
  if (err.isServer) {
    // log the error...
    // probably you don't want to log unauthorized access
    // or do you?
  }
  return res.status(err.statusCode).json(err)
})

app.listen(port)
console.log('server start')
