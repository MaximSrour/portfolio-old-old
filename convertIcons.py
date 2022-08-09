from PIL import Image
import os

path = "assets/icons/source/"
pathOut = "assets/icons/"

for filename in os.listdir(path):
    print(filename)
    img = Image.open(f"{path}{filename}")

    # Edit
    img = img.resize((64, 64))

    img.save(f"{pathOut}{filename}")