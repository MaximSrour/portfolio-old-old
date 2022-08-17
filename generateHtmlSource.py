import json
from datetime import datetime
from dateutil import relativedelta
import os  
import re

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

def includeLib(lib, relativePath):
    outString = "\n\t\t<!-- {} library inclusion -->"
    outString += f"\n\t\t<link href=\"{relativePath}vendor/{lib}/{lib}.css\" rel=\"stylesheet\">"
    outString += f"\n\t\t<script src=\"{relativePath}vendor/{lib}/{lib}.js\"></script>"

    return outString

def includeAllLibs(libdir):
    outString = ""

    outString += includeLib("icons", libdir)
    outString += includeLib("accordion", libdir)
    outString += includeLib("navbar", libdir)
    #outString += includeLib("login", libdir)

    return outString

templatePath = "./templates/"
generatedPath = "./generated/"

f = open(f"{templatePath}google-analytics-scripts.txt")
templateGoogleAnalytics = f.read()
f.close()

f = open(f"{templatePath}template-work.txt")
templateWork = f.read()
contentWorkExperience = ""
f.close()

f = open(f"{templatePath}template-education.txt")
templateEducation = f.read()
contentEducation = ""
f.close()

f = open(f"{templatePath}template-additionalActivities.txt")
templateAdditionalActivities = f.read()
contentAdditionalActivities = ""
f.close()

f = open(f"{templatePath}template-project.txt")
templateProject = f.read()
contentProjects = ""
f.close()

f = open(f"{templatePath}template-project-page.txt")
templateProjectPage = f.read()
f.close()

jsonFile = open("C:/Users/maxim/Documents/LaTeX/Resume/items.json")
data = json.load(jsonFile)
jsonFile.close()

# Work
for i in data["work"]:
    startDate = i["start"]
    endDate = i["end"]
    durationString = ""

    startDateObject = datetime.strptime(startDate, '%d/%m/%Y')
    if(endDate == "Current"):
        endDateObject = datetime.today()
    else:
        endDateObject = datetime.strptime(endDate, '%d/%m/%Y')
    
    durationObject = relativedelta.relativedelta(endDateObject, startDateObject)

    if(durationObject.years == 1):
        durationString = "{} year".format(durationObject.years)
    elif(durationObject.years > 1):
        durationString = "{} years".format(durationObject.years)
        
    if(durationObject.months == 1):
        if(durationString !=""):
            durationString += " "
        durationString += "{} month".format(durationObject.months)
    elif(durationObject.months > 1):
        if(durationString !=""):
            durationString += " "
        durationString += "{} months".format(durationObject.months)

    printString = templateWork
    printString = printString.replace("<<ID>>", "workExperience-" + i["id"])
    printString = printString.replace("<<TITLE>>", i["title"])
    printString = printString.replace("<<ORGANISATION>>", i["organisation"])
    printString = printString.replace("<<START>>", startDate)
    printString = printString.replace("<<END>>", endDate)
    #printString = printString.replace("<<DURATION>>", durationString)

    textString = ""
    for item in i["text"]:
        textString += "<li>{}</li>".format(item)
    
    printString = printString.replace("<<TEXT>>", textString)

    if(i["hidden"] == False):
        contentWorkExperience += printString
        contentWorkExperience += "\n"

contentWorkExperience += "\n"
contentWorkExperience = contentWorkExperience.replace("\n", "\n\t\t\t\t\t")

f = open(f"{generatedPath}workExperienceContent.html", "w")
f.write(contentWorkExperience)
f.close()

# Education
for i in data["education"]:
    printString = templateEducation
    printString = printString.replace("<<ID>>", "education-" + i["id"])
    printString = printString.replace("<<TITLE>>", i["title"])
    printString = printString.replace("<<ORGANISATION>>", i["organisation"])
    printString = printString.replace("<<START>>", i["start"])
    printString = printString.replace("<<END>>", i["end"])
    printString = printString.replace("<<TEXT>>", i["text"])

    if(i["hidden"] == False):
        contentEducation += printString
        contentEducation += "\n"

contentEducation += "\n"
contentEducation = contentEducation.replace("\n", "\n\t\t\t\t\t")

f = open(f"{generatedPath}educationContent.html", "w")
f.write(contentEducation)
f.close()

# Additional Activities
for i in data["additionalActivities"]:
    printString = templateAdditionalActivities
    printString = printString.replace("<<ID>>", "additionalActivities-" + i["id"])
    printString = printString.replace("<<TITLE>>", i["title"])
    printString = printString.replace("<<ORGANISATION>>", i["organisation"])
    printString = printString.replace("<<TEXT>>", i["text"])

    if(i["hidden"] == False):
        contentAdditionalActivities += printString
        contentAdditionalActivities += "\n"

contentAdditionalActivities += "\n"
contentAdditionalActivities = contentAdditionalActivities.replace("\n", "\n\t\t\t\t\t")

f = open(f"{generatedPath}additionalActivitiesContent.html", "w")
f.write(contentAdditionalActivities)
f.close()




jsonFile = open("./projects/projects.json")
data = json.load(jsonFile)
jsonFile.close()

