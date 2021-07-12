const connection = require("../app/database")


class UserService {
    //用户注册
    async create(user) {
        const { name, password } = user;
        const statement = `INSERT INTO users(name,password) VALUES(?,?);`;
        const result = await connection.execute(statement, [name, password]);
        return result[0];
    }
    //查询是否存在用户名
    async getUserByName(name) {
        const statement = `SELECT * FROM users WHERE name=?;`;
        const result = await connection.execute(statement, [name]);
        return result[0];
    }
    async updateAvatarUrlById(avatarUrl, userId) {
        const statement = `UPDATE users SET avatarUrl=? WHERE id=?;`
        const result = await connection.execute(statement, [avatarUrl, userId]);
        return result;
    }
}

module.exports = new UserService();