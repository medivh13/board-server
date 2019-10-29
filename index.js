const HttpConnector = require('./connectors/HttpConnector');
const OdbcConnector = require('./connectors/OdbcConnector');

const odbcConnector = new OdbcConnector();

const startServer = async () => {
    let odbc;
    let opts;

    try {
        odbc = await odbcConnector.connectToDatabase();
    }
    catch (err){
        console.log("Failed to connect to ODBC, starting offline mode...");
    }

    opts = { odbc };
    const httpConnector = new HttpConnector(opts);

    try {
        await httpConnector.start();
        return {
            odbc: opts.odbc
        };
    }
    catch(err){
        throw err;
    }
};

startServer();

// startServer().then((res) => {
// 	try {
// 		res.odbc.query('SELECT * FROM AgentConnectionDetail', (error, result) => {
// 			if (error) {
// 				console.error(error)
// 			}
// 			else {
// 				console.log(result);
// 			}
// 		});
// 	}
// 	catch(err){
// 		console.log(err.message);
// 	}
// });


