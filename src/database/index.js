const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/uread', { useMongoClient: true })
mongoose.Promise = global.Promise
module.exports = mongoose
