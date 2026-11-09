/* =====================================================
   MINECRAFT ARCHIVE
   Data source: Minecraft Wiki MediaWiki API
===================================================== */

const API_URL = "https://minecraft.wiki/api.php";

const MOB_SEEDS = [
    // PASSIVE
    { name: "Allay", type: "passive" },
    { name: "Armadillo", type: "passive" },
    { name: "Axolotl", type: "passive" },
    { name: "Bat", type: "passive" },
    { name: "Camel", type: "passive" },
    { name: "Cat", type: "passive" },
    { name: "Chicken", type: "passive" },
    { name: "Cod", type: "passive" },
    { name: "Cow", type: "passive" },
    { name: "Donkey", type: "passive" },
    { name: "Frog", type: "passive" },
    { name: "Glow Squid", type: "passive" },
    { name: "Horse", type: "passive" },
    { name: "Mooshroom", type: "passive" },
    { name: "Mule", type: "passive" },
    { name: "Ocelot", type: "passive" },
    { name: "Parrot", type: "passive" },
    { name: "Pig", type: "passive" },
    { name: "Rabbit", type: "passive" },
    { name: "Salmon", type: "passive" },
    { name: "Sheep", type: "passive" },
    { name: "Sniffer", type: "passive" },
    { name: "Snow Golem", type: "passive" },
    { name: "Squid", type: "passive" },
    { name: "Strider", type: "passive" },
    { name: "Tadpole", type: "passive" },
    { name: "Tropical Fish", type: "passive" },
    { name: "Turtle", type: "passive" },
    { name: "Villager", type: "passive" },
    { name: "Wandering Trader", type: "passive" },

    // NEUTRAL
    { name: "Bee", type: "neutral" },
    { name: "Cave Spider", type: "neutral" },
    { name: "Dolphin", type: "neutral" },
    { name: "Drowned", type: "neutral" },
    { name: "Enderman", type: "neutral" },
    { name: "Fox", type: "neutral" },
    { name: "Goat", type: "neutral" },
    { name: "Iron Golem", type: "neutral" },
    { name: "Llama", type: "neutral" },
    { name: "Panda", type: "neutral" },
    { name: "Piglin", type: "neutral" },
    { name: "Polar Bear", type: "neutral" },
    { name: "Pufferfish", type: "neutral" },
    { name: "Spider", type: "neutral" },
    { name: "Wolf", type: "neutral" },
    { name: "Zombified Piglin", type: "neutral" },

    // HOSTILE
    { name: "Blaze", type: "hostile" },
    { name: "Bogged", type: "hostile" },
    { name: "Breeze", type: "hostile" },
    { name: "Creaking", type: "hostile" },
    { name: "Creeper", type: "hostile" },
    { name: "Elder Guardian", type: "hostile" },
    { name: "Endermite", type: "hostile" },
    { name: "Evoker", type: "hostile" },
    { name: "Ghast", type: "hostile" },
    { name: "Guardian", type: "hostile" },
    { name: "Hoglin", type: "hostile" },
    { name: "Husk", type: "hostile" },
    { name: "Magma Cube", type: "hostile" },
    { name: "Phantom", type: "hostile" },
    { name: "Piglin Brute", type: "hostile" },
    { name: "Pillager", type: "hostile" },
    { name: "Ravager", type: "hostile" },
    { name: "Shulker", type: "hostile" },
    { name: "Silverfish", type: "hostile" },
    { name: "Skeleton", type: "hostile" },
    { name: "Slime", type: "hostile" },
    { name: "Stray", type: "hostile" },
    { name: "Vex", type: "hostile" },
    { name: "Vindicator", type: "hostile" },
    { name: "Warden", type: "hostile" },
    { name: "Witch", type: "hostile" },
    { name: "Wither Skeleton", type: "hostile" },
    { name: "Zoglin", type: "hostile" },
    { name: "Zombie", type: "hostile" },
    { name: "Zombie Villager", type: "hostile" },

    // BOSSES
    { name: "Ender Dragon", type: "boss" },
    { name: "Wither", type: "boss" }
];

let mobs = [];
let filteredMobs = [];

let activeFilter = "all";
let currentPage = 1;
const pageSize = 12;

