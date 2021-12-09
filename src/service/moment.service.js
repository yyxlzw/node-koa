const connection = require('../app/database');

// 抽取出来 sql代码
const sqlFragment = `
SELECT
  m.id id, m.content content, m.createAt createTime, m.updateAT updateTime,
  JSON_OBJECT('id', users.id, 'name', users.name) author
FROM moment m
LEFT JOIN users ON m.user_id = users.id`

class MomentService {
  async create(userId, content) {
    const statement = `INSERT INTO moment (content, user_id) VALUES (?, ?);`
    
    const result = await connection.execute(statement, [content, userId]);
    return result;
  };

  async getMomentById(momentId) {
    const statement = `
      SELECT
        m.id id, m.content content, m.createAt createTime, m.updateAT updateTime,
        JSON_OBJECT('id', users.id, 'name', users.name, 'avatarUrl', users.avatarUrl) author,
        IF(COUNT(l.id),JSON_ARRAYAGG(JSON_OBJECT('id', l.id, 'name', l.name)),NULL) labels,
        (SELECT IF(COUNT(c.id),JSON_ARRAYAGG(JSON_OBJECT('id', c.id, 'content', c.content, 'commnetId', c.comment_id, 'createTime', c.createAt,
          'user', JSON_OBJECT('id', cu.id, 'name', cu.name, 'avatarUrl', cu.avatarUrl))),
        NULL) FROM comment c LEFT JOIN users cu ON c.user_id = cu.id WHERE m.id = c.moment_id) comments,
        (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8000/moment/images/', file.filename)) 
          FROM file WHERE m.id = file.moment_id) images
      FROM moment m
      LEFT JOIN users ON m.user_id = users.id
      LEFT JOIN moment_label ml ON ml.moment_id = m.id
      LEFT JOIN label l ON l.id = ml.label_id
      WHERE m.id = ?
      GROUP BY m.id;`;
    const [result] = await connection.execute(statement, [momentId])
    return result[0];
  };

  async getMomentList(offset, size) {
    const statement = `
      SELECT
        m.id id, m.content content, m.createAt createTime, m.updateAT updateTime,
        JSON_OBJECT('id', users.id, 'name', users.name) author,
        (SELECT COUNT(*) FROM comment c WHERE c.moment_id = m.id)	commentCount,
        (SELECT COUNT(*) FROM moment_label ml WHERE ml.moment_id = m.id)	labelCount,
        (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8000/moment/images/', file.filename)) 
          FROM file WHERE m.id = file.moment_id) images
      FROM moment m
      LEFT JOIN users ON m.user_id = users.id
      LIMIT ?, ?;`;
    const [result] = await connection.execute(statement, [offset, size]);
    return result;
  };

  async update(content, momentId) {
    const statement = `UPDATE moment SET content = ? WHERE id = ?;`;
    const [result] = await connection.execute(statement, [content, momentId]);
    return result;
  };

  async remove(momentId) {
    const statement = `DELETE FROM moment WHERE id = ?;`;
    const [result] = await connection.execute(statement, [momentId]);
    return result;
  }

  async addLabels(momentId, labelId) {
    const statement = `INSERT INTO moment_label (moment_id, label_id) VALUES (?, ?);`;
    const [result] = await connection.execute(statement, [momentId, labelId]);
    return result;
  }

  async hasLabel(momentId, labelId) {
    const statement = `SELECT * FROM moment_label WHERE moment_id = ? AND label_id = ?;`;
    const [result] = await connection.execute(statement, [momentId, labelId]);
    return result[0] ? true : false;
  };


}

module.exports = new MomentService();