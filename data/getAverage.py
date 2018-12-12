files = []
outFile = open("Out.csv",'w')

numFiles = int(input("num of files: "))
               
samplePoints = int(input("num of sample points: "))

for i in range(numFiles):
    file = open("Run#"+str(i+1)+".csv",'r')
    files.append(file)
    #print(files[i].readline().strip())

i = 0
outFile.write("Ants,Larva,Food\n")
while i < samplePoints * numFiles:
    i += numFiles
    antTotal = 0
    larvaTotal = 0
    foodTotal = 0
    elCount = 0
    for j in range(numFiles):
        line = files[j].readline().strip()
        if line.startswith(',') or line is "":
            i -= 1
        else:
            elList = line.split(',')
            antTotal += int(elList[1])
            larvaTotal += int(elList[2])
            foodTotal += int(elList[3])
            elCount += 1
    
    if elCount != 0:
        outFile.write(str(antTotal/elCount) + "," + str(larvaTotal/elCount) +
                      "," + str(foodTotal/elCount) + "\n")
					  
i = 0
outFile.write("\nAnt+Larva,Food\n")
while i < samplePoints * numFiles:
    i += numFiles
    lifeTotal = 0
    foodTotal = 0
    elCount = 0
    for j in range(numFiles):
        line = files[j].readline().strip()
        if line.startswith(',') or line is "":
            i -= 1
        else:
            elList = line.split(',')
            lifeTotal += int(elList[1])
            foodTotal += int(elList[2])
            elCount += 1
    if elCount != 0:
        outFile.write(str(lifeTotal/elCount) + "," + str(foodTotal/elCount) + "\n")
        
i = 0
outFile.write("\nBreed,Forage\n")
outFile.write("\n0.00,0.05,0.1,0.15,0.2,0.25,0.3,0.35,0.4,0.45,0.5" +
              ",0.55,0.6,0.65,0.7,0.75,0.8,0.85,0.9,0.95\n")
while i < samplePoints * numFiles:
    i += numFiles
    dataTotal = []
    for j in range(20):
        dataTotal.append(0)
    elCount = 0
    for j in range(numFiles):
        line = files[j].readline().strip()
        if line.startswith(',') or line is "":
            i -= 1
        else:
            elList = line.split(',')
            for k in range(1,len(elList)-1):
                dataTotal[k-1] += int(elList[k])
            elCount += 1
    if elCount != 0:
        breedForageStr = ""
        for k in range(len(dataTotal)):
            breedForageStr += str(dataTotal[k]/elCount) + ","
        outFile.write(breedForageStr + "\n")

i = 0
outFile.write("\nExploit,Explore\n")
outFile.write("\n0.00,0.05,0.1,0.15,0.2,0.25,0.3,0.35,0.4,0.45,0.5" +
              ",0.55,0.6,0.65,0.7,0.75,0.8,0.85,0.9,0.95\n")
while i < samplePoints * numFiles:
    i += numFiles
    dataTotal = []
    for j in range(20):
        dataTotal.append(0)
    elCount = 0
    for j in range(numFiles):
        line = files[j].readline().strip()
        if line.startswith(',') or line is "":
            i -= 1
        else:
            elList = line.split(',')
            for k in range(1,len(elList)-1):
                dataTotal[k-1] += int(elList[k])
            elCount += 1
    if elCount != 0:
        breedForageStr = ""
        for k in range(len(dataTotal)):
            breedForageStr += str(dataTotal[k]/elCount) + ","
        outFile.write(breedForageStr + "\n")
outFile.close()
        
##fileMatrix = []
##for i in range(10):
##    fileMatrix.append([])
##    for line in files[i]:
##        line = line.strip()
##        if not line.startswith(','):
##            elList = line.split(',')
##            fileMatrix[i].append(elList)
##            for el in elList:
##                outFile.write(el + " ")
##            outFile.write("\n")
    
##for i in range(1):
##    fOpen = open("Run#"+str(i+1)+".csv",'r')
##    for line in fOpen:
##        line = line.strip()
##        if not line.startswith(','):
##            elementList = line.split(',')
##            if len(elementList) is 3:
##                
##            else if len(elementList) is 2:
##                
##            else if len(elementList) is 20:
