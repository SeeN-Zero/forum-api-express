import UserCommentLikeRepository from '../../Domains/userCommentLikes/UserCommentLikeRepository.js';

class UserCommentLikeRepositoryPostgres extends UserCommentLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyLike(userId, commentId) {
    const query = {
      text: 'SELECT id FROM user_comment_likes WHERE user_id = $1 AND comment_id = $2',
      values: [userId, commentId],
    };

    const result = await this._pool.query(query);
    return Boolean(result.rowCount);
  }

  async addLike(userId, commentId) {
    const id = `like-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO user_comment_likes VALUES($1, $2, $3, $4)',
      values: [id, userId, commentId, new Date().toISOString()],
    };

    await this._pool.query(query);
  }

  async deleteLike(userId, commentId) {
    const query = {
      text: 'DELETE FROM user_comment_likes WHERE user_id = $1 AND comment_id = $2',
      values: [userId, commentId],
    };

    await this._pool.query(query);
  }
}

export default UserCommentLikeRepositoryPostgres;
