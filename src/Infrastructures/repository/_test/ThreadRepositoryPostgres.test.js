const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addThread function', () => {
        it('should persist add thread and return added thread correctly', async () => {
            
        await UsersTableTestHelper.addUser({});

        const addThread = new AddThread({
            title: 'some thread',
            body: 'aku orang medan',
            owner: 'user-212',
        });
        const fakeIdGenerator = () => '212';
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
        await threadRepositoryPostgres.addThread(addThread);
        const searchThread = await ThreadsTableTestHelper.findThreadsById('thread-212');
        expect(searchThread).toHaveLength(1);
        });

        it('should return added thread correctly', async () => {
            
            await UsersTableTestHelper.addUser({});

            const addThread = new AddThread({
                title: 'some thread',
                body: 'aku orang medan',
                owner: 'user-212',
            });
            const fakeIdGenerator = () => '212';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            const addedThread = await threadRepositoryPostgres.addThread(addThread);

            expect(addedThread).toStrictEqual(new AddedThread({
                id: 'thread-212',
                title: 'some thread',
                body: 'aku orang medan',
                owner: 'user-212',
            }));
        });
    });

    describe('verifyAvailableThread function', () => {
        it('if thread existed in database, do not throw NotFoundError', async () => {
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            
            await expect(threadRepositoryPostgres.verifyAvailableThread('thread-212')).resolves.not.toThrowError(NotFoundError);
        });

        it('if thread does not exist in db, throw NotFoundError', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            await expect(threadRepositoryPostgres.verifyAvailableThread('thread-212')).rejects.toThrowError(NotFoundError);
        });
    });

    describe('getThreadById function', () => {
        it('should return getThreadById correctly', async () => {
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
            const id = 'thread-212';
            const thread = await threadRepositoryPostgres.getThreadById(id);

            
            expect(thread.id).toEqual('thread-212');
            expect(thread.title).toEqual('some thread');
            expect(thread.body).toEqual('aku orang medan');
            expect(thread.username).toEqual('dicoding');
        });
    });
});