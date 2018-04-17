let mongoose = require('mongoose')
let Schema = mongoose.Schema
let tagSchema = Schema({
  author: {
    type: Schema.Types.ObjectId,
    index: true,
    require: true
  },
  icon: {
    type: String,
    require: true
  },
  name: {
    type: String,
    require: true
  },
  list: {
    type: [Schema.Types.ObjectId]
  },
  date: {
    type: Date,
    require: true
  }
})

tagSchema.pre('remove', function(next) {
  this.model('Memo').update(
    { tags: { $in: this.list } },
    { $pull: { tags: this._id } },
    { multi: true },
    next
  )
})

module.exports = mongoose.model('Tag', tagSchema)
