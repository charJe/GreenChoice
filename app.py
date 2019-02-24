#@author: Mohit Bhole
from flask import Flask,request
from process import OCR
from getWaterFootPrint import calculateEverything
import json
from flask import Flask,request

app = Flask(__name__)
picture=None
information=None

@app.route('/')
def new():
        print('POST: /postPicture/ , GET: /getInfo/')

        return "success"


@app.route('/postPicture/', methods=['POST'])
def getPicture():
        global picture
        if request.method=="POST":
                picture=request.data
                #print(picture)
                information = calculateEverything(OCR(picture))

        return "success"

@app.route('/getInfo/' , methods=['GET'])
def sendInfo():
	return information