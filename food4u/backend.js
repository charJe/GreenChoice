var waterJSON = require('./GlobalAvgWaterFootPrintForPrimaryCrop.json');
var restrictionJSON = require('./DietaryRestrictions.json');

module.exports = {
calculateEverything: function (ingredients){
    var finalJSON = '{ "List" : ['
    let totalWater = 0
    let overallType = "NONVEGETARIAN"

    for(var i in ingredients){
        let type = "NONVEGETARIAN"
        let water = 0

        for(var j in restrictionJSON){
            if(((restrictionJSON[j].ingredient)) == ((ingredients[i]).toUpperCase())){
                type = (restrictionJSON[j].type).toUpperCase()
                break;
            }
        }
        for(var j in waterJSON){
            if(((waterJSON[j].name)) == ((ingredients[i]).toUpperCase())){
                water = parseInt(((waterJSON[j].values).split(','))[3]);
                totalWater = totalWater + water;
                break;
            }
        }

        finalJSON = finalJSON.concat('{"ingredient": "'+(ingredients[i]).toUpperCase()+'", "data": [{"type": "'+type+'", "water": "'+water+'"}]},')
    }
    finalJSON = finalJSON.slice(0, -1);
    finalJSON = finalJSON.concat('], "overallType": "'+overallType+'", "totalWater": "'+totalWater+'" }')

    return(finalJSON)
}
}