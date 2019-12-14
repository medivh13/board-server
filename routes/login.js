const { executeHttp } = require('../services');
const { http: httpTarget } = require('../env');
const btoa = require('btoa');

const login = async ({ app, http, logger }) => {

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

        executeHttp.httpRequest({ http, logger }, options)
            .then((result) => {
                // a hack for login problem
                const { errorData, errorType } = result.apiErrors.apiError;
                if (errorType !== 'Unauthorized'){
                    //TODO add JWT Token
                    response = {
                        code: 'success',
                        message: 'Login successful.'
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