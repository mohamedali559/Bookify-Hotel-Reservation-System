/**
 * Booking Form Page - Room Display & Form Pre-fill
 * Handles room details display, guest selection, and date picking with booked dates
 * Form submission is handled by ASP.NET MVC with jQuery validation
 * 
 * @file book.js
 * @description Booking form page functionality
 */

/* ===========================
   LOAD ROOM DATA FROM LOCALSTORAGE
============================ */

const selectedRoom = JSON.parse(localStorage.getItem("selectedRoom"));
const detailsDiv = document.getElementById("room-details");
const roomIdInput = document.getElementById("roomId");

/* ===========================
   DISPLAY ROOM DETAILS
============================ */

if (selectedRoom) {
    // Display room details
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
    
    // Set room ID in hidden field
    if (roomIdInput) {
        roomIdInput.value = selectedRoom.roomId;
    }
    
    // Populate guests dropdown
    const guestsSelect = document.getElementById("guests");
    if (guestsSelect) {
        guestsSelect.innerHTML = '<option value="">Select number of guests</option>';
        for (let i = 1; i <= selectedRoom.guests; i++) {
            guestsSelect.innerHTML += `<option value="${i}">${i} Guest${i > 1 ? 's' : ''}</option>`;
        }
    }
    
    // Lock room selection dropdown
    const roomSelect = document.getElementById("room");
    if (roomSelect) {
        roomSelect.innerHTML = `<option value="${selectedRoom.roomId}" selected>${selectedRoom.roomTypeName}</option>`;
        roomSelect.disabled = true;
        roomSelect.style.background = '#f3f4f6';
    }

    // Load booked dates and initialize Flatpickr
    loadBookedDatesAndInitializePicker();
} else {
    // No room selected - show error
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
   FLATPICKR DATE PICKER WITH BOOKED DATES
============================ */

async function loadBookedDatesAndInitializePicker() {
    try {
        // Fetch booked dates from server
        const response = await fetch(`/Book/GetBookedDates?roomId=${selectedRoom.roomId}`);
        const data = await response.json();

        if (data.success) {
            const bookedRanges = data.bookedDates;
            
            // Convert booked ranges to disabled dates array
            const disabledDates = [];
            bookedRanges.forEach(range => {
                const start = new Date(range.checkIn);
                const end = new Date(range.checkOut);
                
                // Add all dates in the range
                for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                    disabledDates.push(new Date(d));
                }
            });

            // Initialize Flatpickr for Check-in
            const checkinPicker = flatpickr("#checkin", {
                minDate: "today",
                dateFormat: "Y-m-d",
                disable: disabledDates,
                onChange: function(selectedDates, dateStr, instance) {
                    // Update checkout minimum date
                    if (selectedDates.length > 0) {
                        const nextDay = new Date(selectedDates[0]);
                        nextDay.setDate(nextDay.getDate() + 1);
                        checkoutPicker.set('minDate', nextDay);
                        
                        // Clear checkout if it's before new minimum
                        const currentCheckout = checkoutPicker.selectedDates[0];
                        if (currentCheckout && currentCheckout <= selectedDates[0]) {
                            checkoutPicker.clear();
                        }
                    }
                },
                onDayCreate: function(dObj, dStr, fp, dayElem) {
                    // Style disabled dates in red
                    const date = dayElem.dateObj;
                    const isBooked = disabledDates.some(d => 
                        d.toDateString() === date.toDateString()
                    );
                    
                    if (isBooked) {
                        dayElem.classList.add('booked-date');
                        dayElem.innerHTML += '<span class="booked-indicator">?</span>';
                    }
                }
            });

            // Initialize Flatpickr for Check-out
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            const checkoutPicker = flatpickr("#checkout", {
                minDate: tomorrow,
                dateFormat: "Y-m-d",
                disable: disabledDates,
                onDayCreate: function(dObj, dStr, fp, dayElem) {
                    // Style disabled dates in red
                    const date = dayElem.dateObj;
                    const isBooked = disabledDates.some(d => 
                        d.toDateString() === date.toDateString()
                    );
                    
                    if (isBooked) {
                        dayElem.classList.add('booked-date');
                        dayElem.innerHTML += '<span class="booked-indicator">?</span>';
                    }
                }
            });

            // Add custom CSS for booked dates
            addBookedDatesStyles();

        } else {
            console.error('Error loading booked dates:', data.message);
            // Initialize without disabled dates
            initializeBasicPickers();
        }
    } catch (error) {
        console.error('Error fetching booked dates:', error);
        // Initialize without disabled dates
        initializeBasicPickers();
    }
}

/**
 * Initialize basic date pickers without booked dates (fallback)
 */
function initializeBasicPickers() {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const checkinPicker = flatpickr("#checkin", {
        minDate: today,
        dateFormat: "Y-m-d",
        onChange: function(selectedDates) {
            if (selectedDates.length > 0) {
                const nextDay = new Date(selectedDates[0]);
                nextDay.setDate(nextDay.getDate() + 1);
                checkoutPicker.set('minDate', nextDay);
            }
        }
    });

    const checkoutPicker = flatpickr("#checkout", {
        minDate: tomorrow,
        dateFormat: "Y-m-d"
    });
}

/**
 * Add custom styles for booked dates
 */
function addBookedDatesStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .flatpickr-day.booked-date {
            background-color: #fee2e2 !important;
            border-color: #ef4444 !important;
            color: #991b1b !important;
            cursor: not-allowed !important;
            position: relative;
        }
        
        .flatpickr-day.booked-date:hover {
            background-color: #fecaca !important;
            border-color: #dc2626 !important;
        }
        
        .booked-indicator {
            position: absolute;
            top: 2px;
            right: 2px;
            font-size: 8px;
            color: #ef4444;
            font-weight: bold;
        }
        
        .flatpickr-day.disabled,
        .flatpickr-day.disabled:hover {
            color: #d1d5db !important;
            cursor: not-allowed !important;
        }
    `;
    document.head.appendChild(style);
}


