import NewComment from '../NewComment.js';

describe('a NewComment entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    const payload = {};

    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    const payload = {
      content: ['isi komentar'],
    };

    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewComment object correctly', () => {
    const payload = {
      content: 'isi komentar',
    };

    expect(new NewComment(payload)).toEqual(payload);
  });
});
