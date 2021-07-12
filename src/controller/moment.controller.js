const fs = require("fs")
const momentRouter = require("../router/moment.router");
const momentService = require('../service/moment.service')
const FileService = require("../service/file.service")

const { PICTURE_PATH } = require("../constants/file-path")

class momentController {
    //插入动态信息
    async create(ctx, next) {
        const userId = ctx.user.id;
        const content = ctx.request.body.content;
        const result = await momentService.create(userId, content);
        ctx.body = result;
    }
    //查询一条动态
    async detail(ctx, next) {
        const momentId = ctx.params.momentId;
        const result = await momentService.getMomentById(momentId);
        ctx.body = result;
    }
    //查询一组动态
    async list(ctx, next) {
        const { offset, size } = ctx.query;
        const result = await momentService.getMomentList(offset, size);
        ctx.body = result;
    }
    async update(ctx, next) {
        const { momentId } = ctx.params;
        const { content } = ctx.request.body;
        const result = await momentService.update(content, momentId);
        ctx.body = result;
    }
    async remove(ctx, next) {
        const { momentId } = ctx.params;
        const result = await momentService.delete(momentId);
        ctx.body = result;
    }
    async addLabels(ctx, next) {
        const { momentId } = ctx.params;
        const { labels } = ctx;
        for (let label of labels) {
            const isExist = await momentService.hasLabel(momentId, label.id);
            if (!isExist) {
                await momentService.addLabel(momentId, label.id);
            }
        }
        ctx.body = "添加标签成功~";
    }
    async fileInfo(ctx, next) {
        const { filename } = ctx.params;
        const fileInfo = await FileService.getFileByFileName(filename);
        if (!fileInfo) return ctx.body = "资源不存在";
        ctx.response.set('content-type', fileInfo.mimetype);
        ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`)
    }
}

module.exports = new momentController();