const fs = require('fs');
const momentService = require('../service/moment.service');
const fileService = require('../service/file.service')
const {PICTURE_PATH} = require('../constants/file-path')

class MomentController {
  // 储存用户发表的动态
  async create (ctx, next) {
    // 1、获取数据（user_id， content）
    const userId = ctx.user.id;
    const content = ctx.request.body.content;
    
    // 2、往数据库插入数据
    const result = await momentService.create(userId, content);
    ctx.body = result
  };

  // 获取某个momentId发表的动态
  async detail(ctx, next) {
    // 1、获取 momentId
    const momentId = ctx.params.momentId;

    // 2、根据id去数据库查询
    const result = await momentService.getMomentById(momentId);
    ctx.body = result
  };

  // 获取多条动态
  async list(ctx, next) {
    // 获取 offset size
    const { offset, size } = ctx.query;

    // 查询列表
    const result = await momentService.getMomentList(offset, size);

    ctx.body = result;
  };

  // 修改动态
  async update(ctx, next) {
    const { momentId } = ctx.params;
    const { content } = ctx.request.body
    const result = await momentService.update(content, momentId)
    ctx.body = result;
  };

  // 删除动态
  async remove(ctx, next) {
    const { momentId } = ctx.params;

    const result = await momentService.remove(momentId);
    ctx.body = result;
  };

  // 给动态添加标签
  async addLabels(ctx, next) {
    const { momentId } = ctx.params;
    const { labels } =  ctx;
    for(let label of labels) {
      const hasLabel = await momentService.hasLabel(momentId, label.id);
      if(!hasLabel) {
        await momentService.addLabels(momentId, label.id);
      }
    }
    ctx.body = "给动态添加标签";
  };

  // 给动态配图
  async fileInfo(ctx, next) {
    let { filename } = ctx.params;
    const fileInfo = await fileService.getFileByFilename(filename);
    const { type } = ctx.query;
    const types = ["small", "middle", "large"];
    if(types.some(item => item === type)) {
      filename = filename + '-' + type;
    }
    ctx.response.set('content-type', fileInfo.mimetype);
    ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`);
  }
}

module.exports = new MomentController();