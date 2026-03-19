import { vi } from 'vitest';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import DeleteReplyUseCase from '../DeleteReplyUseCase.js';

describe('DeleteReplyUseCase', () => {
  it('should orchestrating delete reply action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123',
    };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExistsInThread = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.getReplyOwnerById = vi.fn()
      .mockImplementation(() => Promise.resolve('user-123'));
    mockReplyRepository.softDeleteReply = vi.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    await deleteReplyUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentExistsInThread).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId,
    );
    expect(mockReplyRepository.verifyReplyExists).toBeCalledWith(useCasePayload.replyId);
    expect(mockReplyRepository.getReplyOwnerById).toBeCalledWith(useCasePayload.replyId);
    expect(mockReplyRepository.softDeleteReply).toBeCalledWith(useCasePayload.replyId);
  });
});
