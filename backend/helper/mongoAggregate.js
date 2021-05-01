module.exports = function mongoAggregate(client, db, collectionName, pipeLineArray) {
    return new Promise(function (resolve, reject) {
        const collection = db.collection(collectionName);

        var cursor = collection.aggregate(pipeLineArray);
        const results = [];

        cursor.on('data', function (chunk) {
            results.push(chunk);
        });

        cursor.on('end', function () {
            resolve(results);
        });


        // collection.aggregate(pipeLineArray, function (err, results) {
        //     console.log('aggregate err', err);
        //     console.log('aggregate results', results);
        //     if (err) {
        //         client.close();
        //         console.log('aggregateError', err);
        //         reject(err);
        //     }
        //
        //     resolve(results)
        // });
    });
}