const FileService = require('../service/file.service');
const UserService = require('../service/user.service');
const {AVATAR_PATH} = require('../constants/file-path');
const { APP_HOST, APP_PORT } = require('../app/config');

class FileController {
  async saveAvatarInfo(ctx, next) {
    // 1、获取图片相关信息
    const { mimetype, filename, size } = ctx.req.file;
    const { id } = ctx.user;
    // 2、将数据保存到数据库中
    await FileService.createAvatar(mimetype, filename, size, id);
    // 3、将图片地址保存到users表中
    const avatarUrl = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`;
    await UserService.updateAvatarUrlById(avatarUrl, id);
    ctx.body = '上传头像成功';
  }

  async savePictureInfo(ctx, next) {
    // 获取信息
    const files = ctx.req.files;
    const { id } = ctx.user;
    const { momentId } = ctx.query;
    // 将所有文件信息
    for(let file of files) {
      // 获取每个文件信息
      const { mimetype, filename, size } = file;
      await FileService.createFile(filename, mimetype, size, id, momentId);      
    }
    ctx.body = '文件上传成功';
  }
};

module.exports = new FileController();