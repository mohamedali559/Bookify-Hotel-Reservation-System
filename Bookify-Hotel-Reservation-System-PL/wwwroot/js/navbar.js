// ===========================
// Navbar JavaScript
// ===========================

// Toggle User Dropdown
function toggleUserDropdown() {
    var dropdown = document.getElementById('userDropdownMenu');
    var dropdownContainer = document.querySelector('.user-dropdown');
    
    if (dropdown && dropdownContainer) {
        dropdown.classList.toggle('show');
        dropdownContainer.classList.toggle('show');
    }
}

// Close dropdown when clicking outside
window.onclick = function(event) {
    if (!event.target.matches('.user-dropdown-toggle') && !event.target.closest('.user-dropdown-toggle')) {
        var dropdowns = document.getElementsByClassName("user-dropdown-menu");
        var dropdownContainers = document.getElementsByClassName("user-dropdown");
        
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
                if (dropdownContainers[i]) {
                    dropdownContainers[i].classList.remove('show');
                }
            }
        }
    }
}

// Hamburger menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
});
