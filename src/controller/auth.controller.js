const jwt = require('jsonwebtoken');
const { PRIVATE_KEY } = require('../app/config');


class AuthController {
  async login(ctx, next) {
    const { id, name, avatarUrl } = ctx.user;

    const token = jwt.sign({id, name}, PRIVATE_KEY, {
      expiresIn: 20,
      algorithm: 'RS256'
    }) 
    ctx.body = { id, name, token, avatarUrl }
  };

  async success(ctx, next) {
    ctx.body = '登录成功'
  }
}

module.exports = new AuthController();