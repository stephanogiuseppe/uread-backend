import express from 'express'
import User from '../models/User'
import AuthController from './AuthController'
import bcrypt from 'bcrypt'

const UserController = {
  async edit(req: express.Request, res: express.Response) {
    const { name, email, password, favoritePosts, subscriptions } = req.body
    const user: any = await User.findByIdAndUpdate(req.params.id, {
      name,
      email,
      password: await bcrypt.hash(password, 10),
      favoritePosts,
      subscriptions
    }, { new: true })

    user.password = undefined
    return res.send({
      user,
      token: AuthController.generateToken({ id: user.id })
    })
  }
}

export default UserController
