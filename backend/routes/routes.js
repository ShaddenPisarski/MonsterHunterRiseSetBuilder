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
        //TODO: Add page for request-maker

        app.get('/', function defaultRoute(request, response) {
            response.send(null);
        });

        app.get('/help', function defaultRoute(request, response) {
            let possibilities = '<html><head>Help</head><body>'
            let helpString = '';

            for (let skill of skillList) {
                helpString += '<a href="http://81.30.158.74:3001/getData?skill=' + skill + '">' + skill + '</a><br/>'
            }

            let endHtml = '</body></html>';
            const result = possibilities + helpString + endHtml;

            response.send(result);
        });

        app.get('/getData', function getDataRoute(request, response) {
            const url = '';
            const client = new MongoClient(url, {useUnifiedTopology: true});


            let skills = request.query.skill;

            if (!Array.isArray(skills)) {
                skills = [skills];
            }

            if (skillList.indexOf(skills[0]) === -1) {
                skills = false;
            }

            if (skills) {
                // Select only the first skill, because we can filter later
                const whereSkill = 'skills.' + skills[0];
                connectToDB(client)
                    .then(function (_db) {
                        // return find(client, _db, 'combinations', {[whereSkill]: {$exists: true}}, {limit: 5000})
                        return aggregate(client, _db, 'combinations', [{$match: {[whereSkill]: {$exists: true}}}, {$limit: 5000}])
                    })
                    .then(function (armorList) {

                        // Filter only of necessary
                        if (skills.length > 1 && skills.length < 25) {
                            armorList = armorList.filter(function filterSkills(element, index, array) {
                                let objectKeys = Object.keys(element.skills);

                                // If all skills selected aren't present in this loadout - remove it
                                for (let singleSkill of skills) {
                                    // TODO Filter if skill has more points than needed
                                    if (objectKeys.indexOf(singleSkill) === -1) {
                                        return false;
                                    }
                                }

                                return true;
                            });
                        }

                        // TODO: Sort after the first three parameters
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
