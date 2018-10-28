var mongoose = require('mongoose')

var user = new mongoose.Schema({
  username: String,
  email: String,
  password: String
})

module.exports = mongoose.model('Users', user)
