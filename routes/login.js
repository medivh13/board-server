const { executeHttp } = require('../services');
const { server, http: httpTarget } = require('../env');
const http = require('http');
const btoa = require('btoa');

const login = async (app) => {
    app.post('/fiboard/login', (req, res) => {
        const { username, password } = req.body;
        const authorize = 'Basic ' + btoa(username + ':' + password);

        const options = {
            hostname: httpTarget.hostname,
            method: 'POST',
            path: '/adminapi/login',
            headers: {
                'Authorization': authorize,
                'Content-Type': 'text/plain'
            }
        };

        executeHttp.httpRequest(http, options)
            .then((result) => {
                // a hack for login problem
                const { errorData, errorType } = result.apiErrors.apiError;
                if (errorType !== 'Unauthorized'){
                    //TODO add JWT Token
                    response = {
                        code: 'success',
                        message: 'Login successful.',
                        authToken: '12345678'
                    };
                }
                else {
                    response = {
                        code: 'error',
                        message: 'Login Failed.'
                    }
                }
                res.send(response);
            })
            .catch((err) => {
                response = {
                    code: 'error',
                    message: 'Login Failed.'
                };
                res.send(response);
            });
    });
};

module.exports = login;