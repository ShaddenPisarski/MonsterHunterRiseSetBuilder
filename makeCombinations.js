const Bluebird = require('bluebird');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
// Connection URL
const url = 'mongodb://isengartAdmin:5x8JpSSP3vWRq2CEg#Jpann@localhost:27017/isengart';

// Database Name
const dbName = 'isengart';
const client = new MongoClient(url, {useUnifiedTopology: true});

function addSkills(skillsObject, newSkillsObject) {
    for (const skill of Object.keys(newSkillsObject)) {
        skillsObject[skill] = skillsObject[skill]
            ? skillsObject[skill] + newSkillsObject[skill]
            : newSkillsObject[skill];
    }
    return skillsObject;
}

function calculateSkills(options) {
    let skillsObject = {};
    skillsObject = addSkills(skillsObject, options.head);
    skillsObject = addSkills(skillsObject, options.body);
    skillsObject = addSkills(skillsObject, options.arms);
    skillsObject = addSkills(skillsObject, options.waist);
    skillsObject = addSkills(skillsObject, options.legs);
    return skillsObject;
}

function makeArmorSet(singleHead, singleBody, singleArms, singleWaist, singleLegs) {
    return {
        head: singleHead.name,
        body: singleBody.name,
        arms: singleArms.name,
        waist: singleWaist.name,
        legs: singleLegs.name,
        defense: singleHead.defense
            + singleBody.defense
            + singleArms.defense
            + singleWaist.defense
            + singleLegs.defense,
        slots: {
            level1: singleHead.slots.level1
                + singleBody.slots.level1
                + singleArms.slots.level1
                + singleWaist.slots.level1
                + singleLegs.slots.level1,
            level2: singleHead.slots.level2
                + singleBody.slots.level2
                + singleArms.slots.level2
                + singleWaist.slots.level2
                + singleLegs.slots.level2,
            level3: singleHead.slots.level3
                + singleBody.slots.level3
                + singleArms.slots.level3
                + singleWaist.slots.level3
                + singleLegs.slots.level3
        },
        fireResistance: singleHead.fireResistance
            + singleBody.fireResistance
            + singleArms.fireResistance
            + singleWaist.fireResistance
            + singleLegs.fireResistance,
        waterResistance: singleHead.waterResistance
            + singleBody.waterResistance
            + singleArms.waterResistance
            + singleWaist.waterResistance
            + singleLegs.waterResistance,
        thunderResistance: singleHead.thunderResistance
            + singleBody.thunderResistance
            + singleArms.thunderResistance
            + singleWaist.thunderResistance
            + singleLegs.thunderResistance,
        iceResistance: singleHead.iceResistance
            + singleBody.iceResistance
            + singleArms.iceResistance
            + singleWaist.iceResistance
            + singleLegs.iceResistance,
        dragonResistance: singleHead.dragonResistance
            + singleBody.dragonResistance
            + singleArms.dragonResistance
            + singleWaist.dragonResistance
            + singleLegs.dragonResistance,
        skills: calculateSkills({
            head: singleHead.skills,
            body: singleBody.skills,
            arms: singleArms.skills,
            waist: singleWaist.skills,
            legs: singleLegs.skills,
        })
    }
}

function connectToDB() {
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
}

