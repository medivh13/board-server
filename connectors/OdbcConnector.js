const odbc = require('odbc');
const {
  odbcConfig: {
    dsn,
    connectionTimeout,
    loginTimeout
  }
} = require('../env');

class OdbcConnector {
    constructor(){
        console.log("Initiating ODBC Connection... ");
    }

    async connectToDatabase() {
        // or using a configuration object
        const connectionConfig = {
            connectionString: 'DSN=' + dsn,
            connectionTimeout: connectionTimeout,
            loginTimeout: loginTimeout
        };

		try {
			const res = await odbc.connect(connectionConfig);
			if (res){
				console.log("Successfully connected to ODBC server.");
			}
			return res;
		}
		catch(err){
			throw err;
		}
    }
}


module.exports = OdbcConnector;