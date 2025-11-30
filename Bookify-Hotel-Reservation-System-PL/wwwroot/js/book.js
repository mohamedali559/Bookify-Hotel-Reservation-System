// Load selected room from localStorage
const selectedRoom = JSON.parse(localStorage.getItem("selectedRoom"));
const detailsDiv = document.getElementById("room-details");

// Display room details
if (selectedRoom) {
    detailsDiv.innerHTML = `
        <div style="display:flex;gap:20px;align-items:center;background:#fff;padding:20px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
            <img src="${selectedRoom.imageUrl}" alt="${selectedRoom.roomTypeName}" 
                 style="width:200px;height:160px;object-fit:cover;border-radius:10px;">
            <div style="flex:1;">
                <h2 style="color:#0b3a66;margin:0 0 10px;font-size:1.5rem;">${selectedRoom.roomTypeName}</h2>
                <p style="color:#666;margin:0 0 15px;line-height:1.6;">${selectedRoom.roomDescription}</p>
                <div class="room-meta" style="display:flex;gap:20px;flex-wrap:wrap;">
                    <p style="margin:0;"><strong style="color:#0b3a66;">Price:</strong> <span style="color:#2563eb;font-size:1.2rem;font-weight:700;">$${selectedRoom.basePrice}</span>/night</p>
                    <p style="margin:0;"><strong style="color:#0b3a66;">Guests:</strong> ${selectedRoom.guests}</p>
                    <p style="margin:0;"><strong style="color:#0b3a66;">Area:</strong> ${selectedRoom.area}m²</p>
                    <p style="margin:0;"><strong style="color:#0b3a66;">Floor:</strong> ${selectedRoom.floor}</p>
                </div>
            </div>
        </div>
    `;
    
    // Pre-fill guests field based on room capacity
    const guestsSelect = document.getElementById("guests");
    if (guestsSelect) {
        guestsSelect.innerHTML = '<option value="">Select number of guests</option>';
        for (let i = 1; i <= selectedRoom.guests; i++) {
            guestsSelect.innerHTML += `<option value="${i}">${i} Guest${i > 1 ? 's' : ''}</option>`;
        }
    }
    
    // Remove room type selection since we already have a selected room
    const roomSelect = document.getElementById("room");
    if (roomSelect) {
        roomSelect.innerHTML = `<option value="${selectedRoom.roomId}" selected>${selectedRoom.roomTypeName}</option>`;
        roomSelect.disabled = true;
        roomSelect.style.background = '#f3f4f6';
    }
} else {
    detailsDiv.innerHTML = `
        <div style="text-align:center;padding:40px;background:#fff;border-radius:12px;">
            <i class="fas fa-exclamation-circle" style="font-size:48px;color:#ef4444;margin-bottom:15px;"></i>
            <p style="color:#666;font-size:1.1rem;margin:0 0 20px;">No room selected. Please select a room first.</p>
            <a href="/Room" style="background:#2563eb;color:#fff;padding:12px 30px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600;">
                Browse Rooms
            </a>
        </div>
    `;
}

// Set minimum dates (today and tomorrow)
const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

const checkinInput = document.getElementById("checkin");
const checkoutInput = document.getElementById("checkout");

if (checkinInput) {
    checkinInput.min = today;
    checkinInput.value = today;
}

if (checkoutInput) {
    checkoutInput.min = tomorrow;
    checkoutInput.value = tomorrow;
}

// Update checkout min date when checkin changes
if (checkinInput) {
    checkinInput.addEventListener('change', function() {
        const checkinDate = new Date(this.value);
        const nextDay = new Date(checkinDate.getTime() + 86400000);
        const minCheckout = nextDay.toISOString().split('T')[0];
        
        if (checkoutInput) {
            checkoutInput.min = minCheckout;
            if (checkoutInput.value <= this.value) {
                checkoutInput.value = minCheckout;
            }
        }
    });
}

