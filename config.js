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
    local: 'http://localhost:7777',
    keyToken: 'NhanSinhNhuMong'
}
module.exports = {myEmail, api}