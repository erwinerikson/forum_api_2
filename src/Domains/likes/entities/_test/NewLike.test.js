const NewLike = require('../NewLike');

describe('a AddReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
    };
        
    // Action & Assert
    expect(() => new NewLike(payload)).toThrowError('NEW_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      thread: 'thread-123',
      comment: true,
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new NewLike(payload)).toThrowError('NEW_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create like entities correctly', () => {
    // Arrange
    const payload = {
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
    };

    // Action
    const {
      thread, comment, owner, 
    } = new NewLike(payload);

    // Assert
    expect(thread).toEqual(payload.thread);
    expect(comment).toEqual(payload.comment);
    expect(owner).toEqual(payload.owner);
  });
});
