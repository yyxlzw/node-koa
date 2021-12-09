const errorTypes = require('../constants/error-types')

const errorHandle = (error, ctx) => {
  let status, message;
  console.log(error.message);
  switch (error.message) {
    case errorTypes.NAME_OR_PASSWORD_IS_REQUIRED:
      status = 400;
      message = '用户名或密码不能为空';
      break;
    case errorTypes.USER_ALREADY_EXISTS:
      status =  409;
      message = "用户已存在";
      break;
    case errorTypes.USER_DOES_NOT_EXISTS:
      status = 400;
      message = "用户名不存在";
      break;
    case errorTypes.PASSWORD_IS_INCORRENT:
      status = 400;
      message = '密码错误';
      break;
    case errorTypes.UNAUTHORIZATION:
      status = 401;
      message = '无效token';
      break;
    case errorTypes.UNPERMISSION:
      status = 401;
      message = '您没有操作权限';
      break;
    default:
      status = 404;
      message = "NOT FOUND"
  }

  ctx.status = status;
  ctx.body = {status, message};
}

module.exports = errorHandle;