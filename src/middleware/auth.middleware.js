const jwt = require('jsonwebtoken');

const errorTypes = require('../constants/error-types');
const UserService = require('../service/user.service');
const AuthService = require('../service/auth.service');
const md5password = require('../utils/password-handle');
const { PUBLIC_KEY } = require('../app/config');

const verifyLogin = async (ctx, next) => {
  // 1、获取用户名和密码
  const { name, password } = ctx.request.body;

  // 2、判断用户名和密码是否为空
  if( !name || !password) {
    const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error', error, ctx);
  }

  // 3、判断用户是否存在(用户不存在)
  const result = await UserService.getUserByName(name);
  const user = result[0];
  console.log(user);
  if(!user) {
    const error = new Error(errorTypes.USER_DOES_NOT_EXISTS);
    return ctx.app.emit('error', error, ctx);
  }

  // 4、判断密码是否和数据库中的密码一致（加密）
  if(md5password(password) !== user.password) {
    const error = new Error(errorTypes.PASSWORD_IS_INCORRENT);
    return ctx.app.emit('error', error, ctx);
  }

  ctx.user = user;
  await next();
};

const verifAuth = async (ctx, next) => {
  console.log('验证登录的middleware');
  
  // 1、获取token
  const authorization = ctx.headers.token;
  if(!authorization) {
    const error = new Error(errorTypes.UNAUTHORIZATION);
    return ctx.app.emit('error', error, ctx);
  }
  const token = authorization/* .replace('Bearer ', ''); */
  console.log(token);
  try {
    // 2、验证token
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ['RS256']
    })
    ctx.user = result;
    await next()
  } catch (err) {
    const error = new Error(errorTypes.UNAUTHORIZATION);
    ctx.app.emit('error', error, ctx);
  }
};

/* 
1、很多内容都需要验证权限： 修改/删除动态  修改/删除评论
2、接口：业务接口系统/后端管理系统
   一对一：user -> role
   多对多：role -> menu(删除动态/修改动态)
*/
// 验证是否有权限
const verifyPermission = async (ctx, next) => {
  console.log('验证权限的middleware');
  
  // 1、获取参数 { commentId: '1'}
  const [resourceKey] = Object.keys(ctx.params);
  const tableName = resourceKey.replace('Id', '');
  const resourceId = ctx.params[resourceKey];
  const userId = ctx.user.id;
  
  // 查询 是否具备权限
  const isPermission = await AuthService.checkResource(tableName, resourceId, userId);
  if(!isPermission) {
    const error = new Error(errorTypes.UNPERMISSION);
    return ctx.app.emit('error', error, ctx);
  };
  await next();
};


module.exports = { verifyLogin, verifAuth, verifyPermission};