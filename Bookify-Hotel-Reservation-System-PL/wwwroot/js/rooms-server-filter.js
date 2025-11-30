document.addEventListener("DOMContentLoaded", () => {

    /* ===========================
       USER SECTION
    ============================ */
    const userSection = document.getElementById("user-section");
    const navLinks = document.getElementById("nav-links");

    const loggedUser = localStorage.getItem("loggedUser");
    const userType = localStorage.getItem("userType");

    if (loggedUser) {
        const displayName = loggedUser.includes("@") ? loggedUser.split("@")[0] : loggedUser;

        if (userType === "admin") {
            const adminLink = document.createElement("a");
            adminLink.href = "AdminPanel.html";
            adminLink.textContent = "Admin Dashboard";
            adminLink.className = "hover:text-[#cbb58f] transition";
            const contactLink = navLinks.querySelector('a:last-child');
            if (contactLink) navLinks.insertBefore(adminLink, contactLink);
        }

        userSection.innerHTML = `
        <div class="flex items-center space-x-3 text-[#e5e3df]">
            <a href="${userType === 'admin' ? '#' : 'profile.html'}" 
                class="bg-[#cbb58f] text-[#2e2b29] px-4 py-2 rounded-lg font-semibold hover:bg-[#d7c29b] transition flex items-center gap-2"
                ${userType === 'admin' ? 'onclick="return false;"' : ''}>
            <i class="fa-solid fa-user"></i> ${displayName}
            </a>
            <a href="#" id="logout-btn" class="bg-[#cbb58f] text-[#2e2b29] px-4 py-2 rounded-lg font-medium hover:bg-[#d7c29b] transition inline-block mr-4">
            Logout
            </a>
        </div>
        `;

        document.getElementById("logout-btn")?.addEventListener("click", () => {
            localStorage.removeItem("loggedUser");
            localStorage.removeItem("userType");
            location.reload();
        });
    } else {
        userSection.innerHTML = `
      <a href="/login">Log In</a>
    `;
    }

    /* ===========================
       CART BUSINESS LOGIC
    ============================ */
    
    // Initialize cart from localStorage
    function loadCartFromStorage() {
        const savedCart = localStorage.getItem('reservationRooms');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // Save cart to localStorage
    function saveCartToStorage(cart) {
        localStorage.setItem('reservationRooms', JSON.stringify(cart));
    }

    let cart = loadCartFromStorage();

    // Update cart count on page load
    function updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = cart.length;
            // Show cart icon if there are items
            const mainCart = document.getElementById('main-cart');
            if (mainCart) {
                mainCart.style.display = cart.length > 0 ? 'flex' : 'none';
            }
        }
    }

    // Show toast notification
    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        
        toast.textContent = message;
        toast.style.display = "block";
        toast.style.background = type === 'success' ? 'rgba(76, 175, 80, 0.95)' : 'rgba(255, 152, 0, 0.95)';
        toast.style.color = '#fff';
        
        setTimeout(() => {
            toast.style.display = "none";
        }, 2000);
    }

    // Add to cart with duplicate check
    function addToCart(roomData) {
        // Check if room already exists in cart
        const existingRoom = cart.find(item => item.roomId === roomData.roomId);
        
        if (existingRoom) {
            showToast(`${roomData.roomTypeName} is already in your cart!`, 'warning');
            return false;
        }

        // Add room to cart
        cart.push({
            roomId: roomData.roomId,
            roomTypeName: roomData.roomTypeName,
            roomDescription: roomData.roomDescription,
            imageUrl: roomData.imageUrl,
            basePrice: roomData.basePrice,
            guests: roomData.guests,
            area: roomData.area,
            floor: roomData.floor,
            addedAt: new Date().toISOString()
        });

        // Save to localStorage
        saveCartToStorage(cart);
        
        // Update UI
        updateCartCount();
        showToast(`? ${roomData.roomTypeName} added to cart!`, 'success');
        
        return true;
    }

    // Remove from cart
    function removeFromCart(index) {
        if (index >= 0 && index < cart.length) {
            const removedRoom = cart.splice(index, 1)[0];
            saveCartToStorage(cart);
            renderCartItems();
            updateCartCount();
            showToast(`${removedRoom.roomTypeName} removed from cart`, 'success');
        }
    }

    // Clear entire cart
    function clearCart() {
        if (confirm('Are you sure you want to clear your cart?')) {
            cart = [];
            saveCartToStorage(cart);
            renderCartItems();
            updateCartCount();
            showToast('Cart cleared', 'success');
        }
    }

    // Make functions available globally
    window.removeFromCart = removeFromCart;
    window.clearCart = clearCart;

    // Render cart items in popup
    function renderCartItems() {
        const container = document.getElementById('cart-items');
        if (!container) return;
        
        container.innerHTML = "";

        if (cart.length === 0) {
            container.innerHTML = "<p style='text-align:center;color:#666;'>Your cart is empty.</p>";
            return;
        }

        // Calculate total
        const total = cart.reduce((sum, room) => sum + room.basePrice, 0);

        cart.forEach((room, i) => {
            const div = document.createElement('div');
            div.className = "cart-item";
            div.innerHTML = `
                <div style="display:flex;gap:10px;align-items:center;padding:10px 0;position:relative;">
                    <img src="${room.imageUrl}" alt="${room.roomTypeName}" 
                         style="width:60px;height:50px;object-fit:cover;border-radius:5px;">
                    <div style="flex:1;">
                        <strong style="display:block;color:#0b3a66;">${room.roomTypeName}</strong>
                        <small style="color:#666;">Floor ${room.floor} • ${room.guests} Guests</small>
                        <div style="color:#2563eb;font-weight:600;margin-top:3px;">$${room.basePrice}</div>
                    </div>
                    <button onclick="removeFromCart(${i})" class="cart-remove" 
                            style="position:absolute;top:10px;right:0;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            container.appendChild(div);
        });

        // Add total and clear button
        const footer = document.createElement('div');
        footer.style.cssText = 'margin-top:15px;padding-top:15px;border-top:2px solid #eee;';
        footer.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <strong style="color:#0b3a66;">Total:</strong>
                <strong style="color:#2563eb;font-size:1.2rem;">$${total.toFixed(2)}</strong>
            </div>
            <button onclick="clearCart()" 
                    style="width:100%;padding:8px;background:#e74c3c;color:#fff;border:none;border-radius:5px;cursor:pointer;margin-bottom:5px;">
                Clear Cart
            </button>
        `;
        container.appendChild(footer);
    }

    // Toggle cart popup
    document.getElementById("main-cart")?.addEventListener("click", () => {
        const popup = document.getElementById("cart-popup");
        if (!popup) return;
        
        const isVisible = popup.style.display === "block";
        popup.style.display = isVisible ? "none" : "block";
        
        if (!isVisible) {
            renderCartItems();
        }
    });

    // Go to reservation page
    document.getElementById("go-reservation")?.addEventListener("click", () => {
        if (cart.length === 0) {
            showToast('Please add rooms to cart first', 'warning');
            return;
        }
        
        // Cart is already saved in localStorage
        window.location.href = '/Reservation';
    });

    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
        const mainCart = document.getElementById('main-cart');
        const cartPopup = document.getElementById('cart-popup');
        
        if (mainCart && cartPopup && 
            !mainCart.contains(e.target) && 
            !cartPopup.contains(e.target)) {
            cartPopup.style.display = 'none';
        }
    });

    /* ===========================
       FILTERS & ROOM RENDERING
    ============================ */

    // Apply Filters (Call Server)
    async function applyFilters() {
        const search = document.getElementById("search-room").value.trim();
        const type = document.getElementById("room-type").value;
        const guests = document.getElementById("guests").value;
        const price = document.getElementById("price-select").value;

        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (type) params.append('type', type);
        if (guests) params.append('guests', guests);
        if (price) params.append('price', price);

        const url = `/Room/Filter?${params.toString()}`;

        const container = document.getElementById("rooms-container");
        container.innerHTML = "<p class='loading-message'>Loading...</p>";

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const rooms = await response.json();
            renderRooms(rooms);
        } catch (error) {
            console.error('Error fetching rooms:', error);
            container.innerHTML = "<p class='error-message'>Error loading rooms. Please try again.</p>";
        }
    }

    // Render Rooms
    function renderRooms(rooms) {
        const container = document.getElementById("rooms-container");
        container.innerHTML = "";

        if (rooms.length === 0) {
            container.innerHTML = "<p class='loading-message'>No rooms found matching your criteria.</p>";
            return;
        }

        rooms.forEach(room => {
            const roomCard = document.createElement('div');
            roomCard.className = 'room-card';
            
            // Check if room is already in cart
            const inCart = cart.some(item => item.roomId === room.roomId);
            
            roomCard.innerHTML = `
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
                        <button class="add-cart" ${inCart ? 'disabled' : ''} 
                                style="${inCart ? 'opacity:0.6;cursor:not-allowed;' : ''}">
                            ${inCart ? '<i class="fas fa-check"></i> In Cart' : '<i class="fas fa-cart-plus"></i> Add to Cart'}
                        </button>
                        <a href="/Room/RoomDetails/${room.roomId}" class="view-details">View Details</a>
                    </div>
                </div>
            `;
            
            // Add to cart event listener
            const addButton = roomCard.querySelector('.add-cart');
            if (!inCart) {
                addButton.addEventListener('click', () => {
                    if (addToCart(room)) {
                        // Update button state
                        addButton.disabled = true;
                        addButton.style.opacity = '0.6';
                        addButton.style.cursor = 'not-allowed';
                        addButton.innerHTML = '<i class="fas fa-check"></i> In Cart';
                    }
                });
            }
            
            container.appendChild(roomCard);
        });
    }

    // Load all rooms initially
    async function loadAllRooms() {
        const container = document.getElementById("rooms-container");
        container.innerHTML = "<p class='loading-message'>Loading all rooms...</p>";

        try {
            const response = await fetch('/Room/GetAllRooms');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const rooms = await response.json();
            renderRooms(rooms);
        } catch (error) {
            console.error('Error fetching all rooms:', error);
            container.innerHTML = "<p class='error-message'>Error loading rooms. Please try again.</p>";
        }
    }

    // Filter Events
    document.getElementById("search-room")?.addEventListener("input", applyFilters);
    document.getElementById("room-type")?.addEventListener("change", applyFilters);
    document.getElementById("guests")?.addEventListener("change", applyFilters);
    document.getElementById("price-select")?.addEventListener("change", applyFilters);

    // Initialize cart count on page load
    updateCartCount();

    // Load all rooms on page load
    loadAllRooms();
});
