document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop(); // hozirgi html fayl nomi

    const links = document.querySelectorAll(".nav-links a");
    links.forEach(link => {
        const href = link.getAttribute("href").split("/").pop();
        if (href === currentPage) {
            link.classList.add("active");
        }
    });

    // User details
    const parsedUser = JSON.parse(localStorage.getItem("userDetails")) || { name: "User", email: "user@example.com" };

    const usernameEl = document.getElementById("username");
    const usernameSpanEl = document.getElementById("usernameSpan");
    const userEmailEl = document.getElementById("userEmail");

    if(usernameEl) usernameEl.innerText = parsedUser.name;
    if(usernameSpanEl) usernameSpanEl.innerText = parsedUser.name;
    if(userEmailEl) userEmailEl.innerText = parsedUser.email;

    // Profile menu toggle
    const menuBtn = document.getElementById("menuBtn");
    const dropdown = document.getElementById("dropdownMenu");

    if(menuBtn && dropdown){
        menuBtn.addEventListener("click", () => {
            dropdown.classList.toggle("active");
        });

        // Close dropdown if clicked outside
        document.addEventListener("click", (event) => {
            if (!menuBtn.contains(event.target) && !dropdown.contains(event.target)) {
                dropdown.classList.remove("active");
            }
        });
    }

    // Logout with confirmation
    const logoutBtn = document.getElementById("logoutBtn");
    if(logoutBtn){
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const confirmLogout = confirm("Are you sure you want to logout?");
            if(confirmLogout){
                localStorage.removeItem("userDetails");
                localStorage.removeItem("jwtToken");
                window.location.href = "./login.html";
            }
        });
    }

    // Favorite button toggle
    document.addEventListener("click", (e) => {
        if(e.target.classList.contains("favorite-btn")) {
            e.target.classList.toggle("active");
        }
    });
});
