from PIL import Image
import os

path = "assets/certs/source/"
pathOut = "assets/certs/"

for filename in os.listdir(path):
    print(filename)
    img = Image.open(f"{path}{filename}")

    # Edit
    width, height = img.size
    if(width > height):
        left = 0
        top = (width-height)/2 * -1
        right = width
        bottom = height + (width-height)/2
        img = img.crop((left, top, right, bottom))
    else:
        left = (height-width)/2 * -1
        top = 0
        right = width + (height-width)/2
        bottom = height
        img = img.crop((left, top, right, bottom))

    # Edit
    img = img.resize((250, 250))

    img.save(f"{pathOut}{filename}")