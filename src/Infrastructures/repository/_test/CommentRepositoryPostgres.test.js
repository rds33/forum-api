const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const NotFoundError= require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');


describe('CommentRepositoryPostgres', () => {
    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
    });
    
    afterAll(async () => {
        await pool.end();
    });

    describe('addComment function', () => {
        it('should add comment correctly to database', async () => {
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});

            const addComment = new AddComment({
                content: 'medan dimananya?',
                thread: 'thread-212',
                owner: 'user-212',
            });
            
            const fakeIdGenerator = () => '212';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            const addingComment = await commentRepositoryPostgres.addComment(addComment);
            expect(addingComment).toStrictEqual(new AddedComment({
                id: 'comment-212',
                content: 'medan dimananya?',
                owner: 'user-212',
            }));

            const comments = await CommentsTableTestHelper.findCommentsById('comment-212');
            expect(comments).toHaveLength(1);
        });

        it('should return addedComment entities correctly', async () => {
            
            const addComment = new AddComment({
                content: 'medan dimananya?',
                thread: 'thread-212',
                owner: 'user-212',
            });
            const fakeIdGenerator = () => '212';
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            const addedComment = await commentRepositoryPostgres.addComment(addComment);

            expect(addedComment).toStrictEqual(new AddedComment({
                id: 'comment-212',
                content: 'medan dimananya?',
                owner: 'user-212',
            }));
        });
    });

    describe('function verifyAvailableComment', () => {
        it('if comment existed, do not throw NotFoundError', async () => {
            
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            const commentId = 'comment-212';
            await expect(commentRepositoryPostgres.verifyAvailableComment(commentId)).resolves.not.toThrowError(NotFoundError);
        });

        it('if comment does not exist, throw NotFoundError', async () => {
            
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            const commentId = 'comment-212';
            await expect(commentRepositoryPostgres.verifyAvailableComment(commentId)).rejects.toThrowError(NotFoundError);
        });
    });

    describe('verifyCommentsOwner function', () => {
        it('throw AuthorizationError when user dont have an access', async () => {
            
            await UsersTableTestHelper.addUser({}); 
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({}); 

            const userNoAccess = {
                id: 'wiro-212',
                username: 'wirosableng',
                password: 'juruskapak',
                fullname: 'pinjual alat pertanian',
            };
            await UsersTableTestHelper.addUser(userNoAccess);

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            expect(commentRepositoryPostgres.verifyCommentsOwner('comment-212', userNoAccess.id))
                .rejects.toThrowError(AuthorizationError);
        });

        it('do not throw error Authorization if user have an access', async () => {
            
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
    
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
    
            expect(commentRepositoryPostgres.verifyCommentsOwner('comment-212', 'user-212'))
            .resolves.not.toThrowError(AuthorizationError);
        });
    });

    describe('deleteComment', () => {
        it('deleting Comment correctly', async () => {
            
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        
            const commentId = 'comment-212';
            await commentRepositoryPostgres.deleteComment(commentId);
        
            const result = await CommentsTableTestHelper.findCommentsById(commentId);
            expect(result[0].id).toEqual('comment-212');
            expect(result[0].content).toEqual('medan dimananya?');
            expect(result[0].owner).toEqual('user-212');
            expect(result[0].deletedOn).toEqual(true);
        });
    });

    describe('getCommentsOfThread function', () => {
        it('should return comments of a thread correctly', async () => {
            
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({}); 
            await CommentsTableTestHelper.addComment({}); 
            await CommentsTableTestHelper.addComment({
                id: 'lambeturah-001', content: 'komentar buruk', thread: 'thread-212', owner: 'user-212', deletedOn: true,
            }); 
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        
            const comments = await commentRepositoryPostgres.getCommentsOfThread('thread-212');
        
            expect(comments).toHaveLength(2);
            expect(comments[0].id).toEqual('comment-212');
            expect(comments[0].content).toEqual('medan dimananya?');
            expect(comments[0].username).toEqual('dicoding');
            expect(comments[0].date).toBeInstanceOf(Date);
            expect(comments[0].deletedOn).toEqual(false);
        
            expect(comments[1].id).toEqual('lambeturah-001');
            expect(comments[1].content).toEqual('**komentar telah dihapus**');
            expect(comments[1].username).toEqual('dicoding');
            expect(comments[1].date).toBeInstanceOf(Date);
            expect(comments[1].deletedOn).toEqual(true);
        });
    });
});