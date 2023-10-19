const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThread(addThread) {
        const { title, body, owner } = addThread;
        const id = `thread-${this._idGenerator()}`;

        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, body, owner',
            values: [id, title, body, owner],
        };
        const result = await this._pool.query(query);

        const addedThread = {
            id: result.rows[0].id,
            title: result.rows[0].title,
            body: result.rows[0].body,
            owner: result.rows[0].owner,
        };
        return new AddedThread(addedThread);
    }

    async verifyAvailableThread(id) {
        const query = {
            text: 'SELECT id FROM threads WHERE id = $1',
            values: [id],
        };
    
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('thread tidak ditemukan');
        }
    }
    
    async getThreadById(threadId) {
        const query = {
            text: `SELECT threads.*, users.username FROM threads
            LEFT JOIN users ON users.id = threads.owner
            WHERE threads.id = $1`,
            values: [threadId],
        };
        const result = await this._pool.query(query);
        return result.rows[0];
    }
}


module.exports = ThreadRepositoryPostgres;