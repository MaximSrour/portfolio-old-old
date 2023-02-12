import os
from PIL import Image
import aspose.words as aw

# Constants for the input and output directories
INPUT_DIR = "assets/icons/source/"
OUTPUT_DIR = "assets/icons/"
SVG_OUTPUT_DIR = "assets/icons/svg/"

def process_images():
    """
    The main function that processes the images in the input directory.
    """
    try:
        # Check if the input directory exists
        if not os.path.isdir(INPUT_DIR):
            raise Exception(f"The input directory '{INPUT_DIR}' does not exist.")
        
        # Create the output directory if it doesn't exist
        if not os.path.isdir(OUTPUT_DIR):
            os.makedirs(OUTPUT_DIR)
        if not os.path.isdir(SVG_OUTPUT_DIR):
            os.makedirs(SVG_OUTPUT_DIR)

        # Initialize the Aspose.Words document and builder
        doc = aw.Document()
        builder = aw.DocumentBuilder(doc)

        # Iterate over the filenames in the input directory
        for filename in os.listdir(INPUT_DIR):
            # Skip filenames that don't end with ".png"
            if not filename.endswith(".png"):
                continue

            print(f"Processing: {filename}")
            img = Image.open(f"{INPUT_DIR}{filename}")
            # Resize the image to 64x64
            img = img.resize((64, 64))
            # Save the resized image
            img.save(f"{OUTPUT_DIR}{filename}")
            # Insert the image into the Aspose.Words document
            shape = builder.insert_image(f"{OUTPUT_DIR}{filename}")
            # Save the image as an SVG
            shape.image_data.save(f"{SVG_OUTPUT_DIR}{filename[:-4]}.svg")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    """
    Call the main function only if the script is being run as the main program and not imported as a module.
    """
    process_images()
