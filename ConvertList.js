// Charles Jackson 
"use strict";

let ingredients = "NGREDIENIS: WATER, SUGAR, CORNSYRUP MILK PROTEIN CONCENTRATE, VEGETABLE OIL (CANOLA, HIGH OLEIC SUNFLOWER, CORN), COCOA PROCESSED WITH ALKALI, SOY PROTEIN ISOLATE, AND USES THAN 55% OF POTASSIUM CITRATE, MAGNESIUM PHOSPHATE, POTASSIUM CHLORIDE, CELLULOSE GEL AND GUM, SALT, CALCIUM PHOSPHATE CALCIUM CARBONATE, SODIUM ASCORBATE, SOY LECITHIN, CHOLINE BITARIRATE, ALPHA TOCOPHERYL ACETATE, ASCORBIC ACID, CARRAGEENAN, FERRIC PYROPHOSPHATE, NATURAL AND ARTIFICIAL FLAVOR, ZINC SULFATE, VITAMINAPAIMITATE,NIACINAMIDE,VITAMINDa,CALCIUM PANTOTHENATE, MANGANESE SULFATE, COPPER SULFATE, PYRIDOXINE HYDROCHLORIDE, THIAMINE HYDROCHLORIDE, BETA CAROTENE, RIBOFLAVIN, CHROMIUM CHLORIDE, FOLIC ACID, BIOTIN, POTASSIUM IODIDE, VITAMIN Ki, SODIUM SELENITE, SODIUM MOLYBDATE, VITAMIN 6.12.";
console.log(parseIngredients(ingredients));
//pass in what you get from the OCR
function parseIngredients(text){
    let list = text.split(new  RegExp(/: |, |;/) );
    let oilMode = false;
    for(let i=0; i < list.length; i++){
	// get rid of AKA and specifications
	if( (list[i]).includes("(") && (list[i]).includes(")") ){
	    list[i] = list[i].substr(0,list[i].indexOf("("));
	}else
	// break up a list of sub ingredients
	if(list[i].includes("(")){
	    let biggerIngre = list[i].split("\(");
	    if(biggerIngre[0].includes("OIL")){ // this is a list of oils
		oilMode = true;
		list[i] = biggerIngre[1] += " OIL";
	    }else{		// this is a sub list but not of oil
		list[i] = biggerIngre[1];
	    }
	}else if(list[i].includes(")")){ // the end of a list of ingredients
	    list[i] = list[i].substring(0,list[i].length-1); // remove the )
	    if(oilMode){
		list[i] += " OIL";
	    }
	    oilMode = false;
	}
	// fix the problem caused by new lines and spaces in the middle of ingredients
	if(list[i].includes("\r\n") || list[i].includes("\n")){
	    list[i] = list[i].replace(" ","");
	    list[i] = list[i].replace("\r\n", " ");
	    list[i] = list[i].replace("\n"," ");
	}
	if(oilMode){
	    list[i] += " OIL";
	}
    }
    return list;
}
