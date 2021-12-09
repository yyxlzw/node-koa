const crypto = require('crypto');

const md5password = (password) => {
  // 采用md5方式加密
  const md5 = crypto.createHash('md5');
  // 以16进制字符串
  const result = md5.update(password).digest('hex');
  return result;
}

module.exports = md5password;