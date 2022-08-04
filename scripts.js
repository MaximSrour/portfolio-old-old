class Accordion {
    constructor(el) {
        this.container = el;
        // Store the <details> element
        this.el = this.container.querySelector('details');
        // Store the <summary> element
        this.summary = this.el.querySelector('summary');
        // Store the <div class="content"> element
        this.content = this.el.querySelector('.content');

        this.arrow = this.container.querySelector('.detailArrow');
        this.arrowAnimation = null;

        // Store the animation object (so we can cancel it if needed)
        this.animation = null;
        // Store if the element is closing
        this.isClosing = false;
        // Store if the element is expanding
        this.isExpanding = false;
        // Detect user clicks on the summary element
        this.container.addEventListener('click', (e) => this.onClick(e));

        this.animationTiming = {
            duration: 400,
            easing: 'ease-in-out'
        }

        this.paddingHeight = 40;
    }

    onClick(e) {
        // Stop default behaviour from the browser
        e.preventDefault();
        // Add an overflow on the <details> to avoid content overflowing
        this.el.style.overflow = 'hidden';
        // Check if the element is being closed or is already closed
        if (this.isClosing || !this.el.open) {
            this.open();
        // Check if the element is being openned or is already open
        } else if (this.isExpanding || this.el.open) {
            this.shrink();
        }
    }

    shrink() {
        // Set the element as "being closed"
        this.isClosing = true;
        
        // Store the current height of the element
        const startHeight = `${this.el.offsetHeight + this.paddingHeight*0}px`;
        // Calculate the height of the summary
        const endHeight = `${this.summary.offsetHeight + this.paddingHeight}px`;
        
        // If there is already an animation running
        if (this.animation) {
            // Cancel the current animation
            this.animation.cancel();
        }
        
        // Start a WAAPI animation
        this.animation = this.el.animate({
            // Set the keyframes from the startHeight to endHeight
            height: [startHeight, endHeight]
        }, this.animationTiming);
        
        // When the animation is complete, call onAnimationFinish()
        this.animation.onfinish = () => this.onAnimationFinish(false);
        // If the animation is cancelled, isClosing variable is set to false
        this.animation.oncancel = () => this.isClosing = false;

        this.arrow.style.transform = "rotate(0deg)";
        let arrowAnimationKeyframes = [
            { transform: 'rotate(180deg)' },
            { transform: 'rotate(0deg)' }
        ];

        if(this.arrowAnimation) {
            this.arrowAnimation.cancel();
        }
        this.arrowAnimation = this.arrow.animate(arrowAnimationKeyframes, this.animationTiming);
    }

    open() {
        // Apply a fixed height on the element
        this.el.style.height = `${this.el.offsetHeight}px`;
        // Force the [open] attribute on the details element
        this.el.open = true;
        // Wait for the next frame to call the expand function
        window.requestAnimationFrame(() => this.expand());
    }

    expand() {
        // Set the element as "being expanding"
        this.isExpanding = true;
        // Get the current fixed height of the element
        const startHeight = `${this.el.offsetHeight}px`;
        // Calculate the open height of the element (summary height + content height)
        const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight + this.paddingHeight}px`;
        
        // If there is already an animation running
        if (this.animation) {
            // Cancel the current animation
            this.animation.cancel();
        }
        
        // Start a WAAPI animation
        this.animation = this.el.animate({
            // Set the keyframes from the startHeight to endHeight
            height: [startHeight, endHeight]
        }, this.animationTiming);
        // When the animation is complete, call onAnimationFinish()
        this.animation.onfinish = () => this.onAnimationFinish(true);
        // If the animation is cancelled, isExpanding variable is set to false
        this.animation.oncancel = () => this.isExpanding = false;

        this.arrow.style.transform = "rotate(180deg)";
        let arrowAnimationKeyframes = [
            { transform: 'rotate(0deg)' },
            { transform: 'rotate(180deg)' }
        ];

        if(this.arrowAnimation) {
            this.arrowAnimation.cancel();
        }
        this.arrowAnimation = this.arrow.animate(arrowAnimationKeyframes, this.animationTiming);
    }

    onAnimationFinish(open) {
        // Set the open attribute based on the parameter
        this.el.open = open;
        // Clear the stored animation
        this.animation = null;
        this.arrowAnimation = null;
        // Reset isClosing & isExpanding
        this.isClosing = false;
        this.isExpanding = false;
        // Remove the overflow hidden and the fixed height
        this.el.style.height = this.el.style.overflow = '';
    }
}

window.onload = function() {
    document.querySelectorAll('.accordian').forEach((el) => {
        new Accordion(el);
    });
}

