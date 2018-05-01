let mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/danote')
mongoose.Promise = global.Promise
let express = require('express')
let bodyParser = require('body-parser')
let app = express()

let port = process.env.PORT || 8090

let loginSys = require('./api/loginSys')
let MemoApi = require('./api/memo')
let TagApi = require('./api/tag')

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

// static
app.use(express.static('public'))

// process request body
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.use(bodyParser.json())

// process session
let session = require('express-session')
app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: 'dddanote'
  })
)

app.use('/api', loginSys)

// check login
app.use(function(req, res, next) {
  console.log(req.session.userId)
  if (req.session.userId) next()
  else next({ statusCode: 401 })
})

app.use('/api/memo', MemoApi)
app.use('/api/tag', TagApi)

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
