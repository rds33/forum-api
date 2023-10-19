class GetThreadUseCase {
    constructor({ commentRepository, threadRepository }) {
        
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async execute(threadId) {
        await this._threadRepository.verifyAvailableThread(threadId);
        const thread = await this._threadRepository.getThreadById(threadId);
        const comments = await this._commentRepository.getCommentsOfThread(threadId);
        thread.comments = comments;

        return thread;
    }
}


module.exports = GetThreadUseCase;