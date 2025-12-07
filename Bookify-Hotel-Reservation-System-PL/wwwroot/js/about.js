/**
 * About Page - Navigation Handler
 * Manages mobile hamburger menu toggle for the about page
 * 
 * Features:
 * - Toggles mobile navigation menu visibility
 * - Responsive design support for mobile devices
 */

// Wait for the DOM to be fully loaded before executing scripts
document.addEventListener("DOMContentLoaded", () => {
  // Get references to hamburger menu button and navigation links container
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  // Check if both elements exist on the page
  if (hamburger && navLinks) {
    // Add click event listener to hamburger menu
    hamburger.addEventListener("click", () => {
      // Toggle the 'active' class to show/hide navigation menu
      navLinks.classList.toggle("active");
    });
  }
});

