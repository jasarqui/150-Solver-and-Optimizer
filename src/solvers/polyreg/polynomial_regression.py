import numpy as np

# get the helper function needed
import sys
sys.path.append('./../helper')
from gauss_jordan import *

# sample data
# dependent = np.array([50,50,50,70,70,70,80,80,80,90,90,90,100,100,100])
# independent = np.array([3.3,2.8,2.9,2.3,2.6,2.1,2.5,2.9,2.4,3.0,3.1,2.8,3.3,3.5,3.0])
# speed = np.array([4,4,7,7,8,9,10,10,10,11,11,12,12,12,12,13,13,13,13,14,14,14,14,15,15,15,16,16,17,17,17,18,18,18,18,19,19,19,20,20,20,20,20,22,23,24,24,24,24,25])
# dist = np.array([2,10,4,22,16,10,18,26,34,17,28,14,20,24,28,26,34,34,46,26,36,60,80,20,26,54,32,40,32,40,50,42,56,76,84,36,46,68,32,48,52,56,64,66,54,70,92,93,120,85])

# this gets the trend of the given data points and returns a function
def PolynomialRegression(x, y, degree):
  if (degree >= 1): # degree should be at least 1
    # storage arrays
    coeff = np.array([])
    RHS = np.array([])
    system = np.array([])

    # get the possible values for the matrix
    for i in range(0, (2 * degree + 1)): coeff = np.append(coeff, np.sum(x ** i))
    for i in range(0, (degree + 2)): RHS = np.append(RHS, (np.sum(x ** i * y)))

    # create matrix for gauss jordan
    for i in range(0, degree + 1):
      # temporary storage for an equation array
      equation = np.array([])

      # insert value into an equation
      for j in range(0, degree + 2):
        if (j == degree + 1): equation = np.append(equation, RHS[i])
        else: equation = np.append(equation, coeff[j + i])

      # insert equation array to matrix
      if (i == 0): system = equation
      else: system = np.vstack((system, equation))

    # solve for the unknowns
    return GaussJordan(system)
  else: return None

# print(PolynomialRegression(speed, dist, 1))