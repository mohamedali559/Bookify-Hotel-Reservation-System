let reservationRooms = JSON.parse(localStorage.getItem("reservationRooms")) || [];

function renderReservation() {
    const container = document.getElementById("reservation-container");
    if (!container) return;
    
    container.innerHTML = "";

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

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    toast.style.background = type === 'success' 
        ? 'rgba(16, 185, 129, 0.95)' 
        : type === 'warning'
            ? 'rgba(251, 146, 60, 0.95)'
            : 'rgba(239, 68, 68, 0.95)';
    toast.style.color = '#fff';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '8px';
    toast.style.fontWeight = '600';
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
    }, 3000);
}

function bookNow(index) {
    if (index < 0 || index >= reservationRooms.length) return;
    
    const room = reservationRooms[index];
    
    // Save the selected room for booking
    localStorage.setItem("selectedRoom", JSON.stringify(room));
    
    showToast(`? ${room.roomTypeName} selected for booking!`, 'success');
    
    setTimeout(() => {
        window.location.href = "/Book";
    }, 1000);
}

function removeReservation(index) {
    if (index < 0 || index >= reservationRooms.length) return;
    
    const removedRoom = reservationRooms.splice(index, 1)[0];
    localStorage.setItem("reservationRooms", JSON.stringify(reservationRooms));
    
    renderReservation();
    showToast(`${removedRoom.roomTypeName} removed from reservation`, 'success');
}

function backToRooms() {
    window.location.href = "/Room"; 
}

// Make functions globally accessible
window.bookNow = bookNow;
window.removeReservation = removeReservation;
window.backToRooms = backToRooms;

// Initialize on page load
document.addEventListener("DOMContentLoaded", renderReservation);
