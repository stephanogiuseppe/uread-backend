import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema(
  {
    title: String,
    image: String,
    description: String,
    tags: String,
    likes: {
      type: Number,
      default: 0
    },
    valid: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    },
    column: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Column'
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        require: false
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

export default mongoose.model('Post', PostSchema)
