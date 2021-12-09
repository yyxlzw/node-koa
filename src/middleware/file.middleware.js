const path = require('path');

const Multer = require('koa-multer');
const Jimp = require('jimp');
const { AVATAR_PATH, PICTURE_PATH } = require('../constants/file-path')

// const storage = Multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null,  AVATAR_PATH);
//   }, 
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// })

const avatarUpload = Multer({
  dest: AVATAR_PATH
});
const avatarHandler = avatarUpload.single('avatar');

const pictureUpload = Multer({
  dest: PICTURE_PATH
});
const pictureHandler = pictureUpload.array('picture', 9);

const pictureReszie = async (ctx, next) => {
  const files = ctx.req.files;

  for(let file of files) {
    const destPath = path.join(file.destination, file.filename);
    Jimp.read(file.path).then(image => {
      image.resize(1280, Jimp.AUTO).write(`${destPath}-large`);
      image.resize(640, Jimp.AUTO).write(`${destPath}-middle`);
      image.resize(320, Jimp.AUTO).write(`${destPath}-small`);
    })
  };
  await next()
}

module.exports = {
  avatarHandler,
  pictureHandler,
  pictureReszie
};