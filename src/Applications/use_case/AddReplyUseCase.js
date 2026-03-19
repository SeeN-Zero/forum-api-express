import NewReply from '../../Domains/replies/entities/NewReply.js';

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload, owner, threadId, commentId) {
    const newReply = new NewReply(useCasePayload);

    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.verifyCommentExistsInThread(commentId, threadId);

    return this._replyRepository.addReply(newReply, owner, commentId);
  }
}

export default AddReplyUseCase;
