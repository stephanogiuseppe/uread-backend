import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost/uread', { useNewUrlParser: true })
mongoose.Promise = global.Promise

export default mongoose
