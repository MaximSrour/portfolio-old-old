class Accordion {
    constructor(el) {
        //Create links to all elements
        this.linkTo = el;
        this.accordionContainer = this.linkTo.parentNode.querySelector('div');
        this.accordion = this.accordionContainer.querySelector('details');
        this.summary = this.accordion.querySelector('summary');
        this.content = this.accordion.querySelector('.content');
        
        //Generate scrolling bounds container
        this.scrollingBounds = document.createElement("span");
        this.scrollingBounds.id = this.linkTo.id + "-scrollingBounds";
        this.scrollingBounds.classList.add("accordianScrollingBounds");
        this.linkTo.parentNode.insertBefore(this.scrollingBounds, this.linkTo);

        //Generate arrow
        this.arrow = document.createElement("span");
        this.arrow.classList.add("detailArrow", "mdi", "mdi-chevron-down");
        this.accordionContainer.appendChild(this.arrow);

        //Animation
        this.animation = null;
        this.arrowAnimation = null;
        this.isClosing = false;
        this.isExpanding = false;

        //Add event listener
        this.accordionContainer.addEventListener('click', (e) => this.OnClick(e));

        //Animation params
        this.animationTiming = {
            duration: 400,
            easing: 'ease-in-out'
        }

        this.paddingHeight = 40;
    }
    
    ComputeScrollingBounds(height) {
        const heightOfElement = parseInt(height,10);
        const topPadding = parseInt(getComputedStyle(this.linkTo).getPropertyValue("top"), 10);
        const bottomPadding = 50;
        const computedHeight = heightOfElement - topPadding + bottomPadding;

        this.scrollingBounds.style.top = `${topPadding}px`;
        this.scrollingBounds.style.height = `${computedHeight}px`;
        
        this.scrollingBounds.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    HaltAnimation() {
        if (this.animation) {
            this.animation.cancel();
        }

        if(this.arrowAnimation) {
            this.arrowAnimation.cancel();
        }
    }

    OnClick(e) {
        e.preventDefault();
        this.accordion.style.overflow = 'hidden';
        
        if (this.isClosing || !this.accordion.open) {
            this.Open();
        } else if (this.isExpanding || this.accordion.open) {
            this.Shrink();
        }
    }

    Shrink() {
        this.isClosing = true;
        
        //Compute the height end stops
        const startHeight = `${this.accordion.offsetHeight + this.paddingHeight*0}px`;
        const endHeight = `calc(${this.summary.offsetHeight + this.paddingHeight}px + 1.25rem)`;

        this.HaltAnimation()
        
        // Start a WAAPI animation
        this.animation = this.accordion.animate({
            // Set the keyframes from the startHeight to endHeight
            height: [startHeight, endHeight]
        }, this.animationTiming);
        
        this.animation.onfinish = () => this.OnAnimationFinish(false);
        // If the animation is cancelled, isClosing variable is set to false
        this.animation.oncancel = () => this.isClosing = false;

        this.arrow.style.transform = "rotate(0deg)";
        let arrowAnimationKeyframes = [
            { transform: 'rotate(180deg)' },
            { transform: 'rotate(0deg)' }
        ];

        this.arrowAnimation = this.arrow.animate(arrowAnimationKeyframes, this.animationTiming);

        this.ComputeScrollingBounds(endHeight);
    }

    Open() {
        // Apply a fixed height on the element
        this.accordion.style.height = `${this.accordion.offsetHeight}px`;
        // Force the [open] attribute on the details element
        this.accordion.open = true;
        // Wait for the next frame to call the expand function
        window.requestAnimationFrame(() => this.expand());
    }

    expand() {
        // Set the element as "being expanding"
        this.isExpanding = true;
        // Get the current fixed height of the element
        const startHeight = `${this.accordion.offsetHeight}px`;
        // Calculate the open height of the element (summary height + content height)
        const endHeight = `calc(${this.summary.offsetHeight + this.content.offsetHeight + this.paddingHeight}px + 1.25rem)`;
        
        this.HaltAnimation()
        
        // Start a WAAPI animation
        this.animation = this.accordion.animate({
            // Set the keyframes from the startHeight to endHeight
            height: [startHeight, endHeight]
        }, this.animationTiming);

        this.animation.onfinish = () => this.OnAnimationFinish(true);
        // If the animation is cancelled, isExpanding variable is set to false
        this.animation.oncancel = () => this.isExpanding = false;

        this.arrow.style.transform = "rotate(180deg)";
        let arrowAnimationKeyframes = [
            { transform: 'rotate(0deg)' },
            { transform: 'rotate(180deg)' }
        ];

        this.arrowAnimation = this.arrow.animate(arrowAnimationKeyframes, this.animationTiming);

        this.ComputeScrollingBounds(endHeight);
    }

    OnAnimationFinish(open) {
        // Set the open attribute based on the parameter
        this.accordion.open = open;
        // Clear the stored animation
        this.animation = null;
        this.arrowAnimation = null;
        // Reset isClosing & isExpanding
        this.isClosing = false;
        this.isExpanding = false;
        // Remove the overflow hidden and the fixed height
        this.accordion.style.height = this.accordion.style.overflow = '';
    }
}

function LoadAccordians() {
    document.querySelectorAll('.accordian').forEach((el) => {
        new Accordion(el);
    });
}