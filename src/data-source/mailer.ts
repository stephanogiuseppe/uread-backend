import path from 'path'
import * as nodemailer from 'nodemailer'
const hbs = require('nodemailer-express-handlebars')

import { getEnv, MAILGUN_HOST, MAINGUN_PORT, MAILGUN_USER, MAINGUN_PASS } from '../config/getEnv'
const host = getEnv(MAILGUN_HOST)
const port = parseInt(getEnv(MAINGUN_PORT))
const user = getEnv(MAILGUN_USER)
const pass = getEnv(MAINGUN_PASS)

const transport = nodemailer.createTransport({
  host,
  port,
  auth: {
    user,
    pass
  }
});

transport.use(
  'compile',
  hbs({
    viewEngine: 'handlebars',
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html'
  })
)

export default transport
