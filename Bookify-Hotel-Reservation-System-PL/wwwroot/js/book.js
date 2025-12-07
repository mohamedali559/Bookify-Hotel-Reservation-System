/**
 * Booking Form Page - Room Booking & Data Collection
 * Handles the complete booking form functionality including room display,
 * form validation, date management, and booking creation
 * 
 * Features:
 * - Display selected room details
 * - Dynamic guest selection based on room capacity
 * - Date validation (check-in/check-out)
 * - Client-side form validation
 * - Booking creation via API
 * - localStorage integration
 * - Toast notifications for user feedback
 * 
 * Dependencies:
 * - Toastify (toast notifications)
 * - Fetch API (booking creation)
 * - localStorage (room and booking data)
 * 
 * @file book.js
 * @description Booking form and room selection page functionality
 * @requires Toastify
 */

/* ===========================
   INITIAL SETUP & ROOM DISPLAY
============================ */

/**
 * Load Selected Room from localStorage
 * Retrieves the room data that user selected from rooms page
 * @type {Object|null}
 */
const selectedRoom = JSON.parse(localStorage.getItem("selectedRoom"));
const detailsDiv = document.getElementById("room-details");

/**
 * Display Room Details or Empty State
 * Shows selected room information or prompts user to select a room
 */
if (selectedRoom) {
    // Room is selected - Display full details
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
    
    /**
     * Pre-fill Guests Dropdown
     * Dynamically creates guest options based on room capacity
     * User can select from 1 to max room capacity
     */
    const guestsSelect = document.getElementById("guests");
    if (guestsSelect) {
        guestsSelect.innerHTML = '<option value="">Select number of guests</option>';
        for (let i = 1; i <= selectedRoom.guests; i++) {
            guestsSelect.innerHTML += `<option value="${i}">${i} Guest${i > 1 ? 's' : ''}</option>`;
        }
    }
    
    /**
     * Lock Room Selection
     * Since room is already selected, disable room dropdown
     * and set it to the selected room
     */
    const roomSelect = document.getElementById("room");
    if (roomSelect) {
        roomSelect.innerHTML = `<option value="${selectedRoom.roomId}" selected>${selectedRoom.roomTypeName}</option>`;
        roomSelect.disabled = true;
        roomSelect.style.background = '#f3f4f6';
    }
} else {
    /**
     * Empty State - No Room Selected
     * Shows message and button to browse rooms
     */
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

/* ===========================
   DATE MANAGEMENT
============================ */

/**
 * Set Minimum Dates
 * Prevents users from selecting past dates
 * - Check-in: Minimum today
 * - Check-out: Minimum tomorrow
 */
const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]; // +1 day in milliseconds

const checkinInput = document.getElementById("checkin");
const checkoutInput = document.getElementById("checkout");

// Set check-in minimum to today
if (checkinInput) {
    checkinInput.min = today;
    checkinInput.value = today;
}

// Set check-out minimum to tomorrow
if (checkoutInput) {
    checkoutInput.min = tomorrow;
    checkoutInput.value = tomorrow;
}

/**
 * Dynamic Check-out Date Validation
 * Updates check-out minimum date when check-in changes
 * Ensures check-out is always after check-in
 * 
 * @listens change - On check-in date input
 */
if (checkinInput) {
    checkinInput.addEventListener('change', function() {
        const checkinDate = new Date(this.value);
        const nextDay = new Date(checkinDate.getTime() + 86400000); // Add 1 day
        const minCheckout = nextDay.toISOString().split('T')[0];
        
        if (checkoutInput) {
            checkoutInput.min = minCheckout;
            // If current checkout is before new minimum, update it
            if (checkoutInput.value <= this.value) {
                checkoutInput.value = minCheckout;
            }
        }
    });
}

/* ===========================
   BOOKING SUBMISSION
============================ */

/**
 * Payment Button Click Handler
 * Main booking creation function with validation and API call
 * 
 * Flow:
 * 1. Validate room selection
 * 2. Get and validate form data
 * 3. Calculate nights and total price
 * 4. Send booking request to backend
 * 5. Save booking data to localStorage
 * 6. Remove room from cart
 * 7. Redirect to payment page
 * 
 * @async
 * @listens click - On "Proceed to Payment" button
 */
