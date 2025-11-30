document.addEventListener("DOMContentLoaded", () => {

    /* ===========================
       USER SECTION
    ============================ */
    const userSection = document.getElementById("user-section");
    const navLinks = document.getElementById("nav-links");

    const loggedUser = localStorage.getItem("loggedUser");
    const userType = localStorage.getItem("userType");

    if (loggedUser && userSection) {
        const displayName = loggedUser.includes("@") ? loggedUser.split("@")[0] : loggedUser;

        if (userType === "admin" && navLinks) {
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
    } else if (userSection) {
        userSection.innerHTML = `<a href="/login">Log In</a>`;
    }

    /* ===========================
       CART BUSINESS LOGIC
    ============================ */
    
    function loadCartFromStorage() {
        const savedCart = localStorage.getItem('reservationRooms');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    function saveCartToStorage(cart) {
        localStorage.setItem('reservationRooms', JSON.stringify(cart));
    }

    let cart = loadCartFromStorage();

    function updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = cart.length;
            const mainCart = document.getElementById('main-cart');
            if (mainCart) {
                mainCart.style.display = cart.length > 0 ? 'flex' : 'none';
            }
        }
    }

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

    function addToCart(roomData) {
        const existingRoom = cart.find(item => item.roomId === roomData.roomId);
        
        if (existingRoom) {
            showToast(`${roomData.roomTypeName} is already in your cart!`, 'warning');
            return false;
        }

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

        saveCartToStorage(cart);
        updateCartCount();
        showToast(`? ${roomData.roomTypeName} added to cart!`, 'success');
        
        return true;
    }

    function removeFromCart(index) {
        if (index >= 0 && index < cart.length) {
            const removedRoom = cart.splice(index, 1)[0];
            saveCartToStorage(cart);
            renderCartItems();
            updateCartCount();
            applyClientSideFilters();
            showToast(`${removedRoom.roomTypeName} removed from cart`, 'success');
        }
    }

    function clearCart() {
        if (confirm('Are you sure you want to clear your cart?')) {
            cart = [];
            saveCartToStorage(cart);
            renderCartItems();
            updateCartCount();
            applyClientSideFilters();
            showToast('Cart cleared', 'success');
        }
    }

    window.removeFromCart = removeFromCart;
    window.clearCart = clearCart;

    function renderCartItems() {
        const container = document.getElementById('cart-items');
        if (!container) return;
        
        container.innerHTML = "";

        if (cart.length === 0) {
            container.innerHTML = "<p style='text-align:center;color:#666;'>Your cart is empty.</p>";
            return;
        }

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

    document.getElementById("main-cart")?.addEventListener("click", () => {
        const popup = document.getElementById("cart-popup");
        if (!popup) return;
        
        const isVisible = popup.style.display === "block";
        popup.style.display = isVisible ? "none" : "block";
        
        if (!isVisible) {
            renderCartItems();
        }
    });

    document.getElementById("go-reservation")?.addEventListener("click", () => {
        if (cart.length === 0) {
            showToast('Please add rooms to cart first', 'warning');
            return;
        }
        
        window.location.href = '/Reservation';
    });

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
       CLIENT-SIDE FILTERING
    ============================ */
    
    let allRoomCards = [];
    
    function initializeRoomCards() {
        const container = document.getElementById('rooms-container');
        if (!container) return;
        
        allRoomCards = Array.from(container.querySelectorAll('.room-card')).map(card => {
            const addButton = card.querySelector('.add-cart');
            return {
                element: card.cloneNode(true),
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

    function applyClientSideFilters() {
        const searchText = document.getElementById('search-room')?.value.toLowerCase().trim() || '';
        const roomType = document.getElementById('room-type')?.value || '';
        const guestsValue = document.getElementById('guests')?.value || '';
        const priceRange = document.getElementById('price-select')?.value || '';

        let filteredRooms = [...allRoomCards];

        if (searchText) {
            filteredRooms = filteredRooms.filter(room => 
                room.roomTypeName.toLowerCase().includes(searchText) ||
                room.roomDescription.toLowerCase().includes(searchText)
            );
        }

        if (roomType) {
            filteredRooms = filteredRooms.filter(room => 
                room.roomTypeName.toLowerCase() === roomType.toLowerCase()
            );
        }

        if (guestsValue) {
            const minGuests = parseInt(guestsValue);
            filteredRooms = filteredRooms.filter(room => room.guests >= minGuests);
        }

        if (priceRange && priceRange.includes('-')) {
            const [minPrice, maxPrice] = priceRange.split('-').map(p => parseFloat(p));
            filteredRooms = filteredRooms.filter(room => 
                room.basePrice >= minPrice && room.basePrice <= maxPrice
            );
        }

        renderFilteredRooms(filteredRooms);
    }

    function renderFilteredRooms(filteredRooms) {
        const container = document.getElementById('rooms-container');
        if (!container) return;

        container.innerHTML = '';

        if (filteredRooms.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <i class="fas fa-search" style="font-size: 48px; color: #ccc; margin-bottom: 15px;"></i>
                    <p class="loading-message">No rooms found matching your criteria.</p>
                    <p style="color: #666; margin-top: 10px;">Try adjusting your filters to see more results.</p>
                </div>
            `;
            return;
        }

        filteredRooms.forEach(room => {
            const roomCard = room.element.cloneNode(true);
            const addButton = roomCard.querySelector('.add-cart');
            const roomId = parseInt(addButton.getAttribute('data-room-id'));
            const inCart = cart.some(item => item.roomId === roomId);

            if (inCart) {
                addButton.disabled = true;
                addButton.style.opacity = '0.6';
                addButton.style.cursor = 'not-allowed';
                addButton.innerHTML = '<i class="fas fa-check"></i> In Cart';
            } else {
                addButton.disabled = false;
                addButton.style.opacity = '1';
                addButton.style.cursor = 'pointer';
                addButton.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
            }

            addButton.addEventListener('click', () => {
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

                if (addToCart(roomData)) {
                    addButton.disabled = true;
                    addButton.style.opacity = '0.6';
                    addButton.style.cursor = 'not-allowed';
                    addButton.innerHTML = '<i class="fas fa-check"></i> In Cart';
                }
            });

            container.appendChild(roomCard);
        });
    }

    function resetFilters() {
        document.getElementById('search-room').value = '';
        document.getElementById('room-type').value = '';
        document.getElementById('guests').value = '';
        document.getElementById('price-select').value = '';
        
        applyClientSideFilters();
        showToast('Filters reset', 'success');
    }

    // Initialize
    initializeRoomCards();
    updateCartCount();

    // Attach filter event listeners
    const searchInput = document.getElementById('search-room');
    const roomTypeSelect = document.getElementById('room-type');
    const guestsSelect = document.getElementById('guests');
    const priceSelect = document.getElementById('price-select');
    const resetButton = document.getElementById('reset-filters');

    if (searchInput) searchInput.addEventListener('input', applyClientSideFilters);
    if (roomTypeSelect) roomTypeSelect.addEventListener('change', applyClientSideFilters);
    if (guestsSelect) guestsSelect.addEventListener('change', applyClientSideFilters);
    if (priceSelect) priceSelect.addEventListener('change', applyClientSideFilters);
    if (resetButton) resetButton.addEventListener('click', resetFilters);
});
