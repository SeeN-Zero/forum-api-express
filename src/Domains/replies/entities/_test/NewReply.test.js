import NewReply from '../NewReply.js';

describe('a NewReply entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    expect(() => new NewReply({})).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    expect(() => new NewReply({ content: ['isi balasan'] })).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewReply object correctly', () => {
    const payload = { content: 'isi balasan' };
    expect(new NewReply(payload)).toEqual(payload);
  });
});
