import ThreadDetail from '../../Domains/threads/entities/ThreadDetail.js';

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyThreadExists(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const replies = await this._replyRepository.getRepliesByThreadId(threadId);

    const mappedComments = comments.map((comment) => {
      const commentReplies = replies
        .filter((reply) => reply.commentId === comment.id)
        .map((reply) => ({
          id: reply.id,
          content: reply.isDelete ? '**balasan telah dihapus**' : reply.content,
          date: reply.date,
          username: reply.username,
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      return ({
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.isDelete ? '**komentar telah dihapus**' : comment.content,
        likeCount: comment.likeCount,
        replies: commentReplies,
      });
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    return new ThreadDetail({
      ...thread,
      comments: mappedComments,
    });
  }
}

export default GetThreadDetailUseCase;
