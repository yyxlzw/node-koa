const labelService = require("../service/label.service");

const verifyLabelExists = async (ctx, next) => {
  const { labels } = ctx.request.body;

  // 判断 每一个标签是否存在
  const newLabels = [];
  for(let name of labels) {
    const labelResult = await labelService.getLabelByName(name);
    const label = { name };
    if(!labelResult) {
      const result = await labelService.create(name);
      label.id = result.insertId;
    } else {
      label.id = labelResult.id;
    }
    newLabels.push(label);
  }
  ctx.labels = newLabels;
  await next()
}

module.exports = {verifyLabelExists}