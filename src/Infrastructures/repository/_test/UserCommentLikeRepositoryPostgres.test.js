import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import UserCommentLikesTableTestHelper from '../../../../tests/UserCommentLikesTableTestHelper.js';
import pool from '../../database/postgres/pool.js';
import UserCommentLikeRepositoryPostgres from '../UserCommentLikeRepositoryPostgres.js';

describe('UserCommentLikeRepositoryPostgres', () => {
  afterEach(async () => {
    await UserCommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyLike function', () => {
    it('should return false when like not exists', async () => {
      const userCommentLikeRepositoryPostgres = new UserCommentLikeRepositoryPostgres(pool, {});

      const isLiked = await userCommentLikeRepositoryPostgres.verifyLike('user-123', 'comment-123');

      expect(isLiked).toEqual(false);
    });

    it('should return true when like exists', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      await UserCommentLikesTableTestHelper.addLike({
        id: 'like-123',
        userId: 'user-123',
        commentId: 'comment-123',
      });
      const userCommentLikeRepositoryPostgres = new UserCommentLikeRepositoryPostgres(pool, {});

      const isLiked = await userCommentLikeRepositoryPostgres.verifyLike('user-123', 'comment-123');

      expect(isLiked).toEqual(true);
    });
  });

  describe('addLike function', () => {
    it('should persist like', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      const userCommentLikeRepositoryPostgres = new UserCommentLikeRepositoryPostgres(pool, () => '123');

      await userCommentLikeRepositoryPostgres.addLike('user-123', 'comment-123');

      const likes = await UserCommentLikesTableTestHelper.findLikeByUserIdAndCommentId('user-123', 'comment-123');
      expect(likes).toHaveLength(1);
      expect(likes[0].id).toEqual('like-123');
    });
  });

  describe('deleteLike function', () => {
    it('should delete persisted like', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      await UserCommentLikesTableTestHelper.addLike({
        id: 'like-123',
        userId: 'user-123',
        commentId: 'comment-123',
      });
      const userCommentLikeRepositoryPostgres = new UserCommentLikeRepositoryPostgres(pool, {});

      await userCommentLikeRepositoryPostgres.deleteLike('user-123', 'comment-123');

      const likes = await UserCommentLikesTableTestHelper.findLikeByUserIdAndCommentId('user-123', 'comment-123');
      expect(likes).toHaveLength(0);
    });
  });
});
