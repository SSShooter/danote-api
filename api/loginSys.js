let User = require('../models/User')
let express = require('express')
let router = express.Router()

/**
 * @api {post} /login Login
 * @apiName login
 * @apiGroup Login system
 *
 * @apiParam {String} name  username
 * @apiParam {String} password  user's password
 * @apiParamExample {json} Request-Example:
 *{
 *	"name":"ssshooter",
 *	"password":"1234567"
 *}

 * @apiSuccess {Number} code Error code
 * @apiSuccess {Object} msg Status description
 * @apiSuccessExample {json} Success-Response:
 * {
 *   "code":0,
 *   "msg": "Success"
 * }
 */
let login = (req, res, next) => {
  let name = req.body.name
  let password = req.body.password
  User.findOne({ name })
    .then(user => {
      if (!user) return next({ statusCode: 401, msg: 'wrong user' })
      if (user.comparePassword(password)) {
        req.session.name = name
        req.session.userId = user._id
        res.json({
          code: 0,
          msg: 'Success'
        })
      } else {
        return next({ statusCode: 401, msg: 'wrong pw' })
      }
    })
    .catch(err => next({ statusCode: 500, msg: err }))
}
/**
 * @api {post} /register Register
 * @apiName register
 * @apiGroup Login system
 *
 * @apiParam {String} name  username
 * @apiParam {String} password  user's password
 * @apiParamExample {json} Request-Example:
 *{
 *	"name":"ssshooter",
 *	"password":"1234567"
 *}
 *
 * @apiSuccess {Number} code Error code
 * @apiSuccess {Object} msg Status description
 * @apiSuccessExample {json} Success-Response:
 * {
 *   "code":0,
 *   "msg": "Success"
 * }
 */
let register = (req, res, next) => {
  let user = new User(req.body)
  user
    .save()
    .then(() => {
      res.json({ code: 0, msg: 'Success' })
    })
    .catch(err => {
      res.json({ msg: err })
    })
}

router.route('/login').post(login)

router.route('/register').post(register)

module.exports = router
