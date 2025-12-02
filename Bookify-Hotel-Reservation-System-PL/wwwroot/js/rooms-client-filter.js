document.addEventListener("DOMContentLoaded", () => {

    /* ===========================
       USER SECTION - REMOVED
       Navbar is now controlled by server-side Razor
    ============================ */

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
        toast.style.background = type === 'success' 
            ? 'rgba(76, 175, 80, 0.95)' 
            : type === 'warning' 
                ? 'rgba(255, 152, 0, 0.95)' 
                : 'rgba(244, 67, 54, 0.95)';
        toast.style.color = '#fff';
        toast.style.padding = '12px 20px';
        toast.style.borderRadius = '8px';
        toast.style.fontWeight = '600';
        
        setTimeout(() => {
            toast.style.display = "none";
        }, 3000);
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
        showToast(`?? ${roomData.roomTypeName} added to cart!`, 'success');
        
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
        if (cart.length === 0) {
            showToast('Cart is already empty', 'warning');
            return;
        }
        
        if (confirm('Are you sure you want to clear your cart?\n\nThis will remove all selected rooms.')) {
            const roomCount = cart.length;
            cart = [];
            saveCartToStorage(cart);
            renderCartItems();
            updateCartCount();
            applyClientSideFilters();
            
            // Close popup after clearing
            const popup = document.getElementById('cart-popup');
            if (popup) {
                setTimeout(() => {
                    popup.style.display = 'none';
                }, 500);
            }
            
            showToast(`?? Cart cleared! ${roomCount} room${roomCount > 1 ? 's' : ''} removed.`, 'success');
        }
    }

    window.removeFromCart = removeFromCart;
    window.clearCart = clearCart;

    function renderCartItems() {
        const container = document.getElementById('cart-items');
        if (!container) return;
        
        container.innerHTML = "";

        if (cart.length === 0) {
            container.innerHTML = "<p style='text-align:center;color:#666;padding:20px;'>Your cart is empty.</p>";
            return;
        }

        const total = cart.reduce((sum, room) => sum + room.basePrice, 0);

        cart.forEach((room, i) => {
            const div = document.createElement('div');
            div.className = "cart-item";
            div.innerHTML = `
                <div style="display:flex;gap:10px;align-items:center;padding:10px 0;position:relative;border-bottom:1px solid #eee;">
                    <img src="${room.imageUrl}" alt="${room.roomTypeName}" 
                         style="width:70px;height:60px;object-fit:cover;border-radius:8px;">
                    <div style="flex:1;">
                        <strong style="display:block;color:#0b3a66;font-size:0.95rem;">${room.roomTypeName}</strong>
                        <small style="color:#666;display:block;margin:3px 0;">Floor ${room.floor} • ${room.guests} Guests • ${room.area}m²</small>
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

        const footer = document.createElement('div');
        footer.style.cssText = 'margin-top:15px;padding-top:15px;border-top:2px solid #ddd;';
        footer.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <strong style="color:#0b3a66;font-size:1.1rem;">Total:</strong>
                <strong style="color:#2563eb;font-size:1.3rem;">$${total.toFixed(2)}</strong>
            </div>
            <button onclick="clearCart()" 
                    style="width:100%;padding:10px;background:#e74c3c;color:#fff;border:none;border-radius:6px;cursor:pointer;margin-bottom:8px;font-weight:600;transition:all 0.3s;">
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
        
        // Close the popup
        const popup = document.getElementById("cart-popup");
        if (popup) popup.style.display = 'none';
        
        // Navigate to Reservation page
        window.location.href = '/Reservation/Index';
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
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <i class="fas fa-search" style="font-size: 64px; color: #ddd; margin-bottom: 20px; display: block;"></i>
                    <p class="loading-message" style="font-size: 1.2rem; color: #666; margin-bottom: 10px;">No rooms found matching your criteria.</p>
                    <p style="color: #999; font-size: 0.95rem;">Try adjusting your filters to see more results.</p>
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
                addButton.style.background = 'linear-gradient(90deg, #10b981, #059669)';
            } else {
                addButton.disabled = false;
                addButton.style.opacity = '1';
                addButton.style.cursor = 'pointer';
                addButton.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
                addButton.style.background = 'linear-gradient(90deg,#06b6d4,#3b82f6)';
            }

            addButton.addEventListener('click', () => {
                if (addButton.disabled) return;
                
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
                    addButton.style.background = 'linear-gradient(90deg, #10b981, #059669)';
                }
            });

            container.appendChild(roomCard);
        });
    }

    // Initialize
    initializeRoomCards();
    updateCartCount();
    
    // Initial render with cart state
    applyClientSideFilters();

    // Attach filter event listeners
    const searchInput = document.getElementById('search-room');
    const roomTypeSelect = document.getElementById('room-type');
    const guestsSelect = document.getElementById('guests');
    const priceSelect = document.getElementById('price-select');

    if (searchInput) searchInput.addEventListener('input', applyClientSideFilters);
    if (roomTypeSelect) roomTypeSelect.addEventListener('change', applyClientSideFilters);
    if (guestsSelect) guestsSelect.addEventListener('change', applyClientSideFilters);
    if (priceSelect) priceSelect.addEventListener('change', applyClientSideFilters);
});
