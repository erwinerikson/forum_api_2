const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const GetThread = require('../../../Domains/threads/entities/GetThread');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });
        
  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      await ThreadsTableTestHelper.addThread({
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123',
      });
      const addComment = new AddComment({
        content: 'sebuah comment',
        thread: 'thread-123',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(addComment);

      // Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-123'))
        .resolves
        .not.toThrowError(NotFoundError);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      await ThreadsTableTestHelper.addThread({
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123',
      });
      const payloadAddComment = new AddComment({
        content: 'sebuah comment',
        thread: 'thread-123',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(payloadAddComment);

      // Assert
      expect(addedComment).toEqual(new AddedComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyCommentAvailability function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread: 'thread-123',
        content: 'sebuah comment',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-123'))
        .resolves
        .not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentByOwnerAvailability function', () => {
    it('should throw AuthorizationError when comment by owner not found', async () => {
      // Arrange
      const findOwnerComment = {
        comment: 'comment-321',
        thread: 'thread-321',
        owner: 'user-321',
      };
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
  
      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentByOwnerAvailability(findOwnerComment))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when comment  by owner available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread: 'thread-123',
        content: 'sebuah comment',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
      });
      const findOwnerComment = {
        comment: 'comment-123',
        thread: 'thread-123',
        owner: 'user-123',
      };
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
  
      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentByOwnerAvailability(findOwnerComment))
        .resolves
        .not.toThrowError(AuthorizationError);
    });
  });

  describe('readComment function', () => {
    it('should return comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread: 'thread-123',
        content: 'sebuah comment',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
      });
      const expectedGetComment = [
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '2021-08-08T07:19:09.775Z',
          content: 'sebuah comment',
          is_delete: 0,
        },
      ];
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
    
      // Action
      const readComment = await commentRepositoryPostgres.getComment(new GetThread({ id: 'thread-123' }));

      // Assert
      expect(readComment).toStrictEqual(expectedGetComment);
    });
  });

  describe('deleteComment function', () => {
    it('should return comment id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread: 'thread-123',
        content: 'sebuah comment',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
      });
      const expectedDeleteComment = 1;
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      
      // Action
      const deleteComment = await commentRepositoryPostgres.deleteComment({ comment: 'comment-123' });

      // Assert
      const isDeleteComment = await CommentsTableTestHelper.checkIsDelete({ comment: 'comment-123' });
      expect(isDeleteComment).toStrictEqual({ is_delete: 1 });
      expect(deleteComment).toStrictEqual(expectedDeleteComment);
    });
  });
});
