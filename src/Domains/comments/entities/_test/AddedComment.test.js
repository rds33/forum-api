const AddedComment = require('../AddedComment');

describe('AddedComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        
        const payload = {
            content: 'medan dimananya?',
            owner: 'robby',
        };
    
        expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        
        const payload = {
            id: 123,
            content: 'medan dimananya?',
            owner: 'robby',
        };
    
        expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create addedComment object correctly', () => {
        
        const payload = {
            id: 'comment-212',
            content: 'medan dimananya?',
            owner: 'robby',
        };
    
        const { id, content, owner } = new AddedComment(payload);
    
        expect(id).toEqual(payload.id);
        expect(content).toEqual(payload.content);
        expect(owner).toEqual(payload.owner);
    });
});