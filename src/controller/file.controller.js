const service = require("../service/file.service")
const UserService = require("../service/user.service")
const { APP_HOST, APP_PORT } = require("../app/config")

class FileController {
    async saveAvatarInfo(ctx, next) {
        const { filename, mimetype, size } = ctx.req.file;
        const { id } = ctx.user;
        const result = await service.createAvatar(filename, mimetype, size, id);
        const avatarUrl = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`;
        await UserService.updateAvatarUrlById(avatarUrl, id);
        ctx.body = "头像上传成功";
    }
    async savePictureInfo(ctx, next) {
        const { files } = ctx.req;
        const { id } = ctx.user;
        const { momentId } = ctx.query
        for (let file of files) {
            const { filename, mimetype, size } = file;
            await service.createFile(filename, mimetype, size, momentId, id);
        }
        ctx.body = "图片上传成功";
    }
}

module.exports = new FileController()