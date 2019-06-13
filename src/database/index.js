const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/uread')
mongoose.Promise = global.Promise
module.exports = mongoose
