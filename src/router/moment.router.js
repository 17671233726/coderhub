const Router = require('koa-router');
const momentRouter = new Router({ prefix: '/moment' });

const {
    create,
    list,
    detail,
    update,
    remove,
    addLabels,
    fileInfo
} = require('../controller/moment.controller')

const {
    verifyAuth,
    verifyPermission
} = require('../middleware/auth.middleware')

const {
    verifyLabelExists
} = require("../middleware/label.middleware")
//发布动态，验证token
momentRouter.post('/', verifyAuth, create);
//查询动态列表
momentRouter.get('/', list);
//根据id查询动态
momentRouter.get('/:momentId', detail);

momentRouter.patch('/:momentId', verifyAuth, verifyPermission, update);

momentRouter.delete('/:momentId', verifyAuth, verifyPermission, remove);

momentRouter.post('/:momentId/labels', verifyAuth, verifyPermission, verifyLabelExists, addLabels);

momentRouter.get('/images/:filename', fileInfo);

module.exports = momentRouter;