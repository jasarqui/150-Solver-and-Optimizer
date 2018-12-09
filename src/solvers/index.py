# setup flask
from flask import Flask, jsonify
from cors import *
app = Flask(__name__)

import numpy as np

# get the solvers
import sys
sys.path.append('./src/solvers/main')
from polynomial_regression import *
from quadspline_interpol import *
from min_simplex import *

# Adding '@crossdomain(origin='*')' will let us enable CORS per route
@app.route("/solve/pr/<string:contents>&<int:degree>/")
@crossdomain(origin='*')
def poly_reg(contents, degree):
    contents = np.fromstring(contents, dtype = float, sep = ',').reshape(-1,2)
    return jsonify(result = PolynomialRegression(contents[:,0], contents[:,1], degree).tolist())

@app.route("/solve/qsi/<string:contents>/")
@crossdomain(origin='*')
def quad_spline(contents):
    contents = np.fromstring(contents, dtype = float, sep = ',').reshape(-1,2)
    return jsonify(result = QuadSplineInterpol(contents[:,0], contents[:,1]).tolist())

@app.route("/solve/simplex/<string:tableau>/")
@crossdomain(origin='*')
def simplex(tableau):
    tableau = np.fromstring(tableau, dtype = float, sep = ',').reshape(-1,16)
    tableau[3:9] = tableau[3:9] * -1
    return jsonify(result = MinSimplex(tableau))

@app.route("/eval/pr/<string:function>&<string:x>/")
@crossdomain(origin='*')
def eval_pr(function, x):
    function = np.fromstring(function, dtype = float, sep = ',')
    return jsonify(result = EvaluatePR(function, float(x)).tolist())

@app.route("/eval/qsi/<string:functions>&<string:data>&<string:x>/")
@crossdomain(origin='*')
def eval_qsi(functions, data, x):
    functions = np.fromstring(functions, dtype = float, sep = ',').reshape(-1,3)
    intervals = np.fromstring(data, dtype = float, sep = ',').reshape(-1,2)
    return jsonify(result = EvaluateQSI(functions, intervals[:,0], float(x)).tolist())

# so that our app will only run when called
if __name__ == "__main__":
    app.run()