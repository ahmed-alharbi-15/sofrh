const menuBtn = document.getElementById("menu-btn");
const sideMenu = document.getElementById("side-menu");
const closeBtn = document.getElementById("close-btn");

menuBtn.addEventListener("click", () => { sideMenu.style.right = "0px"; });
closeBtn.addEventListener("click", () => { sideMenu.style.right = "-260px"; });
document.addEventListener("click", (e) => {
    if (!sideMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        sideMenu.style.right = "-260px";
    }
});

const searchInput = document.getElementById("searchInput");
const filterBtns = document.querySelectorAll(".filter-buttons button");
const cards = document.querySelectorAll(".event-card");

let activeFilter = "all";

function applySearchAndFilter() {
    const query = (searchInput?.value || "").toLowerCase().trim();
    cards.forEach((card) => {
        const name = (card.querySelector(".event-name")?.textContent || "").toLowerCase();
        const region = card.getAttribute("data-region") || "";
        const matchesSearch = name.includes(query);
        const matchesFilter = activeFilter === "all" || region === activeFilter;
        card.style.display = (matchesSearch && matchesFilter) ? "block" : "none";
    });
}

if (searchInput) searchInput.addEventListener("input", applySearchAndFilter);

filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeFilter = btn.getAttribute("data-filter") || "all";
        applySearchAndFilter();
    });
});

const eventModal = document.getElementById("eventModal");

function openEventModal(btn) {
    document.getElementById("modalEventImg").src = btn.dataset.img || "";
    document.getElementById("modalEventImg").alt = btn.dataset.title || "";
    document.getElementById("modalEventTitle").textContent = btn.dataset.title || "";

    document.getElementById("modalEventMeta").innerHTML = `
        <span>${btn.dataset.country || ""}</span>
        <span>${btn.dataset.date || ""}</span>
    `;

    document.getElementById("modalEventDesc").textContent = btn.dataset.desc || "";

    document.getElementById("modalEventExtra").innerHTML = `
        <span>📍 ${btn.dataset.location || ""}</span>
        <span>🕐 المدة: ${btn.dataset.duration || ""}</span>
        <span>🌡️ الطقس: ${btn.dataset.weather || ""}</span>
        <span>✈️ أقرب مطار: ${btn.dataset.airport || ""}</span>
    `;

    const activities = (btn.dataset.activities || "").split("|").map(x => x.trim()).filter(Boolean);
    let activitiesHTML = "";
    for (let i = 0; i < activities.length; i += 2) {
        activitiesHTML += `
            <div class="activity-card">
                <span class="activity-icon">${activities[i] || ""}</span>
                <span class="activity-price">${activities[i + 1] || ""}</span>
            </div>
        `;
    }
    document.getElementById("modalActivities").innerHTML = activitiesHTML;

    document.getElementById("modalBudget").innerHTML = `
        <div class="budget-row">
            <span>مدة الإقامة</span>
            <span>${btn.dataset.stay || ""}</span>
        </div>
        <div class="budget-row">
            <span>رسوم الفعاليات</span>
            <span>${btn.dataset.eventFee || ""}</span>
        </div>
        <div class="budget-row">
        <span>السكن (الليلة)</span>
        <span>${btn.dataset.hotelPrice || ""}</span>
    </div>

        <div class="budget-row total">
            <span>المجموع التقريبي</span>
            <span>${btn.dataset.total || ""}</span>
        </div>
    `;

    eventModal.style.display = "block";
    document.body.style.overflow = "hidden";
}

function closeEventModal(e) {
    if (e && e.target !== eventModal && !e.target.classList.contains("modal-close")) return;
    eventModal.style.display = "none";
    document.body.style.overflow = "auto";
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        eventModal.style.display = "none";
        document.body.style.overflow = "auto";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get("event");
    if (!eventId) return;

    const card = document.getElementById(eventId);
    if (!card) return;

    card.scrollIntoView({ behavior: "smooth", block: "center" });
    const btn = card.querySelector(".event-item");
    if (btn) btn.click();
});