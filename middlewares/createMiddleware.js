const createMiddleware = (args, func) => {
    return async (req, res, next) => {
        if (args.http){
            args.http.options.headers['Authorization'] = req.header('Authorization');
        }

        try {
            const middlewareRes = await func(args);
            res.locals.data = res.locals.data || {};
            Object.assign(res.locals.data, middlewareRes);
        }
        catch(err){
            console.log(err);
            // throw err;
        }

        next();
    }
};

module.exports = createMiddleware;