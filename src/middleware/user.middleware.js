const errorTypes = require('../constants/error-types');
const UserService = require('../service/user.service');
const md5password = require('../utils/password-handle');

// 判断用户名跟密码注册是否成功的中间件
const verifyUser = async (ctx, next) => {
  // 1、获取用户名和密码
  const { name, password } = ctx.request.body;

  // 2、判断用户名跟密码不为空
  if( !name || !password) {
    const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error', error, ctx);
  }

  // 3、判断这次注册的用户名是没有被注册过
  const result = await UserService.getUserByName(name);
  console.log(result);
  if(result.length) {
    const error = new Error(errorTypes.USER_ALREADY_EXISTS);
    return ctx.app.emit('error', error, ctx);
  }

  // 当用户名跟密码 没毛病时 就调用next执行下一个中间件
  await next();
}

// 把密码加密的中间件
const handlePassword = async (ctx, next) => {
  const { password } = ctx.request.body;
  
  // 调用自己封装的 md5password 函数进行密码加密
  ctx.request.body.password = md5password(password)

  // 当加密完成后执行下一个中间件
  await next();
}


module.exports = {
  verifyUser,
  handlePassword
}