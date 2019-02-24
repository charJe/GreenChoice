import json

from flask import Flask

app = Flask(__name__)
picture=None

@app.route('/')
def new():
        print('hello')

        return "success"


@app.route('/postPicture', methods=['POST'])
def getPicture():
        global picture;
        if request.method=="POST":
                picture=request.data

        return "success"