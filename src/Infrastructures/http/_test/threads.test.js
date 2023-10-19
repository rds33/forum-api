const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  it('should response 201 and persisted thread', async () => {
    
    const requestPayload = {
        title: 'some thread',
        body: 'aku orang medan',
    };

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
    const { data: { accessToken } } = JSON.parse(loginUser.payload); 

    const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    const responseJson = JSON.parse(response.payload);

    expect(response.statusCode).toEqual(201);
    expect(responseJson.status).toEqual('success');
    expect(responseJson.data.addedThread).toBeDefined();
  });

  it('should response 400 if payload not contain needed property', async () => {
    const server = await createServer(container);
    const requestPayload = {
        title: 'some thread',
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

    const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const responseJson = JSON.parse(response.payload);

    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toBeDefined();
    expect(responseJson.message).toEqual('tidak dapat membuat thread karena properti yang dibutuhkan tidak sesuai');
  });

  it('should response 400 if payload not meet data type specification', async () => {
    const server = await createServer(container);
    
    const requestPayload = {
        title: 212,
        body: true,
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

    const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toEqual('tidak dapat membuat thread karena tipe data tidak sesuai');
  });

  it('should response 200 when getThread', async () => {
    
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
    const {data: { accessToken }} = JSON.parse(loginUser.payload);

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
        method: 'GET',
        url: `/threads/${threadId}`,
    });

    const responseJson = JSON.parse(response.payload);
    expect(responseJson.data.thread).toBeDefined();
    expect(responseJson.data.thread.id).toEqual(threadId);
    expect(responseJson.data.thread.title).toEqual('some thread');
    expect(responseJson.data.thread.body).toEqual('aku orang medan');
    expect(responseJson.data.thread.date).toBeDefined();
    expect(responseJson.data.thread.username).toEqual('dicoding');
    expect(Array.isArray(responseJson.data.thread.comments)).toBe(true);
  });
});