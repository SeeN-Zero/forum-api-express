/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js';

const UserCommentLikesTableTestHelper = {
  async addLike({
    id = 'like-123',
    userId = 'user-123',
    commentId = 'comment-123',
    createdAt = '2021-08-08T07:30:33.555Z',
  }) {
    const query = {
      text: 'INSERT INTO user_comment_likes VALUES($1, $2, $3, $4)',
      values: [id, userId, commentId, createdAt],
    };

    await pool.query(query);
  },

  async findLikeByUserIdAndCommentId(userId, commentId) {
    const query = {
      text: 'SELECT * FROM user_comment_likes WHERE user_id = $1 AND comment_id = $2',
      values: [userId, commentId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM user_comment_likes');
  },
};

export default UserCommentLikesTableTestHelper;
