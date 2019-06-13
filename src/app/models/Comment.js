const mongoose = require('../../database')

const CommentSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      require: true
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      require: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Comment', CommentSchema)
