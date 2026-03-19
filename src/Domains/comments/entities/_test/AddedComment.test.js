import AddedComment from '../AddedComment.js';

describe('an AddedComment entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    const payload = {
      id: 'comment-123',
      content: 'isi komentar',
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    const payload = {
      id: 'comment-123',
      content: 'isi komentar',
      owner: 123,
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedComment object correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'isi komentar',
      owner: 'user-123',
    };

    expect(new AddedComment(payload)).toEqual(payload);
  });
});
