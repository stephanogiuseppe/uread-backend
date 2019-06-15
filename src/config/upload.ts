import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, '..', '..', 'uploads'),
  filename: function (_, file, cb) {
    cb(null, file.originalname)
  }
})

export default storage