// DOM ELEMENTS
const mobGrid = document.getElementById("mobGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

const loadingState = document.getElementById("loadingState");
const errorState = document.getElementById("errorState");
const emptyState = document.getElementById("emptyState");

const resultCount = document.getElementById("resultCount");

const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");

const modal = document.getElementById("mobModal");
const modalImage = document.getElementById("modalImage");
const modalName = document.getElementById("modalName");
const modalCategory = document.getElementById("modalCategory");
const modalDescription = document.getElementById("modalDescription");
const wikiLink = document.getElementById("wikiLink");


/* =====================================================
   FETCH MOBS
===================================================== */

async function fetchMobBatch(batch) {
    const params = new URLSearchParams({
        action: "query",
        format: "json",
        origin: "*",
        redirects: "1",
        prop: "pageimages|extracts|info",
        inprop: "url",
        piprop: "thumbnail",
        pithumbsize: "600",
        exintro: "1",
        explaintext: "1",
        exsentences: "3",
        titles: batch.map(mob => mob.name).join("|")
    });

    const response = await fetch(`${API_URL}?${params}`);

    if (!response.ok) {
        throw new Error("Minecraft Wiki API request failed.");
    }

    const data = await response.json();

    if (data.error) {
        throw new Error(data.error.info || "Minecraft Wiki API error.");
    }

    return Object.values(data.query?.pages || {});
}


/* =====================================================
   HERO STEVE IMAGE
===================================================== */

async function loadHeroSteve() {
    const steveImage = document.getElementById("heroSteve");

    if (!steveImage) {
        console.warn("Steve image element #heroSteve was not found.");
        return;
    }

    const params = new URLSearchParams({
        action: "query",
        format: "json",
        origin: "*",
        redirects: "1",
        prop: "pageimages",
        piprop: "thumbnail",
        pithumbsize: "800",
        titles: "Steve"
    });

    try {
        const response = await fetch(`${API_URL}?${params}`);

        if (!response.ok) {
            throw new Error(`Steve API request failed: HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.info || "Steve API error.");
        }

        const page = Object.values(data.query?.pages || {})[0];
        const imageUrl = page?.thumbnail?.source;

        if (!imageUrl) {
            console.error(
                "The Minecraft Wiki API returned no thumbnail for Steve.",
                page
            );
            return;
        }

        steveImage.onload = () => {
            steveImage.style.display = "block";
            console.log("Steve image loaded successfully.");
        };

        steveImage.onerror = () => {
            console.error("Steve thumbnail could not be loaded:", imageUrl);
            steveImage.style.display = "none";
        };

        steveImage.src = imageUrl;

    } catch (error) {
        console.error("Steve image loading failed:", error);
    }
}


/* =====================================================
   LOAD MOBS
===================================================== */

async function loadMobs() {
    loadingState.hidden = false;
    errorState.hidden = true;
    mobGrid.innerHTML = "";

    try {
        const batches = [];

        for (let i = 0; i < MOB_SEEDS.length; i += 40) {
            batches.push(MOB_SEEDS.slice(i, i + 40));
        }

        const results = await Promise.all(
            batches.map(fetchMobBatch)
        );

        const pages = results.flat();

        const pageMap = new Map(
            pages.map(page => [
                normalizeName(page.title),
                page
            ])
        );

        mobs = MOB_SEEDS.map(seed => {
            const page = pageMap.get(normalizeName(seed.name));

            if (!page || page.missing !== undefined) {
                return null;
            }

            return {
                name: page.title,
                type: seed.type,
                description:
                    page.extract ||
                    "No description is available for this mob.",
                image: page.thumbnail?.source || "",
                wiki: page.fullurl ||
                    `https://minecraft.wiki/w/${encodeURIComponent(
                        page.title.replaceAll(" ", "_")
                    )}`
            };
        }).filter(Boolean);

        if (!mobs.length) {
            throw new Error("No mob records were returned.");
        }

        updateStatistics();
        applyFilters();

        loadingState.hidden = true;

    } catch (error) {
        console.error("Minecraft archive:", error);

        loadingState.hidden = true;
        errorState.hidden = false;
        resultCount.textContent = "Unable to load data";
    }
}


function normalizeName(name) {
    return name.trim().toLowerCase().replaceAll("_", " ");
}


/* =====================================================
   STATISTICS
===================================================== */

function updateStatistics() {
    document.getElementById("totalMobs").textContent = mobs.length;

    document.getElementById("passiveCount").textContent =
        mobs.filter(m => m.type === "passive").length;

    document.getElementById("neutralCount").textContent =
        mobs.filter(m => m.type === "neutral").length;

    document.getElementById("hostileCount").textContent =
        mobs.filter(m => m.type === "hostile").length;
}


/* =====================================================
   FILTER AND SEARCH
===================================================== */

function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();

    filteredMobs = mobs.filter(mob => {
        const matchesSearch =
            mob.name.toLowerCase().includes(query) ||
            mob.description.toLowerCase().includes(query);

        const matchesFilter =
            activeFilter === "all" ||
            mob.type === activeFilter;

        return matchesSearch && matchesFilter;
    });

    if (sortSelect.value === "az") {
        filteredMobs.sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    } else {
        filteredMobs.sort((a, b) =>
            b.name.localeCompare(a.name)
        );
    }

    currentPage = 1;
    renderMobs();
}


/* =====================================================
   RENDER MOB CARDS
===================================================== */

function renderMobs() {
    mobGrid.innerHTML = "";

    const totalPages = Math.max(
        1,
        Math.ceil(filteredMobs.length / pageSize)
    );

    currentPage = Math.min(currentPage, totalPages);

    const start = (currentPage - 1) * pageSize;

    const visibleMobs = filteredMobs.slice(
        start,
        start + pageSize
    );

    resultCount.textContent =
        `${filteredMobs.length} mobs found`;

    emptyState.hidden = filteredMobs.length !== 0;

    visibleMobs.forEach(mob => {
        const card = document.createElement("article");
        card.className = "mc-mob-card";

        const imageArea = document.createElement("div");
        imageArea.className = "mc-mob-image";

        if (mob.image) {
            const img = document.createElement("img");

            img.src = mob.image;
            img.alt = mob.name;
            img.loading = "lazy";

            img.onerror = () => {
                imageArea.innerHTML =
                    `<span class="mc-image-fallback">${escapeHTML(
                        mob.name.charAt(0)
                    )}</span>`;
            };

            imageArea.appendChild(img);

        } else {
            imageArea.innerHTML =
                `<span class="mc-image-fallback">${escapeHTML(
                    mob.name.charAt(0)
                )}</span>`;
        }

        const info = document.createElement("div");
        info.className = "mc-mob-info";

        const tag = document.createElement("span");
        tag.className = "mc-tag";
        tag.textContent = mob.type;

        const title = document.createElement("h3");
        title.textContent = mob.name;

        const description = document.createElement("p");
        description.textContent = mob.description;

        const link = document.createElement("span");
        link.className = "mc-view-link";
        link.textContent = "View details →";

        info.append(tag, title, description, link);
        card.append(imageArea, info);

        card.addEventListener("click", () => openModal(mob));

        mobGrid.appendChild(card);
    });

    // NUMBERED PAGINATION
    const pageNumbers = [];

    function addPageButton(page) {
        pageNumbers.push(`
            <button
                type="button"
                class="mc-page-number ${page === currentPage ? "active" : ""}"
                data-page="${page}"
                aria-current="${page === currentPage ? "page" : "false"}">
                ${page}
            </button>
        `);
    }

    if (totalPages <= 5) {
        for (let page = 1; page <= totalPages; page++) {
            addPageButton(page);
        }

    } else if (currentPage <= 2) {
        addPageButton(1);
        addPageButton(2);
        pageNumbers.push('<span class="mc-page-ellipsis">...</span>');
        addPageButton(totalPages);

    } else if (currentPage >= totalPages - 1) {
        addPageButton(1);
        pageNumbers.push('<span class="mc-page-ellipsis">...</span>');
        addPageButton(totalPages - 1);
        addPageButton(totalPages);

    } else {
        addPageButton(1);
        pageNumbers.push('<span class="mc-page-ellipsis">...</span>');
        addPageButton(currentPage - 1);
        addPageButton(currentPage);
        addPageButton(currentPage + 1);
        pageNumbers.push('<span class="mc-page-ellipsis">...</span>');
        addPageButton(totalPages);
    }

    pageInfo.innerHTML = pageNumbers.join("");

    prevPage.disabled = currentPage === 1;
    nextPage.disabled = currentPage === totalPages;
}


/* =====================================================
   DETAIL MODAL
===================================================== */


/* =====================================================
   WIKI MOB DETAILS
===================================================== */

let currentDetailRequest = 0;

function createDetailsContainer() {
    const modalInfo = document.querySelector(".mc-modal-info");

    let container = document.getElementById("modalWikiDetails");

    if (!container) {
        container = document.createElement("section");
        container.id = "modalWikiDetails";
        container.className = "mc-wiki-details";

        const wikiLink = document.getElementById("wikiLink");

        modalInfo.insertBefore(container, wikiLink);
    }

    return container;
}


/* FETCH THE MOB'S FULL WIKI INFOBOX */

async function fetchMobDetails(mob) {
    const params = new URLSearchParams({
        action: "parse",
        page: mob.name,
        prop: "text",
        format: "json",
        formatversion: "2",
        origin: "*",
        disableeditsection: "1"
    });

    const response = await fetch(`${API_URL}?${params}`);

    if (!response.ok) {
        throw new Error("Unable to retrieve Wiki information.");
    }

    const data = await response.json();

    if (data.error) {
        throw new Error(data.error.info || "Wiki API error.");
    }

    const html = data.parse?.text;

    if (!html) {
        throw new Error("No Wiki article content was returned.");
    }

    const parser = new DOMParser();
    const documentHTML = parser.parseFromString(html, "text/html");

    const infobox = documentHTML.querySelector(
        "table.infobox, .infobox table, table[class*='infobox']"
    );

    if (!infobox) {
        return [];
    }

    const rows = Array.from(infobox.querySelectorAll("tr"));

    return rows
        .filter(row => row.closest("table") === infobox)
        .map(row => {
            const label = row.querySelector(":scope > th");
            const value = row.querySelector(":scope > td");

            if (!label || !value) return null;

            return {
                label: label.innerText.trim().replace(/\s+/g, " "),
                value: value.innerText.trim().replace(/\s+/g, " ")
            };
        })
        .filter(item => item && item.label && item.value);
}


/* DISPLAY WIKI DETAILS */

function renderMobDetails(details) {
    const container = createDetailsContainer();

    container.innerHTML = "";

    const heading = document.createElement("h3");
    heading.textContent = "Mob Information";

    container.appendChild(heading);

    if (!details.length) {
        const message = document.createElement("p");
        message.className = "mc-details-message";
        message.textContent =
            "No structured information table was found for this mob. Visit the Wiki article for more information.";

        container.appendChild(message);
        return;
    }

    const table = document.createElement("table");
    table.className = "mc-wiki-table";

    details.forEach(detail => {
        const row = document.createElement("tr");

        const label = document.createElement("th");
        label.textContent = detail.label;

        const value = document.createElement("td");
        value.textContent = detail.value;

        row.append(label, value);
        table.appendChild(row);
    });

    container.appendChild(table);
}


/* =====================================================
   DETAIL MODAL
===================================================== */

async function openModal(mob) {
    const requestId = ++currentDetailRequest;

    modalName.textContent = mob.name;
    modalCategory.textContent = mob.type;
    modalDescription.textContent = mob.description;

    wikiLink.href = mob.wiki;
    wikiLink.target = "_blank";
    wikiLink.rel = "noopener noreferrer";

    modalImage.onerror = () => {
        modalImage.style.display = "none";
    };

    modalImage.style.display = mob.image ? "block" : "none";
    modalImage.src = mob.image || "";
    modalImage.alt = mob.name;

    const detailsContainer = createDetailsContainer();

    detailsContainer.innerHTML = `
        <h3>Mob Information</h3>
        <p class="mc-details-message">Loading information from Minecraft Wiki...</p>
    `;

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    try {
        const details = await fetchMobDetails(mob);

        // Prevent an older request from replacing the current mob's details.
        if (requestId !== currentDetailRequest) return;

        renderMobDetails(details);

    } catch (error) {
        console.error("Unable to load mob information:", error);

        if (requestId !== currentDetailRequest) return;

        detailsContainer.innerHTML = `
            <h3>Mob Information</h3>
            <p class="mc-details-message">
                Unable to load the Wiki information. Please try again or visit the Wiki article.
            </p>
        `;
    }
}


function closeModal() {
    currentDetailRequest++;

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";
}



document.getElementById("closeModal")
    .addEventListener("click", closeModal);


modal.addEventListener("click", event => {
    if (event.target.dataset.close === "true") {
        closeModal();
    }
});


document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeModal();
    }
});


/* =====================================================
   EVENTS
===================================================== */

searchInput.addEventListener("input", applyFilters);
sortSelect.addEventListener("change", applyFilters);


document.querySelectorAll(".mc-filter").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelector(".mc-filter.active")
            ?.classList.remove("active");

        button.classList.add("active");

        activeFilter = button.dataset.filter;

        applyFilters();
    });
});


// NUMBERED PAGE CLICK
pageInfo.addEventListener("click", event => {
    const button = event.target.closest("[data-page]");

    if (!button) return;

    currentPage = Number(button.dataset.page);

    renderMobs();
});


prevPage.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderMobs();
    }
});


nextPage.addEventListener("click", () => {
    const totalPages = Math.ceil(
        filteredMobs.length / pageSize
    );

    if (currentPage < totalPages) {
        currentPage++;
        renderMobs();
    }
});


document.getElementById("retryButton")
    .addEventListener("click", loadMobs);


/* =====================================================
   HTML ESCAPING
===================================================== */

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}


/* =====================================================
   INITIALIZE
===================================================== */

loadMobs();
loadHeroSteve();