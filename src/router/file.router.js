const Router =  require('koa-router');
const { avatarHandler, pictureHandler, pictureReszie } = require('../middleware/file.middleware')
const { saveAvatarInfo, savePictureInfo } = require('../controller/file.controller')
const fileRouter = new Router({prefix: '/upload'});

const { verifAuth } = require('../middleware/auth.middleware')

// 第一个中间件是验证是否登录
// 第二个中间件是把用户上传的图片保存起来
// 第三个中间件是获取图片相关信息
fileRouter.post('/avatar', verifAuth, avatarHandler, saveAvatarInfo)
fileRouter.post('/picture', verifAuth, pictureHandler, pictureReszie, savePictureInfo)
module.exports = fileRouter; 