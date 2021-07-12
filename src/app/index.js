const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const errorHandle = require("./error.handle")
const useRoutes = require("../router/index");

const app = new Koa();

app.useRoutes = useRoutes;

app.use(bodyParser());
app.useRoutes();     //封装的导入router的函数
app.on("error", errorHandle);

module.exports = app

