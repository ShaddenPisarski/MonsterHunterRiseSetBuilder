/**
 * Main route handling
 * @param {Express} app
 * @param {FileList} fs
 */
module.exports = function routes(app, db) {
    const MongoClient = require('mongodb').MongoClient;
    const connectToDB = require('./../helper/connectToDb');
    const find = require('./../helper/mongoFind');
    const aggregate = require('./../helper/mongoAggregate');
    const skillList = require('./../helper/allowedSkills')();
    // Handle default routing for empty routes
    // These sites must work without javascript
    const appRouter = function appRouter(app) {
        app.get('/', function defaultRoute(request, response) {
            response.send(null);
        });

        app.get('/help', function defaultRoute(request, response) {
            let possibilities = '<html><head>Help</head><body>'
            let helpString = '';

            for(let skill of skillList) {
                helpString += '<a href="http://81.30.158.74:3001/getData?skill=' + skill + '">' + skill + '</a><br/>'
            }

            let endHtml = '</body></html>';
            const result = possibilities + helpString + endHtml;

            response.send(result);
        });

        app.get('/getData', function getDataRoute(request, response) {
            console.time('Aggregate')

            const url = '';
            const client = new MongoClient(url, {useUnifiedTopology: true});


            let skills = request.query.skill;

            if (!Array.isArray(skills)) {
                skills = [skills];
            }

            if(skillList.indexOf(skills[0]) === -1) {
                skills = false;
            }

            if (skills) {
                const whereSkill = 'skills.' + skills[0];
                connectToDB(client)
                    .then(function (_db) {
                        // return find(client, _db, 'combinations', {[whereSkill]: {$exists: true}}, {limit: 5000})
                        return aggregate(client, _db, 'combinations', [{$match: {[whereSkill]: {$exists: true}}}, {$limit: 5000}])
                    })
                    .then(function (armorList) {
                        console.timeEnd('Aggregate')
                        return response.send(armorList);
                    })
                    .catch(function (err) {
                        console.log('err1', err)
                    })
            } else {
                response.send(null);
            }
        });
    };

    appRouter(app, db);
};
