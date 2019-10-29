const { queryResult } = require('../services/executeDbQuery');

const testData = async ({ odbc }, query) => {
    const result = await queryResult(odbc, query);
    return result;
};

const testDbQueryMiddleware = (app, args) => {
    app.use(async (req, res, next) => {
        try {
            const { query } = req.headers;
            console.log(`Running: "${query}"`);
            const dbRes = await testData(args, query);
            console.log('--- DB RES --- LENGTH: ' + dbRes.length);
            console.log(dbRes);
            res.locals.data = res.locals.data || {};
            Object.assign(res.locals.data, { dbRes });
        }
        catch(err){
            console.log(err);
            throw err;
        }

        next();
    });
};

module.exports = testDbQueryMiddleware;
