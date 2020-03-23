const http = require("http");
const context = require("./context");
const request = require("./request");
const response = require("./response");
class MyKoa {
    constructor() {
        this.middlewares = []
    }
    createContext(req, res) {
        const ctx = Object.create(context);
        ctx.request = Object.create(request);
        ctx.response = Object.create(response);
        // req, res是http原始的req、res
        ctx.req = ctx.request.req = req;
        ctx.res = ctx.response.res = res;
        return ctx;
    }
    use(middleware) {
        this.middlewares.push(middleware)
    }
    listen(...args) {
        const server = http.createServer(async (req, res) => {
            const ctx = this.createContext(req, res);
            // 合成的新的函数
            const fn = this.compose(this.middlewares);
            await fn(ctx)
            res.end(ctx.body)
        });
        // console.log('args', ...args);
        server.listen(...args);
    }
    compose(middlewares) {
        // 聚合函数要返回一个新的函数
        return function(ctx) {
            //每个中间件都是异步的
            return dispatch(0);
            function dispatch(i) {
                let fn = middlewares[i];
                if (!fn) return Promise.resolve();
                return Promise.resolve(
                    fn(ctx, function next() {
                        return dispatch(i + 1);
                    })
                );
            }
        };
    }
}

module.exports = MyKoa;
