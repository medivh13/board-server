const express = require('express');
const http = require('http');
const { parseStringPromise } = require('xml2js');
const createMiddleware = require('../middlewares/createMiddleware');
const { server, http: httpTarget, client } = require('../env');
const routes = require('../routes');
const middlewares = require('../middlewares');

class HttpConnector {
    constructor(opts){
        Object.assign(this, opts);
    }

    async start(){
        const app = express();
        app.use(express.json());

        await this._setMiddlewares(app);
        await this._setHeaders(app);
        await this._setProxyGet(app);
        await this._setRoutes(app);

        app.listen(server.port);
        this.logger.info("[INFO] Successfully started proxy server.");
    }

    async _setMiddlewares(app){
        const args = {
            odbc: this.odbc,
            logger: this.logger,
            http: {
                instance: http,
                options: {
                    hostname: httpTarget.hostname,
                    port: httpTarget.port,
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                }
            }
        };

        const createJoinMiddlewares = async (args) => {
            const middlewareList = middlewares.map((func) => {
                return createMiddleware(args, func);
            });

            return async (req, res, next) => {
                const middlewares = await middlewareList.map((middleware) => {
                    return middleware(req, res);
                });
                await Promise.all(middlewares);
                next();
            };
        };

        app.use(await createJoinMiddlewares(args));

        // for testing db query only
        // require('../middlewares/testDbQueryMiddleware')(app, args);
    }

    async _setHeaders(app){
        app.use((req, res, next) => {

            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', client.accessControlAllowOrigin);

            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

            // Set to true if you need the website to include cookies in the requests sent
            // to the API (e.g. in case you use sessions)
            res.setHeader('Access-Control-Allow-Credentials', true);

            // Pass to next layer of middleware
            next();
        });
    }

    async _setProxyGet(app){
        app.get('*', (client_req, client_res) => {
            this.logger.info('serve: ' + client_req.url);
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

            const proxy = http.request(options, (res) => {
                let result = {
                    response: {},
                    data: client_res.locals.data
                };
                let body = [];

                res.on('data',(data) => {
                    body.push(data);
                }).on('end', async () => {
                    const response = Buffer.concat(body).toString();
                    result.response = await parseStringPromise(response, { explicitArray: false });
                    client_res.send(result);
                    res.pipe(client_res, {
                        end: true
                    });
                });
            })
            .on('error', (err) => {
                this.logger.error(`[ERROR] ${err}`);
                client_res.send({
                    response: {},
                    data: client_res.locals.data,
                    message: "Failed to fetch response from server."
                });
            });

            client_req.pipe(proxy, {
                end: true
            });
        });
    }

    async _setRoutes(app){
        const args = {
            app,
            http,
            logger: this.logger
        };

        for(let key in routes){
            routes[key](args);
        }
    }
}

module.exports = HttpConnector;
