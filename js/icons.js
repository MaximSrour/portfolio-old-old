function LoadIcons() {
    document.querySelectorAll('.iconFull').forEach((el) => {
        let img = el.querySelector('img');
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
    });
}