document.getElementById("goPayment")?.addEventListener("click", async function () {
    /* ===========================
       STEP 1: VALIDATE ROOM SELECTION
    ============================ */
    if (!selectedRoom) {
        return Toastify({
            text: "? No room selected. Please go back and select a room.",
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "#ef4444",
        }).showToast();
    }

    /* ===========================
       STEP 2: GET FORM DATA
    ============================ */
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const guests = document.getElementById("guests").value;
    const checkin = document.getElementById("checkin").value;
    const checkout = document.getElementById("checkout").value;

    /* ===========================
       STEP 3: CLIENT-SIDE VALIDATION
    ============================ */
    
    /**
     * Validation: Required Fields
     * Ensures all form fields are filled
     */
    if (!name || !email || !guests || !checkin || !checkout) {
        return Toastify({
            text: "? Please fill all fields",
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "#ef4444",
        }).showToast();
    }

    /**
     * Validation: Email Format
     * Checks for valid email pattern
     */
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

    /**
     * Validation: Date Logic
     * Check-in date must be before check-out date
     */
    if (new Date(checkin) >= new Date(checkout)) {
        return Toastify({
            text: "? Check-In date must be BEFORE Check-Out",
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "#ef4444",
        }).showToast();
    }

    /* ===========================
       STEP 4: CALCULATE PRICING
    ============================ */
    
    /**
     * Calculate Number of Nights
     * Difference between check-out and check-in dates
     */
    const checkInDate = new Date(checkin);
    const checkOutDate = new Date(checkout);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    /**
     * Calculate Total Price
     * Nights × Price per night
     */
    const totalPrice = nights * selectedRoom.basePrice;

    /* ===========================
       STEP 5: PREPARE API REQUEST
    ============================ */
    
    /**
     * Booking Data Object
     * Data structure sent to backend API
     * @type {Object}
     */
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

    /* ===========================
       STEP 6: SHOW LOADING STATE
    ============================ */
    
    /**
     * Update Button State
     * Disable button and show loading spinner
     */
    const paymentButton = document.getElementById("goPayment");
    const originalButtonText = paymentButton.innerHTML;
    paymentButton.disabled = true;
    paymentButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Booking...';

    /* ===========================
       STEP 7: SEND BOOKING REQUEST
    ============================ */
    
    try {
        /**
         * API Call: Create Booking
         * POST request to backend to create booking in database
         * Endpoint: /Book/CreateBooking
         */
        const response = await fetch('/Book/CreateBooking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });

        // Check HTTP response status
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        /* ===========================
           STEP 8: HANDLE SUCCESS
        ============================ */
        
        if (result.success) {
            /**
             * Complete Booking Data
             * Combines form data with API response
             * Saved to localStorage for payment page
             * @type {Object}
             */
            const completeBookingData = {
                bookingId: result.bookingId,          // From API
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
                numberOfNights: result.nights,        // From API (confirmed)
                totalPrice: result.totalPrice,        // From API (confirmed)
                bookingDate: new Date().toISOString()
            };
            
            // Save complete booking data for payment page
            localStorage.setItem("bookingData", JSON.stringify(completeBookingData));

            /**
             * Remove Room from Cart
             * After successful booking, remove the room from reservation cart
             */
            let cart = JSON.parse(localStorage.getItem('reservationRooms') || '[]');
            cart = cart.filter(room => room.roomId !== selectedRoom.roomId);
            localStorage.setItem('reservationRooms', JSON.stringify(cart));

            /**
             * Show Success Message
             * Confirmation toast with booking details
             */
            Toastify({
                text: `? Booking confirmed! Total: $${result.totalPrice} for ${result.nights} night${result.nights > 1 ? 's' : ''}`,
                duration: 2000,
                gravity: "top",
                position: "center",
                backgroundColor: "#10b981",
            }).showToast();

            /**
             * Redirect to Payment Page
             * After 2 seconds delay to show success message
             */
            setTimeout(() => {
                window.location.href = "/Payment";
            }, 2000);
        } else {
            /**
             * Handle API Error
             * Show error message returned from server
             */
            Toastify({
                text: `? ${result.message}${result.details ? '\n' + result.details : ''}`,
                duration: 5000,
                gravity: "top",
                position: "center",
                backgroundColor: "#ef4444",
            }).showToast();

            // Re-enable button on error
            paymentButton.disabled = false;
            paymentButton.innerHTML = originalButtonText;
        }
    } catch (error) {
        /* ===========================
           STEP 9: HANDLE NETWORK ERRORS
        ============================ */
        
        /**
         * Network Error Handler
         * Catches connection issues, timeouts, parsing errors
         */
        console.error('Booking error:', error);
        
        Toastify({
            text: `? Connection error: ${error.message}. Please check your connection and try again.`,
            duration: 5000,
            gravity: "top",
            position: "center",
            backgroundColor: "#ef4444",
        }).showToast();

        // Re-enable button on error
        paymentButton.disabled = false;
        paymentButton.innerHTML = originalButtonText;
    }
});


