const fs = require("fs");
const service = require("../service/user.service");
const FileService = require("../service/file.service")
const { AVATAR_PATH } = require("../constants/file-path")
class UserController {
    //用户注册中间件
    async create(ctx, next) {
        const user = ctx.request.body;
        const result = await service.create(user);
        ctx.body = result;
    }
    async avatarInfo(ctx, next) {
        const { userId } = ctx.params;
        const avatarInfo = await FileService.getAvatarByUserId(userId);
        ctx.response.set('content-type', avatarInfo.mimetype); //设置响应文件类型
        ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avatarInfo.filename}`);
    }
}

module.exports = new UserController();