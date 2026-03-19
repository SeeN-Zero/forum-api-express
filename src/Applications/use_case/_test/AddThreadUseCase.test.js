import { vi } from 'vitest';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import AddedThread from '../../../Domains/threads/entities/AddedThread.js';
import NewThread from '../../../Domains/threads/entities/NewThread.js';
import AddThreadUseCase from '../AddThreadUseCase.js';

describe('AddThreadUseCase', () => {
  it('should orchestrating add thread action correctly', async () => {
    const useCasePayload = {
      title: 'judul thread',
      body: 'isi thread',
    };
    const useCaseOwner = 'user-123';
    const mockedAddedThread = new AddedThread({
      id: 'thread-123',
      title: 'judul thread',
      owner: 'user-123',
    });
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = vi.fn()
      .mockImplementation(() => Promise.resolve(mockedAddedThread));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const addedThread = await addThreadUseCase.execute(useCasePayload, useCaseOwner);

    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-123',
      title: 'judul thread',
      owner: 'user-123',
    }));
    expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread({
      title: 'judul thread',
      body: 'isi thread',
    }), useCaseOwner);
  });
});
