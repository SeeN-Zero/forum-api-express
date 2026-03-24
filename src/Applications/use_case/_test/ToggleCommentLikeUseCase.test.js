import { vi } from 'vitest';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import UserCommentLikeRepository from '../../../Domains/userCommentLikes/UserCommentLikeRepository.js';
import ToggleCommentLikeUseCase from '../ToggleCommentLikeUseCase.js';

describe('ToggleCommentLikeUseCase', () => {
  it('should orchestrating toggle comment like action correctly when comment not liked', async () => {
    const useCasePayload = {
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockUserCommentLikeRepository = new UserCommentLikeRepository();

    mockThreadRepository.verifyThreadExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExistsInThread = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockUserCommentLikeRepository.verifyLike = vi.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockUserCommentLikeRepository.addLike = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockUserCommentLikeRepository.deleteLike = vi.fn()
      .mockImplementation(() => Promise.resolve());

    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      userCommentLikeRepository: mockUserCommentLikeRepository,
    });

    await toggleCommentLikeUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentExistsInThread).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId,
    );
    expect(mockUserCommentLikeRepository.verifyLike).toBeCalledWith(
      useCasePayload.userId,
      useCasePayload.commentId,
    );
    expect(mockUserCommentLikeRepository.addLike).toBeCalledWith(
      useCasePayload.userId,
      useCasePayload.commentId,
    );
    expect(mockUserCommentLikeRepository.deleteLike).not.toBeCalled();
  });

  it('should orchestrating toggle comment like action correctly when comment already liked', async () => {
    const useCasePayload = {
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockUserCommentLikeRepository = new UserCommentLikeRepository();

    mockThreadRepository.verifyThreadExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExistsInThread = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockUserCommentLikeRepository.verifyLike = vi.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockUserCommentLikeRepository.addLike = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockUserCommentLikeRepository.deleteLike = vi.fn()
      .mockImplementation(() => Promise.resolve());

    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      userCommentLikeRepository: mockUserCommentLikeRepository,
    });

    await toggleCommentLikeUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentExistsInThread).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId,
    );
    expect(mockUserCommentLikeRepository.verifyLike).toBeCalledWith(
      useCasePayload.userId,
      useCasePayload.commentId,
    );
    expect(mockUserCommentLikeRepository.deleteLike).toBeCalledWith(
      useCasePayload.userId,
      useCasePayload.commentId,
    );
    expect(mockUserCommentLikeRepository.addLike).not.toBeCalled();
  });
});
