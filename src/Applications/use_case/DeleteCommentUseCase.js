import AuthorizationError from '../../Commons/exceptions/AuthorizationError.js';

class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, owner } = useCasePayload;

    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.verifyCommentExists(commentId);
    const commentOwner = await this._commentRepository.getCommentOwnerById(commentId);

    if (commentOwner !== owner) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini');
    }

    await this._commentRepository.softDeleteComment(commentId);
  }
}

export default DeleteCommentUseCase;
