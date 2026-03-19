import ThreadDetail from '../ThreadDetail.js';

describe('a ThreadDetail entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    const payload = {
      id: 'thread-123',
      title: 'judul',
      body: 'body',
      username: 'dicoding',
      comments: [],
    };

    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    const payload = {
      id: 'thread-123',
      title: 'judul',
      body: 'body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: {},
    };

    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create ThreadDetail object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'judul',
      body: 'body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [],
    };

    expect(new ThreadDetail(payload)).toEqual(payload);
  });
});
