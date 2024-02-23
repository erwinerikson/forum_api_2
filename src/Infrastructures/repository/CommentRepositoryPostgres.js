const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class CommentRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(comment) {
    const { thread, content, owner } = comment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    const is_delete = 0;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, thread, content, owner, date, updatedAt, is_delete],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async verifyCommentAvailability(id) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [id],
    };
    
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async verifyCommentByOwnerAvailability(comments) {
    const { comment: id, thread, owner } = comments;
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND thread = $2 AND owner = $3',
      values: [id, thread, owner],
    };
  
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Missing Authentication to Access');
    }
  }

  async getComment(comments) {
    const { id } = comments;
    const query = {
      text: `SELECT comments.id, users.username, comments.date, comments.content, comments.is_delete FROM comments
        LEFT JOIN users ON users.id = comments.owner
        WHERE comments.thread = $1 ORDER BY date ASC`,
      values: [id],
    };
  
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteComment(comments) {
    const { comment: id } = comments;
    const updatedAt = new Date().toISOString();
    const is_delete = 1;
    const query = {
      text: 'UPDATE comments SET updated_at = $1, is_delete = $2 WHERE id = $3 RETURNING is_delete',
      values: [updatedAt, is_delete, id],
    };
        
    const result = await this._pool.query(query);
    return result.rows[0].is_delete;
  }
}

module.exports = CommentRepositoryPostgres;
