const armorMaker = require('./makeCombinations');
return new Promise(function (resolve, reject) {
    return armorMaker('weaknessExploit');
})
    .then(function (armorList) {
        console.log(armorList);
    })