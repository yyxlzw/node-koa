const connection = require('../app/database');

class FileService {
  async createAvatar(mimetype, filename, size, id) {
    const statement = 
    `INSERT INTO avatar (filename, mimetype, size, user_id) 
      VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE filename = ?, mimetype = ? ,size = ?;`;
    const [result] = await connection.execute(statement, [filename, mimetype, size, id, filename, mimetype, size]);
    return result;
  };

  async getAvatarByUserId(userId) {
    const statement = `SELECT * FROM avatar WHERE user_id = ?;`;
    const [result] = await connection.execute(statement, [userId]);
    return result[0];
  };

  async createFile(filename, mimetype, size, id, momentId) {
    const statement = 
    `INSERT INTO file (filename, mimetype, size, user_id, moment_id) 
      VALUES (?, ?, ?, ?, ?)`;
    const [result] = await connection.execute(statement, [filename, mimetype, size, id, momentId]);
    return result;
  };

  async getFileByFilename(filename) {
    const statement = `SELECT * FROM file WHERE filename = ?`;
    const [result] = await connection.execute(statement, [filename]);
    return result[0]
  }
}

module.exports = new FileService();