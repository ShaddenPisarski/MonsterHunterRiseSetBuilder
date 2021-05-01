module.exports = function mongoFind(client, db, collectionName, whereQuery, queryOptions) {
    return new Promise(function (resolve, reject) {
        const collection = db.collection(collectionName);
        collection.find(whereQuery, queryOptions)
            .toArray()
            .then(function (docs) {
                resolve(docs)
            })
            .catch(function (err) {
                client.close();
                console.log('errFind', err)
            });
    });
}