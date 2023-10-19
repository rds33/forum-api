const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
    it('it should orchestrate the add comment action correctly', async () => {
        
        const useCasePayload = {
            content: 'medan dimananya?',
            thread: 'thread-123',
            owner: 'robby',
        };

        const addingComment = new AddedComment({
            id: 'comment-123',
            content: useCasePayload.content,
            owner: useCasePayload.owner,
        })
    
        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();
    
        mockThreadRepository.verifyAvailableThread = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.addComment = jest.fn(() => Promise.resolve(addingComment));
    
        const addCommentUseCase = new AddCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        });
    
        const addedComment = await addCommentUseCase.execute(useCasePayload);

        expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.thread);
        expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
            content: useCasePayload.content,
            thread: useCasePayload.thread,
            owner: useCasePayload.owner,
        }));
        expect(addedComment).toStrictEqual(new AddedComment({
            id: 'comment-123',
            content: useCasePayload.content,
            owner: useCasePayload.owner,
        }));
    });
});