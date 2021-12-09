const Router = require('koa-router');

const { create, detail, list, update, remove, addLabels, fileInfo} = require('../controller/moment.controller.js');
const { verifAuth, verifyPermission } = require('../middleware/auth.middleware');
const { verifyLabelExists } = require('../middleware/label.middleware')

const momentRouter = new Router({prefix: '/moment'});

// 发表动态
momentRouter.post('/', verifAuth, create);
// 获取某一条动态
momentRouter.get('/:momentId', detail);
// 查多条动态
momentRouter.get('/', list);
// 修改内容
momentRouter.patch('/:momentId', verifAuth, verifyPermission, update);
// 删除动态
momentRouter.delete('/:momentId', verifAuth, verifyPermission, verifyLabelExists, remove);
// 给动态添加标签
momentRouter.post('/:momentId/labels', verifAuth, verifyPermission, verifyLabelExists, addLabels)
// 动态配图服务
momentRouter.get('/images/:filename', fileInfo);

module.exports = momentRouter;