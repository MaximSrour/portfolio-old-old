class UnitcodeIconGenerator {
    constructor() {
        this.imageDimensions = {
            width: 512,
            height: 512,
        };

        this.configData = {
            unitcode: "1045",
            fontColorSwatch: "#FFFFFF",
            gradientColorSwatch1: "#000000",
            gradientColorSwatch2: "#FFFFFF",
            gradientRotation: 0,
            textSize: 300,
            textPaddingHorizontal: 100,
            textPaddingVertical: 50,
            fontFamily: "Consolas",
        };

        this.text = {
            dimensions: {
                size: 300,
                height: 0,
                width: 0,
            },
            padding: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
            },
        };

        this.htmlRef = {
            unitcodeField: document.getElementById("unitcodeField"),
            fontColorSwatch: document.getElementById("fontColorSwatch"),
            gradientColorSwatch1: document.getElementById("gradientColorSwatch1"),
            gradientColorSwatch2: document.getElementById("gradientColorSwatch2"),
            colorRandomButton: document.getElementById("gradientRanomizerButton"),
            gradientRotationSlider: document.getElementById("gradientRotationSlider"),
            textSizeSlider: document.getElementById("textSizeSlider"),
            textPaddingHorizontalSlider: document.getElementById("textPaddingHorizontalSlider"),
            textPaddingVerticalSlider: document.getElementById("textPaddingVerticalSlider"),
            fontFamilyDropdown: document.getElementById("fontFamilyDropdown"),

            gradientRotationSliderValue: document.getElementById("gradientRotationSliderValue"),
            textSizeSliderValue: document.getElementById("textSizeSliderValue"),
            textPaddingHorizontalSliderValue: document.getElementById("textPaddingHorizontalSliderValue"),
            textPaddingVerticalSliderValue: document.getElementById("textPaddingVerticalSliderValue"),

            saveImageButton: document.getElementById("saveImageButton"),
            saveConfigButton: document.getElementById("saveConfigButton"),
            loadConfigButton: document.getElementById("loadConfigButton"),
            configFile: document.getElementById("configFile"),

            outputImage1: document.getElementById("image1"),
            outputImage2: document.getElementById("image2"),
            outputImage3: document.getElementById("image3"),
            outputImage4: document.getElementById("image4"),
        };

        this.image;

        this.tempCanvas = document.createElement("canvas");
        this.diagonal = Math.sqrt(this.imageDimensions.width * this.imageDimensions.width + this.imageDimensions.height * this.imageDimensions.height);
        this.tempCanvas.width = this.diagonal;
        this.tempCanvas.height = this.diagonal;

        this.canvas = document.createElement("canvas");
        this.canvas.width = this.imageDimensions.width;
        this.canvas.height = this.imageDimensions.height;

        this.Init();
    };

    /**
     * Runs all necessary functions to initialise the state and functionality of the app
     */
    Init() {
        this.CreateEventListeners();
        this.GenerateRandomColors();
        this.CalculateImageDimensions();
        this.GenerateImageGradient();
        this.RenderImage();
    }

    /**
     * Generates all of the event listeners
     */
    CreateEventListeners() {
        /**
         * Unitcode field event listener
         */
        this.htmlRef.unitcodeField.addEventListener("keyup", () => {
            this.configData.unitcode = this.htmlRef.unitcodeField.value;
            this.RenderImage();
        });

        /**
         * Font color swatch event listener
         */
        this.htmlRef.fontColorSwatch.addEventListener("input", () => {
            this.configData.fontColorSwatch = this.htmlRef.fontColorSwatch.value;
            this.RenderImage();
        });
        
        /**
         * Gradient color swatch 1 event listener
         */
        this.htmlRef.gradientColorSwatch1.addEventListener("input", () => {
            this.configData.gradientColorSwatch1 = this.htmlRef.gradientColorSwatch1.value;
            this.GenerateImageGradient();
            this.RenderImage();
        });

        /**
         * Gradient color swatch 2 event listener
         */
        this.htmlRef.gradientColorSwatch2.addEventListener("input", () => {
            this.configData.gradientColorSwatch2 = this.htmlRef.gradientColorSwatch2.value;
            this.GenerateImageGradient();
            this.RenderImage();
        });

        /**
         * Random button event listener
         */
        this.htmlRef.colorRandomButton.addEventListener("click", () => {
            this.GenerateRandomColors();
            this.GenerateImageGradient();
            this.RenderImage();
        });

        /**
         * Gradient rotation slider event listener
         */
        this.htmlRef.gradientRotationSlider.addEventListener("input", () => {
            this.configData.gradientRotation = Number(this.htmlRef.gradientRotationSlider.value);
            this.htmlRef.gradientRotationSliderValue.innerHTML = this.configData.gradientRotation;
            this.GenerateImageGradient();
            this.RenderImage();
        });

        /**
         * Text size slider event listener
         */
        this.htmlRef.textSizeSlider.addEventListener("input", () => {
            this.configData.textSize = Number(this.htmlRef.textSizeSlider.value);
            this.htmlRef.textSizeSliderValue.innerHTML = this.configData.textSize;

            this.CalculateImageDimensions();
            this.RenderImage();
        });

        /**
         * Text padding horizontal slider event listener
         */
        this.htmlRef.textPaddingHorizontalSlider.addEventListener("input", () => {
            this.configData.textPaddingHorizontal = Number(this.htmlRef.textPaddingHorizontalSlider.value);
            this.htmlRef.textPaddingHorizontalSliderValue.innerHTML = this.configData.textPaddingHorizontal;

            this.CalculateImageDimensions();
            this.RenderImage();
        });

        /**
         * Text padding vertical slider event listener
         */
        this.htmlRef.textPaddingVerticalSlider.addEventListener("input", () => {
            this.configData.textPaddingVertical = Number(this.htmlRef.textPaddingVerticalSlider.value);
            this.htmlRef.textPaddingVerticalSliderValue.innerHTML = this.configData.textPaddingVertical;

            this.CalculateImageDimensions();
            this.RenderImage();
        });

        /**
         * Font family dropdown event listener
         */
        this.htmlRef.fontFamilyDropdown.addEventListener("change", () => {
            this.configData.fontFamily = this.htmlRef.fontFamilyDropdown.value;
            this.RenderImage();
        });

        /**
         * Save image button event listener
         */
        this.htmlRef.saveImageButton.addEventListener("click", () => {
            this.SaveImage();
        });

        /**
         * Save config button event listener
         */
        this.htmlRef.saveConfigButton.addEventListener("click", () => {
            this.SaveConfig();
        });

        /**
         * Load config button event listener
         */
        this.htmlRef.loadConfigButton.addEventListener("click", () => {
            this.LoadConfig();
        });

        /**
         * Config file event listener
         */
        this.htmlRef.configFile.addEventListener("change", (event) => {
            let file = event.target.files[0];
            let reader = new FileReader();

            reader.onload = (event) => {
                this.configData = JSON.parse(event.target.result);

                this.InstallConfig();
                this.CalculateImageDimensions();
                this.GenerateImageGradient();
                this.RenderImage();
            };

            reader.readAsText(file);

            this.htmlRef.configFile.value = "";
        });
    };

    /**
     * Generates random colors for the gradient
     */
    GenerateRandomColors() {
        this.htmlRef.gradientColorSwatch1.value = this.GenerateRandomColor();
        this.htmlRef.gradientColorSwatch2.value = this.GenerateRandomColor();
        this.configData.gradientColorSwatch1 = this.htmlRef.gradientColorSwatch1.value;
        this.configData.gradientColorSwatch2 = this.htmlRef.gradientColorSwatch2.value;
    };

    /**
     * Generates a random color
     * @returns a HEX formatted string
     */
    GenerateRandomColor() {
        let randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
        return randomColor;
    };

    /**
     * Computes the dimensions of the image and text
     * This exists to remove excess computations when nothing relevant has changed
     */
    CalculateImageDimensions() {
        const ctx = this.tempCanvas.getContext("2d");
        ctx.resetTransform();
        ctx.font = `bold ${this.configData.textSize}px ${this.configData.fontFamily}`;
        const textMeasurements = ctx.measureText("0");

        this.text.dimensions.height = Math.abs(textMeasurements.actualBoundingBoxAscent - textMeasurements.actualBoundingBoxDescent);
        this.text.dimensions.width = textMeasurements.width;

        this.text.padding.top = this.configData.textPaddingVertical + this.text.dimensions.height;
        this.text.padding.bottom = this.imageDimensions.height - this.configData.textPaddingVertical;
        this.text.padding.left = this.configData.textPaddingHorizontal;
        this.text.padding.right = this.imageDimensions.width - this.configData.textPaddingHorizontal - this.text.dimensions.width;
    };

    /**
     * Generates a gradient image background
     * This exists to remove excess background draws when nothing relevant has changed
     */
    GenerateImageGradient() {
        const tempCtx = this.tempCanvas.getContext("2d");
        tempCtx.resetTransform();
        
        // Rotate the context of temporary canvas
        tempCtx.translate(this.diagonal / 2, this.diagonal / 2);
        tempCtx.rotate(this.configData.gradientRotation * Math.PI / 180 - 45);
        tempCtx.translate(-this.diagonal / 2, -this.diagonal / 2);
        
        // Draw gradient on temporary canvas
        const grd = tempCtx.createLinearGradient(0, 0, this.diagonal, this.diagonal);
        grd.addColorStop(0, this.configData.gradientColorSwatch1);
        grd.addColorStop(1, this.configData.gradientColorSwatch2);
        tempCtx.fillStyle = grd;
        tempCtx.fillRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
    }

    /**
     * Renders the image using the configured data
     */
    RenderImage() {
        const ctx = this.canvas.getContext("2d");

        ctx.drawImage(
            this.tempCanvas,
            (this.diagonal - this.imageDimensions.width) / 2,
            (this.diagonal - this.imageDimensions.height) / 2,
            this.imageDimensions.width,
            this.imageDimensions.height,
            0,
            0,
            this.imageDimensions.width,
            this.imageDimensions.height
        );

        ctx.fillStyle = this.configData.fontColorSwatch;
        ctx.font = `bold ${this.configData.textSize}px ${this.configData.fontFamily}`;

        if (this.configData.unitcode.length > 0) ctx.fillText(this.configData.unitcode[0], this.text.padding.left, this.text.padding.top);
        if (this.configData.unitcode.length > 1) ctx.fillText(this.configData.unitcode[1], this.text.padding.right, this.text.padding.top);
        if (this.configData.unitcode.length > 2) ctx.fillText(this.configData.unitcode[2], this.text.padding.left, this.text.padding.bottom);
        if (this.configData.unitcode.length > 3) ctx.fillText(this.configData.unitcode[3], this.text.padding.right, this.text.padding.bottom);

        this.InstallImage();
    };

    /**
     * Saves the image file using a browser download
     */
    SaveImage() {
        let a = document.createElement("a");
        a.href = this.image;
        a.download = `FIT${this.configData.unitcode}_Icon.png`;
        a.click();
    };

    /**
     * Saves the config file using a browser download
     */
    SaveConfig() {
        let a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([JSON.stringify(this.configData, null, 2)], {
            type: "text/plain"
        }));
        a.download = `FIT${this.configData.unitcode}_IconConfig.uig`;
        a.click();
    };

    /**
     * Opens the file selection dialog
     */
    LoadConfig() {
        this.htmlRef.configFile.click();
    };

    /**
     * Installs the image data stored in the app into the frontend
     */
    InstallImage() {
        this.image = this.canvas.toDataURL();

        this.htmlRef.outputImage1.src = this.image;
        this.htmlRef.outputImage2.src = this.image;
        this.htmlRef.outputImage3.src = this.image;
        this.htmlRef.outputImage4.src = this.image;
    };

    /**
     * Installs the config data stored in the app into the frontend
     */
    InstallConfig() {
        this.htmlRef.unitcodeField.value = this.configData.unitcode;
        this.htmlRef.fontColorSwatch.value = this.configData.fontColorSwatch;
        this.htmlRef.gradientColorSwatch1.value = this.configData.gradientColorSwatch1;
        this.htmlRef.gradientColorSwatch2.value = this.configData.gradientColorSwatch2;
        this.htmlRef.gradientRotationSlider.value = this.configData.gradientRotation;
        this.htmlRef.textSizeSlider.value = this.configData.textSize;
        this.htmlRef.textPaddingHorizontalSlider.value = this.configData.textPaddingHorizontal;
        this.htmlRef.textPaddingVerticalSlider.value = this.configData.textPaddingVertical;
        this.htmlRef.fontFamilyDropdown.value = this.configData.fontFamily;
    }
};

document.addEventListener("DOMContentLoaded", (event) => {
    new UnitcodeIconGenerator();
});
