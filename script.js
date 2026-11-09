    // ----------------------------------------------------------------
    // 1. THEME MANAGEMENT, NAVBAR, SCROLL REVEAL AND ACTIVE NAVIGATION
    // ----------------------------------------------------------------

    
document.addEventListener("DOMContentLoaded", () => {
    const html = document.documentElement;
    const themeToggle = document.getElementById("themeToggle");
    const galleryFrame = document.getElementById("galleryFrame");
    const navbar = document.querySelector(".navbar");

    const navLinks = document.querySelectorAll(
        '.navbar .nav-link[href^="#"]'
    );

    // 1. THEME MANAGEMENT

    function getSavedTheme() {
        try {
            return localStorage.getItem("theme") || "dark";
        } catch {
            return "dark";
        }
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem("theme", theme);
        } catch {
            // Theme still works without storage.
        }
    }

    function updateThemeIcon(theme) {
        if (!themeToggle) return;

        const icon = themeToggle.querySelector("i");
        if (!icon) return;

        icon.classList.toggle("fa-sun", theme === "light");
        icon.classList.toggle("fa-moon", theme !== "light");

        themeToggle.setAttribute(
            "aria-label",
            theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
        );

        themeToggle.setAttribute(
            "aria-pressed",
            String(theme === "light")
        );
    }

    function syncGalleryTheme() {
        if (!galleryFrame?.contentWindow) return;

        try {
            galleryFrame.contentWindow.postMessage(
                {
                    type: "gallery-theme",
                    theme: html.getAttribute("data-theme") || "dark"
                },
                window.location.origin
            );
        } catch (error) {
            console.warn(
                "Could not synchronize gallery theme.",
                error
            );
        }
    }

    function applyTheme(theme, persist = false) {
        const selectedTheme =
            theme === "light" ? "light" : "dark";

        html.setAttribute("data-theme", selectedTheme);
        updateThemeIcon(selectedTheme);

        if (persist) {
            saveTheme(selectedTheme);
        }

        syncGalleryTheme();
    }

    applyTheme(getSavedTheme());

    themeToggle?.addEventListener("click", () => {
        const currentTheme =
            html.getAttribute("data-theme");

        applyTheme(
            currentTheme === "dark" ? "light" : "dark",
            true
        );
    });

    // 2. NAVBAR SCROLL EFFECT

    function updateNavbar() {
        if (!navbar) return;

        navbar.classList.toggle(
            "scrolled",
            window.scrollY > 35
        );
    }

    window.addEventListener("scroll", updateNavbar, {
        passive: true
    });

    updateNavbar();

    // 3. SCROLL REVEAL ANIMATIONS

    const revealElements = document.querySelectorAll(
        ".reveal, .about-card, .education-card, " +
        ".skill-card, .project-card, .service-card, .contact-card"
    );

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
        "IntersectionObserver" in window &&
        !reduceMotion
    ) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach((element) => {
            element.classList.add("reveal");
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("visible");
        });
    }

    // 4. ACTIVE NAVIGATION LINKS

    const sections = document.querySelectorAll(
        "section[id]"
    );

    function setActiveLink(id) {
        navLinks.forEach((link) => {
            const isActive =
                link.getAttribute("href") === `#${id}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                const visibleSections = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            b.intersectionRatio -
                            a.intersectionRatio
                    );

                if (visibleSections.length > 0) {
                    setActiveLink(
                        visibleSections[0].target.id
                    );
                }
            },
            {
                rootMargin: "-20% 0px -60% 0px",
                threshold: [0, 0.1, 0.25, 0.5]
            }
        );

        sections.forEach((section) => {
            sectionObserver.observe(section);
        });
    }

    // The next sections continue inside this same
    // DOMContentLoaded callback.


    // -------------------------------------------------
    // 2. MOBILE NAVIGATION, GALLERY IFRAME, FOOTER YEAR
    // -------------------------------------------------

    
    // 5. MOBILE NAVIGATION

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            const menu = document.getElementById("menu");

            if (
                menu?.classList.contains("show") &&
                window.bootstrap
            ) {
                window.bootstrap.Collapse
                    .getOrCreateInstance(menu, {
                        toggle: false
                    })
                    .hide();
            }
        });
    });

    // 6. GALLERY IFRAME

    function sendGalleryTheme() {
        syncGalleryTheme();
    }

    galleryFrame?.addEventListener(
        "load",
        sendGalleryTheme
    );

    window.addEventListener("message", (event) => {
        if (event.origin !== window.location.origin) return;
        if (!galleryFrame) return;

        if (
            event.source !== galleryFrame.contentWindow
        ) {
            return;
        }

        const data = event.data;

        if (!data || typeof data !== "object") return;

        if (data.type === "gallery-height") {
            const height = Number(data.height);

            if (
                Number.isFinite(height) &&
                height >= 100 &&
                height <= 20000
            ) {
                galleryFrame.style.height =
                    `${height}px`;
            }
        }
    });

    // 7. FOOTER YEAR

    const footerText = document.querySelector(
        ".footer-details p"
    );

    if (footerText) {
        footerText.textContent =
            footerText.textContent.replace(
                /©\s*\d{4}/,
                `© ${new Date().getFullYear()}`
            );
    }
});

    // -----------------------------
    // 3. ABOUT SECTION THEME TOGGLE
    // -----------------------------


function setPortfolioTheme(theme) {
    const selectedTheme =
        theme === "light" ? "light" : "dark";

    document.documentElement.setAttribute(
        "data-theme",
        selectedTheme
    );

    try {
        localStorage.setItem("theme", selectedTheme);
    } catch {
        // Theme still works without storage.
    }

    const themeToggle =
        document.getElementById("themeToggle");

    if (themeToggle) {
        const icon = themeToggle.querySelector("i");

        if (icon) {
            icon.classList.toggle(
                "fa-sun",
                selectedTheme === "light"
            );

            icon.classList.toggle(
                "fa-moon",
                selectedTheme === "dark"
            );
        }

        themeToggle.setAttribute(
            "aria-label",
            selectedTheme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
        );

        themeToggle.setAttribute(
            "aria-pressed",
            String(selectedTheme === "light")
        );
    }
}

window.setPortfolioTheme = setPortfolioTheme;

document
    .querySelectorAll("[data-about-theme-toggle]")
    .forEach((button) => {
        button.addEventListener("click", () => {
            const currentTheme =
                document.documentElement.getAttribute(
                    "data-theme"
                ) || "dark";

            setPortfolioTheme(
                currentTheme === "dark" ? "light" : "dark"
            );
        });
    });

    // ---------------------------------
    // 4. SPORTS AND HOBBIES COLLECTION
    // ---------------------------------


const collections = {
    Sports: [
        {
            title: "Badminton",
            description: "One of my favorite sports. I enjoy improving my footwork, speed, coordination, and strategy while playing and challenging myself.",
            tag: "Sport · Racket sport",
            icon: "fa-solid fa-table-tennis-paddle-ball",
            image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1000&q=85",
            alt: "Badminton racket and shuttlecock"
        },
        {
            title: "Basketball",
            description: "A fun way to stay active, build teamwork, and enjoy friendly competition with other players.",
            tag: "Sport · Teamwork",
            icon: "fa-solid fa-basketball",
            image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=85",
            alt: "Basketball court"
        },
        {
            title: "Running",
            description: "Running gives me time to focus, stay active, and challenge myself to keep improving at my own pace.",
            tag: "Sport · Fitness",
            icon: "fa-solid fa-person-running",
            image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1000&q=85",
            alt: "Runner training outdoors"
        },
        {
            title: "Swimming",
            description: "Swimming is a refreshing way to stay fit, build endurance, and enjoy being active in the water.",
            tag: "Sport · Endurance",
            icon: "fa-solid fa-person-swimming",
            image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1000&q=85",
            alt: "Swimming pool"
        },
        {
            title: "Cycling",
            description: "Cycling lets me explore new places, enjoy the outdoors, and work on my stamina at my own pace.",
            tag: "Sport · Outdoor",
            icon: "fa-solid fa-person-biking",
            image: "https://wallpaperaccess.com/full/1223017.jpg",
            alt: "Cyclist riding outdoors"
        },
        {
            title: "Table Tennis",
            description: "Table tennis combines quick reflexes, precision, and strategy in a fast-paced and exciting racket sport.",
            tag: "Sport · Racket sport",
            icon: "fa-solid fa-table-tennis-paddle-ball",
            image: "https://images.unsplash.com/photo-1611251135345-18c56206b863?auto=format&fit=crop&w=1000&q=85",
            alt: "Table tennis paddle and ball"
        }
    ],

    Hobbies: [
        {
            title: "Photography",
            description: "I enjoy capturing memorable moments, exploring different perspectives, and noticing the small details that make a scene special.",
            tag: "Hobby · Creativity",
            icon: "fa-solid fa-camera",
            image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1000&q=85",
            alt: "Camera used for photography"
        },
        {
            title: "Gaming",
            description: "Gaming is a way to unwind, explore imaginative worlds, and enjoy interactive experiences in my free time.",
            tag: "Hobby · Entertainment",
            icon: "fa-solid fa-gamepad",
            image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=85",
            alt: "Gaming setup"
        },
        {
            title: "Music",
            description: "Listening to music helps me relax, recharge, and find inspiration while working on creative projects.",
            tag: "Hobby · Relaxation",
            icon: "fa-solid fa-headphones",
            image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1000&q=85",
            alt: "Musician performing with a microphone"
        },
        {
            title: "Reading",
            description: "Reading helps me discover new ideas, explore different perspectives, and enjoy a quiet moment away from distractions.",
            tag: "Hobby · Learning",
            icon: "fa-solid fa-book-open",
            image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1000&q=85",
            alt: "Books ready for reading"
        },
        {
            title: "Cooking",
            description: "I enjoy experimenting with ingredients, learning new recipes, and creating delicious meals to share with others.",
            tag: "Hobby · Food",
            icon: "fa-solid fa-utensils",
            image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=85",
            alt: "Preparing food in a kitchen"
        },
        {
            title: "Travel",
            description: "Exploring new places gives me the chance to experience different cultures, discover beautiful scenery, and make memories.",
            tag: "Hobby · Exploration",
            icon: "fa-solid fa-plane",
            image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=85",
            alt: "Travel scenery"
        }
    ]
};

    // ---------------------------------
    // 5. SPORTS AND HOBBIES CAROUSEL
    // ---------------------------------


let category = "Sports";
let currentIndex = 0;
let isAnimating = false;
let resizeTimer;

const title = document.getElementById("categoryTitle");
const toggle = document.getElementById("categoryToggle");
const track = document.getElementById("track");
const dots = document.getElementById("dots");
const counter = document.getElementById("counter");
const viewport = document.getElementById("viewport");

function getVisibleCount() {
    if (window.innerWidth <= 550) return 1;
    if (window.innerWidth <= 850) return 2;
    return 3;
}

function getMaxIndex() {
    return Math.max(
        0,
        collections[category].length - getVisibleCount()
    );
}

function updatePosition() {
    const slide = track.querySelector(".slide");
    if (!slide) return;

    const slideWidth =
        slide.getBoundingClientRect().width;

    track.style.transform =
        `translateX(${-currentIndex * slideWidth}px)`;
}

function renderSlides() {
    const items = collections[category];
    const visible = getVisibleCount();

    track.innerHTML = items.map((item, index) => `
        <article class="slide"
                 aria-label="${index + 1} of ${items.length}">
            <div class="hobby-card">
                <div class="image-wrap">
                    <img
                        src="${item.image}"
                        alt="${item.alt}"
                        loading="${index < visible ? "eager" : "lazy"}"
                    >
                </div>

                <div class="card-content">
                    <span class="category-tag">
                        <i class="${item.icon}" aria-hidden="true"></i>
                        ${item.tag}
                    </span>

                    <h2>${item.title}</h2>
                    <p>${item.description}</p>
                </div>
            </div>
        </article>
    `).join("");

    track.style.transition = "none";

    updatePosition();
    renderDots();
    updateCounter();

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            track.style.transition =
                "transform 450ms cubic-bezier(.2, .7, .2, 1)";
        });
    });
}

function renderDots() {
    const maxIndex = getMaxIndex();

    dots.innerHTML = Array.from(
        { length: maxIndex + 1 },
        (_, index) => `
            <button
                class="dot ${index === currentIndex ? "active" : ""}"
                type="button"
                aria-label="Show cards starting at position ${index + 1}"
                aria-current="${index === currentIndex ? "true" : "false"}"
                data-index="${index}">
            </button>
        `
    ).join("");
}

function updateCounter() {
    const total = collections[category].length;

    const lastVisible = Math.min(
        currentIndex + getVisibleCount(),
        total
    );

    counter.textContent =
        `${String(currentIndex + 1).padStart(2, "0")}–` +
        `${String(lastVisible).padStart(2, "0")} / ` +
        `${String(total).padStart(2, "0")}`;

    title.textContent = category;
}

function goToSlide(index) {
    if (isAnimating) return;

    const nextIndex = Math.max(
        0,
        Math.min(index, getMaxIndex())
    );

    if (nextIndex === currentIndex) return;

    isAnimating = true;
    currentIndex = nextIndex;

    updatePosition();
    renderDots();
    updateCounter();

    window.setTimeout(() => {
        isAnimating = false;
    }, 460);
}

function switchCategory() {
    category =
        category === "Sports" ? "Hobbies" : "Sports";

    currentIndex = 0;
    isAnimating = false;

    if (title.animate) {
        title.animate(
            [
                {
                    opacity: 0,
                    transform: "translateY(8px)"
                },
                {
                    opacity: 1,
                    transform: "translateY(0)"
                }
            ],
            {
                duration: 300,
                easing: "ease-out"
            }
        );
    }

    renderSlides();
}

document.getElementById("prevButton")
    ?.addEventListener("click", () => {
        goToSlide(currentIndex - 1);
    });

document.getElementById("nextButton")
    ?.addEventListener("click", () => {
        goToSlide(currentIndex + 1);
    });

toggle?.addEventListener("click", switchCategory);

dots?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-index]");

    if (button) {
        goToSlide(Number(button.dataset.index));
    }
});

// Touch swipe support

let touchStartX = 0;
let touchStartY = 0;

viewport?.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
    touchStartY = event.changedTouches[0].clientY;
}, { passive: true });

viewport?.addEventListener("touchend", (event) => {
    const deltaX =
        event.changedTouches[0].clientX - touchStartX;

    const deltaY =
        event.changedTouches[0].clientY - touchStartY;

    if (
        Math.abs(deltaX) > 45 &&
        Math.abs(deltaX) > Math.abs(deltaY)
    ) {
        goToSlide(
            currentIndex + (deltaX < 0 ? 1 : -1)
        );
    }
}, { passive: true });

// Keyboard navigation

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
        goToSlide(currentIndex + 1);
    } else if (event.key === "ArrowLeft") {
        goToSlide(currentIndex - 1);
    }
});

// Responsive recalculation

window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);

    resizeTimer = window.setTimeout(() => {
        currentIndex = Math.min(
            currentIndex,
            getMaxIndex()
        );

        isAnimating = false;
        renderSlides();
    }, 100);
});

renderSlides();

    // -----------------
    // 6. FAQ ACCORDION
    // -----------------


document.querySelectorAll(".faq-question").forEach(
    (button) => {
        button.addEventListener("click", () => {
            const currentItem =
                button.closest(".faq-item");

            if (!currentItem) return;

            const isOpen =
                currentItem.classList.contains("active");

            // Close all FAQ items.
            document.querySelectorAll(".faq-item").forEach(
                (item) => {
                    item.classList.remove("active");

                    const question =
                        item.querySelector(".faq-question");

                    question?.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }
            );

            // Reopen the clicked item only if it was closed.
            if (!isOpen) {
                currentItem.classList.add("active");

                button.setAttribute(
                    "aria-expanded",
                    "true"
                );
            }
        });
    }
);

    // --------------------
    // 7. OVERLAP CAROUSEL
    // --------------------


(() => {
    const carousel =
        document.getElementById("overlapCarousel");

    if (!carousel || carousel.dataset.initialized) return;

    carousel.dataset.initialized = "true";

    const track =
        carousel.querySelector(".carousel-track");

    const viewport =
        carousel.querySelector(".carousel-viewport");

    const prevButton =
        carousel.querySelector(".carousel-prev");

    const nextButton =
        carousel.querySelector(".carousel-next");

    if (
        !track ||
        !viewport ||
        !prevButton ||
        !nextButton
    ) {
        return;
    }

    const cardData = [
        {
            title: "Virtual Library",
            description: "A digital library system designed to organize, manage, and easily search study notes and learning materials.",
            image: "visuals/virtual-library.png",
            color: "#4263eb",
        },
        {
            title: "Echo Protocol",
            description: "A tactical shooter game developed using Python and Pygame, featuring strategic gameplay and action-oriented mechanics.",
            image: "visuals/echo.jpg",
            color: "#198754",
        },
        {
            title: "ToneZone",
            description: "An exercise-tracking application designed to help users monitor workouts and stay consistent with their gym and calisthenics routines.",
            image: "visuals/tonezone.png",
            color: "#ed7952",
        },
        {
            title: "ToDo List App",
            description: "A simple yet effective to-do list application designed to help users organize their tasks and boost productivity.",
            image: "visuals/todo.jpg",
            color: "#0c185e",
        },
        {
            title: "Portfolio Website",
            description: "A personal portfolio built with HTML, CSS, and JavaScript to showcase my skills, interests, projects, and web development journey.",
            image: "visuals/personalportfolio.jpg",
            color: "#7657f6",
            buttonText: "View Portfolio",
            link: ""
        },
        {
            title: "Activity 2: Cian Archives — Wheel Gallery",
            description: "A dark-themed automotive gallery showcasing Porsche, Audi, Mustang, Corvette, WSPEIRA, and Honda Civic collections. Features category filters, live search, animated image cards, and an interactive lightbox preview, built with HTML, CSS, and JavaScript.",
            image: "visuals/wheelgallery.jpg",
            color: "#9b7bff",
            buttonText: "Explore Archives",
            link: "json/index.html"
        },
        {
            title: "Activity 1: Bento Gallery",
            description: "A responsive photo gallery built with HTML, CSS, and Bootstrap, featuring a bento-style grid layout that arranges images into different-sized tiles for desktop and mobile screens.",
            image: "visuals/bento.jpg",
            color: "#34495e",
            buttonText: "View Project",
            link: "Bento/bento.html"
        },
        {
            title: "Activity 3: Minecraft API",
            description: "A fan-made Minecraft API website that provides information about mobs, items, blocks, and biomes. Built with HTML, CSS, and JavaScript, it features a responsive design, search functionality, and interactive elements.",
            image: "visuals/mcapi.jpg",
            color: "#f10c0c",
            buttonText: "View API",
            link: "api/index.html"
        }
    ];

    let activeIndex = 0;
    let startX = 0;
    let isDragging = false;

    const visibleRange = 2;
    const overlap = 0.82;

    // Create cards.

const cards = cardData.map((item, index) => {
    const card = document.createElement("article");

    card.className = "carousel-card";

    card.style.setProperty(
        "--card-color",
        item.color || "#536dfe"
    );

    if (item.image) {
        const img = document.createElement("img");

        img.className = "carousel-image";
        img.src = item.image;
        img.alt = item.title || `Card ${index + 1}`;
        img.draggable = false;

        card.appendChild(img);
    }

    const content = document.createElement("div");
    content.className = "carousel-content";

    const heading = document.createElement("h3");
    heading.textContent =
        item.title || `Card ${index + 1}`;

    content.appendChild(heading);

    const description = document.createElement("p");
    description.textContent = item.description || "";

    content.appendChild(description);

    // Create button only if buttonText and link exist.
    if (item.buttonText && item.link) {
        const button = document.createElement("a");

        button.className = "carousel-button";
        button.textContent = item.buttonText;
        button.href = item.link;

        content.appendChild(button);
    }

    card.appendChild(content);
    track.appendChild(card);

    return card;
});

    // Calculate each card's distance from the active card.

    function getDistance(index) {
        let distance = index - activeIndex;

        if (distance > cards.length / 2) {
            distance -= cards.length;
        }

        if (distance < -cards.length / 2) {
            distance += cards.length;
        }

        return distance;
    }

    // Position and style cards.

    function render() {
        if (!cards.length) return;

        const cardWidth = cards[0].offsetWidth;
        const spacing = cardWidth * overlap;

        cards.forEach((card, index) => {
            const distance = getDistance(index);
            const absDistance = Math.abs(distance);

            const isVisible =
                cards.length <= 5 ||
                absDistance <= visibleRange;

            let scale = 1;
            let opacity = 1;

            if (absDistance === 1) {
                scale = 0.86;
                opacity = 0.95;
            } else if (absDistance >= 2) {
                scale = 0.72;
                opacity = 0.82;
            }

            card.style.setProperty(
                "--x",
                `${distance * spacing}px`
            );

            card.style.setProperty("--scale", scale);
            card.style.setProperty("--opacity", opacity);
            card.style.setProperty(
                "--z",
                cards.length - absDistance
            );

            card.style.visibility =
                isVisible ? "visible" : "hidden";

            card.style.pointerEvents =
                isVisible ? "auto" : "none";

            card.classList.toggle(
                "active",
                distance === 0
            );

            card.setAttribute(
                "aria-hidden",
                String(!isVisible)
            );
        });

        prevButton.disabled = cards.length <= 1;
        nextButton.disabled = cards.length <= 1;
    }

    // Infinite navigation.

    function move(step) {
        if (cards.length <= 1) return;

        activeIndex =
            (activeIndex + step + cards.length) %
            cards.length;

        render();
    }

    prevButton.addEventListener("click", () => move(-1));
    nextButton.addEventListener("click", () => move(1));

    // Swipe support.

    viewport.addEventListener("pointerdown", (event) => {
        if (
            event.pointerType === "mouse" &&
            event.button !== 0
        ) {
            return;
        }

        startX = event.clientX;
        isDragging = true;
    });

    viewport.addEventListener("pointerup", (event) => {
        if (!isDragging) return;

        isDragging = false;

        const deltaX = event.clientX - startX;

        if (Math.abs(deltaX) > 45) {
            move(deltaX < 0 ? 1 : -1);
        }
    });

    viewport.addEventListener("pointercancel", () => {
        isDragging = false;
    });

    // Keyboard navigation.

    carousel.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            move(-1);
        }

        if (event.key === "ArrowRight") {
            event.preventDefault();
            move(1);
        }
    });

    // Responsive layout.

    let resizeFrame;

    window.addEventListener("resize", () => {
        cancelAnimationFrame(resizeFrame);

        resizeFrame = requestAnimationFrame(render);
    });

    render();
})();


/* ==========================================
   PROJECTS CAROUSEL
   Independent carousel with no category toggle.
========================================== */

(() => {
    const track = document.getElementById("projectTrack");
    const viewport = document.getElementById("projectViewport");
    const prevButton = document.getElementById("projectPrev");
    const nextButton = document.getElementById("projectNext");
    const counter = document.getElementById("projectCounter");
    const dots = document.getElementById("projectDots");

    if (
        !track ||
        !viewport ||
        !prevButton ||
        !nextButton ||
        !counter ||
        !dots
    ) {
        return;
    }

    const projects = [
        {
            title: "Virtual Library",
            tag: "Application Development",
            icon: "fa-solid fa-book-open",
            description:
                "A digital library concept for uploading, organizing, searching, and reviewing personal study notes.",
            image:
                "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1000&q=85",
            alt: "Library shelves filled with books"
        },
        {
            title: "Echo Protocol",
            tag: "Game Development",
            icon: "fa-solid fa-gamepad",
            description:
                "A tactical shooter built with Python and Pygame, featuring enemy AI, missions, character classes, and inventory mechanics.",
            image:
                "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=85",
            alt: "Gaming setup with a computer and monitor"
        },
        {
            title: "ToneZone",
            tag: "Desktop Application",
            icon: "fa-solid fa-dumbbell",
            description:
                "An exercise-tracking application concept designed to organize gym routines and calisthenics workouts.",
            image:
                "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=85",
            alt: "Modern gym with exercise equipment"
        },
        {
            title: "Portfolio Website",
            tag: "Web Development",
            icon: "fa-solid fa-code",
            description:
                "A personal portfolio built with HTML, CSS, and JavaScript to showcase projects, technical skills, interests, and achievements.",
            image:
                "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1000&q=85",
            alt: "Code displayed on a computer screen"
        }
    ];

    let currentIndex = 0;
    let resizeTimer;
    let touchStartX = 0;
    let touchStartY = 0;

    function getVisibleCount() {
        if (window.innerWidth <= 550) return 1;
        if (window.innerWidth <= 850) return 2;
        return 3;
    }

    function getMaxIndex() {
        return Math.max(
            0,
            projects.length - getVisibleCount()
        );
    }

    function renderSlides() {
        track.innerHTML = projects.map((project, index) => `
            <article
                class="slide"
                aria-label="${index + 1} of ${projects.length}"
            >
                <div class="hobby-card">
                    <div class="image-wrap">
                        <img
                            src="${project.image}"
                            alt="${project.alt}"
                            loading="${index < getVisibleCount()
                                ? "eager"
                                : "lazy"}"
                            draggable="false"
                        >
                    </div>

                    <div class="card-content">
                        <span class="category-tag">
                            <i class="${project.icon}"
                               aria-hidden="true"></i>
                            ${project.tag}
                        </span>

                        <h2>${project.title}</h2>
                        <p>${project.description}</p>
                    </div>
                </div>
            </article>
        `).join("");

        updateCarousel(false);
    }

    function updateCarousel(animate = true) {
        const slide = track.querySelector(".slide");

        if (!slide) return;

        const slideWidth = slide.getBoundingClientRect().width;

        track.style.transition = animate
            ? "transform 450ms cubic-bezier(.2, .7, .2, 1)"
            : "none";

        track.style.transform =
            `translateX(-${currentIndex * slideWidth}px)`;

        renderDots();
        updateCounter();
    }

    function renderDots() {
        const maxIndex = getMaxIndex();

        dots.innerHTML = Array.from(
            { length: maxIndex + 1 },
            (_, index) => `
                <button
                    class="dot ${index === currentIndex ? "active" : ""}"
                    type="button"
                    data-index="${index}"
                    aria-label="Show projects starting at position ${index + 1}"
                    aria-current="${index === currentIndex ? "true" : "false"}"
                ></button>
            `
        ).join("");
    }

    function updateCounter() {
        const visible = getVisibleCount();
        const lastVisible = Math.min(
            currentIndex + visible,
            projects.length
        );

        counter.textContent =
            `${String(currentIndex + 1).padStart(2, "0")}–` +
            `${String(lastVisible).padStart(2, "0")} / ` +
            `${String(projects.length).padStart(2, "0")}`;
    }

    function goToSlide(index) {
        currentIndex = Math.max(
            0,
            Math.min(index, getMaxIndex())
        );

        updateCarousel();
    }

    prevButton.addEventListener("click", () => {
        goToSlide(currentIndex - 1);
    });

    nextButton.addEventListener("click", () => {
        goToSlide(currentIndex + 1);
    });

    dots.addEventListener("click", (event) => {
        const button = event.target.closest("[data-index]");

        if (button) {
            goToSlide(Number(button.dataset.index));
        }
    });

    // Swipe support for touchscreens.
    viewport.addEventListener("touchstart", (event) => {
        touchStartX = event.changedTouches[0].clientX;
        touchStartY = event.changedTouches[0].clientY;
    }, { passive: true });

    viewport.addEventListener("touchend", (event) => {
        const deltaX =
            event.changedTouches[0].clientX - touchStartX;

        const deltaY =
            event.changedTouches[0].clientY - touchStartY;

        if (
            Math.abs(deltaX) > 45 &&
            Math.abs(deltaX) > Math.abs(deltaY)
        ) {
            goToSlide(
                currentIndex + (deltaX < 0 ? 1 : -1)
            );
        }
    }, { passive: true });

    // Keep the carousel aligned when the screen is resized.
    window.addEventListener("resize", () => {
        window.clearTimeout(resizeTimer);

        resizeTimer = window.setTimeout(() => {
            currentIndex = Math.min(
                currentIndex,
                getMaxIndex()
            );

            updateCarousel(false);
        }, 120);
    });

    renderSlides();
})();
