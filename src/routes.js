const express = require('express')
const multer = require('multer')

const uploadConfig = require('./config/upload')
const authMiddleware = require('./app/middlewares/auth')
const AuthController = require('./app/controllers/AuthController')
const ColumnController = require('./app/controllers/ColumnController')
const PostController = require('./app/controllers/PostController')

const router = new express.Router()
const upload = multer(uploadConfig)

/* AUTH ROUTES */
router.post('/auth/register', AuthController.register)
router.post('/auth/authenticate', AuthController.authenticate)
router.post('/auth/forgot-password', AuthController.authenticate)
router.post('/auth/reset-password', AuthController.authenticate)

router.use(authMiddleware)

/* COLUMN ROUTES */
router.get('/column', ColumnController.get)
router.post('/column', ColumnController.create)
router.put('/column/:id', ColumnController.update)
router.put('/column/:id/subscribe', ColumnController.subscribe)

/* POSTS ROUTES */
router.get('/posts', PostController.get)
router.post('/posts', upload.single('image'), PostController.save)
router.post('/posts/:id/like', PostController.like)

module.exports = router
