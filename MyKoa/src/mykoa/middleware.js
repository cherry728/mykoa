const compose1 = (...fn) => {
    return fn.reduce((a, b) => (...args) => {
        return b(a(...args));
    });
};

const compose2 = (...[first, ...other]) => (...args) => {
    let ret = first(...args);
    other.forEach(fn => {
        ret = fn(ret);
    });
    return ret;
};

function compose(middlewares) {
    // 聚合函数要返回一个新的函数
    return function() {
        //每个中间件都是异步的
        return dispatch(0);
        function dispatch(i) {
            let fn = middlewares[i];
            if (!fn) return Promise.resolve();
            return Promise.resolve(
                fn(function next() {
                    return dispatch(i + 1);
                })
            );
        }
    };
}

async function fn1(next) {
    console.log("fn1");
    await next();
    console.log("end fn1");
}

async function fn2(next) {
    console.log("fn2");
    await delay();
    await next();
    console.log("end fn2");
}

function fn3(next) {
    console.log("fn3");
}

function delay() {
    return new Promise((reslove, reject) => {
        setTimeout(() => {
            reslove();
        }, 2000);
    });
}

const middlewares = [fn1, fn2, fn3];
const finalFn = compose(middlewares);
finalFn();
