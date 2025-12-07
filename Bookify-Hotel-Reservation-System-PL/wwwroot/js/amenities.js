/**
 * Amenities Page - Navigation Handler
 * Manages mobile navigation for the amenities page
 * 
 * Features:
 * - Mobile hamburger menu toggle
 * - Server-side authentication (navbar controlled by Razor)
 * 
 * Note: Authentication logic removed - now handled server-side by ASP.NET Identity
 * The navbar is fully controlled by _HotelLayout.cshtml using User.Identity.IsAuthenticated
 */

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  /**
   * NOTE: localStorage authentication logic has been removed
   * Authentication is now fully handled server-side by ASP.NET Identity
   * The navbar rendering is controlled by Razor views based on User.Identity.IsAuthenticated
   */
});

/**
 * Mobile Navigation Toggle
 * Handles showing/hiding the navigation menu on mobile devices
 */
document.addEventListener("DOMContentLoaded", () => {
  // Get references to hamburger button and navigation links
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  // Check if elements exist before attaching event listeners
  if (hamburger && navLinks) {
    /**
     * Hamburger Menu Click Handler
     * Toggles the 'active' class on navigation links
     * This shows/hides the mobile menu
     */
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }
});
