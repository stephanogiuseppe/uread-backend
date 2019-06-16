import bcrypt from 'bcryptjs'

import mongoose from '../../data-source/mongo'

const UserSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true, select: false },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  favoritePosts: [{ type: String }],
  subscriptions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Column',
      require: false
    }
  ],
  createdAt: { type: Date, default: Date.now }
})

interface IUser extends mongoose.Document {
  password: string;
}

UserSchema.pre<IUser>('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 10)
  this.password = hash
  next()
})

export default mongoose.model('User', UserSchema)
