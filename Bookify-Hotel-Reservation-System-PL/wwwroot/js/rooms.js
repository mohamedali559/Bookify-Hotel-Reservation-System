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

    function extractRoomData(card) {
        return {
            name: card.querySelector("h3").innerText,
            description: card.querySelector("p").innerText,
            beds: parseInt(card.querySelector(".fa-bed")?.parentNode.textContent.replace(/\D/g, "")) || 0,
            guests: parseInt(card.querySelector(".fa-user-friends")?.parentNode.textContent.replace(/\D/g, "")) || 0,
            size: card.querySelectorAll(".features span")[2]?.innerText || "",
            price: parseInt(card.querySelectorAll(".features span")[3]?.innerText.replace('$', '')) || 0,
            type: card.dataset.type ?? "",
            image: card.querySelector("img")?.src || "",  // ? ??? ???? ??????
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

//    /* ===========================
//       FILTERS
//    ============================ */
//    function applyFilters() {
//        const search = document.getElementById("search-room").value.toLowerCase();
//        const type = document.getElementById("room-type").value;
//        const guests = document.getElementById("guests").value;
//        const maxPrice = document.getElementById("price-select").value;

//        let min = 0, max = Infinity;
//        if (maxPrice) {
//            [min, max] = maxPrice.split('-').map(Number);
//        }

//        const filtered = rooms.filter(room => {
//            if (!room.name.toLowerCase().includes(search)) return false;
//            if (type && room.type !== type) return false;
//            if (guests && room.guests != guests) return false;
//            if (room.price < min || room.price > max) return false;
//            return true;
//        });

//        renderRooms(filtered);
//    }

//    function renderRooms(filteredRooms) {
//        const container = document.getElementById("rooms-container");
//        container.innerHTML = "";
//        filteredRooms.forEach(r => container.appendChild(r.element));
//    }

//    document.getElementById("search-room").addEventListener("input", applyFilters);
//    document.getElementById("room-type").addEventListener("change", applyFilters);
//    document.getElementById("guests").addEventListener("change", applyFilters);
//    document.getElementById("price-select").addEventListener("change", applyFilters);

//});
