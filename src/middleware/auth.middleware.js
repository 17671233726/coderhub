const errorTypes = require("../constants/error-types")
const userService = require("../service/user.service")
const authService = require('../service/auth.service')
const jwt = require("jsonwebtoken");
const md5password = require("../utils/password-handle");

const { PUBLIC_KEY } = require('../app/config')

const verifyLogin = async (ctx, next) => {
    //判断用户名或密码不能为空
    const { name, password } = ctx.request.body;
    if (!name || !password) {
        const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED);
        return ctx.app.emit("error", error, ctx)
    }
    //验证用户名密码是否正确
    const result = await userService.getUserByName(name);
    const user = result[0];
    if (!user) {
        const error = new Error(errorTypes.USER_DOES_NOT_EXISTS);
        return ctx.app.emit("error", error, ctx);
    }

    if (md5password(password) !== user.password) {
        const error = new Error(errorTypes.PASSWORD_IS_INCORRECT);
        return ctx.app.emit("error", error, ctx);
    }
    //保存用户信息
    ctx.user = user;
    await next();
}

const verifyAuth = async (ctx, next) => {
    //获取token
    const authorization = ctx.headers.authorization;
    //没有携带token
    if (!authorization) {
        const error = new Error(errorTypes.UNAUTHORIZATION);
        return ctx.app.emit("error", error, ctx);
    }
    const token = authorization.replace('Bearer ', '');
    try {
        //验证token
        const result = jwt.verify(token, PUBLIC_KEY, {
            algorithms: ['RS256']
        })
        ctx.user = result;
        await next();
    } catch (err) {
        //无效toekn抛出错误
        const error = new Error(errorTypes.UNAUTHORIZATION);
        ctx.app.emit("error", error, ctx);
    }

}

const verifyPermission = async (ctx, next) => {
    //获取表名
    const tableName = Object.keys(ctx.params)[0].replace('Id', '');
    //获取params参数中的id
    const id = Object.values(ctx.params)[0];
    //获取用户id
    const userId = ctx.user.id;
    const isPermission = await authService.checkMoment(tableName, id, userId);
    if (!isPermission) {
        const error = new Error(errorTypes.UNPERMISSION);
        return ctx.app.emit("error", error, ctx);
    }
    await next();
}

module.exports = {
    verifyLogin,
    verifyAuth,
    verifyPermission
}