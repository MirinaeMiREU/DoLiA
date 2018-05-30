files = []
outFile = open("Out.txt",'w')

numFiles = int(input("num of files: "))
               
samplePoints = int(input("num of sample points: "))

for i in range(numFiles):
    file = open("Run#"+str(i+1)+".csv",'r')
    files.append(file)
    #print(files[i].readline().strip())

i = 0
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
        outFile.write("Ants: " + str(antTotal/elCount) +
                      " Larva: " + str(larvaTotal/elCount) +
                      " Food: " + str(foodTotal/elCount) + "\n")
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
