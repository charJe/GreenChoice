import json
from pprint import pprint

# returnt he blue, green, grey, and total water footfrint of all the ingredients
def waterFootPrint(ingredients):
    
    # total water footfrint
    #  green water footfrint
    #  blue water footfrint
    #  grey water footfrint
    twf = 0
    gwf = 0
    bwf = 0
    greywf = 0

    # add up the water footprint of all the ingredients

    for ingre in ingredients:
        ing = getIngreInfo(ingre)
        twf+= ing[3]
        greywf+= ing[2]
        gwf+= ing[1]
        bwf+= ing[0]
    
    return [bwf, gwf, greywf, twf]


# look for the specific ingredient in the json
def getIngreInfo(ingredient):
    
    with open('GlobalAvgWaterFootPrintForPrimaryCrop.json') as f:
        data = json.load(f)

    
    print (data[0][""]);

    return 0;

getIngreInfo("d")



    


