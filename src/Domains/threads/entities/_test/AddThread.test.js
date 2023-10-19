const AddThread = require('../AddThread');

describe('Addthread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            title: 'some thread',
            body: 'aku orang medan',
        };
        
        expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        
        const payload = {
            title: 'some thread',
            body: true,
            owner: 'robby',
        };
        
        
        expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddThread object correctly', () => {
        const payload = {
            title: 'some thread',
            body: 'aku orang medan',
            owner: 'robby',
        };
    
        const { title, body, owner } = new AddThread(payload);
    
        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
        expect(owner).toEqual(payload.owner);
    });
});