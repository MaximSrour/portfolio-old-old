window.onload = function() {
    document.querySelectorAll('.iconFull').forEach((el) => {
        let img = el.querySelector('img');
        let text = getComputedStyle(img).getPropertyValue("--iconText");
        text = text.substring(2, text.length-1)
        
        el.innerHTML += text;
    });
}