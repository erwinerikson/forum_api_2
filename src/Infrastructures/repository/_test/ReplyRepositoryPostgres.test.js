const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const GetThread = require('../../../Domains/threads/entities/GetThread');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });
            
  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
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
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread: 'thread-123',
        content: 'sebuah comment',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
      });
      const addReply = new AddReply({
        content: 'sebuah reply',
        thread: 'thread-123',
        comment: 'comment-123',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.addReply(addReply);

      // Assert
      await expect(replyRepositoryPostgres.verifyReplyAvailability('reply-123'))
        .resolves
        .not.toThrowError(NotFoundError);
    });

    it('should return added reply correctly', async () => {
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
      const payloadAddReply = new AddReply({
        content: 'sebuah reply',
        thread: 'thread-123',
        comment: 'comment-123',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
  
      // Action
      const addReply = await replyRepositoryPostgres.addReply(payloadAddReply);
  
      // Assert
      expect(addReply).toEqual(new AddedReply({
        id: 'reply-123',
        content: 'sebuah reply',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyReplyAvailability function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyAvailability('reply-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when reply available', async () => {
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
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'sebuah reply',
        thread: 'thread-123',
        comment: 'comment-123',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyAvailability('reply-123'))
        .resolves
        .not.toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyByOwnerAvailability function', () => {
    it('should throw AuthenticationError when reply not found', async () => {
      // Arrange
      const findOwnerReply = {
        id: 'reply-321',
        thread: 'thread-321',
        comment: 'comment-321',
        owner: 'user-321',
      };
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
  
      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyByOwnerAvailability(findOwnerReply))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should return reply id correctly', async () => {
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
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'sebuah reply',
        thread: 'thread-123',
        comment: 'comment-123',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
      });
      const findOwnerReply = {
        id: 'reply-123',
        thread: 'thread-123',
        comment: 'comment-123',
        owner: 'user-123',
      };
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
  
      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyByOwnerAvailability(findOwnerReply))
        .resolves
        .not.toThrowError(AuthorizationError);
    });
  });

  describe('getReply function', () => {
    it('should return reply correctly', async () => {
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
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'sebuah reply',
        thread: 'thread-123',
        comment: 'comment-123',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
      });
      const expectedGetReply = [
        {
          id: 'reply-123',
          comment: 'comment-123',
          content: 'sebuah reply',
          date: '2021-08-08T07:19:09.775Z',
          username: 'dicoding',
          is_delete: 0,
        },
      ];
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
    
      // Action
      const readReply = await replyRepositoryPostgres.getReply(new GetThread({ id: 'thread-123' }));

      // Assert
      expect(readReply).toStrictEqual(expectedGetReply);
    });
  });

  describe('deleteReply function', () => {
    it('should return reply id correctly', async () => {
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
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'sebuah reply',
        thread: 'thread-123',
        comment: 'comment-123',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
      });
      const expectedDeleteReply = 1;
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      
      // Action
      const deleteReply = await replyRepositoryPostgres.deleteReply({ reply: 'reply-123' });

      // Assert
      const isDeleteReply = await RepliesTableTestHelper.checkIsDelete({ reply: 'reply-123' });
      expect(isDeleteReply).toStrictEqual({ is_delete: 1 });
      expect(deleteReply).toStrictEqual(expectedDeleteReply);
    });
  });
});
