document.addEventListener("DOMContentLoaded", () => {

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

    function addToCart(card) {
        const room = extractRoomData(card);
        cart.push(room);
        document.getElementById('cart-count').textContent = cart.length;
        showToast(`${room.name} added to cart`);
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
                <img src="${room.image}" alt="${room.name}" style="width:60px;height:50px;object-fit:cover;margin-right:10px;">
                <strong>${room.name}</strong> - $${room.price}
                <br>
                Guests: ${room.guests}, Beds: ${room.beds}
                <button onclick="removeFromCart(${i})" class="cart-remove">Remove</button>
            `;
            container.appendChild(div);
        });
    }

    document.getElementById("main-cart")?.addEventListener("click", () => {
        const popup = document.getElementById("cart-popup");
        popup.style.display = popup.style.display === "block" ? "none" : "block";
        if (popup.style.display === "block") renderCartItems();
    });

    document.getElementById("go-reservation")?.addEventListener("click", () => {
        localStorage.setItem("reservationRooms", JSON.stringify(cart));
        window.location.href = '/Reservation';
    });

    /* ===========================
       ROOM CARDS + DETAILS POPUP
    ============================ */
    let rooms = Array.from(document.querySelectorAll(".room-card")).map(card => extractRoomData(card));

    rooms.forEach(r => {
        r.element.querySelector(".add-cart")?.addEventListener("click", () => addToCart(r.element));
        r.element.querySelector(".view-details")?.addEventListener("click", () => showRoomDetails(r.element));
    });

    function showRoomDetails(card) {
        const room = extractRoomData(card);

        let popup = document.getElementById("room-popup");
        if (!popup) {
            popup = document.createElement("div");
            popup.id = "room-popup";
            popup.className = "overlay";
            document.body.appendChild(popup);
        }

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

        popup.style.display = "flex";

        popup.querySelector(".add-cart-popup").addEventListener("click", () => {
            addToCart(card);
        });

        popup.querySelector(".close-details-btn").addEventListener("click", () => {
            popup.style.display = "none";
        });
    }

    /* ===========================
       FILTERS
    ============================ */

    // Apply Filters (Call Server)
    async function applyFilters() {
        const search = document.getElementById("search-room")?.value || "";
        const type = document.getElementById("room-type")?.value || "";
        const guests = document.getElementById("guests")?.value || "";
        const price = document.getElementById("price-select")?.value || "";

        const url = `/Room/Filter?search=${search}&type=${type}&guests=${guests}&price=${price}`;

        const container = document.getElementById("rooms-container");
        if (!container) return;
        
        container.innerHTML = "<p class='loading-message'>Loading...</p>";

        try {
            const response = await fetch(url);
            const rooms = await response.json();
            renderRooms(rooms);
        } catch (error) {
            console.error("Error fetching rooms:", error);
            container.innerHTML = "<p>Error loading rooms. Please try again.</p>";
        }
    }

    // Render Rooms
    function renderRooms(rooms) {
        const container = document.getElementById("rooms-container");
        if (!container) return;
        
        container.innerHTML = "";

        if (rooms.length === 0) {
            container.innerHTML = "<p>No rooms found.</p>";
            return;
        }

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

    // Events
    document.getElementById("search-room")?.addEventListener("input", applyFilters);
    document.getElementById("room-type")?.addEventListener("change", applyFilters);
    document.getElementById("guests")?.addEventListener("change", applyFilters);
    document.getElementById("price-select")?.addEventListener("change", applyFilters);

});
