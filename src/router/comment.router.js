const Router = require('koa-router');
const { verifAuth, verifyPermission } = require('../middleware/auth.middleware');
const { create, reply, update, remove, list } = require('../controller/comment.controller');

const commentRouter = new Router({prefix: '/comment'});

// 发表动态评论
commentRouter.post('/', verifAuth, create);
// 回复评论
commentRouter.post('/:commentId/reply', verifAuth, reply);
// 修改评论
commentRouter.patch('/:commentId', verifAuth, verifyPermission, update);
// 删除评论
commentRouter.delete('/:commentId', verifAuth, verifyPermission, remove);
// 获取评论
commentRouter.get('/', list);
module.exports = commentRouter;