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
        ing = getIngreInfo(ingre, 'GlobalAvgWaterFootPrintForPrimaryCrop.json',30)
        twf+= ing[1][3]
        greywf+= ing[1][2]
        gwf+= ing[1][1]
        bwf+= ing[1][0]
    
    return [bwf, gwf, greywf, twf]


# look for the specific ingredient in the json
def getIngreInfo(ingredient, file,best):
    
    with open(file) as f:
        data = json.load(f)

    

    ing = []

# go through the data
    for x in data:
        a = fuzz.ratio(x[0], ingredient)
        if a > best:
            best = a
            ing = x
# return the total for the best match
    return ing 

#get diatary restriction
def getRes(ingredients):
    final = list() 

    for x in ingredients:
        ing = getIngreInfo(x,'DietaryRestrictions.json', 100) 

        if ing == []:
            final.append((x,2))
            return final
        # none of the above
        rr = 2 

        if ing[1][0] == "Vegan":
            rr = 0
        if ing[1][0] == "Vegetarian":
            rr = 1
        final.append([x,rr]) 

    
    return final 

def whatIs(ing):
    i = 0 
    for x in ing:
        i = max(i,x[1])
    if i == 0:
        return "Vegan"
    if i == 1:
        return "Vegetarian"
    return "none"



print(whatIs(getRes(["vitamin d2"])))
#getIngreInfo("wheat",'GlobalAvgWaterFootPrintForPrimaryCrop.json')



    


