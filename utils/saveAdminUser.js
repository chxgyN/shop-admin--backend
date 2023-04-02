// const CryptoJs = require('crypto-js')
const { User } = require('../db/connect')

module.exports = async function () {
  const user = await User.findOne({account: 'admin'})
  if (!user) {

    await User.create({
      account: 'admin',
      // password: CryptoJs.MD5('123456').toString(),
      password: '123456',
      username: 'Admin',
      role: '总领导',
      entryTime: Date.now()
    })
  }
}