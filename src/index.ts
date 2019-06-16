import express from 'express'
import bodyParser from 'body-parser'
import routes from './routes'

const app: express.Application = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(routes)

app.listen(3838, () => {
  console.log('Server is running on port 3838')
})
