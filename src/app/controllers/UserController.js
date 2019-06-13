const User = require('../models/User')

module.exports = {
  async edit(req, res) {
    const { name, email, password, favoritePosts, subscriptions } = req.body
    const user = await User.findByIdAndUpdate(req.params.id, {
      name,
      email,
      password: await bcrypt.hash(password, 10),
      favoritePosts,
      subscriptions
    }, { new: true })

    user.password = undefined
    res.send(user)
  }
}
