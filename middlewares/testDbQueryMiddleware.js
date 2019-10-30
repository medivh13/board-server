const { queryResult } = require('../services/executeDbQuery');

const testData = async ({ odbc }, query) => {
    const result = await queryResult(odbc, query);
    return result;
};

const testDbQueryMiddleware = (app, args) => {
    const { logger } = args;

    app.use(async (req, res, next) => {
        try {
            const { query } = req.headers;
            logger.info(`Running: "${query}"`);
            const dbRes = await testData(args, query);
            logger.info('--- DB RES --- LENGTH: ' + dbRes.length);
            logger.info(dbRes);
            res.locals.data = res.locals.data || {};
            Object.assign(res.locals.data, { dbRes });
        }
        catch(err){
            logger.error(err);
            throw err;
        }

        next();
    });
};

module.exports = testDbQueryMiddleware;
