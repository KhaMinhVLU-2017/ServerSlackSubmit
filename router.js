const express = require('express')
const router = express.Router()
var Tasks = require('./api/model/task')
var bodyParser = require('body-parser')
var Users = require('./api/model/user')
const bcrypt = require('bcrypt')
const saltRounds = 10
var jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const { myEmail, api } = require('./config')
router.use(bodyParser.json()) // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

router.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  console.log('User connect API at Time: ', Date.now())
  next()
})

router.get('/', (req, res) => {
  res.send('Welcome to API')
})
// Get TaskList
router.get('/taskList', (req, res) => {
  Tasks.find({}, (err, payload) => {
    if (err) console.log(err)
    let data = payload.reverse()
    res.json({ status: 200, data })
  })
})
// Create Task POST
router.post('/task', (req, res) => {
  let content = req.body.content
  let status = req.body.status
  let author = 'JudasFate'
  var task = new Tasks()
  task.content = content
  task.status = status
  task.author = author
  task.date = 'waiting'
  task.save()
  console.log('Save task with DB complete: ' + task)
  res.json({ status: 200, task })
})
// Delete Task Doing
router.get('/Task:id', (req, res) => {
  let id = req.params.id
  Tasks.deleteOne({ _id: id }, (err) => {
    console.log('Error: ' + err)
  })
  let meo = 'Remove task complete ' + id
  res.json({ message: meo })
})
/**
 * 
 */
router.post('/login', (req, res) => {
  let { email, password } = req.body
  res.json(body)
})
router.post('/register', (req, res) => {
  let { email } = req.body
  let { username } = req.body
  let { password } = req.body
  let token = jwt.sign({ email, username }, api.keyToken, { expiresIn: '1h' })
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) res.json({
      message: 'Hash error',
      status: 500
    })
    let user = new Users()
    user.email = email
    user.username = username
    user.password = hash
    user.status = 'inactive'
    user.save((err) => {
      if (err) res.json({
        message: 'Not save DB',
        status: 500
      })
    })
    nodemailer.createTestAccount((err, account) => {
      let transporter = nodemailer.createTransport(myEmail)
      let subject = 'Hello ' + username + ' ✔'
      let url = api.local + '/api/verify' + token
      let text = '<p>You are check url verify account mySlackSubmit: ' + url + '</p>'
      let mailOptions = {
        from: '"Slacks\'s JudasFate" <myslackjudasfate@gmail.com>', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: text // html body
      }
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Send email complete ' + email)
      })
      res.json({
        message: 'complete',
        status: 200
      })
    })
  })
})
/**
 * Link getToken veryfi account
 */
router.get('/verify:token', (req, res) => {
  let token = req.params.token
  jwt.verify(token, api.keyToken, function (err, decoded) {
    if (err) res.json({
      message: 'Token error',
      status: 500
    })
    let emailCr  = decoded.email
    Users.findOneAndUpdate({ email: emailCr }, { status: 'active' }, (err) => {
      if (err) res.json({
        message: 'Token error',
        status: 500
      })
      res.json({
        message: 'Update Complete',
        status: 200
      })
    })
  })
})
module.exports = router
