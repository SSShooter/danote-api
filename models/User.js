let mongoose = require('mongoose')
let Schema = mongoose.Schema
let userSchema = Schema({
  name: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  createDate: {
    type: [Schema.Types.ObjectId]
  }
})


module.exports = mongoose.model('User', userSchema)
