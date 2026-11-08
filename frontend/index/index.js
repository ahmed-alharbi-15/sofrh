document.addEventListener("DOMContentLoaded", () => {

    const menuBtn = document.getElementById("menu-btn");
    const sideMenu = document.getElementById("side-menu");
    const closeBtn = document.getElementById("close-btn");

    const userMenu = document.getElementById("userMenu");
    const userAvatar = document.getElementById("userAvatar");

    if (!menuBtn || !sideMenu || !closeBtn || !userMenu || !userAvatar) return;

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

    userAvatar.addEventListener("click", (e) => {
        e.stopPropagation();
        userMenu.classList.toggle("active");
    });

    userMenu.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    document.addEventListener("click", () => {
        sideMenu.style.right = "-260px";
        userMenu.classList.remove("active");
    });

    const heroSearchForm = document.getElementById("ixHeroSearchForm");
    const heroSearchInput = document.getElementById("ixHeroSearchInput");
    if (heroSearchForm) {
        heroSearchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const q = heroSearchInput?.value.trim();
            if (q) sessionStorage.setItem("safraSearch", q);
            window.location.href = "/countries/countries.html";
        });
    }

    const ixCtaGreet = document.getElementById("ixCtaUserGreet");
    if (ixCtaGreet) {
        const u = JSON.parse(localStorage.getItem("safraUser") || "null");
        if (u?.name) ixCtaGreet.textContent = "\u0645\u0631\u062D\u0628\u0627\u060C " + u.name;
    }

    const recipesScroll = document.getElementById("ixRecipesScroll");
    document.getElementById("ixArrowPrev")?.addEventListener("click", () => {
        recipesScroll?.scrollBy({ left: -300, behavior: "smooth" });
    });
    document.getElementById("ixArrowNext")?.addEventListener("click", () => {
        recipesScroll?.scrollBy({ left: 300, behavior: "smooth" });
    });

    const scrollTopBtn = document.getElementById("scrollTopBtn");
    if (scrollTopBtn) {
        window.addEventListener("scroll", () => {
            scrollTopBtn.classList.toggle("ix-visible", window.scrollY > 300);
        }, { passive: true });
    }

});
