let sections;

function InitNavbar() {
    sections = document.querySelectorAll("section[id]");
    window.addEventListener("scroll", NavbarHighlight);

    NavbarHighlight()

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
    
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

function NavbarLinkSelected() {
    $('.collapse').collapse("hide")
}

function NavbarHighlight() {
    let scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 50;
        const parentNodePadding = parseInt(window.getComputedStyle(current.parentNode).paddingTop, 10);
        sectionId = current.getAttribute("id");

        let element = document.querySelector(`a[href*=${sectionId}Link]`);
        
        if(element != null) {
            if(scrollY > sectionTop - parentNodePadding - 1 && scrollY <= sectionTop + sectionHeight) {
                element.classList.add("active");
            } else {
                element.classList.remove("active");
            }
        }
    });
}