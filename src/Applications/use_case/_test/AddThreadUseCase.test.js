const AddThread = require('../../../Domains/threads/entities/AddThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
    it('it should orchestrate the adding thread action correctly', async () => {
        
        const useCasePayload = {
            title: 'some thread',
            body: 'aku orang medan',
            owner: 'robby',
        };

        const expectedAddedThread = new AddedThread({
            id: 'thread-123',
            title: useCasePayload.title,
            body: useCasePayload.body,
            owner: useCasePayload.owner,
        });
    
        const mockThreadRepository = new ThreadRepository();
    
        mockThreadRepository.addThread = jest.fn().mockImplementation(() => (expectedAddedThread));
    
        const getThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository,
        });
    
        const addedThread = await getThreadUseCase.execute(useCasePayload);
    
        expect(addedThread).toStrictEqual(expectedAddedThread);

        expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
            title: useCasePayload.title,
            body: useCasePayload.body,
            owner: useCasePayload.owner,
        }));
    });
});