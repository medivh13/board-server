const { parseStringPromise } = require('xml2js');

const httpRequest = async (args, options) => {
    const { http, logger } = args;

    return new Promise((resolve, reject) => {
        let body = [];

        const req = http.request(options, (res) => {
            res.on('data', (data) => {
                body.push(data);
            }).on('end', async () => {
                const response = Buffer.concat(body).toString();
                const result = await parseStringPromise(response, { explicitArray: false });
                resolve(result);
            });
        }).on('error', (err) => {
            logger.error(`[ERROR] ${err}`);
            reject({
                Users: {
                    User: []
                },
                message: ("Failed to fetch from URL: " + options.path)
            });
        });
        req.end();
    }).catch((err) => {
        logger.error(`[ERROR] ${err.message}`);
        return {
            Users: {
                User: []
            },
            message: ("Failed to fetch from URL: " + options.path)
        };
    });
};

const httpLogin = async (args, options) => {
    const { http, logger } = args;

    return new Promise((resolve, reject) => {
        let body = [];

        const req = http.request(options, (res) => {
            res.on('data', (data) => {
                body.push(data);
            }).on('end', async () => {
                const response = Buffer.concat(body).toString();
                const result = await parseStringPromise(response, { explicitArray: false });
                resolve(result);
            });
        }).on('error', (err) => {
            logger.error(`[ERROR] ${err}`);
            if (err.message){
                parseStringPromise(err.message, { explicitArray: false }).then((res) => {
                    reject(res);
                })
            }
        });
        req.end();
    }).catch((err) => {
        logger.error(`[ERROR] ${err.message}`);
        return {
            Users: {
                User: []
            },
            message: ("Failed to fetch from URL: " + options.path)
        };
    });
};

module.exports = {
    httpRequest,
    httpLogin
};