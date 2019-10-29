const queryResult = async (odbc, query) => {
    return new Promise((resolve,reject) => {
        odbc.query(query, (error, result) => {
            if (error) {
                console.error(error);
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    }).catch((err) => {
        console.log(err.message);
    });
};

module.exports = {
    queryResult
};