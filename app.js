const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const authRouter = require('./routes/auth')
const productRouter = require('./routes/product')
const purchaseRouter = require('./routes/purchase')
const productInventoryChangeRouter = require('./routes/productInventoryChange')
const salesRouter = require('./routes/sales')
const userRouter = require('./routes/user')
const chatRouter = require('./routes/chat')
const userRoleChangeRouter = require('./routes/userRoleChange')
const saveAdminUser = require('./utils/saveAdminUser')

const app = express()

//设置跨域访问
app.all('*', (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.setHeader("Access-Control-Allow-Methods", "*")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Access-Token")
  res.setHeader("Access-Control-Expose-Headers", "*")
  res.setHeader("Access-Control-Allow-Headers", "content-type,Authorization");

  if (req.method == "OPTIONS") {
    res.sendStatus(200)
    return
  }
  next()
})

let expressJwt = require("express-jwt");

// const verToken = function(token){
//   return new Promise((resolve,reject)=>{
//     var info = jwt.verify(token.split(' ')[1],signkey);
//     resolve(info);
//   })
// }

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', authRouter)
app.use('/', productRouter)
app.use('/', purchaseRouter)
app.use('/', productInventoryChangeRouter)
app.use('/', salesRouter)
app.use('/', userRouter)
app.use('/', chatRouter)
app.use('/', userRoleChangeRouter)


// 解析token获取用户信息
app.use(function(req, res, next) {
  console.log(req,res,next);
  var token = req.headers['authorization'];
  if(token == undefined){
    return next();
  }else{
    vertoken.verToken(token).then((data)=> {
      req.data = data;
      return next();
    }).catch((error)=>{
      return next();
    })
  }
})

//验证token是否过期并规定哪些路由不用验证
app.use(expressJwt({
  secret: '666',
  algorithms: ['HS256'],
  }).unless({
  path: ['/login']//除了这个地址，其他的URL都需要验证
}))

//当token失效返回提示信息
app.use(function(err, req, res, next) {
  // if (err.status == 1) {
  //   return res.status(1).send('token失效');
  // }
  if (err.name === 'UnauthorizedError') {
      // console.error(req.path + ',无效token');
      res.json({
        msg: 'token过期或者无效，请重新登录',
        status: 1
      })
      res.redirect(302,"http://localhost:8080/login")
      return
    }
    next()
})

saveAdminUser().then(() => {
  console.log('管理员账号存储成功')
})

module.exports = app
