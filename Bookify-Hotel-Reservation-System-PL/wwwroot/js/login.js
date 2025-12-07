/**
 * Login Page - Client-Side Enhancements
 * Provides client-side functionality for the login page
 * 
 * Features:
 * - Password visibility toggle
 * - Client-side form validation (optional)
 * - UI enhancements
 * 
 * Note: Actual authentication is handled server-side by ASP.NET Identity
 * Login form is in Views/Account/Login.cshtml and processed by AccountController
 * 
 * @file login.js
 * @description Login page client-side functionality
 * @requires AccountController (server-side)
 */

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  /**
   * Page Initialization
   * 
   * Authentication Flow:
   * 1. User submits login form (handled by Razor form)
   * 2. Server validates credentials using ASP.NET Identity
   * 3. Server creates authentication cookie on success
   * 4. User is redirected to appropriate page
   * 
   * This file can be extended with:
   * - Client-side form validation
   * - Password strength indicator
   * - Remember me functionality UI
   * - Loading states during form submission
   */
});

/**
 * Toggle Password Visibility
 * Shows/hides password text in the password field
 * 
 * Usage: Attach this function to an eye icon button click event
 * 
 * @function togglePasswordVisibility
 * @description Toggles between password and text input types
 */
function togglePasswordVisibility() {
    // Get references to password field and eye icon
    const passwordField = document.getElementById('passwordField');
    const eyeIcon = document.getElementById('eyeIcon');
    
    // Check current state and toggle
    if (passwordField.type === 'password') {
        // Show password as plain text
        passwordField.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        // Hide password (mask characters)
        passwordField.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}
