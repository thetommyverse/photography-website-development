const gallery = document.getElementById("gallery");
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const imageMetadata = document.getElementById("image-metadata");
const imageContainers = document.querySelectorAll(".image-container");
const filterButtons = document.querySelectorAll(".filters > button:not(#subfilters button)");
const subfilterContainer = document.getElementById("subfilters");
const searchBar = document.getElementById("search-bar");

const subfilters = {
    animals: ["dogs", "zoo-animals", "colchester-zoo-2019", "colchester-zoo-2022"],
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

function filterGallery() {
    const query = searchBar.value.toLowerCase();

    imageContainers.forEach(container => {
        const img = container.querySelector("img");
        const caption = container.querySelector(".caption")?.textContent.toLowerCase() || "";
        const alt = img.alt.toLowerCase();
        const classes = container.className.toLowerCase();
        const dataCaption = img.getAttribute("data-caption")?.toLowerCase() || "";

        const categoryMatch = activeCategory === "all" || container.classList.contains(activeCategory);
        const subcategoryMatch = !activeSubcategory || container.classList.contains(activeSubcategory);
        const searchMatch = alt.includes(query) || caption.includes(query) || classes.includes(query) || dataCaption.includes(query);

        if (categoryMatch && subcategoryMatch && searchMatch) {
            showWithDeferredPop(container);
        } else {
            hideAndReset(container);
        }
    });
}

function filterImages(category) {
    imageContainers.forEach(container => {
        const match =
            category === "all" ? true :
                category === "favourites" ? container.classList.contains("favourites") :
                    container.classList.contains(category);

        match ? showWithDeferredPop(container) : hideAndReset(container);
    });

    subfilterContainer.style.display = "none";
    subfilterContainer.innerHTML = "";
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



document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.1 });

    imageContainers.forEach(el => observer.observe(el));
});

// --- viewport helper ---
function isInViewport(el) {
    const r = el.getBoundingClientRect();
    return (
        r.top < window.innerHeight &&
        r.bottom > 0 &&
        r.left < window.innerWidth &&
        r.right > 0
    );
}

// Show item; pop now if it's currently on-screen, otherwise defer to observer
function showWithDeferredPop(container) {
    container.style.display = "inline-block";
    container.classList.remove("visible");      // reset state

    if (isInViewport(container)) {
        // on-screen now → pop immediately
        void container.offsetWidth;               // reflow to restart transition
        container.classList.add("visible");
    }
    // off-screen → leave without 'visible'; observer will add it on scroll
}

function hideAndReset(container) {
    container.classList.remove("visible");
    container.style.display = "none";
}