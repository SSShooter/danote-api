let Memo = require('../models/Memo')
let express = require('express')
let router = express.Router()

/**
 * @api {get} /memo Request User Memo
 * @apiName getUserAllMemo
 * @apiGroup Memo
 *
 * @apiSuccess {Number} code
 * @apiSuccess {Object} data
 * @apiSuccess {String} data.title
 * @apiSuccess {Array} data.date
 * @apiSuccess {Array} data.content
 */
let getUserAllMemo = (req, res, next) => {
  let limit = req.body.limit || 10
  let lastId = req.body.last || ''
  Memo.find({
    author: req.session.userId,
    _id: { $gt: lastId }
  })
    .limit(limit)
    .then(memos => {
      res.json({ code: 0, data: memos })
    })
    .catch(err => {
      return next({ statusCode: 500, msg: err })
    })
}
/**
 * @api {post} /memo Create Memo
 * @apiName createMemo
 * @apiGroup Memo
 *
 * @apiParam {String} content your memo
 * @apiParam {Array} tags tags of your memo
 *
 * @apiSuccess {Number} code
 * @apiSuccess {String} msg
 */
let createMemo = (req, res, next) => {
  let tags = req.body.tags
  let memo = new Memo({
    author: req.session.userId,
    content: [req.body.content],
    date: [Date.now()],
    tags
  })
  memo
    .save()
    .then(() => {
      res.status(201).json({ code: 0, msg: 'success' })
    })
    .catch(err => {
      return next({ statusCode: 500, msg: err })
    })
}

/**
 * @api {get} /memo/:id Get Memo By Id
 * @apiName getMemoById
 * @apiGroup Memo
 *
 * @apiSuccess {Number} code
 * @apiSuccess {Object} data
 * @apiSuccess {String} msg
 */
let getMemoById = (req, res, next) => {
  Memo.findByUserId(req.session.userId)
    .findOne({ _id: req.params.id })
    .then(memo => {
      res.json({ code: 0, data: memo })
    })
    .catch(err => {
      return next({ statusCode: 500, msg: err })
    })
}

/**
 * @api {put} /memo Update Memo By Id
 * @apiName updateMemoById
 * @apiGroup Memo
 *
 * @apiParam {String} content  new content in this update
 *
 * @apiSuccess {Number} code
 * @apiSuccess {String} msg
 */
let updateMemoById = (req, res, next) => {
  let content = req.body.content
  let date = Date.now()
  Memo.findByUserId(req.session.userId)
    .findOneAndUpdate({ _id: req.params.id }, { $push: { content, date } })
    .then(() => {
      res.status(201).json({ code: 0, msg: 'success' })
    })
    .catch(err => {
      return next({ statusCode: 500, msg: err })
    })
}

/**
 * @api {put} /memo Add Tag
 * @apiName addTag
 * @apiGroup Memo
 *
 * @apiParam {Array} tags All tags of your memo
 *
 * @apiSuccess {Number} code
 * @apiSuccess {String} msg
 */
let addTag = (req, res, next) => {}

router
  .route('/')
  .post(createMemo)
  .get(getUserAllMemo)

router
  .route('/:id')
  .put(updateMemoById)
  .get(getMemoById)

router.route('/:id/tags').put(addTag)

module.exports = router
