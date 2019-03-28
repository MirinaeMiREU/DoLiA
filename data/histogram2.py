# library
import seaborn as sns
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.colors as colors
from matplotlib.mlab import bivariate_normal

# import data
inFiles = []
inTitle = []
inFiles.append('s-f1-b1-ft-ftt-ffff-c')
inTitle.append('No Benefit Control')

##inFiles.append('s-f2-b5-ft-ftt-ffff')
##inFiles.append('s-f2-b5-ft-ftt-ttff')
##inFiles.append('s-f2-b7-ft-ftt-fftt')
##inFiles.append('s-f2-b3-ft-ftt-tttt')
##inTitle.append('No Benefit')
##inTitle.append('Queens Benefit')
##inTitle.append('Workers Benefit')
##inTitle.append('Both Benefit')

c=2
fig, axn = plt.subplots(2,2,sharey=True)

#cbar_ax = fig.add_axes([.905, .2, .01, .6])
cbar_ax = fig.add_axes([.905, .555, .01, .3])

# A low hump with a spike coming out of the top right.  Needs to have
# z/colour axis on a log scale so we see both hump and spike.  linear
# scale only shows the spike.
for x in range(len(inFiles)):
    inFile = open(inFiles[x] + '.txt', 'r')
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
            print()

    for i in range(20):
        hist.append(histogram[19-i])
    col = []
    for i in range(2000):
        col.append(i)

    row = []
    for i in range(20):
        row.append('')
    row[0] = 'Worker'
    row[14] = 'Queen'
    # Create a dataset
    df = pd.DataFrame(hist,index=row)
    plt.subplot(2,2,c)
    sns.heatmap(df, center=1,
                norm=colors.LogNorm(),
                vmin = 0.025,
                vmax = 1.025,
                cbar=c == 2,
                cbar_ax=None if c < 2 else cbar_ax,
                cbar_kws={'ticks': [1,0.1,0.025]})
    plt.title(inTitle[x])
    plt.gca().axes.get_xaxis().set_visible(False)
    c += 2
    
 
# Default heatmap: just a visualization of this square matrix
plt.show()
