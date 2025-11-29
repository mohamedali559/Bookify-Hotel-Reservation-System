let reservationRooms = JSON.parse(localStorage.getItem("reservationRooms")) || [];

function renderReservation() {
    const container = document.getElementById("reservation-container");
    container.innerHTML = "";

    if (reservationRooms.length === 0) {
        container.innerHTML = "<p style='grid-column:1/-1;text-align:center;'>No rooms selected.</p>";
        return;
    }

    reservationRooms.forEach((room, i) => {
        const card = document.createElement("div");
        card.className = "room-card";
        card.innerHTML = `
            <img src="${room.image}" alt="${room.name}">
            <div class="room-info">
                <h3>${room.name}</h3>
                <p>${room.description}</p>
                <div class="features">
                    <span><i class="fas fa-bed"></i> ${room.beds} Beds</span>
                    <span><i class="fas fa-user-friends"></i> ${room.guests} Guests</span>
                    <span>${room.size}</span>
                    <span>$${room.price}</span>
                </div>
                <div class="room-buttons">
                    <button onclick="bookNow(${i})" style="background:#2563eb; color:white; padding:8px 12px; border:none; cursor:pointer;">Book Now</button>
                    <button onclick="removeReservation(${i})" style="background:#dc2626; color:white; padding:8px 12px; border:none; cursor:pointer;">Remove</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    const cartCount = document.getElementById("cart-count");
    if (cartCount) cartCount.textContent = reservationRooms.length;
}


function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
    }, 3000);
}

function bookNow(index) {
    const room = reservationRooms[index];
    localStorage.setItem("selectedRoom", JSON.stringify(room));
    showToast("Room selected for booking!");
    setTimeout(() => {
        window.location.href = "/Book";
    }, 800);
}

function removeReservation(index) {
    const removedRoom = reservationRooms.splice(index, 1)[0];
    localStorage.setItem("reservationRooms", JSON.stringify(reservationRooms));
    renderReservation();
    showToast(`${removedRoom.name} removed from reservation`);
}

// ?????? ????? ?????
function backToRooms() {
    window.location.href = "/Room"; 
}


document.addEventListener("DOMContentLoaded", renderReservation);
