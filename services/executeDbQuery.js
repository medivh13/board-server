const queryResult = async (args, query) => {
    const { odbc, logger } = args;

    return new Promise((resolve,reject) => {
        odbc.query(query, (error, result) => {
            if (error) {
                logger.error(`[ERROR] ${error}`);
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    }).catch((err) => {
        logger.error(`[ERROR] ${err.message}`);
    });
};

module.exports = {
    queryResult
};