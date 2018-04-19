let Tag = require('../models/Tag')
let express = require('express')
let router = express.Router()

let getUserAllTag = (req, res, next) => {
  Tag.findByUserId(req.session.userId)
  .then(tags => {
    res.json({ code: 0, data: tags })
  })
  .catch(err => {
    return next({ statusCode: 500, msg: err })
  })
}
router.route('/').get(getUserAllTag)

module.exports = router
