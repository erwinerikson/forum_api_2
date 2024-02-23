const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NewLike = require('../../../Domains/likes/entities/NewLike');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });
     
  afterAll(async () => {
    await pool.end();
  });

  describe('addLike function', () => {
    it('should persist add like', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const addLike = new NewLike({
        thread: 'thread-123',
        comment: 'comment-123',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepositoryPostgres.addLike(addLike);
 
      // Assert
      const likes = await LikesTableTestHelper.findLikeById('like-123');
      expect(likes).toHaveLength(1);
    });
  });

  describe('verify like available function', () => {
    it('should verify if comment is liked', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      await LikesTableTestHelper.addLike({
        thread: 'thread-123',
        comment: 'comment-123',
        owner: 'user-123',
      });
      const payload = {
        thread: 'thread-123',
        comment: 'comment-123',
        owner: 'user-123',
      };
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const isLike = await likeRepositoryPostgres.verifyAvailableLike(payload);

      // Assert
      expect(isLike).toEqual(1);
    });

    it('should verify if comment is not liked', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      await LikesTableTestHelper.addLike({
        thread: 'thread-123',
        comment: 'comment-123',
        owner: 'user-123',
      });
      const payload = {
        thread: 'thread-123',
        comment: 'comment-234',
        owner: 'user-123',
      };
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
  
      // Action
      const isLike = await likeRepositoryPostgres.verifyAvailableLike(payload);
  
      // Assert
      expect(isLike).toEqual(0);
    });
  });

  describe('getLikeCount function', () => {
    it('should return no like of comment', async () => {
      // Arrange
      const id = 'comment-123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
  
      // Action
      const like = await likeRepositoryPostgres.getLikeCount(id);
  
      // Assert
      expect(like).toEqual(0);
    });

    it('should return like count of comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      await LikesTableTestHelper.addLike({
        thread: 'thread-123',
        comment: 'comment-123',
        owner: 'user-123',
      });
      const id = 'comment-123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
    
      // Action
      const like = await likeRepositoryPostgres.getLikeCount(id);
    
      // Assert
      expect(like).toEqual(1);
    });
  });

  describe('deleteLike function', () => {
    it('should unlike comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      await LikesTableTestHelper.addLike({
        thread: 'thread-123',
        comment: 'comment-123',
        owner: 'user-123',
      });
      const payload = {
        thread: 'thread-123',
        comment: 'comment-123',
        owner: 'user-123',
      };
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const deleteLike = await likeRepositoryPostgres.deleteLike(payload);

      // Assert
      expect(deleteLike).toEqual(1);
    });
  });
});
