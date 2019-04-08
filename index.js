const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 7777
const router = require('./router')
var schedule = require('node-schedule')
var Tasks = require('./api/model/task')
var axios = require('axios')
var cors = require('cors')
let {payloadMain, api} = require('./config')
/**
 * Check schedule
 * 0 * 1 * * 0-7  tu thu 2 --> CN work tai 1:00AM o phut thu 1
 * every day at 7:AM except sunday 0 1 7 * * 0-6
 */

var j = schedule.scheduleJob('1 * * * * 0-7', function () {
  console.log('Start Schedule Complete')
  Tasks.find({}, (err, data) => {
    if (err) console.log(err)
    data.map(item => {
      if (item.status === 'Doing') {
        //item.content
        let payload = payloadMain(item.content)
        console.log(payload)
        let url =  api.urlSlackHook// test SlackAPI
        axios.defaults.headers.common['Authorization'] =  api.xToken// Token not push GIt for security
        axios.defaults.headers.post['Content-Type'] = 'application/json'
        axios.post(url, payload)
          .then(function (response) {
            var currentdate = new Date()
            var datetime = currentdate.getDate() + '/' + (currentdate.getMonth() + 1) + '/' +
            currentdate.getFullYear() + ' @ ' +
            currentdate.getHours() + ':' +
            currentdate.getMinutes() + ':' +
            currentdate.getSeconds()
            Tasks.update({ _id: item._id }, { status: 'Done', date: datetime }, (err, resData) => {
              if (err) console.log(err)
              console.log('Submit and Update status task complete')
            })
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    })
  })
})

mongoose.connect('mongodb://judasfate:alarmslack2018@ds157538.mlab.com:57538/alarmslack', { useNewUrlParser: true })
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('Connect Mongodb Complete')
})

app.get('/', (req, res) => res.send('Hello World!'))
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type') // If needed
  res.setHeader('Access-Control-Allow-Credentials', true) // If needed
  next()
})
app.use(cors())
app.use('/api', router)

app.listen(process.env.PORT || port, () => {
  console.log(`Server listening on port ${port}!`)
})
