const GetComment = require('../../../Domains/comments/entities/GetComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
    it('it should orchecstrate the get thread detail action correctly', async () => {
    
        const threadId = 'thread-123';
        const expectedComments = [
            new GetComment({
                id: 'comment-123',
                username: 'robby',
                date: '2021-11-28T03:46:19Z',
                content: 'medan dimananya?',
                deletedOn: false,
            }),
        ];

        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.verifyAvailableThread = jest.fn()
        .mockImplementation(() => Promise.resolve());
        mockCommentRepository.getCommentsOfThread = jest.fn()
        .mockImplementation(() => Promise.resolve(expectedComments));
        mockThreadRepository.getThreadById = jest.fn()
        .mockImplementation(() => ({
            id: 'thread-123',
            title: 'some thread',
            body: 'aku orang medan',
            date: '2021-11-28T03:46:19Z',
            username: 'robby',
            comments: expectedComments,
        }));

        const getThreadUseCase = new GetThreadUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        });
        
        await getThreadUseCase.execute(threadId);
        
        expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
        expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
        expect(mockCommentRepository.getCommentsOfThread).toBeCalledWith(threadId);
    });
});