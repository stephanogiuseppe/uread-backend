const Column = require('../models/Column')

module.exports = {
  async get(req, res) {
    const column = await Column.find().sort('-createdAt')
    return res.json(column)
  },
  async create(req, res) {
    const { title, description } = req.body
    const user = req.userId
    const column = await Column.create({
      title,
      description,
      user,
      writers: [user]
    })

    return res.json(column)
  },
  async update(req, res) {
    const { title, description } = req.body
    const column = await Column.findByIdAndUpdate(req.params.id, {
      title,
      description
    }, { new: true })

    return res.json(column)
  },
  async subscribe(req, res) {
    const column = await Column.findById(req.params.id)

    const id = '' // my user id
    column.subscriptions.find(users => users._id === id)

    await column.update()
    req.io.emit('subscribeColumn', column)
    return res.json(column)
  }
}
