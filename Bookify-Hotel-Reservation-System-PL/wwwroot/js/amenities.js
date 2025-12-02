document.addEventListener("DOMContentLoaded", () => {
  // Removed localStorage authentication logic
  // The navbar is now fully controlled by server-side Razor rendering
  // in _HotelLayout.cshtml using User.Identity.IsAuthenticated
});

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }
});
