const express = require('express')
const router = express.Router()
var Tasks = require('./api/model/task')
var bodyParser = require('body-parser')
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
    res.json({status: 200, data})
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
  task.save()
  console.log('Save task with DB complete: ' + task)
  res.json({status: 200, task})
})
module.exports = router
