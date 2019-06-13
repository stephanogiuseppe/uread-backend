const mongoose = require('mongoose')

const ColumnSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true
    },
    writers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: false
      }
    ],
    subscriptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: 0
      }
    ]
  },
  { timestamps: true }
)

module.exports = mongoose.model('Column', ColumnSchema)
