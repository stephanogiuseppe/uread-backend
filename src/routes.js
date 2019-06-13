const express = require('express')
const multer = require('multer')

const uploadConfig = require('./config/upload')
const authMiddleware = require('./app/middlewares/auth')
const AuthController = require('./app/controllers/AuthController')
const ColumnController = require('./app/controllers/ColumnController')
const PostController = require('./app/controllers/PostController')
const UserController = require('./app/controllers/UserController')

const router = new express.Router()
const upload = multer(uploadConfig)

/* AUTH ROUTES */
router.post('/auth/register', AuthController.register)
router.post('/auth/authenticate', AuthController.authenticate)
router.post('/auth/forgot-password', AuthController.authenticate)
router.post('/auth/reset-password', AuthController.authenticate)

router.use(authMiddleware)

/* USER ROUTES */
router.put('/user/:id', UserController.edit)

/* COLUMN ROUTES */
router.get('/columns', ColumnController.get)
router.get('/columns/subscriptions', ColumnController.subscriptions)
router.post('/columns', ColumnController.create)
router.put('/columns/:id', ColumnController.update)
router.put('/columns/:id/subscribe', ColumnController.subscribe)
router.put('/columns/:id/unsubscribe', ColumnController.unsubscribe)
router.get('/columns/:search', ColumnController.search)

/* POSTS ROUTES */
router.get('/posts', PostController.get)
router.post('/posts', upload.single('image'), PostController.create)
router.get('/posts/:id', PostController.getById)
router.put('/posts/:id', upload.single('image'), PostController.edit)
router.delete('/posts/:id', PostController.remove)
router.get('/posts/column/:columnId', PostController.getByColumn)
router.put('/posts/:id/like', PostController.like)
router.post('/posts/:id/comment', PostController.addComment)
router.delete('/posts/:id/comment/:idComment', PostController.removeComment)

router.get('/posts/search/:search', PostController.search)

module.exports = router
