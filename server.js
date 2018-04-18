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
app.use('/api', function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
  res.header('Access-Control-Allow-Methods', 'PATCH,PUT,POST,GET,DELETE,OPTIONS')
  next()
})
app.use(express.static('public'))

// 处理请求体
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

// 处理session
let session = require('express-session')
app.use(session({
  resave: true, 
  saveUninitialized: false, 
  secret: 'dddanote'
}))
// TODO apidoc 写文档
app.use('/api',loginSys)

app.use('/api/memo', MemoApi)

app.use((req, res) => {
  res.json({ msg: '404' })
})

app.listen(port)
console.log('server start')
