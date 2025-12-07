/**
 * Gallery Page - Navigation Handler
 * Manages mobile navigation toggle for the gallery page
 * 
 * Features:
 * - Hamburger menu toggle for mobile devices
 * - Responsive navigation support
 * 
 * @file gallery.js
 * @description Simple navigation handler for gallery page mobile menu
 */

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Get references to navigation elements
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  // Check if both elements exist in the DOM
  if (hamburger && navLinks) {
    /**
     * Hamburger Menu Click Handler
     * Toggles the 'active' class on navigation links container
     * This controls mobile menu visibility via CSS
     * 
     * @listens click - On hamburger menu icon
     */
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }
});
