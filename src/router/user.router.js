// 注册接口
const Router = require('koa-router');
const { create, avatarInfo } = require('../controller/user.controller');
const { verifyUser, handlePassword } = require('../middleware/user.middleware')

const userRouter = new Router({prefix: '/users'});

// 第一个是中间件是判断用户名或密码为空等  
// 第二个中间件是加密密码
// 第三个 就是执行注册的中间件
userRouter.post('/', verifyUser, handlePassword, create);  // 用户注册接口
userRouter.get('/:userId/avatar', avatarInfo)   // 获取用户头像接口
module.exports = userRouter;