module.exports = {
  data: {
    appName: 'fiboard-server'
  },
  server: {
    port: 3001
  },
  http: {
    hostname: 'cucx01.altros.co.id',
    port: '8082'  // set 8445 as https port
  },
  odbcConfig: {
    dsn: 'Fiture_UCCX_32_2',
    odbcConnectionTimeout: 15,
    loginTimeout: 15
  }
};