const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const createServer = require('../createServer');
const container = require('../../container');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await AuthenticationsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
  });

  it('should response 201 when adding comment', async () => {
    const server = await createServer(container);
      
    const requestPayload = {
        content: 'medan dimananya?',
    };

    // add user
    await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
            username: 'dicoding',
            password: 'secret',
            fullname: 'Dicoding Indonesia',
        },
    });

    // login user
    const loginUser = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
            username: 'dicoding',
            password: 'secret',
        },
    });
    const { data: { accessToken } } = JSON.parse(loginUser.payload); 

    // add thread
    const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
            title: 'some thread',
            body: 'aku orang medan',
        },
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const responseThreadJson = JSON.parse(responseThread.payload);
    const thread = responseThreadJson.data.addedThread.id;

    const response = await server.inject({
        method: 'POST',
        url: `/threads/${thread}/comments`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(201);
    expect(responseJson.status).toEqual('success');
    expect(responseJson.data.addedComment).toBeDefined();
  });

  it('should response 400 if payload not contain needed property', async () => {
    const server = await createServer(container);
    
    const wrongPayload = {};

    // add user
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });

    // login user
    const loginUser = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding',
        password: 'secret',
      },
    });
    const { data: { accessToken } } = JSON.parse(loginUser.payload);

    // add thread
    const responseThread = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title: 'some thread',
        body: 'aku orang medan',
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const responseThreadJson = JSON.parse(responseThread.payload);
    const threadId = responseThreadJson.data.addedThread.id;

    const response = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: wrongPayload,
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const responseJson = JSON.parse(response.payload);

    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toEqual('tidak dapat membuat komentar karena properti yang dibutuhkan tidak sesuai');
  });

  it('should response 400 if payload not meet data type specification', async () => {
    const server = await createServer(container);
    
    const requestPayload = {
      content: 123,
    };

    // add user
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });

    // login user
    const loginUser = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding',
        password: 'secret',
      },
    });
    const { data: { accessToken } } = JSON.parse(loginUser.payload);

    // add thread
    const responseThread = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title: 'some thread',
        body: 'aku orang medan',
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const responseThreadJson = JSON.parse(responseThread.payload);
    const threadId = responseThreadJson.data.addedThread.id;

    const response = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: requestPayload,
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const responseJson = JSON.parse(response.payload);

    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toEqual('tidak dapat membuat komentar karena tipe data tidak sesuai');
  });

  it('should response 404 if the thread with comment does not available', async () => {
    const server = await createServer(container);
    
    const requestPayload = {
      content: 'medan dimananya?',
    };

    // add user
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });

    // login user
    const loginUser = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding',
        password: 'secret',
      },
    });
    const { data: { accessToken } } = JSON.parse(loginUser.payload);

    const threadId = 'thread-123';
    const response = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: requestPayload,
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(404);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toEqual('thread tidak ditemukan');
  });

  it('should response 200 when succesfully deleting comment', async () => {
    const server = await createServer(container);

    // add user
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });

    // login user
    const loginUser = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding',
        password: 'secret',
      },
    });
    const { data: { accessToken } } = JSON.parse(loginUser.payload); // get the acces token

    // add thread
    const responseThread = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title: 'some thread',
        body: 'aku orang medan',
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const responseThreadJson = JSON.parse(responseThread.payload);
    const threadId = responseThreadJson.data.addedThread.id;

    // add comment
    const responseComment = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: {
        content: 'medan dimananya?',
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const responseCommentJson = JSON.parse(responseComment.payload);
    const commentId = responseCommentJson.data.addedComment.id;

    const response = await server.inject({
      method: 'DELETE',
      url: `/threads/${threadId}/comments/${commentId}`,
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const responseJson = JSON.parse(response.payload);

    expect(response.statusCode).toEqual(200);
    expect(responseJson.status).toEqual('success');
  });
});