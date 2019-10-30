const createMiddleware = (args, func) => {
    const { logger } = args;

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
            logger.error(err);
        }

        next();
    }
};

module.exports = createMiddleware;