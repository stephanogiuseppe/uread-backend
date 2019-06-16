import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import mailer from '../../data-source/mailer'
import express from 'express'
import { getEnv, SECRET_KEY } from '../../config/getEnv'
import User from '../models/User'

function generateToken(params = {}) {
  return jwt.sign(params, getEnv(SECRET_KEY), {
    expiresIn: 86400
  })
}

const register = async (req: express.Request, res: express.Response) => {
  const { email } = req.body
  try {
    if (await User.findOne({ email })) {
      return res.status(400).send({ error: 'User already exists' })
    }

    const user: any = await User.create(req.body)
    user.password = undefined

    return res.send({
      user,
      token: generateToken({ id: user.id })
    })
  } catch (err) {
    return res.status(400).send({ error: 'Registrarion failed' })
  }
}

const authenticate = async (req: express.Request, res: express.Response) => {
  const { email, password } = req.body
  const user: any = await User.findOne({ email }).select('+password')

  if (!user) {
    return res.status(400).send({ error: 'User not found' })
  }

  if (!await bcrypt.compare(password, user.password)) {
    return res.status(400).send({ error: 'Invalid password' })
  }

  user.password = undefined

  return res.send({
    user,
    token: generateToken({ id: user.id })
  })
}

const forgotPassword = async (req: express.Request, res: express.Response) => {
  const { email } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).send({ error: 'User not found' })
    }

    const token = crypto.randomBytes(20).toString('hex')
    const now = new Date()
    now.setHours(now.getHours() + 1)

    await User.findByIdAndUpdate(user.id, {
      $set: {
        passwordResetToken: token,
        passwordResetExpires: now
      }
    })

    mailer.sendMail(
      {
        to: email.toString(),
        from: 'sender@server.com',
        html: `<p>To retrieve your email, use this token: ${token}</p>`
      },
      (err: any) => {
        if (err) {
          res.status(400).send({ error: 'Cannot send forgot pasword email' })
        }
      }
    )
    return res.send()
  } catch (err) {
    res.status(400).send({ error: 'Error on forget password, try again' })
  }
  return
}

const resetPassword = async (req: express.Request, res: express.Response) => {
  const { email, token, password } = req.body

  try {
    const user: any = await User.findOne({ email }).select(
      '+passwordResetToken passwordResetExpires'
    )

    if (!user) {
      return res.status(400).send({ error: 'User not found' })
    }

    if (token !== user.passwordResetToken) {
      return res.status(400).send({ error: 'Invalid token' })
    }

    const now = new Date()
    if (now > user.passwordResetExpires) {
      return res
        .status(400)
        .send({ error: 'Token expired, generate a new one' })
    }

    user.password = password
    await user.save()
    return res.send()
  } catch (err) {
    res.status(400).send({ error: 'Cannot reset pasword, try again' })
  }
  return
}

export default { register, authenticate, forgotPassword, resetPassword }