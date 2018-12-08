import numpy as np

# performs an iteration of a modified gauss jordan in simplex
def ModGaussJordan(tableau, pivot_row, pivot_column):
    # setup variables
    solution = tableau.shape[1] - 1 # bound to exclude the test ratio column
    max_iterations = tableau.shape[0] # bound to include all rows

    # normalize
    tableau[pivot_row, 0:solution] = tableau[pivot_row, 0:solution] / tableau[pivot_row, pivot_column]

    # update the tableau values
    j = 0
    while (j < max_iterations):
      if (j == pivot_row): j = j + 1; continue
      tableau[j, 0:solution] = tableau[j, 0:solution] - (tableau[j, pivot_column] * tableau[pivot_row, 0:solution])
      j = j + 1

    return tableau