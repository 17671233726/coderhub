const connection = require("../app/database");

class commentService {
    //添加评论
    async create(momentId, content, userId) {
        try {
            const statement = `INSERT INTO comment(content,moment_id,user_id) values(?,?,?);`;
            const [result] = await connection.execute(statement, [content, momentId, userId]);
            return result
        } catch (err) {
            return err;
        }
    }
    //评论回复评论
    async reply(momentId, content, userId, commentId) {
        const statement = `INSERT INTO comment(content,moment_id,user_id,comment_id) values(?,?,?,?);`;
        const [result] = await connection.execute(statement, [content, momentId, userId, commentId]);
        return result
    }
    //修改评论
    async update(commentId, content) {
        const statement = `UPDATE comment SET content=? WHERE id=?`;
        const [result] = await connection.execute(statement, [content, commentId]);
        return result;
    }
    //删除评论
    async remove(commentId) {
        const statement = `DELETE FROM comment WHERE id=?;`;
        const [result] = await connection.execute(statement, [commentId]);
        return result;
    }
    //通过momentId查询评论列表以及评论的用户信息
    async getCommentsByMomentId(momentId) {
        const statement = `SELECT c.id,c.content,c.comment_id,c.createAt craeteTime,
        JSON_OBJECT('id',u.id,'name',u.name) user
        FROM comment c LEFT JOIN users u ON c.user_id=u.id WHERE moment_id=?;`;
        const [result] = await connection.execute(statement, [momentId]);
        return result
    }
}

module.exports = new commentService();