document.addEventListener("DOMContentLoaded", () => {

    const menuBtn = document.getElementById("menu-btn");
    const sideMenu = document.getElementById("side-menu");
    const closeBtn = document.getElementById("close-btn");

    const userMenu = document.getElementById("userMenu");
    const userAvatar = document.getElementById("userAvatar");

    // لو أي عنصر ناقص لا تشغل شيء
    if (!menuBtn || !sideMenu || !closeBtn || !userMenu || !userAvatar) return;

    // =========================
    // SIDE MENU
    // =========================
    menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        sideMenu.style.right = "0px";
    });

    closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        sideMenu.style.right = "-260px";
    });

    sideMenu.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    // =========================
    // USER MENU
    // =========================
    userAvatar.addEventListener("click", (e) => {
        e.stopPropagation();
        userMenu.classList.toggle("active");
    });

    userMenu.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    // =========================
    // CLOSE EVERYTHING ON OUTSIDE CLICK
    // =========================
    document.addEventListener("click", () => {
        sideMenu.style.right = "-260px";
        userMenu.classList.remove("active");
    });

});