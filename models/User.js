let mongoose = require('mongoose')
let Schema = mongoose.Schema
let crypto = require('crypto')

let userSchema = Schema({
  name: {
    type: String,
    trim:true,
    unique: true,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  createDate: {
    type: Date,
    default: Date.now
  }
})

userSchema.pre('save', function(next) {
  this.password = crypto
    .createHash('sha1')
    .update(this.password)
    .digest('hex')
  next()
})

userSchema.method('comparePassword', function(candidatePassword) {
  if (
    crypto
      .createHash('sha1')
      .update(candidatePassword)
      .digest('hex') === this.password
  )
    return true
  else return false
})

module.exports = mongoose.model('User', userSchema)
