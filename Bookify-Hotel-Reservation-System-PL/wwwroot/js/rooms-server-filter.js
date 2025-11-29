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
       CART + TOAST
    ============================ */
    let cart = [];

    function showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.style.display = "block";
        setTimeout(() => toast.style.display = "none", 1500);
    }

    function addToCart(roomData) {
        cart.push(roomData);
        document.getElementById('cart-count').textContent = cart.length;
        showToast(`${roomData.roomTypeName} added to cart`);
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        renderCartItems();
        document.getElementById("cart-count").textContent = cart.length;
    }

    window.removeFromCart = removeFromCart;

    function renderCartItems() {
        const container = document.getElementById('cart-items');
        container.innerHTML = "";

        if (cart.length === 0) {
            container.innerHTML = "<p>Your cart is empty.</p>";
            return;
        }

        cart.forEach((room, i) => {
            const div = document.createElement('div');
            div.className = "cart-item";
            div.innerHTML = `
                <img src="${room.imageUrl}" alt="${room.roomTypeName}" style="width:60px;height:50px;object-fit:cover;margin-right:10px;">
                <strong>${room.roomTypeName}</strong> - $${room.basePrice}
                <br>
                Guests: ${room.guests}, Area: ${room.area} m²
                <button onclick="removeFromCart(${i})" class="cart-remove">Remove</button>
            `;
            container.appendChild(div);
        });
    }

    document.getElementById("main-cart").addEventListener("click", () => {
        const popup = document.getElementById("cart-popup");
        popup.style.display = popup.style.display === "block" ? "none" : "block";
        if (popup.style.display === "block") renderCartItems();
    });

    document.getElementById("go-reservation")?.addEventListener("click", () => {
        localStorage.setItem("reservationRooms", JSON.stringify(cart));
        window.location.href = '/Reservation';
    });

    /* ===========================
       ROOM DETAILS POPUP
    ============================ */
    function showRoomDetails(room) {
        let popup = document.getElementById("room-popup");
        if (!popup) {
            popup = document.createElement("div");
            popup.id = "room-popup";
            popup.className = "overlay";
            document.body.appendChild(popup);
        }

        popup.innerHTML = `
            <div class="details-card">
                <img src="${room.imageUrl}" alt="${room.roomTypeName}">
                <h2>${room.roomTypeName}</h2>
                <p>${room.roomDescription}</p>
                <div class="extra-info">
                    <p><strong>Breakfast:</strong> Included</p>
                    <p><strong>WiFi:</strong> Free high-speed internet</p>
                    <p><strong>Cancellation:</strong> Free within 24 hours</p>
                    <p><strong>Check-in:</strong> 2 PM</p>
                    <p><strong>Check-out:</strong> 11 AM</p>
                    <p><strong>Room Size:</strong> ${room.area} m²</p>
                    <p><strong>Price:</strong> $${room.basePrice}</p>
                    <p><strong>Guests:</strong> ${room.guests}</p>
                    <p><strong>Floor:</strong> ${room.floor}</p>
                </div>
                <div class="room-buttons">
                    <button class="add-cart-popup">Add to Cart</button>
                    <button class="close-details-btn">Close</button>
                </div>
            </div>
        `;

        popup.style.display = "flex";

        popup.querySelector(".add-cart-popup").addEventListener("click", () => {
            addToCart(room);
            popup.style.display = "none";
        });

        popup.querySelector(".close-details-btn").addEventListener("click", () => {
            popup.style.display = "none";
        });
    }

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
                        <button class="add-cart">Add to Cart</button>
                        <button class="view-details">View Details</button>
                    </div>
                </div>
            `;
            
            // Add event listeners
            roomCard.querySelector('.add-cart').addEventListener('click', () => addToCart(room));
            roomCard.querySelector('.view-details').addEventListener('click', () => showRoomDetails(room));
            
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
    document.getElementById("search-room").addEventListener("input", applyFilters);
    document.getElementById("room-type").addEventListener("change", applyFilters);
    document.getElementById("guests").addEventListener("change", applyFilters);
    document.getElementById("price-select").addEventListener("change", applyFilters);

    // Load all rooms on page load
    loadAllRooms();
});
