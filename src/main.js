const app = require('./app/index');
require('./app/database');

const config = require('./app/config');

// 已经把端口号 抽到 根目录下 .env文件了  而且要安装第三方库 npm install dotenv
app.listen(config.APP_PORT, () => {
  console.log(`服务器${config.APP_PORT}端口启动成功`);
});