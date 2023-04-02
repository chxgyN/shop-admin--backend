const express = require('express')
const router = express.Router()
const { User } = require('../db/connect')

let jwt = require('jsonwebtoken');



router.post('/register', async (req, res) => {
  const obj = req.body
  const user = await User.findOne({ account: obj.account })
  if (!user) {
    await User.create(obj)
    res.send(JSON.stringify({
      code: 0,
      msg: '添加成功'
    }))
  } else {
    res.send(JSON.stringify({
      code: 1,
      msg: '该手机号或邮箱已被占用'
    }))
  }
})



router.post('/login', async (req, res) => {
  const obj = req.body
  const user = await User.findOne({
    account: obj.account,
    password: obj.password
  })  
  // console.log(user);
  let msg = ''
  if (user) {
    if (obj.autoLogin) {
      msg = undefined
    } else {
      msg = '登录成功'
    }
    const token = jwt.sign(user.toJSON(), '666', { expiresIn:'1h'});
    // console.log(token);
    res.send({
      code: 0,
      msg,
      data: {
        username: user.username,
        // avatar: user.avatar || '',
        role: user.role,
        token: token
      
      }
    })
  } else {
    const userAccount = await User.findOne({ account: obj.account })
    if (obj.autoLogin) {
      msg = null
    } else {
      if (userAccount) {
        msg = '密码错误'
      } else {
        msg = '此账户未注册'
      }
    }
    res.send({
      code: 1,
      msg
    })
  }
})

module.exports = router