const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');

class ThreadsHandler {
    constructor(container) {
        this._container = container;
    
        this.postThreadHandler = this.postThreadHandler.bind(this);
        this.getThreadIdHandler = this.getThreadIdHandler.bind(this);
    }

    async postThreadHandler(request, h) {
        const { id: owner } = request.auth.credentials;
        request.payload.owner = owner;
        const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    
        const addedThread = await addThreadUseCase.execute(request.payload);
    
        return h.response({
            status: 'success',
            data: {
                addedThread,
            },
        }).code(201);
    }
    
    async getThreadIdHandler(request, h) {
        const { threadId } = request.params;
        const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
    
        const thread = await getThreadUseCase.execute(threadId);
    
        return h.response({
            status: 'success',
            data: {
                thread,
            },
        }).code(200);
    }
}

module.exports = ThreadsHandler;

