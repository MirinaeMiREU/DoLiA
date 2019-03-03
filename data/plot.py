# library
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

# import data
inVal = input()
inFile = open(inVal+'.txt', 'r')
x = 0
histogram = []
for i in range(20):
    histogram.append([])
for line in inFile:
    
    lines = line[:-1]
    arr = lines.split(',')

    try:
        numArr = [float(num) for num in arr]
        for j in range(20):
            histogram[j].append(numArr[j])
    except ValueError as e:
        print(arr)
        print()
        x += 1
# Make data
bucket = [[],[],[]]

for i in range(3):
    for j in range(2000):
        bucket[i].append(0)

for i in range(20):
    for j in range(2000):
        if i < 7:
            bucket[0][j] += histogram[i][j]
        elif i < 13:
            bucket[1][j] += histogram[i][j]
        else:
            bucket[2][j] += histogram[i][j]
    
data = pd.DataFrame({  'breed':bucket[0],
                       'general':bucket[1],
                       'forage':bucket[2]},
                    index=range(1,2001))
 
# We need to transform the data from raw data to percentage (fraction)
data_perc = data.divide(data.sum(axis=1), axis=0)
 
# Make the plot
plt.stackplot(range(1,2001),
              data_perc["breed"],
              data_perc["general"],
              data_perc["forage"],
              labels=['Breeders','Generalists','Foragers'])
plt.legend(loc='upper left')
plt.margins(0,0)
plt.title(inVal)
plt.show()
