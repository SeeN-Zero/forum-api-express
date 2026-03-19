import AddedReply from '../AddedReply.js';

describe('an AddedReply entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    expect(() => new AddedReply({ id: 'reply-123', content: 'isi balasan' })).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    expect(() => new AddedReply({
      id: 'reply-123',
      content: 'isi balasan',
      owner: 123,
    })).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedReply object correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'isi balasan',
      owner: 'user-123',
    };

    expect(new AddedReply(payload)).toEqual(payload);
  });
});
