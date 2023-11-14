const User = require('../models/userModel')
let nodemailer = require("nodemailer");
const pick = require('../../node_modules/lodash/pick')
require('dotenv').config()
const mailer = {}

mailer.create = async (req, res) => {
  try {
    console.log(req.body, 'node-mailer')
    const body = req.body
    console.log(body, 'body')
    const subscribers = body
    setTimeout(() =>{
    subscribers.map(async(ele) =>{
        const user = await  User.findOne({ _id: ele.userId })
        if (user) {
          let transporter = nodemailer.createTransport({
            service: 'outlook',
            auth: {
              user: 'rajathr02@gmail.com',
              pass: 'Ka05kq5234',
    
            }
          });
    
          let mailOptions = {
            from: 'rajathr02@gmail.com',
            to: user.email,
            subject: 'content',
            text: `Hi Dear User,

            Exciting news! Fresh content just landed on our platform. 🎉 Check it out now:
            Stay in the loop and enjoy the latest updates!
            
            Well Wishes.`
          }
    
          transporter.sendMail(mailOptions, function (err, data) {
            if (err) {
              console.log("Error " + err);
              res.status(201)
            } else {
              console.log("Email sent successfully");
              res.status(200).json('sent')
            }
          })
    
        }
        subscribers.splice(0,1)
      }, 500)
    })
    
    
  }
  catch (e) {
    res.json(e)
  }
}

module.exports = mailer