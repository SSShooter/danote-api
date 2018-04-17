let mongoose = require('mongoose')
let Schema = mongoose.Schema
let memoSchema = Schema({
  author: {
    type: Schema.Types.ObjectId,
    index: true,
    require: true
  },
  content: {
    type: [String],
    require: true
  },
  date: {
    type: [Date],
    require: true
  },
  title: {
    type: String,
    require: true
  },
  tags: {
    type: [Schema.Types.ObjectId]
  }
})

memoSchema.pre('remove', function(next) {
  this.model('Tag').update(
    { list: { $in: this.tags } },
    { $pull: { list: this._id } },
    { multi: true },
    next
  )
})

module.exports = mongoose.model('Memo', memoSchema)
