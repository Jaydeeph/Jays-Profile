document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // --- Initialize AOS ---
    AOS.init({
        duration: 1000, // Animation duration
        easing: "ease-in-out", // Animation easing
        once: true, // Whether animation should happen only once
        mirror: false, // Whether elements should animate out while scrolling past them
    });

    // --- Typed.js Initialization ---
    const typed = document.querySelector("#typed-text");
    if (typed) {
        let typed_strings = [
            "Software Engineer",
            "Cloud Engineer",
            "Service Operations",
            "Security Operations",
            "AI Enthusiast",
        ]; // Add your desired texts here
        typed_strings = typed_strings.map((s) => s.trim());
        new Typed("#typed-text", {
            strings: typed_strings,
            loop: true,
            typeSpeed: 80, // Speed of typing
            backSpeed: 50, // Speed of deleting
            backDelay: 2000, // Pause before deleting
            smartBackspace: true, // Only backspace what doesn't match the next string
        });
    }

    // --- Custom Smooth Scroll Function ---
    function customSmoothScroll(targetY, duration = 600) { // Duration for "snappy" feel
        const startY = window.pageYOffset;
        const distance = targetY - startY;
        let startTime = null;

        // Easing function (easeOutBack - creates the "jiggle")
        // You can adjust the 's' (overshoot) value for more/less jiggle
        function easeOutBack(t, s = 1.70158) { // s = 1.70158 is a common value
            const c1 = s;
            const c3 = c1 + 1;
            return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
        }
        // Alternative: easeOutElastic (more bouncy)

        function easeOutElastic(t) {
            const c4 = (2 * Math.PI) / 3;
            return t === 0 ? 0 : t === 1 ? 1 :
                Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
        }



        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            let progress = Math.min(timeElapsed / duration, 1); // Ensure progress doesn't exceed 1

            // Apply the easing function
            let easedProgress = easeOutBack(progress);
            // let easedProgress = easeOutElastic(progress); // Uncomment to try elastic

            window.scrollTo(0, startY + distance * easedProgress);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            } else {
                // Ensure final position is exact
                window.scrollTo(0, targetY);
            }
        }

        requestAnimationFrame(animation);
    }

    // --- Smooth Scrolling for Nav Links (Using Custom Function) ---
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            let targetId = this.getAttribute("href");
            let targetElement = document.querySelector(targetId);

            if (targetElement) {
                const targetPosition = targetElement.offsetTop;
                customSmoothScroll(targetPosition, 600); 
                updateActiveNav(targetId);
            }
        });
    });

    // --- Active Nav Link Highlighting on Scroll ---
    const sections = document.querySelectorAll("section[id]");
    const sidebarLinks = document.querySelectorAll(".sidebar .nav-menu a");

    const updateActiveNav = (forcedId = null) => {
        let currentSectionId = forcedId;

        if (!currentSectionId) {
            let scrollY = window.pageYOffset;

            sections.forEach((current) => {
                const sectionHeight = current.offsetHeight;
                // Adjust offsetTop calculation slightly for better accuracy across browsers
                const sectionTop =
                    current.getBoundingClientRect().top + window.pageYOffset - 100; // Adjust offset (100px from top)

                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    currentSectionId = `#${current.getAttribute("id")}`;
                }
            });

            // If no section is actively matched (e.g., at the very top or bottom)
            if (!currentSectionId) {
                if (window.scrollY < 200) {
                    // Close to the top
                    currentSectionId = "#home";
                } else if (
                    window.innerHeight + window.scrollY >=
                    document.body.offsetHeight - 50
                ) {
                    // Close to the bottom
                    // Find the last section's ID
                    if (sections.length > 0) {
                        currentSectionId = `#${sections[sections.length - 1].id}`;
                    }
                }
            }
        }

        sidebarLinks.forEach((link) => {
            link.parentElement.classList.remove("active");
            if (link.getAttribute("href") === currentSectionId) {
                link.parentElement.classList.add("active");
            }
        });
    };

    // Use throttle to limit how often updateActiveNav runs during scroll
    let scrollTimeout;
    window.addEventListener("scroll", () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveNav, 50); // Run check max every 50ms
    });
    updateActiveNav(); // Initial check on load

    // --- Animate Progress Bars On Scroll ---
    // Relies on AOS triggering the animation for the section/row containing the skills.
    // The actual bar filling animation is handled by CSS transitions.



    // --- Rotating Profile Image Logic ---
    const profileImageElement = document.getElementById('rotating-profile-image');
    if (profileImageElement) {
        // --- Define your image paths here ---
        const profileImages = [
            './img/jay_1.jpg',
            './img/jay_2.jpg'
        ];

        const rotationInterval = 5000; // Time each image is displayed (in milliseconds)
        const fadeTime = 500; // Must match or be slightly less than CSS transition duration (in ms)

        // Find the index of the initially displayed image
        const initialSrc = profileImageElement.getAttribute('src');
        let currentImageIndex = profileImages.indexOf(initialSrc);
        if (currentImageIndex === -1) { // If initial src not found in array, default to 0
            currentImageIndex = 0;
            profileImageElement.src = profileImages[0]; // Set to first image if not found
        }

        function rotateImage() {
            // 1. Start fade out by reducing opacity
            profileImageElement.style.opacity = '0';

            // 2. Wait for the fade-out transition to almost finish
            setTimeout(() => {
                // Calculate the next image index
                currentImageIndex = (currentImageIndex + 1) % profileImages.length;

                // Change the image source
                profileImageElement.src = profileImages[currentImageIndex];

                // 3. Start fade back in by setting opacity back to 1
                // The CSS transition will handle the smooth fade-in
                profileImageElement.style.opacity = '1';

            }, fadeTime); // Wait for fade-out duration
        }

        // Start the rotation only if there's more than one image
        if (profileImages.length > 1) {
            setInterval(rotateImage, rotationInterval);
        }
    }

    // --- Mailto Link Logic for Contact Form ---
    const mailtoButton = document.getElementById('send-mailto-button');
    const mailtoForm = document.getElementById('contact-form-mailto'); 

    if (mailtoButton && mailtoForm) { 
        mailtoForm.addEventListener('submit', function(event) {
            event.preventDefault();
        });

        mailtoButton.addEventListener('click', function(event) {
            event.preventDefault(); 
            const name = document.getElementById('contactName')?.value || '';
            const email = document.getElementById('contactEmail')?.value || '';
            const phone = document.getElementById('contactPhone')?.value || '';
            const service = document.getElementById('contactService')?.value || '';
            const message = document.getElementById('contactMessage')?.value || '';


            if (!name || !email || !message) {
                alert('Please fill in Name, Email, and Message fields.');
                console.log("Validation failed.");
                return;
            }

            const recipientEmail = "jaydeeph.vaja@gmail.com";
            const subject = "Website Contact Form Submission";
            let body = `New message from your portfolio website:\n\n`;
            body += `Name: ${name}\n`;
            body += `Email: ${email}\n`;
            body += `Phone: ${phone}\n`;
            body += `Service Chosen: ${service}\n\n`;
            body += `Message:\n${message}\n`;
            const encodedSubject = encodeURIComponent(subject);
            const encodedBody = encodeURIComponent(body);
            const mailtoLink = `mailto:${recipientEmail}?subject=${encodedSubject}&body=${encodedBody}`;
            console.log("Constructed mailto link:", mailtoLink);
            try {
                window.open(mailtoLink, '_self');
            } catch (error) {
                console.error("Error attempting to open mailto link:", error);
                alert("Could not open email client.");
            }
        }); 
    } else {
        if (!mailtoButton) console.error("DEBUG: Mailto button (#send-mailto-button) NOT FOUND!");
        if (!mailtoForm) console.error("DEBUG: Mailto form (#contact-form-mailto) NOT FOUND!");
    }


}); // End DOMContentLoaded
