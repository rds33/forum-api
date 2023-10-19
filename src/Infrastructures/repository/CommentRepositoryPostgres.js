const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const GetComment = require('../../Domains/comments/entities/GetComment');

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addComment(newComment) {
        const { content, thread, owner } = newComment;
        const id = `comment-${this._idGenerator()}`;
    
        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
            values: [id, content, thread, owner],
        };
        const result = await this._pool.query(query);
    
        return new AddedComment({ ...result.rows[0] });
    }
    
    async verifyAvailableComment(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id],
        };
    
        const result = await this._pool.query(query);
        if (!result.rowCount) {
        throw new NotFoundError('komentar tidak ditemukan');
        }
    }
    
    async verifyCommentsOwner(comment, owner) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
            values: [comment, owner],
        };
    
        const result = await this._pool.query(query);
        if (result.rowCount === 0) throw new AuthorizationError('Anda tidak memiliki akses');
    }
    
    async deleteComment(id) {
        const query = {
            text: 'UPDATE comments SET "deletedOn" = true WHERE id = $1',
            values: [id],
        };
    
        await this._pool.query(query);
    }
    
    async getCommentsOfThread(threadId) {
        const query = {
            text: `SELECT comments.*, users.username FROM comments
            LEFT JOIN users ON users.id = comments.owner
            WHERE comments.thread = $1
            ORDER BY comments.date ASC`,
            values: [threadId],
        };
    
        const result = await this._pool.query(query);
        const comments = result.rows.map((comment) => new GetComment(comment));
        return comments;
    }
}

module.exports = CommentRepositoryPostgres;