function GenerateIcon(element, iconType) {
    //Create the image element
    let img = document.createElement("img");
    img.classList.add("icon");
    img.classList.add("icon" + iconType);
    element.appendChild(img)
    let text = getComputedStyle(img).getPropertyValue("--iconText");
    text = TruncateIconText(text);
    //img.alt = text;
    return img
}

function LoadIcons() {
    document.querySelectorAll(".iconLong").forEach((el) => {
        let iconType = el.dataset.icon;
        if(iconType) {
            let img = GenerateIcon(el, iconType);
            
            //Get the text
            let text = getComputedStyle(img).getPropertyValue("--iconText");
            textArray = text.split("\"");
            if(textArray.length > 1) {
                textArray.splice(textArray.length-1, 1);
                textArray.splice(0, 1);
    
                text = textArray.join();
            } else {
                text = textArray[1];
            }
    
            el.innerHTML += text;
        }
    });

    document.querySelectorAll(".iconShort").forEach((el) => {
        let iconType = el.dataset.icon;
        if(iconType) {
            GenerateIcon(el, iconType);
        }
    });
}

function TruncateIconText(text) {
    let truncateLeadSpace = text[0] === " ";
    let leadChars = 1 + truncateLeadSpace ? 1 : 0;

    text = text.substring(leadChars, text.length-1)

    return text;
}