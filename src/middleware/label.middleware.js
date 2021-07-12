const service = require("../service/label.service")

const verifyLabelExists = async (ctx, next) => {
    const { labels } = ctx.request.body
    const newLabels = [];
    for (let name of labels) {
        const label = { name };
        const labelResult = await service.getLabelByName(name);
        if (!labelResult) {
            const result = await service.create(name);
            label.id = result.insertId;
        } else {
            label.id = labelResult.id
        }
        newLabels.push(label);
    }
    ctx.labels = newLabels;
    await next();
}

module.exports = {
    verifyLabelExists
}