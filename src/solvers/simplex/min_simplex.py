import numpy as np

# get the helper function needed
import sys
sys.path.append('./../helper')
from setup_tableau import *
from mod_gauss_jordan import *

np.set_printoptions(linewidth=np.inf)

# sample data
data = np.array([[7,11,77],[10,8,80],[1,0,9],[0,1,6],[150,175,0]])

# this gets the minimum values for problem optimization
def MinSimplex(tableau):
    tableau = np.transpose(tableau)

    # set up the tableau
    tableau = SetupTableau(tableau)

    # setup variables
    constraints = tableau.shape[0] - 1 # bound to exclude the objective function 
    num_variables = tableau.shape[1] - 1 # bound to exclude the solution and test ratio
    solution = tableau.shape[1] - 2 # the solution column index
    test_ratio = tableau.shape[1] - 1 # ths test_ratio column index

    iterations = 0
    # while there is a negative in the objective function
    while np.any(tableau[tableau.shape[0] - 1, :] < 0):
        # get the greatest magnitude in the objective function
        
        obj_fxn = np.array(tableau[tableau.shape[0] - 1, :]) # get the objective fxn
        obj_fxn[obj_fxn >= 0] = np.inf # filter out all 0 and positive numbers
        pivot_column = obj_fxn.argmin(axis = 0) # get the smallest negative (largest magnitude)
        # test ratio values are solutions divided by pivot column
        solution_col = tableau[0:constraints, solution]
        pivot_col = tableau[0:constraints, pivot_column]
        tableau[0:constraints, test_ratio] = np.divide(solution_col, pivot_col, out = np.zeros_like(solution_col), where = pivot_col != 0)

        # get the smallest positive number in the test ratios
        pivot_row = np.array(tableau[0:constraints, test_ratio]) # define the pivot row
        pivot_row[pivot_row <= 0] = np.inf # filter out all 0 and negativenumbers
        pivot_row = pivot_row.argmin(axis = 0) # get the smallest positive

        # perform modified gauss jordan
        tableau = ModGaussJordan(tableau, pivot_row, pivot_column)
    return tableau

print(MinSimplex(data))