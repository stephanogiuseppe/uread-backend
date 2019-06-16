import jwt from 'jsonwebtoken'
import express from 'express'
import { getEnv, SECRET_KEY } from '../../config/getEnv'

export default (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).send({ error: 'No token provided' })
  }

  const parts = authHeader.split(' ')

  if (parts.length !== 2) {
    return res.status(401).send({ error: 'Token error' })
  }

  const [scheme, token] = parts

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ error: 'Token malformatted' })
  }

  jwt.verify(token, getEnv(SECRET_KEY), (err: any, decoded: any) => {
    if (err) {
      return res.status(401).send({ error: 'Invalid token' })
    }

    req.headers.userId = decoded.id

    return next()
  })
  return
}
