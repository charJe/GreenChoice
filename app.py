import json
from process import *
from getWaterFootPrint import *

from flask import Flask,request

app = Flask(__name__)
picture=None

@app.route('/')
def new():
        print('hello')

        return "success"


@app.route('/postPicture/', methods=['POST'])
def getPicture():
        global picture;
        if request.method=="POST":
                picture=request.data
                #print(picture)
                OCR(picture)

        return "success"