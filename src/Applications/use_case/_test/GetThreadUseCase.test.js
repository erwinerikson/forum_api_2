const GetThread = require('../../../Domains/threads/entities/GetThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should throw error if use case payload not contain', async () => {
    // Arrange
    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();
    // Create the use case instace
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });
    const useCasePayload = {};
            
    // Action & Assert
    await expect(getThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
    
  it('should throw error if payload not string', async () => {
    // Arrange
    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();
    // Create the use case instace
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });
    const useCasePayload = {
      id: true,
    };
    
    // Action & Assert
    await expect(getThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error if thread does not exist', async () => {
    // Arrange
    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();
    // Create the use case instace
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });
    const useCasePayload = {
      id: 'xyz',
    };

    // Action & Assert
    await expect(getThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should function processData comment', async () => {
    // Arrange
    const comment = [{
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:59:18.982Z',
      content: 'sebuah comment',
      is_delete: 1,
    }];
    const expectedProcessDataComment = [{
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:59:18.982Z',
      content: '**komentar telah dihapus**',
    }];
    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();
    // Create the use case instace
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });
    // Mock
    const mockProcessData = jest.spyOn(getThreadUseCase, '_processData');

    // Action
    getThreadUseCase._processData(comment);

    // Assert
    expect(mockProcessData).toReturnWith(expectedProcessDataComment);
  });

  it('should function processData replies', async () => {
    // Arrange
    const replies = [{
      id: 'reply-123',
      comment: 'comment-123',
      content: 'sebuah balasan',
      date: '2021-08-08T07:59:18.982Z',
      username: 'dicoding',
      is_delete: 1,
    }];
    const expectedProcessDataReply = [{
      id: 'reply-123',
      comment: 'comment-123',
      content: '**balasan telah dihapus**',
      date: '2021-08-08T07:59:18.982Z',
      username: 'dicoding',
    }];
    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();
    // Create the use case instace
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });
    // Mock
    const mockProcessData = jest.spyOn(getThreadUseCase, '_processData');

    // Action
    getThreadUseCase._processData(replies);

    // Assert
    expect(mockProcessData).toReturnWith(expectedProcessDataReply);
  });

  it('should orchestrating the get thread without replies action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-123',
    };
    const mockGetThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:59:18.982Z',
      username: 'dicoding',
    };
    const mockGetComment = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2021-08-08T07:59:18.982Z',
        content: 'sebuah comment',
        is_delete: 0,
      },
    ];
    const mockGetReply = [];
    const expectedProcessDataComment = [{
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:59:18.982Z',
      content: 'sebuah comment',
    }];
    const expectedProcessDataReply = [];
    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();
    // Create the use case instace
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });
    // Mocking
    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockGetThread));
    mockCommentRepository.getComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockGetComment));
    mockReplyRepository.getReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockGetReply));
    const mockProcessData = jest.spyOn(getThreadUseCase, '_processData');
    getThreadUseCase._processData(mockGetComment);
    getThreadUseCase._processData(mockGetReply);

    // Action
    const getThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.getThread).toBeCalledWith(new GetThread({ id: 'thread-123' }));
    expect(mockCommentRepository.getComment).toBeCalledWith(new GetThread({ id: 'thread-123' }));
    expect(mockReplyRepository.getReply).toBeCalledWith(new GetThread({ id: 'thread-123' }));
    expect(mockProcessData).toHaveBeenNthCalledWith(1, expectedProcessDataComment);
    expect(mockProcessData).toHaveBeenNthCalledWith(2, expectedProcessDataReply);
    expect(getThread).toStrictEqual({
      id: 'thread-123',
      body: 'sebuah body thread',
      title: 'sebuah thread',
      date: '2021-08-08T07:59:18.982Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          content: 'sebuah comment',
          date: '2021-08-08T07:59:18.982Z',
          username: 'dicoding',
          replies: [],
        },
      ],
    });
  });

  it('should orchestrating the get thread with replies action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-123',
    };
    const mockGetThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:59:18.982Z',
      username: 'dicoding',
    };
    const mockGetComment = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2021-08-08T07:59:18.982Z',
        content: 'sebuah comment',
        is_delete: 0,
      },
    ];
    const mockGetReply = [
      {
        id: 'reply-123',
        comment: 'comment-123',
        content: 'sebuah balasan',
        date: '2021-08-08T07:59:18.982Z',
        username: 'dicoding',
        is_delete: 0,
      },
    ];
    const expectedProcessDataComment = [{
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:59:18.982Z',
      content: 'sebuah comment',
    }];
    const expectedProcessDataReply = [{
      id: 'reply-123',
      comment: 'comment-123',
      content: 'sebuah balasan',
      date: '2021-08-08T07:59:18.982Z',
      username: 'dicoding',
    }];
    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();
    // Create the use case instace
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });
    // Mocking
    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockGetThread));
    mockCommentRepository.getComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockGetComment));
    mockReplyRepository.getReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockGetReply));
    const mockProcessData = jest.spyOn(getThreadUseCase, '_processData');
    getThreadUseCase._processData(mockGetComment);
    getThreadUseCase._processData(mockGetReply);

    // Action
    const getThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.getThread).toBeCalledWith(new GetThread({ id: 'thread-123' }));
    expect(mockCommentRepository.getComment).toBeCalledWith(new GetThread({ id: 'thread-123' }));
    expect(mockReplyRepository.getReply).toBeCalledWith(new GetThread({ id: 'thread-123' }));
    expect(mockProcessData).toHaveBeenNthCalledWith(1, expectedProcessDataComment);
    expect(mockProcessData).toHaveBeenNthCalledWith(2, expectedProcessDataReply);
    expect(getThread).toStrictEqual({
      id: 'thread-123',
      body: 'sebuah body thread',
      title: 'sebuah thread',
      date: '2021-08-08T07:59:18.982Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          content: 'sebuah comment',
          date: '2021-08-08T07:59:18.982Z',
          username: 'dicoding',
          replies: [
            {
              id: 'reply-123',
              content: 'sebuah balasan',
              date: '2021-08-08T07:59:18.982Z',
              username: 'dicoding',
            },
          ],
        },
      ],
    });
  });
});
