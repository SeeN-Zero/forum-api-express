class ToggleCommentLikeUseCase {
  constructor({ threadRepository, commentRepository, userCommentLikeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._userCommentLikeRepository = userCommentLikeRepository;
  }

  async execute({ userId, threadId, commentId }) {
    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.verifyCommentExistsInThread(commentId, threadId);

    const isLiked = await this._userCommentLikeRepository.verifyLike(userId, commentId);

    if (isLiked) {
      await this._userCommentLikeRepository.deleteLike(userId, commentId);
      return;
    }

    await this._userCommentLikeRepository.addLike(userId, commentId);
  }
}

export default ToggleCommentLikeUseCase;
