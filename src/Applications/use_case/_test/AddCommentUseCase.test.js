import { vi } from 'vitest';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import NewComment from '../../../Domains/comments/entities/NewComment.js';
import AddedComment from '../../../Domains/comments/entities/AddedComment.js';
import AddCommentUseCase from '../AddCommentUseCase.js';

describe('AddCommentUseCase', () => {
  it('should orchestrating add comment action correctly', async () => {
    const useCasePayload = {
      content: 'isi komentar',
    };
    const useCaseOwner = 'user-123';
    const useCaseThreadId = 'thread-123';
    const mockedAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'isi komentar',
      owner: 'user-123',
    });
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = vi.fn()
      .mockImplementation(() => Promise.resolve(mockedAddedComment));

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const addedComment = await addCommentUseCase.execute(useCasePayload, useCaseOwner, useCaseThreadId);

    expect(addedComment).toStrictEqual(new AddedComment({
      id: 'comment-123',
      content: 'isi komentar',
      owner: 'user-123',
    }));
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(useCaseThreadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment({
      content: 'isi komentar',
    }), useCaseOwner, useCaseThreadId);
  });
});
