require('dotenv').config()
import express from 'express'
import bodyParser from 'body-parser'
import routes from './routes'
import path from 'path'
import { getEnv, EXPRESS_PORT } from './config/getEnv'
const cors = require('cors')

const app: express.Application = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors())

app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads', 'resized')))

app.use(routes)

app.listen(getEnv(EXPRESS_PORT), () => {
  console.log(`Server is running on port ${getEnv(EXPRESS_PORT)}`)
})
