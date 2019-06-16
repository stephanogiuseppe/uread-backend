import path from 'path'
import nodemailer from 'nodemailer'
const hbs = require('nodemailer-express-handlebars')

import json from '../config/mail.json'
const { host, port, user, pass } = json

const transport = nodemailer.createTransport({
  host,
  port,
  auth: {
    user,
    pass
  }
})

transport.use(
  'compile',
  hbs({
    viewEngine: 'handlebars',
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html'
  })
)

export default transport
