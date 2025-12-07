/**
 * Room Details Page - Cart and Toast Management
 * Handles cart operations, toast notifications, and UI interactions for the room details page
 */

/* ===========================
   TOAST NOTIFICATIONS
============================ */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = '';
    if (type) {
        toast.classList.add(type);
    }
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

/* ===========================
   CART MANAGEMENT
============================ */

/**
 * Load cart from localStorage
 */
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('reservationRooms');
    return savedCart ? JSON.parse(savedCart) : [];
}

/**
 * Save cart to localStorage
 */
function saveCartToStorage(cart) {
    localStorage.setItem('reservationRooms', JSON.stringify(cart));
}

/**
 * Add room to cart (called from inline onclick)
 */
function addToCart() {
    // Get room data from window object (set by Razor view)
    if (!window.currentRoomData) {
        showToast('? Unable to add room to cart', 'warning');
        return;
    }

    const roomData = window.currentRoomData;
    let cart = loadCartFromStorage();
    
    const existingIndex = cart.findIndex(item => item.roomId === roomData.roomId);
    
    if (existingIndex === -1) {
        cart.push(roomData);
        saveCartToStorage(cart);
        updateCartDisplay();
        showToast('? Room added to cart successfully!', 'success');
    } else {
        showToast('?? This room is already in your cart', 'warning');
    }
}

/**
 * Remove room from cart by index
 */
function removeFromCart(index) {
    let cart = loadCartFromStorage();
    
    if (index >= 0 && index < cart.length) {
        const removedRoom = cart[index];
        cart.splice(index, 1);
        saveCartToStorage(cart);
        updateCartDisplay();
        showToast(`??? ${removedRoom.roomTypeName} removed from cart`, 'success');
    }
}

/**
 * Update cart display in the popup and cart count
 */
function updateCartDisplay() {
    const cart = loadCartFromStorage();
    const cartCountElement = document.getElementById('cart-count');
    const mainCart = document.getElementById('main-cart');

    if (!cartCountElement || !mainCart) return;

    if (cart.length > 0) {
        cartCountElement.textContent = cart.length;
        mainCart.style.display = 'flex';
    } else {
        mainCart.style.display = 'none';
    }

    // Update cart popup if it exists
    const cartItemsContainer = document.getElementById('cart-items');
    if (cartItemsContainer) {
        renderCartItems(cart, cartItemsContainer);
    }
}

/**
 * Render cart items in the popup
 */
function renderCartItems(cart, container) {
    if (!container) return;

    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">Your cart is empty</p>';
        return;
    }

    const total = cart.reduce((sum, room) => sum + room.basePrice, 0);

    cart.forEach((room, index) => {
        const roomDiv = document.createElement('div');
        roomDiv.className = 'cart-item';
        roomDiv.innerHTML = `
            <div style="display:flex;gap:10px;align-items:center;padding:10px 0;position:relative;border-bottom:1px solid #eee;">
                <img src="${room.imageUrl}" alt="${room.roomTypeName}" 
                     style="width:70px;height:60px;object-fit:cover;border-radius:8px;">
                <div style="flex:1;">
                    <strong style="display:block;color:#0b3a66;font-size:0.95rem;">${room.roomTypeName}</strong>
                    <small style="color:#666;display:block;margin:3px 0;">Floor ${room.floor} • ${room.guests} Guests • ${room.area}m²</small>
                    <div style="color:#2563eb;font-weight:700;margin-top:3px;font-size:1.05rem;">$${room.basePrice}</div>
                </div>
                <button onclick="removeFromCart(${index})" class="cart-remove" 
                        style="position:absolute;top:10px;right:0;background:#e74c3c;color:#fff;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:0.85rem;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        container.appendChild(roomDiv);
    });

    // Add total section
    const footer = document.createElement('div');
    footer.style.cssText = 'margin-top:15px;padding-top:15px;border-top:2px solid #ddd;';
    footer.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
            <strong style="color:#0b3a66;font-size:1.1rem;">Total:</strong>
            <strong style="color:#2563eb;font-size:1.3rem;">$${total.toFixed(2)}</strong>
        </div>
    `;
    container.appendChild(footer);
}

/* ===========================
   CART POPUP INTERACTIONS
============================ */

/**
 * Toggle cart popup visibility
 */
function toggleCartPopup() {
    const cartPopup = document.getElementById('cart-popup');
    if (!cartPopup) return;
    
    if (cartPopup.style.display === 'block') {
        cartPopup.style.display = 'none';
    } else {
        cartPopup.style.display = 'block';
        updateCartDisplay();
    }
}

/**
 * Navigate to reservation page
 */
function goToReservation() {
    const cart = loadCartFromStorage();
    
    if (cart.length > 0) {
        window.location.href = '/Reservation/Index';
    } else {
        showToast('?? Your cart is empty', 'warning');
    }
}

/* ===========================
   INITIALIZATION
============================ */

document.addEventListener('DOMContentLoaded', function() {
    // Update cart display on page load
    const cart = loadCartFromStorage();
    if (cart.length > 0) {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = cart.length;
            document.getElementById('main-cart').style.display = 'flex';
        }
    }

    const mainCart = document.getElementById('main-cart');
    const cartPopup = document.getElementById('cart-popup');
    const goReservationBtn = document.getElementById('go-reservation');

    // Cart icon click handler
    if (mainCart) {
        mainCart.addEventListener('click', toggleCartPopup);
    }

    // Close cart popup when clicking outside
    document.addEventListener('click', function(e) {
        if (mainCart && cartPopup && 
            !mainCart.contains(e.target) && 
            !cartPopup.contains(e.target)) {
            cartPopup.style.display = 'none';
        }
    });

    // Go to reservation button
    if (goReservationBtn) {
        goReservationBtn.addEventListener('click', goToReservation);
    }
});
