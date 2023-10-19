class AddComment {
    constructor(payload) {
        this._verifyPayload(payload);

        Object.assign(this, payload);
    }

    _verifyPayload(payload) {
        const { content, thread, owner } = payload;

        if (!content || !thread || !owner) {
            throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof content !== 'string' || typeof thread !== 'string' || typeof owner !== 'string') {
            throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = AddComment;