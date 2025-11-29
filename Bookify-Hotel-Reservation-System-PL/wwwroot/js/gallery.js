
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
      adminLink.style.transition = "color 0.3s";
      adminLink.addEventListener('mouseover', () => { adminLink.style.color = '#3b82f6'; });
      adminLink.addEventListener('mouseout', () => { adminLink.style.color = 'black'; });
      const contactLink = navLinks.querySelector('a:last-child');
      navLinks.insertBefore(adminLink, contactLink);
    }

    userSection.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px;">
        <a href="profile.html" style="background-color:#08306C; color:white; padding:8px 20px; border-radius:8px; font-weight:500; text-decoration:none; display:flex; align-items:center; gap:5px;">
          <i class="fa-solid fa-user"></i> ${displayName}
        </a>
        <button id="logout-btn">Logout</button>
      </div>
    `;

    const logoutBtn = document.getElementById("logout-btn");
    logoutBtn.style.backgroundColor = '#08306C';
    logoutBtn.style.color = 'white';
    logoutBtn.style.padding = '8px 20px';
    logoutBtn.style.borderRadius = '8px';
    logoutBtn.style.fontWeight = '500';
    logoutBtn.style.cursor = 'pointer';
    logoutBtn.addEventListener("mouseover", () => logoutBtn.style.backgroundColor = '#064273');
    logoutBtn.addEventListener("mouseout", () => logoutBtn.style.backgroundColor = '#08306C');

    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedUser");
      localStorage.removeItem("userType");
      location.reload();
    });

  } else {
      userSection.innerHTML = `
      <a href="/login">Log In</a>
    `;
  }
  document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
});

});
