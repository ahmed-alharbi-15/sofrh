// JS للقائمة الجانبية
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

// البحث

const searchInput = document.getElementById("searchInput");
const filterBtns = document.querySelectorAll(".filter-buttons button");
const cards = document.querySelectorAll(".country-card");

searchInput.addEventListener("keyup", () => {
  let value = searchInput.value.toLowerCase();

  cards.forEach((card) => {
    let name = card.querySelector("h1").textContent.toLowerCase();
    card.style.display = name.includes(value) ? "block" : "none";
  });
});

// فلتر
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

