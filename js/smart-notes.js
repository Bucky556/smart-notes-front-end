document.addEventListener("DOMContentLoaded", function () {

    // === Navigation links ===
    document.getElementById("about_link")?.addEventListener("click", () => {
        window.location.href = "about.html";
    });

    document.getElementById("faq_link")?.addEventListener("click", () => {
        window.location.href = "faq.html";
    });

    document.getElementById("register_link")?.addEventListener("click", () => {
        window.location.href = "registration.html";
    });

    document.getElementById("login_link")?.addEventListener("click", () => {
        window.location.href = "login.html";
    });

    // === Hero section buttons (Get Started / Login) ===
    document.getElementById("cta_register")?.addEventListener("click", () => {
        window.location.href = "registration.html";
    });

    // === Logo click → Home ===
    document.getElementById("home_link")?.addEventListener("click", () => {
        window.location.href = "smart-notes.html";
    });

});