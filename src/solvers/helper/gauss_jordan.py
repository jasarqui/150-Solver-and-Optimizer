import numpy as np

# sample data
# sample_data = np.array([[25,5,1,106.8],[64,8,1,177.2],[144,12,1,279.2]])

np.set_printoptions(linewidth=np.inf)

# this solves the unknowns in a system of equations
def GaussJordan(matrix):
  # initialize variables
  max_iterations = len(matrix)
  max_rows = max_iterations - 1
  i = 0 # pivot row

  while (i < max_iterations):
    if (i != max_rows):
      # print(i)
      # Get max in column with row:
      # https://stackoverflow.com/questions/44620467/select-maximum-element-in-numpy-column-and-also-get-its-row
      max_per_col = np.vstack([matrix[i:,:], abs(matrix[i:,:])]).argmax(axis=0) % (max_rows - i)
      max_row = i + max_per_col[i]
      # swap row i with the row with the max value
      matrix[[i, max_row]] = matrix[[max_row, i]]

    # normalize
    matrix[i,:] = matrix[i,:] / matrix[i,i]

    # change the values
    j = 0
    while (j < max_iterations):
      if (i == j): j = j + 1; continue
      matrix[j,:] = matrix[j,:] - (matrix[j,i] * matrix[i,:])
      j = j + 1
    # print(matrix)
    i = i + 1       

  return matrix[:,max_iterations]

# print(GaussJordan(sample_data))