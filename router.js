const express = require('express')
const router = express.Router()
var Tasks = require('./api/model/task')
var bodyParser = require('body-parser')
var Users = require('./api/model/user')

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
  res.json({message: meo})
})
router.post('/login',(req, res) => {
  let {body} = req
  res.json(body)
})
router.post('/register',(req, res) => {
  let {body} = req
  res.json(body)
})
module.exports = router
