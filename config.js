const myEmail = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'myslackjudasfate@gmail.com', // generated ethereal user
    pass: 'Cankhondichchuyen2018' // generated ethereal password
  }
}
const api = {
  // local: 'http://localhost:7777',
  local: 'https://www.judasfateblog.cf/slackserver',
  keyToken: 'NhanSinhNhuMong',
  urlClient: 'https://myslacksubmit.netlify.com/',
  urlSlackHook: '',
  xToken: ''
}
const payLoadTemplate = (content) => {
  return [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": content
      },
      "accessory": {
        "type": "image",
        "image_url": "https://images.pexels.com/photos/670720/pexels-photo-670720.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        "alt_text": "sad dream"
      }
    },
    {
      "type": "context",
      "elements": [
        {
          "type": "mrkdwn",
          "text": "For more info, contact minhnguyengit@gmail.com"
        }
      ]
    },
    {
      "type": "divider"
    }
  ]
}

const payloadMain = (content) => {
  return {
    "text": content,
    "blocks": payLoadTemplate(content)
  }
}
module.exports = { myEmail, api, payLoadTemplate, payloadMain }