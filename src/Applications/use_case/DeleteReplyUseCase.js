class DeleteReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const {
      threadId, commentId, replyId, owner,
    } = useCasePayload;

    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.verifyCommentExistsInThread(commentId, threadId);
    await this._replyRepository.verifyReplyExists(replyId);
    const replyOwner = await this._replyRepository.getReplyOwnerById(replyId);

    if (replyOwner !== owner) {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_AUTHORIZED');
    }

    await this._replyRepository.softDeleteReply(replyId);
  }
}

export default DeleteReplyUseCase;
