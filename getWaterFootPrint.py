import json

from fuzzywuzzy import fuzz

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
        ing = getIngreInfo(ingre, 'GlobalAvgWaterFootPrintForPrimaryCrop.json')
        twf+= ing[1][3]
        greywf+= ing[1][2]
        gwf+= ing[1][1]
        bwf+= ing[1][0]
    
    return [bwf, gwf, greywf, twf]


# look for the specific ingredient in the json
def getIngreInfo(ingredient, file):
    
    with open(file) as f:
        data = json.load(f)

    best = 30;

    ing = [];

# go through the data
    for x in data:
        a = fuzz.ratio(x[0], ingredient)
        if a > best:
            best = a
            ing = x
# return the total for the best match
    print(ing)
    return ing;



getIngreInfo("wheat",'GlobalAvgWaterFootPrintForPrimaryCrop.json')



    


