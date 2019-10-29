const { parseStringPromise } = require('xml2js');

const httpRequest = async (http, options) => {
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
            console.log("Error: " + err);
            reject({
                Users: {
                    User: []
                },
                message: ("Failed to fetch from URL: " + options.path)
            });
        });
        req.end();
    }).catch((err) => {
        console.log(err.message);
        return {
            Users: {
                User: []
            },
            message: ("Failed to fetch from URL: " + options.path)
        };
    });
};

const httpLogin = async (http, options) => {
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
            console.log("Error: " + err);
            if (err.message){
                parseStringPromise(err.message, { explicitArray: false }).then((res) => {
                    reject(res);
                })
            }
        });
        req.end();
    }).catch((err) => {
        console.log(err.message);
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