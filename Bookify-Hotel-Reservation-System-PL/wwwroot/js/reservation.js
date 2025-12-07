/**
 * Reservation Page - Cart Management & Booking Initialization
 * Manages the reservation cart where users can review selected rooms
 * 
 * Features:
 * - Display rooms in reservation cart
 * - Remove rooms from cart
 * - Navigate to booking page for individual rooms
 * - localStorage integration for cart persistence
 * - Toast notifications for user feedback
 * 
 * @file reservation.js
 * @description Reservation cart management functionality
 */

/* ===========================
   GLOBAL STATE
============================ */

/**
 * Reservation Rooms Array
 * Loaded from localStorage to maintain cart state across pages
 * @type {Array<Object>}
 */
let reservationRooms = JSON.parse(localStorage.getItem("reservationRooms")) || [];

/* ===========================
   RENDERING FUNCTIONS
============================ */

/**
 * Render Reservation Cart
 * Displays all rooms in the reservation cart with their details
 * Shows empty state message if cart is empty
 * 
 * @function renderReservation
 * @description Renders the reservation cart UI
 */
function renderReservation() {
    const container = document.getElementById("reservation-container");
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = "";

    // Handle empty cart state
    if (reservationRooms.length === 0) {
        container.innerHTML = `
            <div style='grid-column:1/-1;text-align:center;padding:60px 20px;'>
                <i class="fas fa-inbox" style="font-size:64px;color:#ddd;margin-bottom:20px;display:block;"></i>
                <p style="font-size:1.2rem;color:#666;margin-bottom:15px;">No rooms selected for reservation.</p>
                <p style="color:#999;margin-bottom:25px;">Browse our rooms and add them to your cart.</p>
                <button onclick="backToRooms()" style="background:linear-gradient(135deg,#3b82f6,#2563eb);color:white;padding:12px 30px;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:1rem;">
                    Browse Rooms
                </button>
            </div>
        `;
        return;
    }

    /**
     * Render each room card in the cart
     * Displays room details: image, type, description, features, price
     * Provides Book Now and Remove buttons for each room
     */
    reservationRooms.forEach((room, i) => {
        const card = document.createElement("div");
        card.className = "room-card";
        card.innerHTML = `
            <img src="${room.imageUrl}" alt="${room.roomTypeName}">
            <div class="room-info">
                <h3>${room.roomTypeName}</h3>
                <p>${room.roomDescription}</p>
                <div class="features">
                    <span><i class="fas fa-user-friends"></i> ${room.guests} Guests</span>
                    <span><i class="fas fa-vector-square"></i> ${room.area} m²</span>
                    <span><i class="fas fa-layer-group"></i> Floor ${room.floor}</span>
                    <span><i class="fas fa-dollar-sign"></i> $${room.basePrice}</span>
                </div>
                <div class="room-buttons">
                    <button onclick="bookNow(${i})" style="flex:1;background:linear-gradient(90deg,#10b981,#059669);color:white;padding:10px 12px;border:none;border-radius:8px;cursor:pointer;font-weight:600;transition:all 0.3s;">
                        <i class="fas fa-check-circle"></i> Book Now
                    </button>
                    <button onclick="removeReservation(${i})" style="flex:1;background:linear-gradient(90deg,#ef4444,#dc2626);color:white;padding:10px 12px;border:none;border-radius:8px;cursor:pointer;font-weight:600;transition:all 0.3s;">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    // Update cart count if exists
    updateCartCountFromReservation();
}

/**
 * Update Cart Count Badge
 * Updates the cart count display in the navigation bar
 * 
 * @function updateCartCountFromReservation
 * @description Syncs cart count badge with current cart state
 */
function updateCartCountFromReservation() {
    const cartCount = document.getElementById("cart-count");
    if (cartCount) {
        cartCount.textContent = reservationRooms.length;
        const mainCart = document.getElementById('main-cart');
        if (mainCart) {
            mainCart.style.display = reservationRooms.length > 0 ? 'flex' : 'none';
        }
    }
}

/* ===========================
   TOAST NOTIFICATIONS
============================ */

/**
 * Show Toast Notification
 * Displays a temporary notification message to the user
 * 
 * @function showToast
 * @param {string} message - The message to display
 * @param {string} [type='success'] - Toast type: 'success', 'warning', or 'error'
 * @description Shows styled toast notification with auto-hide
 */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    // Set toast content and visibility
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    
    // Set background color based on type
    toast.style.background = type === 'success' 
        ? 'rgba(16, 185, 129, 0.95)'   // Green for success
        : type === 'warning'
            ? 'rgba(251, 146, 60, 0.95)'  // Orange for warning
            : 'rgba(239, 68, 68, 0.95)';  // Red for error
    
    // Styling
    toast.style.color = '#fff';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '8px';
    toast.style.fontWeight = '600';
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
    }, 3000);
}

/* ===========================
   USER ACTIONS
============================ */

/**
 * Book Now Function
 * Initiates booking process for a selected room
 * Saves room to localStorage and navigates to booking page
 * 
 * @function bookNow
 * @param {number} index - Index of the room in reservationRooms array
 * @description Starts booking process for selected room
 */
function bookNow(index) {
    // Validate index
    if (index < 0 || index >= reservationRooms.length) return;
    
    // Get selected room data
    const room = reservationRooms[index];
    
    // Save selected room for booking page
    localStorage.setItem("selectedRoom", JSON.stringify(room));
    
    // Show confirmation toast
    showToast(`? ${room.roomTypeName} selected for booking!`, 'success');
    
    // Navigate to booking page after brief delay
    setTimeout(() => {
        window.location.href = "/Book";
    }, 1000);
}

/**
 * Remove from Reservation
 * Removes a room from the reservation cart
 * Updates localStorage and re-renders the cart
 * 
 * @function removeReservation
 * @param {number} index - Index of the room to remove
 * @description Removes room from cart and updates UI
 */
function removeReservation(index) {
    // Validate index
    if (index < 0 || index >= reservationRooms.length) return;
    
    // Remove room from array and get removed item
    const removedRoom = reservationRooms.splice(index, 1)[0];
    
    // Update localStorage
    localStorage.setItem("reservationRooms", JSON.stringify(reservationRooms));
    
    // Re-render cart
    renderReservation();
    
    // Show confirmation toast
    showToast(`${removedRoom.roomTypeName} removed from reservation`, 'success');
}

/**
 * Back to Rooms
 * Navigates user back to rooms browsing page
 * 
 * @function backToRooms
 * @description Redirects to rooms listing page
 */
function backToRooms() {
    window.location.href = "/Room"; 
}

/* ===========================
   GLOBAL SCOPE EXPORTS
============================ */

/**
 * Make functions globally accessible for onclick handlers
 * These functions need to be available in the global scope
 * because they're called from inline HTML onclick attributes
 */
window.bookNow = bookNow;
window.removeReservation = removeReservation;
window.backToRooms = backToRooms;

/* ===========================
   INITIALIZATION
============================ */

/**
 * Page Load Event Listener
 * Renders the reservation cart when page loads
 */
document.addEventListener("DOMContentLoaded", renderReservation);
