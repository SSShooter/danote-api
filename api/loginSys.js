let User = require('../models/User')
let express = require('express')
let router = express.Router()

router.route('/login').post((req, res) => {
  let name = req.body.name
  let password = req.body.password
  User.findOne({ name })
    .then(user => {
      if (user.comparePassword(password)) {
        req.session.name = name
        req.session.userId = user._id
        res.json({
          code: 0,
          msg: 'log in'
        })
      } else {
        res.json({
          code: 1,
          msg: 'wrong pw'
        })
      }
    })
    .catch(err => {
      res.json({
        code: 1,
        msg: 'db error'
      })
    })
})

router.route('/register').post((req, res) => {
  let user = new User(req.body)
  user
    .save()
    .then(() => {
      res.json({ msg: 'registered' })
    })
    .catch(err => {
      res.json({ msg: err })
    })
})

module.exports = router
