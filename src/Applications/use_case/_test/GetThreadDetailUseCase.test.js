import { vi } from 'vitest';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import ThreadDetail from '../../../Domains/threads/entities/ThreadDetail.js';
import GetThreadDetailUseCase from '../GetThreadDetailUseCase.js';

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating get thread detail action correctly', async () => {
    const useCasePayload = 'thread-123';
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = vi.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        title: 'judul thread',
        body: 'isi thread',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
      }));
    mockCommentRepository.getCommentsByThreadId = vi.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '2021-08-08T07:22:33.555Z',
          content: 'isi komentar 1',
          isDelete: false,
        },
        {
          id: 'comment-124',
          username: 'johndoe',
          date: '2021-08-08T07:21:33.555Z',
          content: 'isi komentar 2',
          isDelete: true,
        },
      ]));
    mockReplyRepository.getRepliesByThreadId = vi.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'reply-123',
          commentId: 'comment-123',
          username: 'johndoe',
          date: '2021-08-08T07:23:33.555Z',
          content: 'isi balasan 1',
          isDelete: false,
        },
        {
          id: 'reply-124',
          commentId: 'comment-123',
          username: 'dicoding',
          date: '2021-08-08T07:24:33.555Z',
          content: 'isi balasan 2',
          isDelete: true,
        },
      ]));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const threadDetail = await getThreadDetailUseCase.execute(useCasePayload);

    expect(threadDetail).toStrictEqual(new ThreadDetail({
      id: 'thread-123',
      title: 'judul thread',
      body: 'isi thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-124',
          username: 'johndoe',
          date: '2021-08-08T07:21:33.555Z',
          content: '**komentar telah dihapus**',
          replies: [],
        },
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '2021-08-08T07:22:33.555Z',
          content: 'isi komentar 1',
          replies: [
            {
              id: 'reply-123',
              content: 'isi balasan 1',
              date: '2021-08-08T07:23:33.555Z',
              username: 'johndoe',
            },
            {
              id: 'reply-124',
              content: '**balasan telah dihapus**',
              date: '2021-08-08T07:24:33.555Z',
              username: 'dicoding',
            },
          ],
        },
      ],
    }));
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(useCasePayload);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(useCasePayload);
  });
});
