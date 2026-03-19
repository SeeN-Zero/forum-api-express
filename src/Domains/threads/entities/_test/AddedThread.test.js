import AddedThread from '../AddedThread.js';

describe('an AddedThread entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    const payload = {
      id: 'thread-123',
      title: 'judul',
    };

    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    const payload = {
      id: 'thread-123',
      title: 'judul',
      owner: 123,
    };

    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedThread object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'judul',
      owner: 'user-123',
    };

    expect(new AddedThread(payload)).toEqual(payload);
  });
});
