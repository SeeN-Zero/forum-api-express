import CommentRepository from '../../Domains/comments/CommentRepository.js';
import AddedComment from '../../Domains/comments/entities/AddedComment.js';
import NotFoundError from '../../Commons/exceptions/NotFoundError.js';

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment, owner, threadId) {
    const { content } = newComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, threadId, content, owner, new Date().toISOString(), false],
    };

    const result = await this._pool.query(query);

    return new AddedComment(result.rows[0]);
  }

  async verifyCommentExists(commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }

  async verifyCommentExistsInThread(commentId, threadId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND thread_id = $2',
      values: [commentId, threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }

  async getCommentOwnerById(commentId) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }

    return result.rows[0].owner;
  }

  async softDeleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [commentId],
    };

    await this._pool.query(query);
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `
        SELECT
          comments.id,
          users.username,
          comments.date::text AS date,
          comments.content,
          comments.is_delete,
          COALESCE(COUNT(user_comment_likes.id), 0)::int AS like_count
        FROM comments
        JOIN users ON users.id = comments.owner
        LEFT JOIN user_comment_likes ON user_comment_likes.comment_id = comments.id
        WHERE comments.thread_id = $1
        GROUP BY comments.id, users.username, comments.date, comments.content, comments.is_delete
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((row) => ({
      id: row.id,
      username: row.username,
      date: new Date(row.date).toISOString(),
      content: row.content,
      isDelete: row.is_delete,
      likeCount: Number(row.like_count),
    }));
  }
}

export default CommentRepositoryPostgres;
