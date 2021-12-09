const connection = require('../app/database');

class CommentService {
  async create(momentId, content, id) {
    const statement = `INSERT INTO comment (content, user_id, moment_id) VALUES (?, ?, ?);`;
    const [result] = await connection.execute(statement, [content, id, momentId]);
    return result;
  };

  async reply(momentId, content, id, commentId) {
    const statement = `INSERT INTO comment (content, user_id, moment_id, comment_Id) VALUES (?, ?, ?, ?);`;
    const [result] = await connection.execute(statement, [content, id, momentId, commentId]);
    return result;
  };

  async update(content, commentId) {
    const statement = `UPDATE comment SET content = ? WHERE id = ?;`
    const [result] = await connection.execute(statement,[content, commentId]);
    return result;
  };

  async remove(commentId) {
    const statement = `DELETE FROM comment WHERE id = ?;`
    const result = await connection.execute(statement, [commentId]);
    return result;
  };

  async list(momentId) {
    const statement = 
    `SELECT 
      m.id, m.content, m.comment_id commentId, m.createAt createTime,
      JSON_OBJECT('id', u.id, 'name', u.name) user
    FROM comment m
    LEFT JOIN users u ON u.id = m.user_id
    WHERE m.moment_id = ?;`
    const [result] = await connection.execute(statement, [momentId]);
    return result;
  }
};

module.exports = new CommentService();