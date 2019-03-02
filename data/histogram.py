# library
import seaborn as sns
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.colors as colors
from matplotlib.mlab import bivariate_normal

# import data
inFiles = []
inFiles.append('s-f2-b5-ft-ftt-tfff')
inFiles.append('s-f2-b5-ft-ftt-ftff')
inFiles.append('s-f1-b3-ft-ftt-fftf')
inFiles.append('s-f2-b5-ft-ftt-ffft')

##inFiles.append('s-f2-b3-ft-ftt-tttt')
##inFiles.append('s-f2-b5-ft-ftt-ttff')
##inFiles.append('s-f2-b7-ft-ftt-fftt')
##inFiles.append('s-f2-b5-ft-ftt-ffff')
c=1

# A low hump with a spike coming out of the top right.  Needs to have
# z/colour axis on a log scale so we see both hump and spike.  linear
# scale only shows the spike.
for file in inFiles:
    inFile = open(file + '.txt', 'r')
    x = 0
    histogram = []
    hist = []
    for i in range(20):
        histogram.append([])
    for line in inFile:
        
        lines = line[:-1]
        arr = lines.split(',')

        try:
            numArr = [float(num) for num in arr]
            for j in range(20):
                histogram[j].append(numArr[j]+0.025)
        except ValueError as e:
            print(arr)
            print()
            x += 1

    for i in range(20):
        hist.append(histogram[19-i])
    col = []
    for i in range(2000):
        col.append(i)

    row = []
    for i in range(20):
        row.append('')
    row[0] = 'Forager'
    row[12] = 'Breeder'
    # Create a dataset
    df = pd.DataFrame(hist,index=row)
    plt.subplot(2,2,c)
    sns.heatmap(df, center=1,
                vmin=0.025, vmax=1.025,
                norm=colors.LogNorm())
    plt.title(file)
    plt.gca().axes.get_xaxis().set_visible(False)
    c += 1
    
 
# Default heatmap: just a visualization of this square matrix


plt.show()
