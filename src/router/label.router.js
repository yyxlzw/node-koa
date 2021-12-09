const Router = require('koa-router');

const { verifAuth } = require('../middleware/auth.middleware')

const { create, list } = require('../controller/label.controller')

const lableRouter = new Router({prefix: '/label'});

// 创建标签
lableRouter.post('/', verifAuth, create);
// 获取标签
lableRouter.get('/', list)

module.exports = lableRouter;