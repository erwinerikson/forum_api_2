const Jwt = require('@hapi/jwt');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/likes endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });
            
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 401 Missing Authentication', async () => {
      // Arrange
      const server = await createServer(container);
    
      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/{id}/comments/{id}/likes',
        payload: {},
      }); 
    
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 if thread not found', async () => {
      // Arrange
      const server = await createServer(container);
          
      // Action
      const payloadUser = {
        id: 'user-123',
        username: 'dicoding',
      };
      const accessToken = Jwt.token.generate(payloadUser, process.env.ACCESS_TOKEN_KEY);
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/xxx/comments/comment-123/likes',
        payload: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
        
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 if comment not found', async () => {
      // Arrange
      const server = await createServer(container);
      // add user
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      // add thread
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123',
        date: '2021-08-08T07:19:09.775Z',
      });
            
      // Action
      const payloadUser = {
        id: 'user-123',
        username: 'dicoding',
      };
      const accessToken = Jwt.token.generate(payloadUser, process.env.ACCESS_TOKEN_KEY);
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/xxx/likes',
        payload: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
          
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment tidak ditemukan');
    });
  });

  it('should handle server error correctly', async () => {
    // Arrange
    const payloadUser = {
      id: 'user-123',
      username: 'dicoding',
    };
    const accessToken = Jwt.token.generate(payloadUser, process.env.ACCESS_TOKEN_KEY);
    const server = await createServer({}); // fake injection

    // Action
    const response = await server.inject({
      method: 'PUT',
      url: '/threads/thread-123/comments/comment-123/likes',
      payload: {},
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(500);
    expect(responseJson.status).toEqual('error');
    expect(responseJson.message).toEqual('terjadi kegagalan pada server kami');
  });

  it('should return like comment correctly', async () => {
    // Arrange
    const server = await createServer(container);
    // add user
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'dicoding',
      password: 'secret_password',
      fullname: 'Dicoding Indonesia',
    });
    // add thread
    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      owner: 'user-123',
      date: '2021-08-08T07:19:09.775Z',
    });
    // add comment
    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      thread: 'thread-123',
      content: 'sebuah comment',
      owner: 'user-123',
      date: '2021-08-08T07:19:09.775Z',
    });
          
    // Action
    const payloadUser = {
      id: 'user-123',
      username: 'dicoding',
    };
    const accessToken = Jwt.token.generate(payloadUser, process.env.ACCESS_TOKEN_KEY);
    const response = await server.inject({
      method: 'PUT',
      url: '/threads/thread-123/comments/comment-123/likes',
      payload: {},
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
        
    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(200);
    expect(responseJson.status).toEqual('success');
  });

  it('should return unlike comment correctly', async () => {
    // Arrange
    const server = await createServer(container);
    // add user
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'dicoding',
      password: 'secret_password',
      fullname: 'Dicoding Indonesia',
    });
    // add thread
    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      owner: 'user-123',
      date: '2021-08-08T07:19:09.775Z',
    });
    // add comment
    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      thread: 'thread-123',
      content: 'sebuah comment',
      owner: 'user-123',
      date: '2021-08-08T07:19:09.775Z',
    });
    // add like
    await LikesTableTestHelper.addLike({
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
    });
          
    // Action
    const payloadUser = {
      id: 'user-123',
      username: 'dicoding',
    };
    const accessToken = Jwt.token.generate(payloadUser, process.env.ACCESS_TOKEN_KEY);
    const response = await server.inject({
      method: 'PUT',
      url: '/threads/thread-123/comments/comment-123/likes',
      payload: {},
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
        
    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(200);
    expect(responseJson.status).toEqual('success');
  });
});
