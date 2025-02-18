document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll(".nav-links a"); // Select all nav links
    const currentPath = window.location.pathname; // Get current path (e.g., "/about")

    links.forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active"); // Add "active" class to the matching link
        }
    });
});