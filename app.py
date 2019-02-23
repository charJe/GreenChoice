import json

from flask import Flask

app = Flask(__name__)


@app.route('/new', methods=['GET'])
def new():
    if request.method == "GET":
        img = request.data.img;
        
        return "success"