# Projects
for i in data["projects"]:
    filePath = "projects/" + i["id"]
    projectType = i["type"]

    printString = templateProject
    printString = printString.replace("<<ID>>", "project-" + i["id"])
    printString = printString.replace("<<TITLE>>", i["title"])
    printString = printString.replace("<<DESCRIPTION>>", i["description"])
    printString = printString.replace("<<IMAGESMALL>>", filePath + "/imageMainSmall.jpg")

    if(projectType == "Game"):
        printString = printString.replace("<<TYPE>>", "Game Development")
        printString = printString.replace("<<TYPESTYLE>>", "gamedev")
    elif(projectType == "3D"):
        printString = printString.replace("<<TYPE>>", "3D")
        printString = printString.replace("<<TYPESTYLE>>", "3d")
    elif(projectType == "Design"):
        printString = printString.replace("<<TYPE>>", "Design")
        printString = printString.replace("<<TYPESTYLE>>", "design")
    elif(projectType == "AV"):
        printString = printString.replace("<<TYPE>>", "Audio-Visual")
        printString = printString.replace("<<TYPESTYLE>>", "av")
    else:
        printString = printString.replace("<<TYPE>>", "General")
        printString = printString.replace("<<TYPESTYLE>>", "generic")
    
    tempSkillString = ""
    for skill in i["skills"]:
        tempSkillString += "<span class=\"iconShort\" data-icon=\"{}\"></span>".format(skill)
    printString = printString.replace("<<SKILLS>>", tempSkillString)

    if(i["wip"] == True):
        printString = printString.replace("<<WIP>>", "<h4 class=\"wip\">WIP</h4>")
    else:
        printString = printString.replace("<<WIP>>", "")
        
    if(i["clickable"] == True):
        printString = printString.replace("<<LINK>>", "<a class=\"projectLink\" href=\"" + filePath + "/projectPage.html\"><p>(click for more)</p></a>")
    else:
        printString = printString.replace("<<LINK>>", "")

    if(i["hidden"] == False):
        contentProjects += printString
        contentProjects += "\n"

contentProjects += "\n"
contentProjects = contentProjects.replace("\n", "\n\t\t\t\t\t")

f = open(f"{generatedPath}projectsContent.html", "w")
f.write(contentProjects)
f.close()


texFileString = ""
# Projects Pages
for i in data["projects"]:
    if(i["clickable"] == True):
        filePath = "projects/" + i["id"]
        projectType = i["type"]

        printString = templateProjectPage
        printString = printString.replace("<<INCLUDE>>", includeAllLibs("../../"))
        printString = printString.replace("<<GOOGLEANALYTICS>>", templateGoogleAnalytics)
        printString = printString.replace("<<TITLE>>", i["title"])
        printString = printString.replace("<<DESCRIPTION>>", i["description"])

        if(projectType == "Game"):
            printString = printString.replace("<<TYPE>>", "Game Development")
            printString = printString.replace("<<TYPESTYLE>>", "gamedev")
        elif(projectType == "3D"):
            printString = printString.replace("<<TYPE>>", "3D")
            printString = printString.replace("<<TYPESTYLE>>", "3d")
        elif(projectType == "Design"):
            printString = printString.replace("<<TYPE>>", "Design")
            printString = printString.replace("<<TYPESTYLE>>", "design")
        elif(projectType == "AV"):
            printString = printString.replace("<<TYPE>>", "Audio-Visual")
            printString = printString.replace("<<TYPESTYLE>>", "audiovisual")
        else:
            printString = printString.replace("<<TYPE>>", "General")
            printString = printString.replace("<<TYPESTYLE>>", "generic")
        
        tempImageString = ""
        tempCarouselString = ""
        count = 0
        files = os.listdir(filePath)
        for file in files:
            regexSearch = re.search("^image[0-9]+.*$", file)
            if(regexSearch != None):
                count += 1
                tempImageString += "<div class=\"carousel-item\"> <img class=\"d-block img-fluid\" src=\"{}\"></div>".format(file)
                tempCarouselString += "<li data-target=\"#carouselExampleIndicators\" data-slide-to=\"{}\"></li>".format(count)
    
        printString = printString.replace("<<CAROUSELIMAGES>>", tempImageString)
        printString = printString.replace("<<CAROUSELBUTTONS>>", tempCarouselString)

        # <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
        # <div class="carousel-item"> <img class="d-block img-fluid" src="image1.jpg"></div>

        tempSkillString = ""
        for skill in i["skills"]:
            tempSkillString += "<li><span class=\"iconLong\" data-icon=\"{}\"></li>".format(skill)
        printString = printString.replace("<<SKILLS>>", tempSkillString)
        
        tempTextString = ""
        for text in i["text"]:
            tempTextString += "<p>{}</p>".format(text)
        printString = printString.replace("<<TEXT>>", tempTextString)

        if(i["wip"] == True):
            printString = printString.replace("<<WIP>>", "<h4 class=\"wip\">WIP</h4>")
        else:
            printString = printString.replace("<<WIP>>", "")

        f = open(filePath + "/projectPage.html", "w")
        f.write(printString)
        f.close()

# Index
f = open(f"{templatePath}template-index.txt")
templateIndex = f.read()
f.close()

templateIndex = templateIndex.replace("<<INCLUDE>>", includeAllLibs(""))
templateIndex = templateIndex.replace("<<GOOGLEANALYTICS>>", templateGoogleAnalytics)
templateIndex = templateIndex.replace("<<WORKEXPERIENCECONTENT>>", contentWorkExperience)
templateIndex = templateIndex.replace("<<EDUCATIONCONTENT>>", contentEducation)
templateIndex = templateIndex.replace("<<ADDITIONALACTIVITIESCONTENT>>", contentAdditionalActivities)
templateIndex = templateIndex.replace("<<PROJECTSCONTENT>>", contentProjects)

f = open("./index.html", "w")
f.write(templateIndex)
f.close()