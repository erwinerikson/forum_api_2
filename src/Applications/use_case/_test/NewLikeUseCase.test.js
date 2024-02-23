const NewLike = require('../../../Domains/likes/entities/NewLike');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const NewLikeUseCase = require('../NewLikeUseCase');

describe('NewLikeUseCase', () => {
  it('should throw error if use case payload not contain', async () => {
    // Arrange
    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();
    // Create the use case instace
    const getLikeUseCase = new NewLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });
    const useCasePayload = {};
                
    // Action & Assert
    await expect(getLikeUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('NEW_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload not string', async () => {
    // Arrange
    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();
    // Create the use case instace
    const getLikeUseCase = new NewLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });
    const useCasePayload = {
      thread: 'thread-123',
      comment: true,
      owner: 'user-123',
    };
    
    // Action & Assert
    await expect(getLikeUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('NEW_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error if thread not available', async () => {
    // Arrange
    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();
    // Create the use case instace
    const getLikeUseCase = new NewLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });
    const useCasePayload = {
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
    };
    
    // Action & Assert
    await expect(getLikeUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should orchestrating the like action correctly', async () => {
    // Arrange
    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();
    // Create the use case instace
    const newLikeUseCase = new NewLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });
    const useCasePayload = {
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
    };

    // Mocking
    mockThreadRepository.verifyThreadAvailability = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn(() => Promise.resolve());
    mockLikeRepository.verifyAvailableLike = jest.fn(() => Promise.resolve(0));
    mockLikeRepository.addLike = jest.fn(() => Promise.resolve(1));

    // Action
    const newLike = await newLikeUseCase.execute(useCasePayload);
    
    // Assert
    expect(newLike).toEqual(1);
    expect(mockThreadRepository.verifyThreadAvailability)
      .toHaveBeenCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.verifyCommentAvailability)
      .toHaveBeenCalledWith(useCasePayload.comment);
    expect(mockLikeRepository.verifyAvailableLike)
      .toHaveBeenCalledWith(useCasePayload);
    expect(mockLikeRepository.addLike).toHaveBeenCalledWith(new NewLike({
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
    }));
  });

  it('should orchestrating the unlike action correctly', async () => {
    // Arrange
    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();
    // Create the use case instace
    const newLikeUseCase = new NewLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });
    const useCasePayload = {
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
    };

    // Mocking
    mockThreadRepository.verifyThreadAvailability = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn(() => Promise.resolve());
    mockLikeRepository.verifyAvailableLike = jest.fn(() => Promise.resolve(1));
    mockLikeRepository.deleteLike = jest.fn(() => Promise.resolve(1));

    // Action
    const newLike = await newLikeUseCase.execute(useCasePayload);
    
    // Assert
    expect(newLike).toEqual(1);
    expect(mockThreadRepository.verifyThreadAvailability)
      .toHaveBeenCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.verifyCommentAvailability)
      .toHaveBeenCalledWith(useCasePayload.comment);
    expect(mockLikeRepository.verifyAvailableLike)
      .toHaveBeenCalledWith(useCasePayload);
    expect(mockLikeRepository.deleteLike).toHaveBeenCalledWith(new NewLike({
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
    }));
  });
});
