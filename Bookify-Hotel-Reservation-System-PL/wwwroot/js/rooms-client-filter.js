/**
 * Rooms Client-Side Filter & Cart Management System
 * Handles room filtering, cart operations, and UI interactions for the hotel reservation system
 */

// Wait for the DOM to be fully loaded before executing any code
document.addEventListener("DOMContentLoaded", () => {
    /* ===========================
       CART BUSINESS LOGIC
    ============================ */
    
    /**
     * Load cart data from browser's localStorage
     * @returns {Array} Array of room objects stored in cart, or empty array if none exists
     */
    function loadCartFromStorage() {
        const savedCart = localStorage.getItem('reservationRooms');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    /**
     * Save cart data to browser's localStorage
     * @param {Array} cart - Array of room objects to be persisted
     */
    function saveCartToStorage(cart) {
        localStorage.setItem('reservationRooms', JSON.stringify(cart));
    }

    // Initialize cart from localStorage on page load
    let cart = loadCartFromStorage();

    /**
     * Update the cart count badge and toggle cart visibility
     * Shows/hides the cart icon based on whether items exist
     */
    function updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = cart.length;
            const mainCart = document.getElementById('main-cart');
            if (mainCart) {
                // Show cart icon only if there are items in cart
                mainCart.style.display = cart.length > 0 ? 'flex' : 'none';
            }
        }
    }

    /**
     * Display a toast notification message to the user
     * @param {string} message - The message text to display
     * @param {string} type - Type of notification: 'success', 'warning', or 'error'
     */
    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        
        toast.textContent = message;
        toast.style.display = "block";
        
        // Set background color based on notification type
        toast.style.background = type === 'success' 
            ? 'rgba(76, 175, 80, 0.95)'  // Green for success
            : type === 'warning' 
                ? 'rgba(255, 152, 0, 0.95)'  // Orange for warning
                : 'rgba(244, 67, 54, 0.95)';  // Red for error
        
        toast.style.color = '#fff';
        toast.style.padding = '12px 20px';
        toast.style.borderRadius = '8px';
        toast.style.fontWeight = '600';
        
        // Auto-hide toast after 3 seconds
        setTimeout(() => {
            toast.style.display = "none";
        }, 3000);
    }

    /**
     * Add a room to the shopping cart
     * @param {Object} roomData - Room object containing all room details
     * @returns {boolean} True if room was added successfully, false if already exists
     */
    function addToCart(roomData) {
        // Check if room is already in cart to prevent duplicates
        const existingRoom = cart.find(item => item.roomId === roomData.roomId);
        
        if (existingRoom) {
            showToast(`${roomData.roomTypeName} is already in your cart!`, 'warning');
            return false;
        }

        // Add room with all its properties to cart
        cart.push({
            roomId: roomData.roomId,
            roomTypeName: roomData.roomTypeName,
            roomDescription: roomData.roomDescription,
            imageUrl: roomData.imageUrl,
            basePrice: roomData.basePrice,
            guests: roomData.guests,
            area: roomData.area,
            floor: roomData.floor,
            addedAt: new Date().toISOString()  // Timestamp for tracking
        });

        // Persist changes and update UI
        saveCartToStorage(cart);
        updateCartCount();
        showToast(`${roomData.roomTypeName} added to cart!`, 'success');
        
        return true;
    }

    /**
     * Remove a room from the cart by its index
     * @param {number} index - The index position of the room in the cart array
     */
    function removeFromCart(index) {
        if (index >= 0 && index < cart.length) {
            const removedRoom = cart.splice(index, 1)[0];
            
            // Update storage and re-render UI components
            saveCartToStorage(cart);
            renderCartItems();
            updateCartCount();
            applyClientSideFilters();  // Refresh room cards to show "Add to Cart" button
            
            showToast(`${removedRoom.roomTypeName} removed from cart`, 'success');
        }
    }

    /**
     * Clear all items from the shopping cart
     * Asks for user confirmation before clearing
     */
    function clearCart() {
        if (cart.length === 0) {
            showToast('Cart is already empty', 'warning');
            return;
        }
        
        // Confirm with user before clearing
        if (confirm('Are you sure you want to clear your cart?\n\nThis will remove all selected rooms.')) {
            const roomCount = cart.length;
            cart = [];
            
            // Update all related components
            saveCartToStorage(cart);
            renderCartItems();
            updateCartCount();
            applyClientSideFilters();
            
            // Close the cart popup after a short delay
            const popup = document.getElementById('cart-popup');
            if (popup) {
                setTimeout(() => {
                    popup.style.display = 'none';
                }, 500);
            }
            
            showToast(`Cart cleared! ${roomCount} room${roomCount > 1 ? 's' : ''} removed.`, 'success');
        }
    }

    // Expose cart functions to global scope for inline HTML onclick handlers
    // to handel the two buttons in the cart
    window.removeFromCart = removeFromCart;
    window.clearCart = clearCart;

    /**
     * Render the cart items in the popup modal
     * Displays room details, total price, and action buttons
     */
    function renderCartItems() {
        const container = document.getElementById('cart-items');
        if (!container) return;
        
        container.innerHTML = "";

        // Show empty cart message if no items
        if (cart.length === 0) {
            container.innerHTML = "<p style='text-align:center;color:#666;padding:20px;'>Your cart is empty.</p>";
            return;
        }

        // Calculate total price of all rooms in cart
        const total = cart.reduce((sum, room) => sum + room.basePrice, 0);

        // Render each cart item
        cart.forEach((room, i) => {
            const div = document.createElement('div');
            div.className = "cart-item";


            //the style needs to be improved
            div.innerHTML = `
                <div style="display:flex;gap:10px;align-items:center;padding:10px 0;position:relative;border-bottom:1px solid #eee;">
                    <img src="${room.imageUrl}" alt="${room.roomTypeName}" 
                         style="width:70px;height:60px;object-fit:cover;border-radius:8px;">

                    <div style="flex:1;">
                        <strong style="display:block;color:#0b3a66;font-size:0.95rem;">${room.roomTypeName}</strong>
                        <small style="color:#666;display:block;margin:3px 0;">Floor ${room.floor} -- ${room.guests} Guests -- ${room.area}m2</small>
                        <div style="color:#2563eb;font-weight:700;margin-top:3px;font-size:1.05rem;">$${room.basePrice}</div>
                    </div>
                    <button onclick="removeFromCart(${i})" class="cart-remove" 
                            style="position:absolute;top:10px;right:0;background:#e74c3c;color:#fff;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:0.85rem;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            container.appendChild(div);
        });

        // Add footer with total price and clear button
        const footer = document.createElement('div');
        footer.style.cssText = 'margin-top:15px;padding-top:15px;border-top:2px solid #ddd;';
        footer.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <strong style="color:#0b3a66;font-size:1.1rem;">Total for One Day:</strong>
                <strong style="color:#2563eb;font-size:1.3rem;">$${total.toFixed(2)}</strong>
            </div>
            <button onclick="clearCart()" 
                    style="width:100%;padding:10px;background:#e74c3c;color:#fff;border:none;border-radius:6px;cursor:pointer;margin-bottom:8px;font-weight:600;transition:all 0.3s;">
                Clear Cart
            </button>
        `;
        container.appendChild(footer);
    }

    /**
     * Toggle cart popup visibility when cart icon is clicked
     */
    document.getElementById("main-cart")?.addEventListener("click", () => {
        const popup = document.getElementById("cart-popup");
        if (!popup) return;
        
        const isVisible = popup.style.display === "block";
        popup.style.display = isVisible ? "none" : "block";
        
        // Refresh cart items when opening
        if (!isVisible) {
            renderCartItems();
        }
    });

    /**
     * Navigate to reservation page when "Go to Reservation" button is clicked
     * Validates that cart is not empty before navigation
     */
    document.getElementById("go-reservation")?.addEventListener("click", () => {
        if (cart.length === 0) {
            showToast('Please add rooms to cart first', 'warning');
            return;
        }
        
        // Close the popup
        const popup = document.getElementById("cart-popup");
        if (popup) popup.style.display = 'none';
        
        // Navigate to Reservation page -- change the url (the server checks the user is logged in)
        window.location.href = '/Reservation/Index';
    });

    /**
     * Close cart popup when clicking outside of it
     * Implements click-away-to-close behavior
     */
    document.addEventListener('click', (e) => {
        const mainCart = document.getElementById('main-cart');
        const cartPopup = document.getElementById('cart-popup');
        
        // Close popup if click is outside both cart icon and popup
        if (mainCart && cartPopup && 
            !mainCart.contains(e.target) && 
            !cartPopup.contains(e.target)) {
            cartPopup.style.display = 'none';
        }
    });

    /* ======================================================================================================
                                              CLIENT-SIDE FILTERING
    ======================================================================================================= */
    
    // Store all room cards for filtering operations
    let allRoomCards = [];
    
    /**
     * Initialize and cache all room cards from the DOM
     * Extracts room data from data attributes for efficient filtering
     */
    function initializeRoomCards() {
        const container = document.getElementById('rooms-container');
        if (!container) return;
        
        // Map each room card to an object containing its element and data
        allRoomCards = Array.from(container.querySelectorAll('.room-card')).map(card => {
            const addButton = card.querySelector('.add-cart');
            return {
                element: card.cloneNode(true),  // Clone for re-rendering
                roomId: parseInt(addButton.getAttribute('data-room-id')),
                roomTypeName: addButton.getAttribute('data-room-type'),
                roomDescription: addButton.getAttribute('data-room-description'),
                imageUrl: addButton.getAttribute('data-image-url'),
                basePrice: parseFloat(addButton.getAttribute('data-base-price')),
                guests: parseInt(addButton.getAttribute('data-guests')),
                area: parseFloat(addButton.getAttribute('data-area')),
                floor: parseInt(addButton.getAttribute('data-floor'))
            };
        });
    }

    /**
     * Apply all active filters to the room list
     * Filters by search text, room type, guest count, and price range
     */
    function applyClientSideFilters() {
        // Get current filter values from UI inputs
        const searchText = document.getElementById('search-room')?.value.toLowerCase().trim() || '';
        const roomType = document.getElementById('room-type')?.value || '';
        const guestsValue = document.getElementById('guests')?.value || '';
        const priceRangeSlider = document.getElementById('price-range');
        const maxPrice = priceRangeSlider ? parseFloat(priceRangeSlider.value) : Infinity;

        // Start with all rooms -  Shallow Copy -> using Spread Operator
        let filteredRooms = [...allRoomCards];

        // Apply search text filter (matches room name or description)
        if (searchText) {
            filteredRooms = filteredRooms.filter(room => 
                room.roomTypeName.toLowerCase().includes(searchText) ||
                room.roomDescription.toLowerCase().includes(searchText)
            );
        }

        // Apply room type filter (exact match)
        if (roomType) {
            filteredRooms = filteredRooms.filter(room => 
                room.roomTypeName.toLowerCase() === roomType.toLowerCase()
            );
        }

        // Apply guest count filter (minimum capacity)
        if (guestsValue) {
            const minGuests = parseInt(guestsValue);
            filteredRooms = filteredRooms.filter(room => room.guests >= minGuests);
        }

        // Apply price range filter (maximum price)
        if (priceRangeSlider && maxPrice) {
            filteredRooms = filteredRooms.filter(room => room.basePrice <= maxPrice);
        }

        // Update the browser URL with current filter values to enable bookmarking and sharing filtered results
        updateUrlWithFilters(searchText, roomType, guestsValue, maxPrice);

        // Render the filtered results
        renderFilteredRooms(filteredRooms);
    }

    /**
     * Updates the browser URL with current filter parameters without reloading the page
     * This allows users to bookmark or share links with specific filter settings
     * 
     * @param {string} searchText - The search query text
     * @param {string} roomType - The selected room type filter
     * @param {string} guests - The minimum number of guests filter
     * @param {number} price - The maximum price filter value
     */
    function updateUrlWithFilters(searchText, roomType, guests, price) {
        const params = new URLSearchParams();
        
        // Add each filter parameter to the URL query string if it has a value
        if (searchText) params.set('searchText', searchText);
        if (roomType) params.set('roomType', roomType);
        if (guests) params.set('guests', guests);
        if (price) params.set('maxPrice', price);
        
        // Construct the new URL with query parameters, or use base path if no filters
        const newUrl = params.toString() 
            ? `${window.location.pathname}?${params.toString()}`
            : window.location.pathname;
        
        // Update URL without reloading the page using History API
        window.history.pushState({ path: newUrl }, '', newUrl);
    }

    /**
     * Update price value display when slider moves
     * Provides real-time feedback to user and triggers filtering
     */
    const priceRangeSlider = document.getElementById('price-range');
    const priceValueDisplay = document.getElementById('price-value');
    
    if (priceRangeSlider && priceValueDisplay) {
        priceRangeSlider.addEventListener('input', (e) => {
            // Update displayed price value
            priceValueDisplay.textContent = parseFloat(e.target.value).toFixed(0);
            // Trigger filter application
            applyClientSideFilters();
        });
    }

    /**
     * Render the filtered room cards to the DOM
     * Updates button states based on cart contents and reattaches event listeners
     * 
     * @param {Array} filteredRooms - Array of room objects that passed the filters
     */
    function renderFilteredRooms(filteredRooms) {
        const container = document.getElementById('rooms-container');
        if (!container) return;

        // Clear existing content
        container.innerHTML = '';

        // Show "no results" message if no rooms match filters
        if (filteredRooms.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <i class="fas fa-search" style="font-size: 64px; color: #ddd; margin-bottom: 20px; display: block;"></i>
                    <p class="loading-message" style="font-size: 1.2rem; color: #666; margin-bottom: 10px;">No rooms found matching your criteria.</p>
                    <p style="color: #999; font-size: 0.95rem;">Try adjusting your filters to see more results.</p>
                </div>
            `;
            return;
        }

        // Render each filtered room
        filteredRooms.forEach(room => {
            const roomCard = room.element.cloneNode(true);
            const addButton = roomCard.querySelector('.add-cart');
            const roomId = parseInt(addButton.getAttribute('data-room-id'));
            
            // Check if this room is already in cart
            const inCart = cart.some(item => item.roomId === roomId);

            // Update button appearance based on cart status
            if (inCart) {
                // Room is in cart - show as disabled with checkmark
                addButton.disabled = true;
                addButton.style.opacity = '0.6';
                addButton.style.cursor = 'not-allowed';
                addButton.innerHTML = '<i class="fas fa-check"></i> In Cart';
                addButton.style.background = 'linear-gradient(90deg, #10b981, #059669)';
            } else {
                // Room not in cart - show as active "Add to Cart" button
                addButton.disabled = false;
                addButton.style.opacity = '1';
                addButton.style.cursor = 'pointer';
                addButton.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
                addButton.style.background = 'linear-gradient(90deg,#06b6d4,#3b82f6)';
            }

            // Attach click event listener for adding to cart
            addButton.addEventListener('click', () => {
                if (addButton.disabled) return;
                
                // Extract room data from button attributes
                const roomData = {
                    roomId: parseInt(addButton.getAttribute('data-room-id')),
                    roomTypeName: addButton.getAttribute('data-room-type'),
                    roomDescription: addButton.getAttribute('data-room-description'),
                    imageUrl: addButton.getAttribute('data-image-url'),
                    basePrice: parseFloat(addButton.getAttribute('data-base-price')),
                    guests: parseInt(addButton.getAttribute('data-guests')),
                    area: parseFloat(addButton.getAttribute('data-area')),
                    floor: parseInt(addButton.getAttribute('data-floor'))
                };

                // Attempt to add to cart
                if (addToCart(roomData)) {
                    // Update button to "In Cart" state
                    addButton.disabled = true;
                    addButton.style.opacity = '0.6';
                    addButton.style.cursor = 'not-allowed';
                    addButton.innerHTML = '<i class="fas fa-check"></i> In Cart';
                    addButton.style.background = 'linear-gradient(90deg, #10b981, #059669)';
                }
            });

            // Add the room card to the container
            container.appendChild(roomCard);
        });
    }

    /* ===========================
       INITIALIZATION
    ============================ */
    
    // Initialize room cards cache
    initializeRoomCards();
    
    // Update cart count display
    updateCartCount();
    
    // Initial render with cart state (shows correct button states)
    applyClientSideFilters();

    /* ===========================
       ATTACH EVENT LISTENERS
    ============================ */
    
    // Get filter input elements
    const searchInput = document.getElementById('search-room');
    const roomTypeSelect = document.getElementById('room-type');
    const guestsSelect = document.getElementById('guests');
    const priceSlider = document.getElementById('price-range');

    // Attach filter event listeners for real-time filtering
    if (searchInput) searchInput.addEventListener('input', applyClientSideFilters);
    if (roomTypeSelect) roomTypeSelect.addEventListener('change', applyClientSideFilters);
    if (guestsSelect) guestsSelect.addEventListener('change', applyClientSideFilters);
    // Price slider listener is already attached above with display update
});
