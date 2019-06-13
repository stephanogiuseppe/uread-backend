const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema(
  {
    author: String,
    title: String,
    image: String,
    description: String,
    tags: String,
    likes: { type: Number, default: 0 },
    valid: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Post', PostSchema)
