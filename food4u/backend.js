var waterJSON = require('./GlobalAvgWaterFootPrintForPrimaryCrop.json');
var restrictionJSON = require('./DietaryRestrictions.json');

module.exports = {
calculateEverything: function (ingredients){
    //var finalJSON = '{ "List" : ['
    var finalJSON = {
        List: [],
        overallType: "",
        totalWater: ""
    }
    let totalWater = 0
    let overallType = "NONVEGETARIAN"

    for(var i in ingredients){
        let typeX = "NONVEGETARIAN"
        let waterX = 0

        for(var j in restrictionJSON){
            if(((restrictionJSON[j].ingredient)) == ((ingredients[i]).toUpperCase())){
                typeX = (restrictionJSON[j].type).toUpperCase()
                break;
            }
        }
        for(var j in waterJSON){
            if(((waterJSON[j].name)) == ((ingredients[i]).toUpperCase())){
                waterX = parseInt(((waterJSON[j].values).split(','))[3]);
                totalWater = totalWater + waterX;
                break;
            }
        }

        //finalJSON = finalJSON + '{"ingredient": "'+(ingredients[i]).toUpperCase()+'", "data": [{"type": "'+type+'", "water": "'+water+'"}]},';
        let tempObj = {
            ingredient: (ingredients[i]).toUpperCase(),
            data: [
                {
                    type: typeX,
                    water: waterX
                }
            ]
        }
        finalJSON.List.push(tempObj)
    }
    //finalJSON = finalJSON.slice(0, -1);
    //finalJSON = finalJSON + '], "overallType": "'+overallType+'", "totalWater": "'+totalWater+'" }'
    finalJSON.overallType = overallType;
    finalJSON.totalWater = totalWater;
    console.log(finalJSON)
    return(JSON.parse(JSON.stringify(finalJSON)))
}
}