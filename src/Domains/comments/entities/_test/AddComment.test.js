const AddComment = require('../AddComment');

describe('AddComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        
        const payload = {
            content: 'medan dimananya?',
        };

        expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        
        const payload = {
            content: 'medan dimananya?',
            thread: 123,
            owner: 'robby',
        };
    
        expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('must create addComment object Correctly', () => {
        
        const payload = {
            content: 'medan dimananya?',
            thread: 'thread-212',
            owner: 'robby',
        };
    
        const { content, thread, owner } = new AddComment(payload);
    
        expect(content).toEqual(payload.content);
        expect(owner).toEqual(payload.owner);
        expect(thread).toEqual(payload.thread);
    });
});