const menuBtn = document.getElementById("menu-btn");
const sideMenu = document.getElementById("side-menu");
const closeBtn = document.getElementById("close-btn");

// فتح القائمة
menuBtn.addEventListener("click", () => {
    sideMenu.style.right = "0px";
});

// زر الإغلاق
closeBtn.addEventListener("click", () => {
    sideMenu.style.right = "-260px";
});

// إغلاق عند الضغط خارجها
document.addEventListener("click", (e) => {
    if (!sideMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        sideMenu.style.right = "-260px";
    }
});

// البحث والفلتر
const searchInput = document.getElementById("searchInput");
const filterBtns = document.querySelectorAll(".filter-buttons button");
const cards = document.querySelectorAll(".country-card");

if (searchInput) {
    searchInput.addEventListener("keyup", () => {
        let value = searchInput.value.toLowerCase();
        cards.forEach((card) => {
            let name = card.querySelector("h1").textContent.toLowerCase();
            card.style.display = name.includes(value) ? "block" : "none";
        });
    });
}

if (filterBtns.length > 0) {
    filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            filterBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            let filter = btn.getAttribute("data-filter");
            cards.forEach((card) => {
                if (filter === "all") {
                    card.style.display = "block";
                } else {
                    card.style.display =
                        card.getAttribute("data-region") === filter ? "block" : "none";
                }
            });
        });
    });
}

// موديل المدينة
function openCityModal(card) {
    document.getElementById("modalCityImg").src = card.dataset.img || "";
    document.getElementById("modalCityImg").alt = card.dataset.name || "";
    document.getElementById("modalCityName").textContent = card.dataset.name || "";
    document.getElementById("modalCityDesc").textContent = card.dataset.desc || "";

    function renderTags(items, targetId) {
        const box = document.getElementById(targetId);
        box.innerHTML = "";
        items.forEach(item => {
            const span = document.createElement("span");
            span.textContent = item;
            box.appendChild(span);
        });
    }

    renderTags((card.dataset.historic || "").split("|").map(x => x.trim()).filter(Boolean), "modalCityHistoric");
    renderTags((card.dataset.restaurants || "").split("|").map(x => x.trim()).filter(Boolean), "modalCityRestaurants");
    renderTags((card.dataset.cafes || "").split("|").map(x => x.trim()).filter(Boolean), "modalCityCafes");
    renderTags((card.dataset.events || "").split("|").map(x => x.trim()).filter(Boolean), "modalCityEvents");

    document.getElementById("cityModal").style.display = "block";
    document.body.style.overflow = "hidden";
}

function closeCityModal(e) {
    if (e && e.target !== document.getElementById("cityModal") && !e.target.classList.contains("modal-close")) return;
    document.getElementById("cityModal").style.display = "none";
    document.body.style.overflow = "auto";
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        const cityModal = document.getElementById("cityModal");
        if (cityModal) {
            cityModal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    }
});