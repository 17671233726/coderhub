const connection = require('../app/database');

const sqlFragment = `SELECT
m.id id,m.content content,m.createAt createTime,m.updateAt updateTime,
JSON_OBJECT('id',u.id,'name',u.name) author
from moment m
LEFT JOIN users u ON m.user_id=u.id `

class momentService {
    //插入动态信息
    async create(userId, content) {
        const statement = `INSERT INTO moment(content,user_id) values(?,?);`;
        const [result] = await connection.execute(statement, [content, userId]);
        return result;
    }
    //根据momentId查询一条动态以及动态里的评论列表、评论的用户信息
    async getMomentById(id) {
        const statement = `SELECT
        m.id id,m.content content,m.createAt createTime,m.updateAt updateTime,
       JSON_OBJECT('id',u.id,'name',u.name,'avatarUrl',u.avatarUrl) author,
       IF(count(l.id),JSON_ARRAYAGG(JSON_OBJECT('id',l.id,'name',l.name)),NULL) labels,
       (SELECT IF(count(c.id),JSON_ARRAYAGG(JSON_OBJECT('id',c.id,'content',c.content,'comentId',c.comment_id,'createTime',c.createAt,'user',JSON_OBJECT('id',cu.id,'name',cu.name,'avatarUrl',cu.avatarUrl))),null) FROM comment c
       LEFT JOIN users cu ON c.user_id=cu.id WHERE m.id=c.moment_id) coments,
       (SELECT JSON_ARRAYAGG(concat('http://localhost:8000/moment/images/',file.filename))
					from file where m.id=file.moment_id) images
       from moment m
       LEFT JOIN users u ON m.user_id=u.id
       LEFT JOIN moment_label ml ON ml.moment_id=m.id
       LEFT JOIN label l ON l.id=ml.label_id
       where m.id=?;`;
        const [result] = await connection.execute(statement, [id]);
        return result[0];
    }
    //根据offset,size,查询一组动态，以及评论数量,标签数量
    async getMomentList(offset, size) {   //offset：从哪条开始，size：一次查多少条
        const statement = `SELECT
        m.id id,m.content content,m.createAt createTime,m.updateAt updateTime,
        JSON_OBJECT('id',u.id,'name',u.name,'avatarUrl',u.avatarUrl) author,
        (SELECT COUNT(*) FROM comment c where c.moment_id=m.id) commentCount,
        (SELECT count(*) FROM moment_label ml WHERE ml.moment_id=m.id ) labelCount,
        (SELECT JSON_ARRAYAGG(concat('http://localhost:8000/moment/images/',file.filename))
					from file where m.id=file.moment_id) images
        from moment m
        LEFT JOIN users u ON m.user_id=u.id LIMIT ?,?;`;
        const [result] = await connection.execute(statement, [offset, size]);
        return result;
    }
    //修改动态
    async update(content, momentId) {
        const statement = `UPDATE moment SET content=? WHERE id=?;`;
        const [result] = await connection.execute(statement, [content, momentId]);
        return result;
    }
    //删除动态
    async delete(momentId) {
        const statement = `DELETE FROM moment WHERE id=?;`;
        const [result] = await connection.execute(statement, [momentId]);
        return result;
    }
    async hasLabel(momentId, labelId) {
        const statement = `SELECT * FROM moment_label WHERE moment_id=? and label_id=?`;
        const [result] = await connection.execute(statement, [momentId, labelId]);
        return result[0] ? true : false;
    }
    async addLabel(momentId, labelId) {
        const statement = `INSERT INTO moment_label(moment_id,label_id) VALUES(?,?);`;
        const [result] = await connection.execute(statement, [momentId, labelId]);
        return result;
    }
}

module.exports = new momentService()