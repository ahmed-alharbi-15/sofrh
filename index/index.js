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
