const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
    constructor(container) {
        this._container = container;

        this.postCommentHandler = this.postCommentHandler.bind(this);
        this.deleteCommentIdHandler = this.deleteCommentIdHandler.bind(this);
    }

    async postCommentHandler(request, h) {
        const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);

        const { id: owner } = request.auth.credentials;
        const { threadId: thread } = request.params;
        request.payload.thread = thread; 
        request.payload.owner = owner; 
    
        const addedComment = await addCommentUseCase.execute(request.payload);
        
        return h.response({
            status: 'success',
            data: {
                addedComment,
            },
        }).code(201);
    }
    
    async deleteCommentIdHandler(request, h) {
        const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);

        const { id: owner } = request.auth.credentials;
        const { threadId, commentId } = request.params;
        const payload = {
            id: commentId,
            thread: threadId,
            owner,
        };
        await deleteCommentUseCase.execute(payload);

        return h.response({
            status: 'success',
        }).code(200);
    }
}


module.exports = CommentsHandler;