function find(db, collectionName, whereQuery, queryOptions) {
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

function insert(db, collectionName, document) {
    return new Promise(function (resolve, reject) {
        const collection = db.collection(collectionName);

        collection.insert(document, function (err, result) {
            if (err) {
                reject(err);
            }
            resolve(result)
        })
    });
}

let bulk;
let headArmor = JSON.parse(fs.readFileSync('./backend/data/head.json'));
let bodyArmor = JSON.parse(fs.readFileSync('./backend/data/body.json'));
let armsArmor = JSON.parse(fs.readFileSync('./backend/data/arms.json'));
let waistArmor = JSON.parse(fs.readFileSync('./backend/data/waist.json'));
let legsArmor = JSON.parse(fs.readFileSync('./backend/data/legs.json'));
let db;

return Bluebird.resolve(true)
    /**
    .then(function () {
        let headArmor = JSON.parse(fs.readFileSync('./backend/data/head.json'));
        let bodyArmor = JSON.parse(fs.readFileSync('./backend/data/head.json'));
        let armsArmor = JSON.parse(fs.readFileSync('./backend/data/head.json'));
        let waistArmor = JSON.parse(fs.readFileSync('./backend/data/head.json'));
        let legsArmor = JSON.parse(fs.readFileSync('./backend/data/head.json'));
    })
     **/
    .then(function () {
        return connectToDB()
            .then(function (_db) {
                db = _db;
                return Bluebird.resolve(headArmor)
                    .each(function loopHeadArmor(singleHead) {
                        return Bluebird.resolve(bodyArmor)
                            .each(function loopBodyArmor(singleBody) {
                                bulk = db.collection('combinations').initializeUnorderedBulkOp();
                                const armorArr = [];
                                console.log('making armor')
                                return Bluebird.resolve(armsArmor)
                                    .each(function loopArmsArmor(singleArms) {
                                        return Bluebird.resolve(waistArmor)
                                            .each(function loopWaistArmor(singleWaist) {
                                                return Bluebird.resolve(legsArmor)
                                                    .each(function loopLegsArmor(singleLegs) {
                                                        const armorSet = makeArmorSet(singleHead, singleBody, singleArms, singleWaist, singleLegs);
                                                        bulk.insert(armorSet);
                                                        return true;
                                                        //return insert(db,'combinations', armorSet);
                                                    });
                                            })
                                    })
                                    .then(function () {
                                        console.log('bulk.execute()');
                                        return bulk.execute();
                                    })
                                    .catch(function (err) {
                                        console.log('err', err);
                                    });
                            })
                    })
            })
            .then(function () {
                //bulk.execute();
                return true;
            })
            .then(function () {
                client.close();
                return true;
            })
            .then(function () {
                console.log('fertsch!!!!!!!')
                console.log('fertsch!!!!!!!')
                console.log('fertsch!!!!!!!')
                console.log('fertsch!!!!!!!')
                console.log('fertsch!!!!!!!')
                console.log('fertsch!!!!!!!')
                console.log('fertsch!!!!!!!')
                console.log('fertsch!!!!!!!')
                Bluebird.resolve(true)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .delay(100000000000000)
                    .then(function () {
                        console.log('delay ended');
                    })
            })
            .catch(function (err) {
                console.log('error', err)
                client.close();
            });
    });


    //:3001/getData?skill=agitator
    //db.combinations.find({'skills.weaknessExploit': {$lte: 3}})
    //db.combinations.createIndexes([{"skills.agitator": -1},{"skills.ammoUp": -1},{"skills.artillery": -1},{"skills.attackBoost": -1},{"skills.blastAttack": -1},{"skills.bludgeoner": -1},{"skills.constitution": -1},{"skills.counterstrike": -1},{"skills.criticalBoost": -1},{"skills.criticalDraw": -1},{"skills.criticalElement": -1},{"skills.criticalEye": -1},{"skills.defenseBoost": -1},{"skills.divineBlessing": -1},{"skills.dragonAttack": -1},{"skills.earplugs": -1},{"skills.evadeExtender": -1},{"skills.evadeWindow": -1},{"skills.fireAttack": -1},{"skills.flinchFree": -1},{"skills.focus": -1},{"skills.freeMeal": -1},{"skills.guard": -1},{"skills.guardUp": -1},{"skills.handicraft": -1},{"skills.heroics": -1},{"skills.iceAttack": -1},{"skills.itemProlongr": -1},{"skills.latentPower": -1},{"skills.marathonRunner": -1},{"skills.maximumMight": -1},{"skills.mindsEye": -1},{"skills.normalRapidUp": -1},{"skills.offensiveGuard": -1},{"skills.paralysisAttack": -1},{"skills.peakPerformance": -1},{"skills.pierceUp": -1},{"skills.poisonAttack": -1},{"skills.powerProlonger": -1},{"skills.protectivePolish": -1},{"skills.punishingDraw": -1},{"skills.quickSheath": -1},{"skills.rapidFireUp": -1},{"skills.rapidMorph": -1},{"skills.razorSharp": -1},{"skills.recoverySpeed": -1},{"skills.recoveryUp": -1},{"skills.reloadSpeed": -1},{"skills.resentment": -1},{"skills.resuscitate": -1},{"skills.sleepAttack": -1},{"skills.slugger": -1},{"skills.spareShot": -1},{"skills.speedEating": -1},{"skills.spreadUp": -1},{"skills.staminaSurge": -1},{"skills.staminaThief": -1},{"skills.thunderAttack": -1},{"skills.waterAttack": -1},{"skills.weaknessExploit": -1},{"skills.wideRange": -1},{"skills.windproof": -1},{"skills.wirebugWhisperer": -1}], {sparse: true});