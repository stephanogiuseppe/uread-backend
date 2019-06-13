const Post = require('../models/Post')
const Comment = require('../models/Comment')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

module.exports = {
  async get(req, res) {
    const posts = await Post.find().sort('-createdAt').populate(['author'])
    return res.json(posts)
  },
  async getById(req, res) {
    const post = await Post.findById(req.params.id)
      .populate(['author', 'column'])
    return res.json(post)
  },
  async getByColumn(req, res) {
    const columnId = req.params.columnId
    const posts = await Post.find().populate(['column'])
    posts = posts.filter(post => post.column.id === columnId)
    return res.json(posts)
  },
  async search(req, res) {
    const posts = await Post.find().populate(['author', 'column'])
    const filteredPosts = posts.filter(post =>
      post.title.toLowerCase().includes(req.params.search.toLowerCase())
    )
    return res.json(filteredPosts)
  },
  async create(req, res) {
    const { column, author, title, description, tags, valid, active } = req.body
    const { filename: image } = req.file

    const [name] = image.split('.')
    const fileName = `${name}.jpg`

    await sharp(req.file.path)
      .resize(500)
      .jpeg({ quality: 70 })
      .toFile(path.resolve(req.file.destination, 'resized', fileName))

    fs.unlinkSync(req.file.path)

    const post = await Post.create({
      column,
      author,
      title,
      description,
      tags,
      valid,
      active,
      image: fileName
    })

    return res.json(post)
  },
  async edit(req, res) {
    try {
      const { column, author, title, description, tags, valid, active } = req.body
      const post = await Post.findByIdAndUpdate(req.params.id, {
        column,
        author,
        title,
        description,
        tags,
        valid,
        active,
        image: fileName
      })
      return res.json(post)
    } catch (error) {
      return res.status(400).send({ error: 'Error edit post' });
    }
  },
  async remove(req, res) {
    try {
      await Post.findByIdAndRemove(req.params.id);
      return res.send();
    } catch (error) {
      return res.status(400).send({ error: 'Error remove post' });
    }
  },
  async like(req, res) {
    const post = await Post.findById(req.params.id)

    post.likes += 1

    await post.save()

    return res.json(post)
  },
  async addComment(req, res) {
    const { description } = req.body.description

    const comment = await Comment.create({ description, assignedTo: req.userId })

    const post = await Post.findById(req.params.id)
    post.comments.push(comment._id)

    await post.save()

    return res.json(post)
  },
  async removeComment(req, res) {
    const { id, idComment } = req.params
    await Comment.findByIdAndDelete(idComment)

    const post = await Post.findById(id)
    post.comments = post.comments.filter(comment => comment != idComment)

    await post.save()

    return res.json(post)
  }
}
