require('dotenv').config();
const env = process.env;

module.exports = {
  data: {
    appName: env.APP_NAME
  },
  server: {
    port: env.APP_PORT
  },
  http: {
    hostname: env.SERVER_HOSTNAME,
    port: env.SERVER_PORT  // set 8445 as https port
  },
  odbcConfig: {
    dsn: env.ODBC_DSN,
    odbcConnectionTimeout: env.ODBC_CONNECTION_TIMEOUT,
    loginTimeout: env.ODBC_LOGIN_TIMEOUT
  }
};