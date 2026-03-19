import NewThread from '../NewThread.js';

describe('a NewThread entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    const payload = {
      body: 'body thread',
    };

    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    const payload = {
      title: 'judul',
      body: ['body thread'],
    };

    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThread object correctly', () => {
    const payload = {
      title: 'judul thread',
      body: 'body thread',
    };

    expect(new NewThread(payload)).toEqual(payload);
  });
});
