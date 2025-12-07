/**
 * Rooms Listing Page - Basic Version (Server-Side Filtering)
 * Displays available rooms with filtering and cart functionality
 * 
 * Features:
 * - Display room cards
 * - Add rooms to cart
 * - Cart popup management
 * - Room details modal
 * - Server-side filtering (search, type, guests, price)
 * - Toast notifications
 * 
 * Note: This is the basic version. For advanced client-side filtering,
 * see rooms-client-filter.js
 * 
 * @file rooms.js
 * @description Basic rooms listing with server-side filtering
 */

document.addEventListener("DOMContentLoaded", () => {

    /* ===========================
       CART MANAGEMENT
    ============================ */
    
    /**
     * Shopping Cart Array
     * Stores selected rooms temporarily
     * @type {Array<Object>}
     */
    let cart = [];

    /**
     * Show Toast Notification
     * Simple toast message for user feedback
     * 
     * @function showToast
     * @param {string} message - Message to display
     */
    function showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.style.display = "block";
        setTimeout(() => toast.style.display = "none", 1500);
    }

    /**
     * Extract Room Data from Card Element
     * Parses room information from DOM element
     * 
     * @function extractRoomData
     * @param {HTMLElement} card - Room card DOM element
     * @returns {Object} Room data object
     */
    function extractRoomData(card) {
        return {
            name: card.querySelector("h3").innerText,
            description: card.querySelector("p").innerText,
            beds: parseInt(card.querySelector(".fa-bed")?.parentNode.textContent.replace(/\D/g, "")) || 0,
            guests: parseInt(card.querySelector(".fa-user-friends")?.parentNode.textContent.replace(/\D/g, "")) || 0,
            size: card.querySelectorAll(".features span")[2]?.innerText || "",
            price: parseInt(card.querySelectorAll(".features span")[3]?.innerText.replace('$', '')) || 0,
            type: card.dataset.type ?? "",
            image: card.querySelector("img")?.src || "",
            element: card
        };
    }

    /**
     * Add Room to Cart
     * Adds selected room to cart array and updates UI
     * 
     * @function addToCart
     * @param {HTMLElement} card - Room card element to add
     */
    function addToCart(card) {
        const room = extractRoomData(card);
        cart.push(room);
        
        // Update cart count badge
        document.getElementById('cart-count').textContent = cart.length;
        
        // Show confirmation toast
        showToast(`${room.name} added to cart`);
    }

    /**
     * Remove Room from Cart
     * Removes room at specified index and updates UI
     * 
     * @function removeFromCart
     * @param {number} index - Index of room to remove
     */
    function removeFromCart(index) {
        cart.splice(index, 1);
        renderCartItems();
        document.getElementById("cart-count").textContent = cart.length;
    }

    // Make removeFromCart globally accessible for onclick handlers
    window.removeFromCart = removeFromCart;

    /**
     * Render Cart Items
     * Displays all items in cart popup
     * 
     * @function renderCartItems
     */
    function renderCartItems() {
        const container = document.getElementById('cart-items');
        container.innerHTML = "";

        // Show empty state if no items
        if (cart.length === 0) {
            container.innerHTML = "<p>Your cart is empty.</p>";
            return;
        }

        // Render each cart item
        cart.forEach((room, i) => {
            const div = document.createElement('div');
            div.className = "cart-item";
            div.innerHTML = `
                <img src="${room.image}" alt="${room.name}" style="width:60px;height:50px;object-fit:cover;margin-right:10px;">
                <strong>${room.name}</strong> - $${room.price}
                <br>
                Guests: ${room.guests}, Beds: ${room.beds}
                <button onclick="removeFromCart(${i})" class="cart-remove">Remove</button>
            `;
            container.appendChild(div);
        });
    }

    /**
     * Cart Icon Click Handler
     * Toggles cart popup visibility
     * 
     * @listens click - On cart icon
     */
    document.getElementById("main-cart")?.addEventListener("click", () => {
        const popup = document.getElementById("cart-popup");
        popup.style.display = popup.style.display === "block" ? "none" : "block";
        if (popup.style.display === "block") renderCartItems();
    });

    /**
     * Go to Reservation Button Handler
     * Saves cart to localStorage and redirects to reservation page
     * 
     * @listens click - On "Go to Reservation" button
     */
    document.getElementById("go-reservation")?.addEventListener("click", () => {
        localStorage.setItem("reservationRooms", JSON.stringify(cart));
        window.location.href = '/Reservation';
    });

    /* ===========================
       ROOM CARDS & DETAILS POPUP
    ============================ */
    
    /**
     * Initialize Room Cards
     * Extracts data from all room cards on page load
     * @type {Array<Object>}
     */
    let rooms = Array.from(document.querySelectorAll(".room-card")).map(card => extractRoomData(card));

    /**
     * Attach Event Listeners to Room Cards
     * Adds click handlers for "Add to Cart" and "View Details" buttons
     */
    rooms.forEach(r => {
        r.element.querySelector(".add-cart")?.addEventListener("click", () => addToCart(r.element));
        r.element.querySelector(".view-details")?.addEventListener("click", () => showRoomDetails(r.element));
    });

    /**
     * Show Room Details Modal
     * Displays detailed room information in popup overlay
     * 
     * Features:
     * - Full room description
     * - Amenities (WiFi, Breakfast, etc.)
     * - Check-in/check-out times
     * - Cancellation policy
     * - Add to cart from modal
     * 
     * @function showRoomDetails
     * @param {HTMLElement} card - Room card element
     */
    function showRoomDetails(card) {
        const room = extractRoomData(card);

        // Create or get popup element
        let popup = document.getElementById("room-popup");
        if (!popup) {
            popup = document.createElement("div");
            popup.id = "room-popup";
            popup.className = "overlay";
            document.body.appendChild(popup);
        }

        // Populate popup with room details
        popup.innerHTML = `
            <div class="details-card">
                <img src="${room.image}" alt="${room.name}">
                <h2>${room.name}</h2>
                <p>${room.description}</p>
                <div class="extra-info">
                    <p><strong>Breakfast:</strong> Included</p>
                    <p><strong>WiFi:</strong> Free high-speed internet</p>
                    <p><strong>Cancellation:</strong> Free within 24 hours</p>
                    <p><strong>Check-in:</strong> 2 PM</p>
                    <p><strong>Check-out:</strong> 11 AM</p>
                    <p><strong>Room Size:</strong> ${room.size}</p>
                    <p><strong>Price:</strong> $${room.price}</p>
                </div>
                <div class="room-buttons">
                    <button class="add-cart-popup">Add to Cart</button>
                    <button class="close-details-btn">Close</button>
                </div>
            </div>
        `;

        // Show popup
        popup.style.display = "flex";

        /**
         * Add to Cart from Modal
         * Allows adding room from details popup
         */
        popup.querySelector(".add-cart-popup").addEventListener("click", () => {
            addToCart(card);
        });

        /**
         * Close Modal
         * Hides the details popup
         */
        popup.querySelector(".close-details-btn").addEventListener("click", () => {
            popup.style.display = "none";
        });
    }

    /* ===========================
       SERVER-SIDE FILTERING
    ============================ */
    
    /**
     * Apply Filters Function
     * Sends filter criteria to server and updates room display
     * 
     * Filters:
     * - Search text (room name/description)
     * - Room type (Single, Double, Suite, etc.)
     * - Number of guests
     * - Price range
     * 
     * @async
     * @function applyFilters
     */
    async function applyFilters() {
        // Get filter values from inputs
        const search = document.getElementById("search-room")?.value || "";
        const type = document.getElementById("room-type")?.value || "";
        const guests = document.getElementById("guests")?.value || "";
        const price = document.getElementById("price-select")?.value || "";

        // Build API URL with query parameters
        const url = `/Room/Filter?search=${search}&type=${type}&guests=${guests}&price=${price}`;

        const container = document.getElementById("rooms-container");
        if (!container) return;
        
        // Show loading message
        container.innerHTML = "<p class='loading-message'>Loading...</p>";

        try {
            /**
             * Fetch Filtered Rooms from Server
             * Makes GET request with filter parameters
             */
            const response = await fetch(url);
            const rooms = await response.json();
            
            // Render filtered results
            renderRooms(rooms);
        } catch (error) {
            /**
             * Handle Network Errors
             * Shows error message if API call fails
             */
            console.error("Error fetching rooms:", error);
            container.innerHTML = "<p>Error loading rooms. Please try again.</p>";
        }
    }

    /**
     * Render Rooms Function
     * Displays filtered room results in container
     * 
     * @function renderRooms
     * @param {Array<Object>} rooms - Array of room objects from API
     */
    function renderRooms(rooms) {
        const container = document.getElementById("rooms-container");
        if (!container) return;
        
        // Clear existing content
        container.innerHTML = "";

        // Show empty state if no rooms found
        if (rooms.length === 0) {
            container.innerHTML = "<p>No rooms found.</p>";
            return;
        }

        /**
         * Create Room Cards
         * Dynamically generates HTML for each room
         */
        rooms.forEach(room => {
            container.innerHTML += `
                <div class="room-card">
                    <img src="${room.imageUrl}" alt="${room.roomTypeName}">
                    <div class="room-info">
                        <h3>${room.roomTypeName}</h3>
                        <p>${room.roomDescription}</p>
                        <div class="features">
                            <span><i class="fas fa-bed"></i> ${room.guests} Guests</span>
                            <span>${room.area} m²</span>
                            <span>$${room.basePrice}</span>
                        </div>

                        <div class="room-buttons">
                            <button class="add-cart">Add to Cart</button>

                            <a href="/Room/Details/${room.roomId}"
                               class="btn btn-primary view-details">
                                View Details
                            </a>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    /* ===========================
       FILTER EVENT LISTENERS
    ============================ */
    
    /**
     * Attach Filter Input Listeners
     * Triggers filtering when user changes any filter input
     * Uses server-side filtering (makes API call on each change)
     */
    document.getElementById("search-room")?.addEventListener("input", applyFilters);
    document.getElementById("room-type")?.addEventListener("change", applyFilters);
    document.getElementById("guests")?.addEventListener("change", applyFilters);
    document.getElementById("price-select")?.addEventListener("change", applyFilters);

});
