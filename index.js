const env = require('./env');
const HttpConnector = require('./connectors/HttpConnector');
const OdbcConnector = require('./connectors/OdbcConnector');

const createLogger = require('./utils/createLogger');
const logger = createLogger(env.data.appName);

const opts = {
    config: env,
    logger
};

const odbcConnector = new OdbcConnector(opts);

const startServer = async () => {
    let odbc;

    try {
        odbc = await odbcConnector.connectToDatabase();
    }
    catch (err){
        logger.error("Failed to connect to ODBC, starting offline mode...");
    }

    Object.assign(opts, { odbc });
    const httpConnector = new HttpConnector(opts);

    try {
        await httpConnector.start();
        return {
            odbc: opts.odbc
        };
    }
    catch(err){
        throw err;
    }
};

startServer();