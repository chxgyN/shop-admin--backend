const CryptoJs = require('crypto-js')
const { User } = require('../db/connect')

module.exports = async function () {
  const user = await User.findOne({account: 'admin'})
  if (!user) {
    console.log(123);
    await User.create({
      account: 'admin',
      password: CryptoJs.MD5('123456').toString(),
      username: 'Admin',
      role: '总领导',
      entryTime: Date.now()
    })
  }
}