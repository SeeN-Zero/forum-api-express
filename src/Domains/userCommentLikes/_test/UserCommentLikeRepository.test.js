import UserCommentLikeRepository from '../UserCommentLikeRepository.js';

describe('UserCommentLikeRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const userCommentLikeRepository = new UserCommentLikeRepository();

    await expect(userCommentLikeRepository.verifyLike('', ''))
      .rejects
      .toThrowError('USER_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(userCommentLikeRepository.addLike('', ''))
      .rejects
      .toThrowError('USER_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(userCommentLikeRepository.deleteLike('', ''))
      .rejects
      .toThrowError('USER_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
