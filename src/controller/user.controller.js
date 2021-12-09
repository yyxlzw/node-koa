const fs = require('fs');

const UserService = require('../service/user.service');
const FileService = require('../service/file.service');

const { AVATAR_PATH } = require('../constants/file-path');

class UserController {
  // 注册
  async create(ctx, next) {
    // 获取用户请求的参数
    const user = ctx.request.body;

    // 创建用户
    const result = await UserService.create(user);
    ctx.body = result;
  };

  async avatarInfo(ctx, next) {
    // 如何 判断用户的头像是哪一个文件呢
    // 1、获取用户id
    const { userId } = ctx.params; 
    const result = await FileService.getAvatarByUserId(userId);
    ctx.response.set('content-type', result.mimetype)
    ctx.body = fs.createReadStream(`${AVATAR_PATH}/${result.filename}`)
    // 
  }
}

module.exports = new UserController();