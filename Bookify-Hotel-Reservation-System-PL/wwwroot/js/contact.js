/**
 * Contact Page - Navigation Handler
 * Manages mobile navigation for the contact page
 * 
 * Features:
 * - Mobile hamburger menu toggle
 * - Responsive navigation support
 * 
 * Note: Authentication logic removed - now handled server-side by ASP.NET Identity
 * The navbar is fully controlled by _HotelLayout.cshtml using User.Identity.IsAuthenticated
 */

// Wait for DOM to be fully loaded before executing scripts
document.addEventListener("DOMContentLoaded", () => {
  /**
   * NOTE: localStorage authentication logic has been removed
   * Authentication is now fully handled server-side by ASP.NET Identity
   * The navbar rendering is controlled by Razor views (_HotelLayout.cshtml)
   * based on User.Identity.IsAuthenticated property
   */
  
  // Get references to mobile menu elements
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  // Verify elements exist before attaching event listeners
  if (hamburger && navLinks) {
    /**
     * Hamburger Menu Click Handler
     * Toggles the mobile navigation menu visibility
     * 
     * @listens click - On hamburger menu button
     */
    hamburger.addEventListener("click", () => {
      // Toggle 'active' class to show/hide navigation menu
      navLinks.classList.toggle("active");
    });
  }
});
