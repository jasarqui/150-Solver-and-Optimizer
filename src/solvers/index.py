# setup flask
from flask import Flask, jsonify
from cors import *
app = Flask(__name__)

# Adding '@crossdomain(origin='*')' will let us enable CORS per route
@app.route("/solve/<string:num>/")
@crossdomain(origin='*')
def hello(num):
    return jsonify(returnthis = num)

# so that our app will only run when called
if __name__ == "__main__":
    app.run()