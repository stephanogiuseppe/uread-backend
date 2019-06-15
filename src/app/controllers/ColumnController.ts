import express from 'express'
import Column from '../models/Column'

const ColumnController = {
  async get(_: any, res: express.Response) {
    const column = await Column.find().populate(["user", "subscriptions"])
    return res.json(column)
  },
  async subscriptions(req: express.Request, res: express.Response) {
    let column: any = await Column.find().populate(["user", "subscriptions"])
    column = column.subscriptions.filter((subscriptionsId: any) => subscriptionsId === req.headers.userId)
    return res.json(column)
  },
  async search(req: express.Request, res: express.Response) {
    const column: any =
      await Column.find().populate(["user", "subscriptions"])
    const columnFiltered = column.filter((column: any) =>
      column.title.toLowerCase().includes(req.params.search.toLowerCase())
    )
    return res.json(columnFiltered)
  },
  async create(req: express.Request, res: express.Response) {
    const { title, description } = req.body
    const user = req.headers.userId
    const column = await Column.create({
      title,
      description,
      user,
      writers: [user]
    })

    return res.json(column)
  },
  async update(req: express.Request, res: express.Response) {
    const { title, description, writers } = req.body
    const column = await Column.findByIdAndUpdate(req.params.id, {
      title,
      description,
      writers
    }, { new: true })

    return res.json(column)
  },
  async subscribe(req: express.Request, res: express.Response) {
    const column: any = await Column.findById(req.params.id)
    column.subscriptions.push(req.headers.userId)

    await column.save()
    return res.json(column)
  },
  async unsubscribe(req: express.Request, res: express.Response) {
    let column: any = await Column.findById(req.params.id)
    column.subscriptions = column.subscriptions.filter((sub: any) => sub != req.headers.userId)

    await column.save()
    return res.json(column)
  }
}

export default ColumnController