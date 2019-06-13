const Column = require('../models/Column')

module.exports = {
  async get(req, res) {
    const column = await Column.find().populate(["user", "subscriptions"])
    return res.json(column)
  },
  async subscriptions(req, res) {
    const column = await Column.find().populate(["user", "subscriptions"])
    column = column.subscriptions.filter(subscriptionsId === req.userId)
    return res.json(column)
  },
  async search(req, res) {
    const column =
      await Column.find().populate(["user", "subscriptions"])
    const columnFiltered = column.filter(column =>
      column.title.toLowerCase().includes(req.params.search.toLowerCase())
    )
    return res.json(columnFiltered)
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
    const { title, description, writers } = req.body
    const column = await Column.findByIdAndUpdate(req.params.id, {
      title,
      description,
      writers
    }, { new: true })

    return res.json(column)
  },
  async subscribe(req, res) {
    const column = await Column.findById(req.params.id)
    column.subscriptions.push(req.userId)

    await column.save()
    return res.json(column)
  },
  async unsubscribe(req, res) {
    let column = await Column.findById(req.params.id)
    column.subscriptions = column.subscriptions.filter(sub => sub != req.userId)

    await column.save()
    return res.json(column)
  }
}