// Handle payment button click
document.getElementById("goPayment")?.addEventListener("click", async function () {
    if (!selectedRoom) {
        return Toastify({
            text: "? No room selected. Please go back and select a room.",
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "#ef4444",
        }).showToast();
    }

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const guests = document.getElementById("guests").value;
    const checkin = document.getElementById("checkin").value;
    const checkout = document.getElementById("checkout").value;

    // Validation: Required Fields
    if (!name || !email || !guests || !checkin || !checkout) {
        return Toastify({
            text: "? Please fill all fields",
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "#ef4444",
        }).showToast();
    }

    // Validation: Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return Toastify({
            text: "? Please enter a valid email address",
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "#ef4444",
        }).showToast();
    }

    // Validation: Check-in must be before Check-out
    if (new Date(checkin) >= new Date(checkout)) {
        return Toastify({
            text: "? Check-In date must be BEFORE Check-Out",
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "#ef4444",
        }).showToast();
    }

    // Calculate number of nights and total price
    const checkInDate = new Date(checkin);
    const checkOutDate = new Date(checkout);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * selectedRoom.basePrice;

    // Prepare booking data for API
    const bookingData = {
        roomId: selectedRoom.roomId,
        guestName: name,
        guestEmail: email,
        numberOfGuests: parseInt(guests),
        checkInDate: checkin,
        checkOutDate: checkout,
        totalPrice: totalPrice,
        numberOfNights: nights
    };

    // Disable button and show loading
    const paymentButton = document.getElementById("goPayment");
    const originalButtonText = paymentButton.innerHTML;
    paymentButton.disabled = true;
    paymentButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Booking...';

    try {
        // Call API to create booking in database
        const response = await fetch('/Book/CreateBooking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });

        // Check if response is ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            // Save complete booking info for payment page
            const completeBookingData = {
                bookingId: result.bookingId,
                roomId: selectedRoom.roomId,
                roomTypeName: selectedRoom.roomTypeName,
                roomDescription: selectedRoom.roomDescription,
                imageUrl: selectedRoom.imageUrl,
                pricePerNight: selectedRoom.basePrice,
                guestName: name,
                guestEmail: email,
                numberOfGuests: parseInt(guests),
                checkInDate: checkin,
                checkOutDate: checkout,
                numberOfNights: result.nights,
                totalPrice: result.totalPrice,
                bookingDate: new Date().toISOString()
            };
            
            localStorage.setItem("bookingData", JSON.stringify(completeBookingData));

            // Remove room from cart after successful booking
            let cart = JSON.parse(localStorage.getItem('reservationRooms') || '[]');
            cart = cart.filter(room => room.roomId !== selectedRoom.roomId);
            localStorage.setItem('reservationRooms', JSON.stringify(cart));

            // Success Toast
            Toastify({
                text: `? Booking confirmed! Total: $${result.totalPrice} for ${result.nights} night${result.nights > 1 ? 's' : ''}`,
                duration: 2000,
                gravity: "top",
                position: "center",
                backgroundColor: "#10b981",
            }).showToast();

            // Redirect to payment
            setTimeout(() => {
                window.location.href = "/Payment";
            }, 2000);
        } else {
            // Show error message from server
            Toastify({
                text: `? ${result.message}${result.details ? '\n' + result.details : ''}`,
                duration: 5000,
                gravity: "top",
                position: "center",
                backgroundColor: "#ef4444",
            }).showToast();

            // Re-enable button
            paymentButton.disabled = false;
            paymentButton.innerHTML = originalButtonText;
        }
    } catch (error) {
        console.error('Booking error:', error);
        
        Toastify({
            text: `? Connection error: ${error.message}. Please check your connection and try again.`,
            duration: 5000,
            gravity: "top",
            position: "center",
            backgroundColor: "#ef4444",
        }).showToast();

        // Re-enable button
        paymentButton.disabled = false;
        paymentButton.innerHTML = originalButtonText;
    }
});


