import express from 'express'
import Post from '../models/Post'
import Comment from '../models/Comment'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs'

const PostController = {
  async get(_: any, res: express.Response) {
    const posts = await Post.find().sort('-createdAt').populate(['author'])
    return res.json(posts)
  },
  async getById(req: express.Request, res: express.Response) {
    const post = await Post.findById(req.params.id)
      .populate(['author', 'column'])
    return res.json(post)
  },
  async getByColumn(req: express.Request, res: express.Response) {
    const columnId = req.params.columnId
    let posts = await Post.find().populate(['column'])
    posts = posts.filter((post: any) => post.column.id === columnId)
    return res.json(posts)
  },
  async search(req: express.Request, res: express.Response) {
    const posts = await Post.find().populate(['author', 'column'])
    const filteredPosts = posts.filter((post: any) =>
      post.title.toLowerCase().includes(req.params.search.toLowerCase())
    )
    return res.json(filteredPosts)
  },
  async create(req: express.Request, res: express.Response) {
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
  async edit(req: express.Request, res: express.Response) {
    try {
      const { column, author, title, description, tags, valid, active } = req.body
      const { filename: image } = req.file

      const [name] = image.split('.')
      const fileName = `${name}.jpg`

      await sharp(req.file.path)
        .resize(500)
        .jpeg({ quality: 70 })
        .toFile(path.resolve(req.file.destination, 'resized', fileName))

      fs.unlinkSync(req.file.path)

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
  async remove(req: express.Request, res: express.Response) {
    try {
      await Post.findByIdAndRemove(req.params.id);
      return res.send();
    } catch (error) {
      return res.status(400).send({ error: 'Error remove post' });
    }
  },
  async like(req: express.Request, res: express.Response) {
    const post: any = await Post.findById(req.params.id)

    post.likes += 1

    await post.save()

    return res.json(post)
  },
  async addComment(req: express.Request, res: express.Response) {
    const { description } = req.body.description

    const comment = await Comment.create({ description, assignedTo: req.headers.userId })

    const post: any = await Post.findById(req.params.id)
    post.comments.push(comment._id)

    await post.save()

    return res.json(post)
  },
  async removeComment(req: express.Request, res: express.Response) {
    const { id, idComment } = req.params
    await Comment.findByIdAndDelete(idComment)

    const post: any = await Post.findById(id)
    post.comments = post.comments.filter((comment: any) => comment != idComment)

    await post.save()

    return res.json(post)
  }
}

export default PostController
