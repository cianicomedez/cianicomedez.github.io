const galleryData = [
    {
        id: 1,
        title: "Porsche",
        description: "Where the mountains touch the clouds.",
        category: "Porsche",
        image: "porsche.jpg"
    },
    {
        id: 2,
        title: "Porsche (Blue)",
        description: "Blue waters and endless summer days.",
        category: "Porsche",
        image: "porscheblue.jpg"
    },
    {
        id: 3,
        title: "Audi R8",
        description: "The city has a different kind of magic at night.",
        category: "Sports Car",
        image: "r8.jpg"
    },
    {
        id: 4,
        title: "Mustang",
        description: "Warm light dancing across the desert.",
        category: "Sports Car",
        image: "mustang.jpg"
    },
    {
        id: 5,
        title: "Corvette C8",
        description: "A quiet moment beneath the forest canopy.",
        category: "Sports Car",
        image: "corvette.jpg"
    },
    {
        id: 6,
        title: "WSPEIRA",
        description: "Finding beauty in the smallest details.",
        category: "Eira",
        image: "wspeira2.jpg"
    },
    {
        id: 7,
        title: "WSPEIRA 2",
        description: "A peaceful shoreline beneath the sun.",
        category: "Eira",
        image: "wspeira.jpg"
    },
    {
        id: 8,
        title: "Honda Civic Type R",
        description: "The best memories begin somewhere new.",
        category: "Civic",
        image: "civic.jpg"
    },
    {
        id: 9,
        title: "Honda Civic RS Turbo",
        description: "Lines, shapes, and stories in the city.",
        category: "Civic",
        image: "civic2.jpg"
    }
];

const app = document.getElementById("app");

app.innerHTML = `
    <div class="container">

        <nav class="navbar">
            <div class="brand">
                <span class="brand-icon">✳</span>
                <span>WHEEL ARCHIVE</span>
            </div>
            <a href="https://cianicomedez.github.io/">
                <span class="nav-label">Portfolio</span>
            </a>
            <span class="nav-label">WHEEL ARCHIVE / 001</span>
        </nav>

        <header class="hero">
            <div class="eyebrow">A COLLECTION OF MOMENTS</div>
            <h1>
                Cian's Garage,<br>
                <span>Wheel Collection.</span>
            </h1>
            <p>
                Explore places in style, <br> find new places,
                and see how beautiful the world really is.
            </p>
        </header>

        <section class="toolbar">
            <label class="search-box">
                <span>⌕</span>
                <input
                    type="search"
                    id="searchInput"
                    placeholder="Search your inspiration..."
                    aria-label="Search gallery"
                >
            </label>

            <div class="filters" id="filterButtons"></div>
        </section>

        <section class="gallery-section">
            <div class="gallery-heading">
                <h2>Selected moments.</h2>
                <span class="photo-count" id="photoCount"></span>
            </div>

            <div class="gallery-grid" id="galleryGrid"></div>
        </section>

        <footer>
            CianArchives © 2026 &nbsp; · &nbsp; MADE FOR THE LOVE OF WHEELS
        </footer>

    </div>

    <div
        class="lightbox"
        id="lightbox"
        role="dialog"
        aria-modal="true"
        aria-label="Image preview"
        aria-hidden="true"
    >
        <button class="close-btn" id="closeLightbox"
            aria-label="Close image preview">×</button>

        <div class="lightbox-content">
            <img id="lightboxImage" src="" alt="">
            <h3 id="lightboxTitle"></h3>
            <p id="lightboxDescription"></p>
        </div>
    </div>
`;

const galleryGrid = document.getElementById("galleryGrid");
const filterButtons = document.getElementById("filterButtons");
const searchInput = document.getElementById("searchInput");
const photoCount = document.getElementById("photoCount");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxDescription =
    document.getElementById("lightboxDescription");

let activeCategory = "All";

const categories = [
    "All",
    ...new Set(galleryData.map(item => item.category))
];

categories.forEach(category => {
    const button = document.createElement("button");

    button.className =
        `filter-btn ${category === activeCategory ? "active" : ""}`;

    button.textContent = category;
    button.type = "button";

    button.addEventListener("click", () => {
        activeCategory = category;

        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.classList.toggle(
                "active",
                btn.textContent === activeCategory
            );
        });

        renderGallery();
    });

    filterButtons.appendChild(button);
});

function renderGallery() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    const filteredItems = galleryData.filter(item => {
        const matchesCategory =
            activeCategory === "All" ||
            item.category === activeCategory;

        const matchesSearch = [
            item.title,
            item.description,
            item.category
        ].some(value =>
            value.toLowerCase().includes(searchTerm)
        );

        return matchesCategory && matchesSearch;
    });

    galleryGrid.innerHTML = "";

    photoCount.textContent =
        `${String(filteredItems.length).padStart(2, "0")} PHOTOS`;

    if (filteredItems.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty-state";
        empty.textContent =
            "No images found. Try another search or category.";

        galleryGrid.appendChild(empty);
        return;
    }

    filteredItems.forEach((item, index) => {
        const card = document.createElement("article");
        card.className = "gallery-card";
        card.tabIndex = 0;
        card.setAttribute("role", "button");
        card.setAttribute(
            "aria-label",
            `View ${item.title}`
        );
        card.style.animationDelay = `${index * 60}ms`;

        const imageWrap = document.createElement("div");
        imageWrap.className = "image-wrap";

        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.title;
        img.loading = "lazy";
        img.decoding = "async";

        img.onerror = () => {
            img.alt = `${item.title} image unavailable`;
        };

        const number = document.createElement("span");
        number.className = "image-number";
        number.textContent =
            `NO. ${String(item.id).padStart(2, "0")}`;

        const viewIcon = document.createElement("span");
        viewIcon.className = "view-icon";
        viewIcon.textContent = "↗";
        viewIcon.setAttribute("aria-hidden", "true");

        const info = document.createElement("div");
        info.className = "gallery-info";

        const category = document.createElement("span");
        category.className = "card-category";
        category.textContent = item.category;

        const title = document.createElement("h3");
        title.textContent = item.title;

        const description = document.createElement("p");
        description.textContent = item.description;

        info.append(category, title, description);
        imageWrap.append(img, number, viewIcon);
        card.append(imageWrap, info);

        card.addEventListener("click", () => openLightbox(item));

        card.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openLightbox(item);
            }
        });

        galleryGrid.appendChild(card);
    });
}

searchInput.addEventListener("input", renderGallery);

function openLightbox(item) {
    lightboxImage.src = item.image;
    lightboxImage.alt = item.title;
    lightboxTitle.textContent = item.title;
    lightboxDescription.textContent =
        `${item.category} — ${item.description}`;

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    document.getElementById("closeLightbox").focus();
}

function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

document.getElementById("closeLightbox")
    .addEventListener("click", closeLightbox);

lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && lightbox.classList.contains("open")) {
        closeLightbox();
    }
});

renderGallery();
