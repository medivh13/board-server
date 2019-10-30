const bunyan = require('bunyan');

const createLogger = (appName) => {
    return bunyan.createLogger({
        name: appName,
        streams: [
            {
                level: 'debug',
                stream: process.stdout
            },
            {
                level: 'error',
                path: __dirname + `/../logs/${appName}-error.log` // log ERROR and above to a file
            }
        ]
    });
};

module.exports = createLogger;