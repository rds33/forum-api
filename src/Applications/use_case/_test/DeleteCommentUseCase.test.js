const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
    it('should orchestrate the delete comment action correctly', async () => {
        const useCasePayload = {
            id: 'comment-123',
            thread: 'thread-123',
            owner: 'robby',
        };
    
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
    
        mockThreadRepository.verifyAvailableThread = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyAvailableComment = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentsOwner = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.deleteComment = jest.fn()
            .mockImplementation(() => Promise.resolve());
    
        const deleteCommentUseCase = new DeleteCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        });
    
        await deleteCommentUseCase.execute(useCasePayload);
    
        expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(useCasePayload.thread);
        expect(mockCommentRepository.verifyCommentsOwner).toBeCalledWith(useCasePayload.id, useCasePayload.owner);
        expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(useCasePayload.id);
        expect(mockCommentRepository.deleteComment).toBeCalledWith(useCasePayload.id);
    });
});