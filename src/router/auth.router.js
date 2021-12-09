// 登录接口
const Router = require('koa-router');

// 导入中间件
const { verifyLogin, verifAuth, localhostCors } = require('../middleware/auth.middleware.js');
// 执行登录的中间件
const { login, success } = require('../controller/auth.controller.js');

const authRouter = new Router();

authRouter.post('/login', verifyLogin,  login);
authRouter.get('/test', verifAuth, success)

module.exports = authRouter;