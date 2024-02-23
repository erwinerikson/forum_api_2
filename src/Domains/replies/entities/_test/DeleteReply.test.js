const DeleteReply = require('../DeleteReply');

describe('a DeleteReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      thread: 'thread-123',
      comment: 'comment-123',
    };
      
    // Action & Assert
    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      thread: true,
      comment: 'comment-123',
      reply: 1,
      owner: 'user-123',
    };
  
    // Action and Assert
    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  
  it('should delete reply entities correctly', () => {
    // Arrange
    const payload = {
      thread: 'thread-123',
      comment: 'comment-123',
      reply: 'reply-123',
      owner: 'user-123',
    };
  
    // Action
    const {
      thread,
      comment,
      reply,
      owner,
    } = new DeleteReply(payload);
  
    // Assert
    expect(thread).toEqual(payload.thread);
    expect(comment).toEqual(payload.comment);
    expect(reply).toEqual(payload.reply);
    expect(owner).toEqual(payload.owner);
  });
});
