/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
    async addComment({
        id = 'comment-212', content = 'medan dimananya?', thread = 'thread-212', owner = 'user-212', deletedOn = false,
    }) {
        const date = new Date().toISOString();
        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
            values: [id, content, thread, owner, date, deletedOn],
        };

    await pool.query(query);
    },

    async findCommentsById(id) {
    const query = {
        text: 'SELECT * FROM comments WHERE id = $1',
        values: [id],
    };
    const result = await pool.query(query);
    return result.rows;
    },

    async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
    },
};

module.exports = CommentsTableTestHelper;