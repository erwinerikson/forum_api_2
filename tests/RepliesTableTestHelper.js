/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123', comment = 'comment-123', thread = 'thread-123', content = 'sebuah reply', owner = 'user-123', date = '2021-08-08T07:19:09.775Z', is_delete = '0',
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
      values: [id, thread, comment, content, owner, date, date, is_delete],
    };
          
    await pool.query(query);
  },

  async checkIsDelete(reply) {
    const { reply: id } = reply;
    const query = {
      text: 'SELECT is_delete FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
