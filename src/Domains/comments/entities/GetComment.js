class GetComment {
    constructor(payload) {
        this._verifyPayload(payload);

        const {
            id, username, date, content, deletedOn,
          } = payload;
    
        this.id = id;
        this.username = username;
        this.date = date;
        this.deletedOn = deletedOn;
        if (this.deletedOn) {
            this.content = '**komentar telah dihapus**';
        } else {
            this.content = content;
        }
    }

    _verifyPayload(payload) {
        const { id, username, date, content, deletedOn } = payload;
        
        if (!id || !username || !date || !content || deletedOn === undefined) {
            throw new Error('GET_COMMENTS_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY');
        }
    
        if (
            typeof id !== 'string'
            || typeof username !== 'string'
            || !(typeof date === 'string' || typeof date === 'object')
            || typeof content !== 'string'
            || typeof deletedOn !== 'boolean'
        ) {
            throw new Error('GET_COMMENTS_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}


module.exports = GetComment;