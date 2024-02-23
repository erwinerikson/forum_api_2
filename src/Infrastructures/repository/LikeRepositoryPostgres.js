const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(payload) {
    const { comment, owner } = payload;
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3)',
      values: [id, comment, owner],
    };

    const { rowCount } = await this._pool.query(query);

    return rowCount;
  }

  async verifyAvailableLike(payload) {
    const { comment, owner } = payload;

    const query = {
      text: 'SELECT id FROM likes WHERE comment = $1 AND owner = $2',
      values: [comment, owner],
    };

    const { rowCount } = await this._pool.query(query);

    return rowCount;
  }

  async getLikeCount(id) {
    const query = {
      text: 'SELECT id FROM likes WHERE comment = $1',
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);
    return rowCount;
  }

  async deleteLike(payload) {
    const { comment, owner } = payload;

    const query = {
      text: 'DELETE FROM likes WHERE comment = $1 AND owner = $2',
      values: [comment, owner],
    };

    const { rowCount } = await this._pool.query(query);

    return rowCount;
  }
}

module.exports = LikeRepositoryPostgres;
