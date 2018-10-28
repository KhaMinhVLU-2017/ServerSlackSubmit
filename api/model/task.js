var mongoose = require('mongoose')

var task = new mongoose.Schema({
  content: String,
  status: String,
  author: String
})

module.exports = mongoose.model('Tasks', task)
