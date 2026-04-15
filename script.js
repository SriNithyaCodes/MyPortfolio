// MODERN JAVASCRIPT FOR PORTFOLIO INTERACTIVITY

document.addEventListener("DOMContentLoaded", () => {
    

    // 2. Typing Effect Configuration
    const typedTextSpan = document.querySelector(".typed-text");
    const textArray = ["build interactive web experiences.", "study Computer Science Engineering.", "love writing Python code.", "innovate with technology."];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            // Typing finished, start erasing
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            // Erasing finished, move to next text
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }

    // Start typing effect immediately
    if(typedTextSpan) {
        setTimeout(type, newTextDelay + 200);
    }


    // 3. Scroll Reveal Animations via Intersection Observer
    const observerOptions = {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                // Optional: unobserve once revealed if you don't want it to fade out again on scroll
                // observer.unobserve(entry.target); 
            } else {
                // If you want elements to hide again when scrolling up, keep this. 
                // Mostly people prefer keeping them visible once loaded. Let's keep them visible.
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    // Optional: Reveal navbar instantly on load
    const navbar = document.querySelector('.navbar.hidden');
    if(navbar) {
        setTimeout(() => {
            navbar.classList.add('show');
        }, 300);
    }
});
