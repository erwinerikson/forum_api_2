const AddComment = require('../AddComment');

describe('a AddComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      content: 1,
      thread: 'thread_123',
      owner: 'user_123',
    };
    
    // Action & Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      owner: 'user_123',
    };
    
    // Action & Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 'abc',
      thread: true,
      owner: 'user_123',
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create comment entities correctly', () => {
    // Arrange
    const payload = {
      content: 'abc',
      thread: 'thread_123',
      owner: 'user_123',
    };

    // Action
    const { content, thread, owner } = new AddComment(payload);

    // Assert
    expect(content).toEqual(payload.content);
    expect(thread).toEqual(payload.thread);
    expect(owner).toEqual(payload.owner);
  });
});
