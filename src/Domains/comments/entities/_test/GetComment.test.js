const GetComment = require('../GetComment');

describe('GetComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        
        const payload = {
            content: 'medan dimananya?',
        };
    
        expect(() => new GetComment(payload)).toThrowError('GET_COMMENTS_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        
        const payload = {
            id: 234,
            username: true,
            content: 'medan dimananya?',
            date: 'hari raya',
            deletedOn: 123,
        };
    
        expect(() => new GetComment(payload)).toThrowError('GET_COMMENTS_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create getComment object correctly', () => {
        const payload = {
            id: 'comment-212',
            content: 'medan dimananya?',
            username: 'polisi',
            deletedOn: false,
            date: new Date(),
        };

        const { id, content, username, date, deletedOn } = new GetComment(payload);

        expect(id).toEqual(payload.id);
        expect(content).toEqual(payload.content);
        expect(username).toEqual(payload.username);
        expect(date).toEqual(payload.date);
        expect(deletedOn).toEqual(false);
    });

    it('if deletedOn is true, set content to **komentar telah dihapus**', () => {
        
        const payload = {
            id: 'comment-212',
            username: 'polisi',
            date: new Date(),
            content: 'medan dimananya?',
            deletedOn: true,
        };

        
        const { id, content, username, date, deletedOn } = new GetComment(payload);

        expect(id).toEqual(payload.id);
        expect(username).toEqual(payload.username);
        expect(date).toEqual(payload.date);
        expect(content).toEqual('**komentar telah dihapus**');
        expect(deletedOn).toEqual(true);
    }); 
});