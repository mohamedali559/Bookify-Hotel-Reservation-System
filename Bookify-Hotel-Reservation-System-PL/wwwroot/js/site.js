/**
 * Site-Wide JavaScript
 * Global functionality used across all pages
 * 
 * Features:
 * - Mobile navigation toggle (hamburger menu)
 * - Responsive menu behavior
 * - Click-outside-to-close functionality
 * - Auto-close menu on link click (mobile)
 * 
 * @file site.js
 * @description Global site functionality and navigation handlers
 * 
 * References:
 * @see https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
 */

/* ===========================
   NAVIGATION FUNCTIONALITY
============================ */

/**
 * Global Navigation Handler
 * Manages mobile hamburger menu and responsive navigation behavior
 * 
 * Features:
 * 1. Toggle mobile menu on hamburger click
 * 2. Close menu when clicking outside
 * 3. Auto-close menu when link is clicked (mobile only)
 */
document.addEventListener('DOMContentLoaded', function() {
    
    /* ===========================
       HAMBURGER MENU TOGGLE
    ============================ */
    
    /**
     * Hamburger Menu Click Handler
     * Toggles mobile navigation menu visibility
     */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            // Toggle 'active' class to show/hide navigation
            navLinks.classList.toggle('active');
        });
    }
    
    /* ===========================
       CLICK OUTSIDE TO CLOSE
    ============================ */
    
    /**
     * Document Click Handler
     * Closes mobile menu when user clicks outside the navigation area
     * 
     * @listens click - On document
     * @description Improves UX by allowing users to close menu by clicking elsewhere
     */
    document.addEventListener('click', function(event) {
        if (navLinks && hamburger) {
            // Check if click is inside navigation or on hamburger button
            const isClickInsideNav = navLinks.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);
            
            // If click is outside and menu is active, close it
            if (!isClickInsideNav && !isClickOnHamburger && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        }
    });
    
    /* ===========================
       AUTO-CLOSE ON LINK CLICK
    ============================ */
    
    /**
     * Navigation Link Click Handler
     * Automatically closes mobile menu when a navigation link is clicked
     * Only applies on mobile devices (viewport width <= 768px)
     * 
     * @listens click - On navigation links
     * @description Improves mobile UX by closing menu after navigation
     */
    if (navLinks) {
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                // Only close menu on mobile viewports
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('active');
                }
            });
        });
    }
});
