// ===========================
// Navbar JavaScript - Enhanced
// ===========================

/**
 * Toggle User Dropdown
 * Enhanced with better UX and animation handling
 */
function toggleUserDropdown(event) {
    // Prevent event bubbling
    if (event) {
        event.stopPropagation();
    }
    
    const dropdown = document.getElementById('userDropdownMenu');
    const dropdownContainer = document.querySelector('.user-dropdown');
    
    if (dropdown && dropdownContainer) {
        const isShowing = dropdown.classList.contains('show');
        
        if (isShowing) {
            // Close dropdown
            dropdown.classList.remove('show');
            dropdownContainer.classList.remove('show');
        } else {
            // Open dropdown
            dropdown.classList.add('show');
            dropdownContainer.classList.add('show');
        }
    }
}

/**
 * Close dropdown when clicking outside
 * Enhanced to properly handle all edge cases
 */
window.addEventListener('click', function(event) {
    const userDropdown = document.querySelector('.user-dropdown');
    const userDropdownToggle = document.querySelector('.user-dropdown-toggle');
    const userDropdownMenu = document.getElementById('userDropdownMenu');
    
    // Check if click is outside the dropdown
    if (userDropdown && !userDropdown.contains(event.target)) {
        if (userDropdownMenu && userDropdownMenu.classList.contains('show')) {
            userDropdownMenu.classList.remove('show');
            userDropdown.classList.remove('show');
        }
    }
});

/**
 * Close dropdown on escape key
 * Enhanced keyboard accessibility
 */
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const userDropdownMenu = document.getElementById('userDropdownMenu');
        const userDropdown = document.querySelector('.user-dropdown');
        
        if (userDropdownMenu && userDropdownMenu.classList.contains('show')) {
            userDropdownMenu.classList.remove('show');
            if (userDropdown) {
                userDropdown.classList.remove('show');
            }
        }
    }
});

/**
 * Hamburger menu toggle
 * Enhanced for better mobile experience
 */
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function(event) {
            event.stopPropagation();
            navLinks.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('active');
                }
            });
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinks && hamburger) {
            if (!navLinks.contains(event.target) && !hamburger.contains(event.target)) {
                navLinks.classList.remove('active');
            }
        }
    });
});
