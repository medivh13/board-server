const { parseStringPromise } = require('xml2js');
const { http: httpTarget } = require('../env');

const proxy = async ({ app, http, logger }) => {

    app.get('*', (client_req, client_res) => {
        logger.info('serve: ' + client_req.url);
        const authorize = client_req.header('Authorization');

        const options = {
            hostname: httpTarget.hostname,
            port: httpTarget.port,
            method: 'GET',
            path: client_req.url,
            headers: {
                'Authorization': authorize,
                'Content-Type': 'text/plain'
            }
        };

        const proxyRequest = http.request(options, (res) => {
            let result = {
                response: {},
                data: client_res.locals.data
            };
            let body = [];

            res.on('data', (data) => {
                body.push(data);
            }).on('end', async () => {
                const response = Buffer.concat(body).toString();
                result.response = await parseStringPromise(response, {explicitArray: false});
                client_res.send(result);
                res.pipe(client_res, {
                    end: true
                });
            });
        })
            .on('error', (err) => {
                logger.error(`[ERROR] ${err}`);
                client_res.send({
                    response: {},
                    data: client_res.locals.data,
                    message: "Failed to fetch response from server."
                });
            });

        client_req.pipe(proxyRequest, {
            end: true
        });
    });
};

module.exports = proxy;