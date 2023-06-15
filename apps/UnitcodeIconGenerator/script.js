document.addEventListener("DOMContentLoaded", (event) => {
    // Constants
    let imageWidth = 512;
    let imageHeight = 512;

    let textSize = 300;

    let unitcode = "1045";
    let color1 = "#000000";
    let color2 = "#FFFFFF";

    let image;

    let textPaddingHorizontal = 100;
    let textPaddingVertical = 0;
    
    let textPaddingHorizontalThreshold = [0, imageWidth / 2];
    let textPaddingVerticalThreshold = [0, imageHeight / 2];

    const unitcodeField = document.getElementById("unitcode-field");
    const colorButton1 = document.getElementById("color-button-1");
    const colorButton2 = document.getElementById("color-button-2");
    const colorRandomButton = document.getElementById("color-random-button");
    const gradientRotationSlider = document.getElementById("gradientRotationSlider");
    const textSizeSlider = document.getElementById("textSizeSlider");
    const textPaddingHorizontalSlider = document.getElementById("textPaddingHorizontalSlider");
    const textPaddingVerticalSlider = document.getElementById("textPaddingVerticalSlider");
    const fontFamilyDropdown = document.getElementById("fontFamilyDropdown");

    const gradientRotationSliderValue = document.getElementById("gradientRotationSliderValue");
    const textSizeSliderValue = document.getElementById("textSizeSliderValue");
    const textPaddingHorizontalSliderValue = document.getElementById("textPaddingHorizontalSliderValue");
    const textPaddingVerticalSliderValue = document.getElementById("textPaddingVerticalSliderValue");

    
    const saveButton = document.getElementById("saveButton");

    // Event Listeners

    unitcodeField.addEventListener("keyup", () => {
        unitcode = unitcodeField.value;
        updateImage();
    });

    colorButton1.addEventListener("input", () => {
        color1 = colorButton1.value;
        updateImage();
    });

    colorButton2.addEventListener("input", () => {
        color2 = colorButton2.value;
        updateImage();
    });

    colorRandomButton.addEventListener("click", generateRandomColors);

    gradientRotationSlider.addEventListener("input", () => {
        gradientRotationSliderValue.innerHTML = gradientRotationSlider.value;
        updateImage()
    });

    textSizeSlider.addEventListener("input", () => {
        textSizeSliderValue.innerHTML = textSizeSlider.value;
        updateImage()
    });

    textPaddingHorizontalSlider.addEventListener("input", () => {
        textPaddingHorizontalSliderValue.innerHTML = textPaddingHorizontalSlider.value;
        updateImage()
    });

    textPaddingVerticalSlider.addEventListener("input", () => {
        textPaddingVerticalSliderValue.innerHTML = textPaddingVerticalSlider.value;
        updateImage()
    });

    fontFamilyDropdown.addEventListener("change", updateImage);

    // Functions

    function generateRandomColors() {
        colorButton1.value = generateRandomColor();
        colorButton2.value = generateRandomColor();
        color1 = colorButton1.value;
        color2 = colorButton2.value;
        updateImage();
    }

    function generateRandomColor() {
        let randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
        return randomColor;
    }

    function updateImage() {
        textSize = Number(textSizeSlider.value);
        textPaddingHorizontal = Number(textPaddingHorizontalSlider.value);
        textPaddingVertical = Number(textPaddingVerticalSlider.value);

        const TEXT_OFFSET_HORIZONTAL = textSize * 0.5
        const TEXT_OFFSET_VERTICAL = textSize * 1.04
        const TEXT_OFFSET = textSize * 0.2

        const FONT_FAMILY = fontFamilyDropdown.value

        // Create a temporary canvas
        const tempCanvas = document.createElement("canvas");
        const diagonal = Math.sqrt(imageWidth * imageWidth + imageHeight * imageHeight);
        tempCanvas.width = diagonal;
        tempCanvas.height = diagonal;
        const tempCtx = tempCanvas.getContext("2d");
        
        // Rotate the context of temporary canvas
        tempCtx.translate(diagonal / 2, diagonal / 2);
        tempCtx.rotate(gradientRotationSlider.value * Math.PI / 180 - 45);
        tempCtx.translate(-diagonal / 2, -diagonal / 2);
        
        // Draw gradient on temporary canvas
        const grd = tempCtx.createLinearGradient(0, 0, diagonal, diagonal);
        grd.addColorStop(0, color1);
        grd.addColorStop(1, color2);
        tempCtx.fillStyle = grd;
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Create the actual canvas and draw rotated gradient
        const canvas = document.createElement("canvas");
        canvas.width = imageWidth;
        canvas.height = imageHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
            tempCanvas,
            (diagonal - imageWidth) / 2,
            (diagonal - imageHeight) / 2,
            imageWidth,
            imageHeight,
            0,
            0,
            imageWidth,
            imageHeight
        );

        // Draw text
        ctx.fillStyle = "white";
        ctx.font = `bold ${textSize}px ${FONT_FAMILY}`;
        const text = unitcodeField.value;

        const TEXT_MEASURE = ctx.measureText(text[0])

        const TEXT_HEIGHT = Math.abs(TEXT_MEASURE.actualBoundingBoxAscent - TEXT_MEASURE.actualBoundingBoxDescent)
        const TEXT_WIDTH = TEXT_MEASURE.width

        const TOP = textPaddingVertical + TEXT_HEIGHT
        const BOTTOM = imageHeight - textPaddingVertical
        const LEFT = textPaddingHorizontal
        const RIGHT = imageWidth - textPaddingHorizontal - TEXT_WIDTH

        if (text.length > 0) ctx.fillText(text[0], LEFT, TOP);
        if (text.length > 1) ctx.fillText(text[1], RIGHT, TOP);
        if (text.length > 2) ctx.fillText(text[2], LEFT, BOTTOM);
        if (text.length > 3) ctx.fillText(text[3], RIGHT, BOTTOM);

        image = canvas.toDataURL()

        // Update the image
        document.getElementById("image1").src = image;
        document.getElementById("image2").src = image;
        document.getElementById("image3").src = image;
        document.getElementById("image4").src = image;
    }
    
    saveButton.addEventListener("click", saveConfig);

    function saveConfig() {
        let a = document.createElement("a");
        a.href = image;
        a.download = `FIT${unitcode}_Icon.png`;
        a.click();

        let configData = {
            unitCode: unitcodeField.value,
            color1: color1,
            color2: color2,
            gradientRotation: gradientRotationSlider.value,
            textSize: textSizeSlider.value,
            textPaddingHorizontal: textPaddingHorizontalSlider.value,
            textPaddingVertical: textPaddingVerticalSlider.value,
        };
        
        a.href = URL.createObjectURL(new Blob([JSON.stringify(configData, null, 2)], {
            type: "text/plain"
        }));
        a.download = `FIT${unitcode}_IconConfig.txt`;
        a.click();
    }

    generateRandomColors();
    updateImage();
});
