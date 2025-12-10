/**
 * Contact Page - Enhanced Interactions
 * Manages contact page functionality including review form
 * 
 * Features:
 * - Mobile hamburger menu toggle
 * - Star rating interactive feedback
 * - Character counter for review description
 * - Form validation
 * - Auto-hide alerts
 * 
 * Dependencies:
 * - jQuery (for DOM manipulation)
 * - ASP.NET Core Validation Scripts (for client-side validation)
 * 
 * @file contact.js
 * @description Contact page and review form functionality
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

  // Star Rating Interactive Feedback
  initializeStarRating();
  
  // Character Counter for Review Description
  initializeCharacterCounter();
  
  // Form Validation Enhancement
  initializeFormValidation();
  
  // Auto-hide alerts
  autoHideAlerts();
});

/**
 * Initialize Star Rating System
 * Provides visual feedback when user selects a rating
 * Shows descriptive text based on rating value
 */
function initializeStarRating() {
  const ratingText = {
    1: '? Poor',
    2: '?? Fair', 
    3: '??? Good',
    4: '???? Very Good',
    5: '????? Excellent'
  };

  // Get all star rating radio inputs
  const starInputs = document.querySelectorAll('.star-rating input[type="radio"]');
  const ratingTextElement = document.getElementById('ratingText');
  
  if (starInputs.length > 0 && ratingTextElement) {
    starInputs.forEach(input => {
      input.addEventListener('change', function() {
        const rating = this.value;
        ratingTextElement.textContent = ratingText[rating];
        ratingTextElement.style.color = '#ffc107';
        ratingTextElement.style.fontWeight = 'bold';
      });
    });
  }
}

/**
 * Initialize Character Counter
 * Shows real-time character count for review description
 * Changes color based on character limit proximity
 * 
 * Color codes:
 * - Gray: Normal (0-399 chars)
 * - Orange: Warning (400-499 chars)
 * - Red: Limit reached (500 chars)
 */
function initializeCharacterCounter() {
  const textarea = document.querySelector('textarea[name="Description"]');
  const charCount = document.getElementById('charCount');
  
  if (textarea && charCount) {
    // Update character count on input
    textarea.addEventListener('input', function() {
      const length = this.value.length;
      charCount.textContent = length;
      
      // Change color based on character count
      if (length >= 500) {
        charCount.style.color = '#dc3545'; // Red
      } else if (length >= 400) {
        charCount.style.color = '#ffc107'; // Orange
      } else {
        charCount.style.color = '#6c757d'; // Gray
      }
    });
    
    // Initialize character count on page load
    const initialLength = textarea.value.length;
    charCount.textContent = initialLength;
  }
}

/**
 * Initialize Form Validation
 * Adds client-side validation before form submission
 * Validates:
 * - Rating selection (required)
 * - Description length (10-500 characters)
 */
function initializeFormValidation() {
  const reviewForm = document.getElementById('reviewForm');
  
  if (reviewForm) {
    reviewForm.addEventListener('submit', function(e) {
      // Check if rating is selected
      const rateInput = document.querySelector('input[name="Rate"]:checked');
      if (!rateInput) {
        e.preventDefault();
        showValidationError('Please select a rating');
        return false;
      }
      
      // Check description length
      const description = document.querySelector('textarea[name="Description"]').value.trim();
      if (description.length < 10) {
        e.preventDefault();
        showValidationError('Review description must be at least 10 characters');
        return false;
      }
      
      if (description.length > 500) {
        e.preventDefault();
        showValidationError('Review description cannot exceed 500 characters');
        return false;
      }
      
      // Form is valid - allow submission
      return true;
    });
  }
}

/**
 * Show Validation Error Message
 * Displays a temporary error message to the user
 * 
 * @param {string} message - The error message to display
 */
function showValidationError(message) {
  // Check if jQuery is available (for better UX)
  if (typeof $ !== 'undefined') {
    // Create alert div
    const alertHtml = `
      <div class="alert alert-danger alert-dismissible fade show validation-alert" role="alert">
        <i class="fas fa-exclamation-circle"></i> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    
    // Remove any existing validation alerts
    $('.validation-alert').remove();
    
    // Add alert to review form
    $('.review-form-card').prepend(alertHtml);
    
    // Scroll to alert
    $('html, body').animate({
      scrollTop: $('.validation-alert').offset().top - 100
    }, 500);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      $('.validation-alert').fadeOut('slow', function() {
        $(this).remove();
      });
    }, 5000);
  } else {
    // Fallback to native alert if jQuery is not available
    alert(message);
  }
}

/**
 * Auto-hide Alerts
 * Automatically hides success/error alerts after 5 seconds
 */
function autoHideAlerts() {
  setTimeout(() => {
    const alerts = document.querySelectorAll('.alert:not(.validation-alert)');
    alerts.forEach(alert => {
      // Use jQuery fade out if available
      if (typeof $ !== 'undefined') {
        $(alert).fadeOut('slow', function() {
          this.remove();
        });
      } else {
        // Fallback to native removal
        alert.style.transition = 'opacity 0.5s';
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 500);
      }
    });
  }, 5000);
}

/**
 * Export functions for potential external use
 * (Optional - can be removed if not needed)
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeStarRating,
    initializeCharacterCounter,
    initializeFormValidation,
    showValidationError,
    autoHideAlerts
  };
}
