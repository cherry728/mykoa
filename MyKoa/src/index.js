const Koa = require("koa");
const app = new Koa();
app.use(async (ctx, next) => {
    let start = new Date().getTime();
    console.log("start: " + ctx.url);
    await next();
    console.log(`请求${ctx.url}, 耗时:  ${new Date().getTime() - start}ms`);
});
app.use(async (ctx, next) => {
    ctx.body = "HELLO KOA";
    await next();
});
app.listen(3000, () => {
    console.log("listen at 3000");
});
