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
    });
}