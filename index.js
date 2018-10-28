const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 4444
const router = require('./router')
var schedule = require('node-schedule')
var Tasks = require('./api/model/task')
var axios = require('axios')

/**
 * Check schedule
 * 0 * 1 * * 0-7  tu thu 2 --> CN work tai 1:00AM o phut thu 1
 */

var j = schedule.scheduleJob('0 * * * * 0-7', function () {
  console.log('Every minute')
  Tasks.find({}, (err, data) => {
    if (err) console.log(err)
    data.map(item => {
      if (item.status === 'Doing') {
        let payload = { 'text': item.content }
        console.log(payload)
        let url = 'https://hooks.slack.com/services/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'
        axios.defaults.headers.common['Authorization'] = 'xoxp-452785191120-454101834432-466069826834-0dafc517b73cd4977a05a148fa1fdd9a'
        axios.defaults.headers.post['Content-Type'] = 'application/json'
        axios.post(url, payload)
          .then(function (response) {
            Tasks.update({ _id: item._id }, { status: 'Done' }, (err, resData) => {
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

app.use('/api', router)

app.listen(process.env.PORT || port, () => {
  console.log(`Server listening on port ${port}!`)
})
