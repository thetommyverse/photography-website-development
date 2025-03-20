const gallery = document.getElementById("gallery");
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const imageMetadata = document.getElementById("image-metadata");
const images = document.querySelectorAll(".gallery img");
const imageContainers = document.querySelectorAll(".image-container");

document.querySelectorAll(".filters button").forEach(button => {
    button.addEventListener("click", () => {
        const category = button.getAttribute("data-category");
        filterImages(category);
    });
});

function filterImages(category) {
    imageContainers.forEach(container => {
        const image = container.querySelector("img");
        const caption = container.querySelector(".caption");

        if (category === "all" || image.classList.contains(category)) {
            container.style.display = "inline-block";
            caption.style.opacity = "1"; // Make sure the caption is visible when shown
        } else {
            container.style.display = "none"; // Hide the image container
            caption.style.opacity = "0"; // Hide the caption when the image is hidden
        }
    });
}

images.forEach(img => {
    img.addEventListener("click", function() {
        openModal(this);
    });
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
