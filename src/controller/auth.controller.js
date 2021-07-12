const jwt = require("jsonwebtoken");
//引入秘钥
const { PRIVATE_KEY } = require("../app/config");
class AuthController {
    async login(ctx, next) {
        const { id, name } = ctx.user;
        //颁发token
        const token = jwt.sign({ id, name }, PRIVATE_KEY, {
            expiresIn: 60 * 60 * 24,
            algorithm: 'RS256'
        })
        //返回token
        ctx.body = { id, name, token }
    }
    async success(ctx, next) {
        ctx.body = "授权成功";
    }
}

module.exports = new AuthController();