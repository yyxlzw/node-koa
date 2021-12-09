const connection = require('../app/database');

class UserService {
  // 创建用户
  async create(user) {
    const { name, password } = user;
    const statement = `INSERT INTO users (name, password) VALUES (?, ?);`;

    const result = await connection.execute(statement, [name, password])
    // 将user存储到数据库中
    return result[0];
  };

  // 查询数据库中的 name 是否已存在
  async getUserByName(name) {
    const statement = `SELECT * FROM users WHERE name = ?;`
    const result = await connection.execute(statement, [name]);
    return result[0];
  };

  async updateAvatarUrlById(avatarUrl, id) {
    const statement = `UPDATE users SET avatarUrl = ? WHERE id = ?;`
    const [result] = await connection.execute(statement, [avatarUrl, id]);
    return result;
  };
};

module.exports = new UserService();