let Tag = require('../models/Tag')
let express = require('express')
let router = express.Router()

/**
 * @api {post} /memo Create Tag
 * @apiName createTag
 * @apiGroup Tag
 *
 * @apiParam {String} name tag name
 * @apiParam {String} icon tag icon
 *
 * @apiSuccess {Number} code
 * @apiSuccess {String} msg
 */
let createTag = (req, res, next) => {
  let tag = new Tag({
    author: req.session.userId,
    name: req.body.name,
    icon: req.body.icon
  })
  tag
    .save()
    .then(() => {
      res.status(201).json({ code: 0, msg: 'success' })
    })
    .catch(err => {
      return next({ statusCode: 500, msg: err })
    })
}

/**
 * @api {delete} /tag/:id Delete Tag
 * @apiName deleteTag
 * @apiGroup Tag
 *
 * @apiSuccess {Number} code
 * @apiSuccess {String} msg
 */
let deleteTag = (req, res, next) => {
  tag
    .remove({ _id: req.params.id })
    .then(() => {
      res.status(200).json({ code: 0, msg: 'success' })
    })
    .catch(err => {
      return next({ statusCode: 500, msg: err })
    })
}

/**
 * @api {post} /tag Get User All Tag
 * @apiName getUserAllTag
 * @apiGroup Tag
 *
 * @apiSuccess {Number} code
 * @apiSuccess {String} msg
 */
let getUserAllTag = (req, res, next) => {
  Tag.findByUserId(req.session.userId)
    .then(tags => {
      res.json({ code: 0, data: tags })
    })
    .catch(err => {
      return next({ statusCode: 500, msg: err })
    })
}

router
  .route('/')
  .get(getUserAllTag)
  .post(createTag)
router.route('/:id').del(deleteTag)

module.exports = router
