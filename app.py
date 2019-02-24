from flask import Flask,request
import json

from flask import Flask,request

app = Flask(__name__)
picture=None

@app.route('/')
def new():
        print('POST: /postPicture/ , GET: /getInfo/')

        return "success"


@app.route('/postPicture/', methods=['POST'])
def getPicture():
        global picture;
        if request.method=="POST":
                picture=request.data
                #print(picture)
                #OCR(picture)

        return "success"

@app.route('/getInfo/' , methods=['GET'])
def sendInfo():
	return '{"ingredients" : [{"ingredient" : "flour", "type" : "vegan"},{"ingredient" : "eggs", "type" : "vegetarian"},{"ingredient" : "fruit", "type" : "vegan"}],"overallType" : "vegetarian"}';

        return "success"
