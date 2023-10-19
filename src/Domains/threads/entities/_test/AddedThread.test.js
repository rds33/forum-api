const AddedThread = require('../AddedThread');

describe('AddedThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        
        const payload = {
            title: 'some thread',
            body: 'aku orang medan',
        };

        
        expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        
        const payload = {
            id: 123,
            title: 'some thread',
            body: 'aku orang medan',
            owner: 'robby',
        };

        
        expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddedThread object correctly', () => {
        
        const payload = {
            id: 'thread-123',
            title: 'some thread',
            body: 'aku orang medan',
            owner: 'robby',
        };

        
        const { id, title, body, owner } = new AddedThread(payload);

        expect(id).toEqual(payload.id);
        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
        expect(owner).toEqual(payload.owner);
    });
});