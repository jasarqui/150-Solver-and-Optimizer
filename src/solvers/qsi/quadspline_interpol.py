import numpy as np

# get the helper function needed
import sys
sys.path.append('./../helper')
from gauss_jordan import *

# sample data
# x = np.array([1.6, 2, 2.5])
# y = np.array([2, 8, 14])
# x = np.array([3, 4.5, 7, 9])
# y = np.array([2.5, 1, 2.5, 0.5])

def QuadSplineInterpol(x, y):
    if x.shape[0] > 2:
        data_pts = x.shape[0] # n + 1 data points
        intervals = data_pts - 1 # n intervals

        # create unknown matrix
        matrix = np.array([])

        # condition 1
        for i in range(0, data_pts):
            # get only interior data points
            if i > 0 and i < intervals:
                values = np.array([x[i] ** 2, x[i], 1]) # values vector
                
                # get the equations
                equation_prio = np.append(np.append(np.append(np.zeros(3 * (i - 1)), values), np.zeros(3 * (intervals - i))), y[i]) # i - 1
                equation_post = np.append(np.append(np.append(np.zeros(3 * i), values), np.zeros(3 * (intervals - i - 1))), y[i]) # i
                equations = np.vstack((equation_prio, equation_post))

                # add equations to matrix
                if matrix.shape[0] == 0: matrix = equations
                else: matrix = np.vstack((matrix, equations))

        # condition 2
        # get the values at exterior points
        values_prio = np.array([x[0] ** 2, x[0], 1])
        values_post = np.array([x[intervals] ** 2, x[intervals], 1])
        # get the equations
        equation_prio = np.append(np.append(np.array(values_prio), np.zeros(3 * (intervals - 1))), y[0])
        equation_post = np.append(np.append(np.array(np.zeros(3 * (intervals - 1))), values_post), y[intervals])
        equations = np.vstack((equation_prio, equation_post))
        # add equations to matrix
        matrix = np.vstack((matrix, equations))

        # condition 3
        for i in range(0, data_pts):
            # get only interior data points
            if i > 0 and i < intervals:
                values = np.array([2 * x[i], 1, 0])
                equation = np.append(np.append(np.append(np.zeros(3 * (i - 1)), values), values * -1), np.zeros(3 * (intervals - i - 1) + 1))

                # add equation to matrix
                matrix = np.vstack((matrix, equation))

        # condition 4
        equation = np.append(1, np.zeros(intervals * 3)) # a1 = 0
        matrix = np.vstack((matrix, equation))

        # since a1 is 0, ignore first column and last row
        matrix = np.delete(matrix, 0, 1)
        matrix = np.delete(matrix, 3 * intervals - 1, 0)

        # solve for the coefficients
        coefficients = GaussJordan(matrix)
        return np.append(0, coefficients)
    else: return None

# print(QuadSplineInterpol(x,y))