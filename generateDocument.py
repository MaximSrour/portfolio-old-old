import json
from datetime import datetime
import os  

# Converts a date in string format to a date object
def stringToDate(dateString):
    datetimeObject = datetime.strptime(dateString, '%d/%m/%Y')
    return datetimeObject

# Escapes a particular character in a string
def escapeCharacter(stringToClean, character):
    tempArray = stringToClean.split(character)
    tempString = tempArray[0]

    for stringlet in tempArray[1:]:
        print(tempString)
        tempString += "\\{}".format(character)
        tempString += stringlet
    
    print(tempString)
        
    return tempString

# Escapes a collection of characters in a string
def escapeCharacters(stringToClean):
    tempString = escapeCharacter(stringToClean, "&")
    tempString = escapeCharacter(tempString, "#")
    tempString = escapeCharacter(tempString, "%")
    
    return tempString

f = open("Templates/template-work.txt")
templateWork = f.read()
f.close()

f = open("Templates/template-education.txt")
templateEducation = f.read()
f.close()

f = open("Templates/template-additionalActivities.txt")
templateAdditionalActivities = f.read()
f.close()

jsonFile = open("C:/Users/maxim/Documents/LaTeX/Resume/items.json")
data = json.load(jsonFile)
jsonFile.close()

texFileString = ""
# Work
for i in data["work"]:
    printString = templateWork
    printString = printString.replace("<<TITLE>>", i["title"])
    printString = printString.replace("<<ORGANISATION>>", i["organisation"])
    printString = printString.replace("<<START>>", i["start"])
    printString = printString.replace("<<END>>", i["end"])

    textString = ""
    for item in i["text"]:
        textString += "<li>{}</li>".format(item)
    
    printString = printString.replace("<<TEXT>>", textString)

    if(i["hidden"] == False):
        texFileString += printString
        texFileString += "\n"

texFileString += "\n"

f = open("workExperienceContent.html", "w")
f.write(texFileString)
f.close()



texFileString = ""
# Education
for i in data["education"]:
    printString = templateEducation
    printString = printString.replace("<<TITLE>>", i["title"])
    printString = printString.replace("<<ORGANISATION>>", i["organisation"])
    printString = printString.replace("<<START>>", i["start"])
    printString = printString.replace("<<END>>", i["end"])
    printString = printString.replace("<<TEXT>>", i["text"])

    if(i["hidden"] == False):
        texFileString += printString
        texFileString += "\n"

texFileString += "\n"

f = open("educationContent.html", "w")
f.write(texFileString)
f.close()



texFileString = ""
# Additional Activities
for i in data["additionalActivities"]:
    printString = templateAdditionalActivities
    printString = printString.replace("<<TITLE>>", i["title"])
    printString = printString.replace("<<ORGANISATION>>", i["organisation"])
    printString = printString.replace("<<TEXT>>", i["text"])

    if(i["hidden"] == False):
        texFileString += printString
        texFileString += "\n"

texFileString += "\n"

f = open("additionalActivitiesContent.html", "w")
f.write(texFileString)
f.close()