import { vi } from 'vitest';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import AddedReply from '../../../Domains/replies/entities/AddedReply.js';
import NewReply from '../../../Domains/replies/entities/NewReply.js';
import AddReplyUseCase from '../AddReplyUseCase.js';

describe('AddReplyUseCase', () => {
  it('should orchestrating add reply action correctly', async () => {
    const useCasePayload = { content: 'isi balasan' };
    const useCaseOwner = 'user-123';
    const useCaseThreadId = 'thread-123';
    const useCaseCommentId = 'comment-123';
    const mockedAddedReply = new AddedReply({
      id: 'reply-123',
      content: 'isi balasan',
      owner: 'user-123',
    });
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExistsInThread = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = vi.fn()
      .mockImplementation(() => Promise.resolve(mockedAddedReply));

    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const addedReply = await addReplyUseCase.execute(
      useCasePayload,
      useCaseOwner,
      useCaseThreadId,
      useCaseCommentId,
    );

    expect(addedReply).toStrictEqual(new AddedReply({
      id: 'reply-123',
      content: 'isi balasan',
      owner: 'user-123',
    }));
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(useCaseThreadId);
    expect(mockCommentRepository.verifyCommentExistsInThread).toBeCalledWith(
      useCaseCommentId,
      useCaseThreadId,
    );
    expect(mockReplyRepository.addReply).toBeCalledWith(
      new NewReply({ content: 'isi balasan' }),
      useCaseOwner,
      useCaseCommentId,
    );
  });
});
