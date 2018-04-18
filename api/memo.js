let Memo = require('../models/Memo')
let express = require('express')
let router = express.Router()

router
  .route('/')
  .post((req, res) => {
    let memo = new Memo({
      author: req.session.userId,
      content: [req.body.content],
      date: [Date.now()],
      tags: []
    })
    memo
      .save()
      .then(() => {
        res.json({ msg: 'saved' })
      })
      .catch(err => {
        res.json({ code: 10200, msg: err })
      })
  })
  .get((req, res) => {
    Memo.findByUserId(req.session.userId)
      .then(memo => {
        res.json({ code: 0, data: memo })
      })
      .catch(err => {
        res.json({ code: 10201, msg: err })
      })
  })
router
  .route('/:id')
  .post((req, res) => {
    let content = req.body.content
    let date = Date.now()
    Memo.findByUserId(req.session.userId)
      .findOneAndUpdate({ _id: req.params.id }, { $push: { content, date } })
      .then(() => {
        res.json({ msg: 'success' })
      })
      .catch(err => {
        res.json({ code: 10202, msg: err })
      })
  })
  .get((req, res) => {
    Memo.findByUserId(req.session.userId)
      .findOne({ _id: req.params.id })
      .then(memo => {
        res.json({ code: 0, data: a })
      })
      .catch(err => {
        res.json({ code: 10203, msg: err })
      })
  })

module.exports = router
