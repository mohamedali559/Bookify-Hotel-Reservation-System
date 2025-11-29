document.addEventListener("DOMContentLoaded", () => {
  const userSection = document.getElementById("user-section");
  const navLinks = document.getElementById("nav-links");

  const loggedUser = localStorage.getItem("loggedUser");
  const userType = localStorage.getItem("userType"); // "admin" أو "user"

  if (loggedUser) {
    const displayName = loggedUser.includes("@") ? loggedUser.split("@")[0] : loggedUser;

    if (userType === "admin") {
      const adminLink = document.createElement("a");
      adminLink.href = "AdminPanel.html";
      adminLink.textContent = "Admin Dashboard";
      adminLink.className = "hover:text-[#cbb58f] transition";
      const contactLink = navLinks.querySelector('a:last-child');
      navLinks.insertBefore(adminLink, contactLink);
    }

   userSection.innerHTML = `
  <div class="flex items-center space-x-3 text-[#e5e3df]">
    <a href="profile.html" class="bg-[#cbb58f] text-[#2e2b29] px-4 py-2 rounded-lg font-semibold hover:bg-[#d7c29b] transition flex items-center gap-2">
      <i class="fa-solid fa-user"></i> ${displayName}
    </a>
   <a href="#" id="logout-btn" style="margin-left: 12px;" class="bg-[#cbb58f] text-[#2e2b29] px-4 py-2 rounded-lg font-medium hover:bg-[#d7c29b] transition">
  Logout
</a>

  </div>
`;


    // Logout
    document.getElementById("logout-btn").addEventListener("click", () => {
      localStorage.removeItem("loggedUser");
      localStorage.removeItem("userType");
      location.reload();
    });

  } else {
      userSection.innerHTML = `
      <a href="/login">Log In</a>
    `;
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
});

