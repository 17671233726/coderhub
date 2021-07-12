const errorTypes = require("../constants/error-types")
const service = require("../service/user.service")
const md5password = require("../utils/password-handle")

//注册验证中间件
const verifyUser = async (ctx, next) => {
    //判断用户名或密码不能为空
    const { name, password } = ctx.request.body;
    if (!name || !password) {
        const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED);
        return ctx.app.emit("error", error, ctx)
    }
    //判断用户名是否重复
    const result = await service.getUserByName(name);

    if (result.length) {
        console.log("用户名已存在ggggg");
        const error = new Error(errorTypes.USER_ALREADY_EXISTS);
        return ctx.app.emit("error", error, ctx)
    }
    await next();
}

//密码加密中间件
const handlePassword = async (ctx, next) => {
    let { password } = ctx.request.body;
    ctx.request.body.password = md5password(password);
    await next();
}

module.exports = {
    verifyUser,
    handlePassword
}