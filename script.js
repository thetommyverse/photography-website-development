const gallery = document.getElementById("gallery");
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const imageMetadata = document.getElementById("image-metadata");
const imageContainers = document.querySelectorAll(".image-container");
const filterButtons = document.querySelectorAll(".filters > button:not(#subfilters button)");
const subfilterContainer = document.getElementById("subfilters");
const searchBar = document.getElementById("search-bar");

const subfilters = {
    animals: ["dogs", "zoo-animals"],
    // Add other main category subfilters if you want
};

let activeCategory = "all";
let activeSubcategory = null;

// Render subfilter buttons
function renderSubfilters(mainCategory, subcats) {
    subfilterContainer.innerHTML = ""; // Clear previous
    if (!subcats || subcats.length === 0) {
        subfilterContainer.style.display = "none";
        activeSubcategory = null;
        return;
    }

    subfilterContainer.style.display = "flex";

    subcats.forEach(sub => {
        const btn = document.createElement("button");
        btn.textContent = sub.replace("-", " ").toUpperCase();
        btn.setAttribute("data-subcategory", sub);
        btn.addEventListener("click", () => {
            activeSubcategory = sub;
            filterGallery();
            // Highlight active subfilter
            subfilterContainer.querySelectorAll("button").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        });
        subfilterContainer.appendChild(btn);
    });

    activeSubcategory = null; // reset active subcategory on main category change
}

// Filter gallery based on activeCategory, activeSubcategory, and search query
function filterGallery() {
    const query = searchBar.value.toLowerCase();

    imageContainers.forEach(container => {
        const img = container.querySelector("img");
        const caption = container.querySelector(".caption")?.textContent.toLowerCase() || "";
        const alt = img.alt.toLowerCase();
        const classes = container.className.toLowerCase();
        const dataCaption = img.getAttribute("data-caption")?.toLowerCase() || "";

        // Check category/subcategory match
        const categoryMatch = activeCategory === "all" || container.classList.contains(activeCategory);
        const subcategoryMatch = !activeSubcategory || container.classList.contains(activeSubcategory);

        // Check search match
        const searchMatch =
            alt.includes(query) ||
            caption.includes(query) ||
            classes.includes(query) ||
            dataCaption.includes(query);

        // Show only if both category & subcategory & search match
        if (categoryMatch && subcategoryMatch && searchMatch) {
            container.style.display = "inline-block";
        } else {
            container.style.display = "none";
        }
    });
}

// Setup main category filter buttons
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        activeCategory = button.getAttribute("data-category");
        activeSubcategory = null; // reset subcategory on main category change

        // Highlight active button
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        // Render subfilters or hide them
        if (subfilters[activeCategory]) {
            renderSubfilters(activeCategory, subfilters[activeCategory]);
        } else {
            subfilterContainer.style.display = "none";
        }

        filterGallery();
    });
});

// Search input event
searchBar.addEventListener("input", () => {
    filterGallery();
});

// Image click to open modal
imageContainers.forEach(container => {
    const img = container.querySelector("img");
    img.addEventListener("click", () => openModal(img));
});

function openModal(image) {
    modal.style.display = "flex";
    modal.classList.add("show");
    modalImg.src = image.src;
    modalImg.style.maxWidth = "80vw";
    modalImg.style.maxHeight = "70vh";
    imageMetadata.innerHTML = `<h3>${image.alt}</h3><p>${image.getAttribute('data-caption')}</p>`;
}

function closeModal() {
    modal.classList.remove("show");
    setTimeout(() => {
        modal.style.display = "none";
    }, 300);
}

document.querySelector(".close").addEventListener("click", closeModal);

window.onclick = function(event) {
    if (event.target === modal) {
        closeModal();
    }
};

// Initial load show all
filterGallery();


const clearSearchBtn = document.getElementById("clear-search");

searchBar.addEventListener("input", () => {
    filterGallery();

    // Show/hide clear button
    if (searchBar.value.length > 0) {
        clearSearchBtn.style.display = "block";
    } else {
        clearSearchBtn.style.display = "none";
    }
});

clearSearchBtn.addEventListener("click", () => {
    searchBar.value = "";
    clearSearchBtn.style.display = "none";
    filterGallery();
});


window.addEventListener("DOMContentLoaded", () => {
    const favBtn = document.querySelector('.filters button[data-category="favourites"]');
    if (favBtn) {
        // Remove "active" from all buttons first
        document.querySelectorAll('.filters button').forEach(btn => btn.classList.remove("active"));
        // Add "active" to favorites button
        favBtn.classList.add("active");
    }

    // Show only favorites images
    filterImages("favourites");
});

function filterImages(category) {
    imageContainers.forEach(container => {
        if (category === "all") {
            container.style.display = "inline-block";
        } else if (category === "favourites") {
            // Show only containers with 'favorites' class
            if (container.classList.contains("favourites")) {
                container.style.display = "inline-block";
            } else {
                container.style.display = "none";
            }
        } else {
            // For other categories, show containers matching that class
            if (container.classList.contains(category)) {
                container.style.display = "inline-block";
            } else {
                container.style.display = "none";
            }
        }
    });

    // Clear subfilters and hide them when changing main filters
    subfilterContainer.style.display = "none";
    subfilterContainer.innerHTML = "";
}