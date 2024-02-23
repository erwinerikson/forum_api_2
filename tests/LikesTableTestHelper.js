/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
  async addLike({
    id = 'like-123', comment = 'comment-123', owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3)',
      values: [id, comment, owner],
    };
              
    await pool.query(query);
  },

  async verifyAvailableLike(payload) {
    const { comment, owner } = payload;
    const query = {
      text: 'SELECT * FROM likes WHERE comment = $1 AND owner = $2',
      values: [comment, owner],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async findLikeById(id) {
    const query = {
      text: 'SELECT * FROM likes WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes WHERE 1=1');
  },
};

module.exports = LikesTableTestHelper;
