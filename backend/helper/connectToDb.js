module.exports = function connectToDB(client) {
    const dbName = 'isengart';
    return new Promise(function (resolve, reject) {
        client.connect(function (err) {
            if (err) {
                reject(err);
                client.close();
            }
            const db = client.db(dbName);
            console.log('Connected successfully to server');
            resolve(db);
        });
    });
};