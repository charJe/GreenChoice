#returns the required values
#@author: Mohit Bhole
import json

from fuzzywuzzy import fuzz

ingredientJSON = []
waterJSON = []
restrictionsJSON = []
finalJSON = []

def calculateEverything(ingredients):
    ingredientJSON = loadIngredientsJSON(ingredients)
    waterJSON = loadWaterJSON()
    with open('./DietaryRestrictions.json') as json_file:  
        restrictionsJSON = json.load(json_file)
    finJSON = setIngreInfo(ingredientJSON,waterJSON,restrictionsJSON)
    finalJSON = loadIngredientsXJSON(finJSON)
    return(finalJSON)

def setIngreInfo(ingredientJSON,waterJSON,restrictionsJSON):
    finalJSON = []
    type = "NONVEGETARIAN"
    totalWater = 0

    for ingredientx in ingredientJSON:
        type = "NONVEGETARIAN"
        totalWater = 0
        for databaseIngredient in restrictionsJSON["List"]:
            # print(ingredientx["ingredient"].upper()+" ")
            # print(databaseIngredient["ingredient"].upper()+" ")
            if (ingredientx["ingredient"].upper()) == (databaseIngredient["ingredient"].upper()):
                type = databaseIngredient["type"]
        for databaseWaterElement in waterJSON:
            
            if (ingredientx["ingredient"].upper()) == (databaseWaterElement["name"].upper()):
                totalWater = totalWater + int((databaseWaterElement["parsedValues"])[3])
        finalJSON.append({"ingredient": ingredientx["ingredient"], "type": type, "water": totalWater})
    return(finalJSON)

def loadIngredientsJSON(ingr):
    
    zee = []
    for x in ingr:
        zee.append({"ingredient": x})

    return zee

def loadIngredientsXJSON(ingr):
    
    zee = ""
    zee.append({"ingredients": ingr})

    return zee

def loadWaterJSON():
    #  total water footfrint
    #  green water footfrint
    #  blue water footfrint
    #  grey water footfrint
    parsedData = []
    with open('./GlobalAvgWaterFootPrintForPrimaryCrop.json') as json_file:  
        data = json.load(json_file)

    for element in data["List"]:
        # print(element["name"])                                          #this is how you reference each element
        parsedData.append({ "name": element["name"], "parsedValues" : element["values"].split(",")})
        # add up the water footprint of all the ingredients

    
    return parsedData