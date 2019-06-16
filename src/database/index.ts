import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost/uread')
mongoose.Promise = global.Promise

export default mongoose
