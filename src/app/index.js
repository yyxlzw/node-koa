const Koa = require('koa');
// 导入这个来解析 json 数据
const bodyParser = require('koa-bodyparser');

// 导入路由封装的函数 他会自动遍历 router 文件下的路由 并自动添加 也就是动态加载路由
const useRoutes = require('../router');

const errorHandle = require('./error-handle');

// 跨域第三方库
const cors = require('koa-cors');

const app = new Koa();
app.use(cors())
// 调用这个解析 json 数据
app.use(bodyParser())

// 路由
useRoutes(app);

app.on('error', errorHandle);

module.exports = app;