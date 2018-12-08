import numpy as np

# this sets up the tableau for simplex
def SetupTableau(tableau):
    # initialize variables
    num_slack = tableau.shape[0] # will not include nonnegativity

    # set up objective function
    tableau[tableau.shape[0] - 1] = tableau[tableau.shape[0] - 1] * -1

    # initialize slack variables
    slack = np.zeros((num_slack, num_slack))
    np.fill_diagonal(slack, 1)

    # append slack to equations
    tableau = np.insert(tableau, (tableau.shape[1] - 1,), slack, axis = 1)

    # add test ratio column
    test_ratio = np.zeros(num_slack).reshape(-1,1)
    tableau = np.hstack((tableau, test_ratio))

    return tableau