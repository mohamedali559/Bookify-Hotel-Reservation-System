/**
 * Payment Processing Page - Payment Form & Invoice Generation
 * Handles payment form display, validation, processing, and invoice PDF generation
 * 
 * Features:
 * - Load booking data from server-side model (via data attributes)
 * - Display invoice with booking details
 * - Simple card payment form (demo mode)
 * - Client-side card validation
 * - Payment processing via API
 * - Invoice PDF generation and download
 * - Cart cleanup after payment
 * 
 * Dependencies:
 * - Toastify (notifications)
 * - html2pdf (PDF generation)
 * - Fetch API (payment processing)
 * - DOM data attributes (booking data)
 * 
 * @file payment.js
 * @description Payment processing and invoice generation functionality
 * @requires Toastify, html2pdf
 */

/* ===========================
   INITIAL SETUP & VALIDATION
============================ */

/**
 * Load Booking Data from DOM
 * Retrieves booking information from data attributes set by server
 * Required for payment processing and invoice generation
 * @type {Object|null}
 */
const bookingDataElement = document.getElementById("booking-data");
const bookingData = bookingDataElement ? {
    bookingId: parseInt(bookingDataElement.dataset.bookingId),
    guestName: bookingDataElement.dataset.guestName,
    guestEmail: bookingDataElement.dataset.guestEmail,
    roomTypeName: bookingDataElement.dataset.roomType,
    checkInDate: bookingDataElement.dataset.checkIn,
    checkOutDate: bookingDataElement.dataset.checkOut,
    numberOfNights: parseInt(bookingDataElement.dataset.nights),
    totalPrice: parseFloat(bookingDataElement.dataset.totalPrice)
} : null;

/**
 * Validate Booking Data Exists
 * Redirects to rooms page if no booking data found
 * Prevents accessing payment page without a booking
 */
if (!bookingData || !bookingData.bookingId) {
    // Show error notification
    if (typeof Toastify !== 'undefined') {
        Toastify({
            text: "⚠ No booking found. Please complete booking first.",
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "#ef4444",
        }).showToast();
    } else {
        alert("⚠ No booking found. Please complete booking first.");
    }
    
    // Redirect to rooms page after 3 seconds
    setTimeout(() => {
        window.location.href = "/Room";
    }, 3000);
}

/* ===========================
   PRICE CALCULATIONS
============================ */

/**
 * Extract Pricing Information
 * Gets nights and total from booking data
 */
const nights = bookingData?.numberOfNights || 0;
const totalPrice = bookingData?.totalPrice || 0;
const pricePerNight = nights > 0 ? totalPrice / nights : 0;

/* ===========================
   INVOICE DISPLAY
============================ */

/**
 * Fill Invoice Dynamic Content
 * Populates invoice section with complete booking details
 * Displayed after payment processing
 */
const invoiceContent = document.getElementById("invoice-content");
if (invoiceContent) {
    invoiceContent.innerHTML = `
        <p><strong>Booking ID:</strong><br> #${bookingData?.bookingId}</p>
        <p><strong>Full Name:</strong><br> ${bookingData?.guestName}</p>
        <p><strong>Email:</strong><br> ${bookingData?.guestEmail}</p>
        <p><strong>Room Type:</strong><br> ${bookingData?.roomTypeName}</p>
        <p><strong>Check-in:</strong><br> ${new Date(bookingData?.checkInDate).toLocaleDateString()}</p>
        <p><strong>Check-out:</strong><br> ${new Date(bookingData?.checkOutDate).toLocaleDateString()}</p>
        <p><strong>Price per Night:</strong><br> $${pricePerNight.toFixed(2)}</p>
        <p><strong>Number of Nights:</strong><br> ${nights}</p>
    `;
}

/**
 * Display Total Price
 * Shows final amount to be paid
 */
const totalPriceElement = document.getElementById("total-price");
if (totalPriceElement) {
    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
}

/**
 * Display Subtotal
 * Shows price breakdown (same as total in this case)
 */
const subtotalElement = document.getElementById("subtotal-price");
if (subtotalElement) {
    subtotalElement.textContent = `$${totalPrice.toFixed(2)}`;
}

/* ===========================
   PAYMENT FORM SETUP
============================ */

/**
 * Create Simple Card Input Form
 * Demo mode - No actual Stripe integration
 * Creates card number, expiry, and CVC inputs
 * 
 * Note: This is a demo implementation
 * In production, use Stripe Elements or similar secure payment processor
 */
const cardElement = document.getElementById("card-element");
if (cardElement) {
    cardElement.innerHTML = `
        <div style="padding: 10px;">
            <input type="text" id="demo-card-number" placeholder="Card Number (e.g., 4242 4242 4242 4242)" 
                   style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px;">
            <div style="display: flex; gap: 10px;">
                <input type="text" id="demo-card-expiry" placeholder="MM/YY" 
                       style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                <input type="text" id="demo-card-cvc" placeholder="CVC" 
                       style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div id="card-errors" style="color: #ef4444; margin-top: 10px; font-size: 14px;"></div>
        </div>
    `;
}

/* ===========================
   CARD VALIDATION
============================ */

/**
 * Validate Card Input Fields
 * Client-side validation for card details
 * 
 * Validations:
 * - Card number: Minimum 13 digits
 * - Expiry: MM/YY format
 * - CVC: Minimum 3 digits
 * 
 * @function validateCardInputs
 * @returns {boolean} True if all inputs valid, false otherwise
 */
function validateCardInputs() {
    const cardNumber = document.getElementById("demo-card-number")?.value.trim();
    const expiry = document.getElementById("demo-card-expiry")?.value.trim();
    const cvc = document.getElementById("demo-card-cvc")?.value.trim();
    const errorDiv = document.getElementById("card-errors");

    // Validate card number (minimum 13 digits)
    if (!cardNumber || cardNumber.length < 13) {
        if (errorDiv) errorDiv.textContent = "Please enter a valid card number";
        return false;
    }
    
    // Validate expiry format (MM/YY)
    if (!expiry || !expiry.match(/^\d{2}\/\d{2}$/)) {
        if (errorDiv) errorDiv.textContent = "Please enter expiry in MM/YY format";
        return false;
    }
    
    // Validate CVC (minimum 3 digits)
    if (!cvc || cvc.length < 3) {
        if (errorDiv) errorDiv.textContent = "Please enter a valid CVC";
        return false;
    }

    // Clear error message if all valid
    if (errorDiv) errorDiv.textContent = "";
    return true;
}

/* ===========================
   PAYMENT PROCESSING
============================ */

/**
 * Pay Button Click Handler
 * Main payment processing function
 * 
 * Flow:
 * 1. Validate card inputs
 * 2. Prepare payment data
 * 3. Send payment request to backend
 * 4. Save payment confirmation
 * 5. Show invoice
 * 6. Clear cart
 * 
 * @async
 * @listens click - On "Pay Now" button
 */
const payButton = document.getElementById("pay-btn");
if (payButton) {
    payButton.addEventListener("click", async () => {
        const originalButtonText = payButton.innerHTML;
        
        /* ===========================
           STEP 1: VALIDATE CARD INPUTS
        ============================ */
        if (!validateCardInputs()) {
            return;
        }
        
        /* ===========================
           STEP 2: SHOW LOADING STATE
        ============================ */
        payButton.disabled = true;
        payButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Payment...';

        try {
            /* ===========================
               STEP 3: PREPARE PAYMENT DATA
            ============================ */
            
            /**
             * Payment Data Object
             * Sent to backend for processing
             * Card number is masked for security
             * @type {Object}
             */
            const paymentData = {
                bookingId: bookingData.bookingId,
                amount: totalPrice,
                paymentMethod: "Credit Card",
                cardHolderName: bookingData.guestName,
                cardNumber: "**** **** **** " + document.getElementById("demo-card-number").value.slice(-4)
            };

            console.log("Sending payment request:", paymentData);

            /* ===========================
               STEP 4: SEND PAYMENT REQUEST
            ============================ */
            
            /**
             * API Call: Process Payment
             * POST request to backend payment processor
             * Endpoint: /Payment/ProcessPayment
             */
            const response = await fetch('/Payment/ProcessPayment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paymentData)
            });

            console.log("Response status:", response.status);

            // Check HTTP response status
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Payment result:", result);

            /* ===========================
               STEP 5: HANDLE SUCCESS
            ============================ */
            
            if (result.success) {
                /**
                 * Payment Information
                 * Saved to localStorage for reference
                 * @type {Object}
                 */
                const paymentInfo = {
                    paymentId: result.paymentId,
                    transactionId: result.transactionId,
                    bookingId: bookingData.bookingId,
                    amount: totalPrice,
                    paymentDate: new Date().toISOString(),
                    status: 'Completed'
                };
                
                // Save payment confirmation
                localStorage.setItem("paymentInfo", JSON.stringify(paymentInfo));

                /**
                 * Show Success Message
                 * Display confirmation with transaction ID
                 */
                if (typeof Toastify !== 'undefined') {
                    Toastify({
                        text: `✓ Payment successful! Transaction ID: ${result.transactionId}`,
                        duration: 3000,
                        gravity: "top",
                        position: "center",
                        backgroundColor: "#10b981",
                    }).showToast();
                } else {
                    alert(`✓ Payment successful! Transaction ID: ${result.transactionId}`);
                }

                /**
                 * Switch to Invoice View
                 * Hide payment form, show invoice with download button
                 */
                const cardContainer = document.querySelector('.card-container');
                const invoiceBox = document.querySelector('.invoice');
                if (cardContainer) cardContainer.style.display = 'none';
                if (invoiceBox) invoiceBox.style.display = 'block';

                /**
                 * Clear Cart
                 * Remove booked room from reservation cart (if exists)
                 */
                try {
                    let cart = JSON.parse(localStorage.getItem('reservationRooms') || '[]');
                    cart = cart.filter(room => room.roomId !== bookingData.roomId);
                    localStorage.setItem('reservationRooms', JSON.stringify(cart));
                } catch (e) {
                    console.log("No cart data to clear");
                }

            } else {
                throw new Error(result.message || 'Payment failed');
            }
        } catch (error) {
            /* ===========================
               STEP 6: HANDLE ERRORS
            ============================ */
            
            /**
             * Error Handler
             * Catches network errors, payment failures, etc.
             */
            console.error('Payment error:', error);
            
            if (typeof Toastify !== 'undefined') {
                Toastify({
                    text: `❌ Payment failed: ${error.message}`,
                    duration: 5000,
                    gravity: "top",
                    position: "center",
                    backgroundColor: "#ef4444",
                }).showToast();
            } else {
                alert(`❌ Payment failed: ${error.message}`);
            }

            // Re-enable button on error
            payButton.disabled = false;
            payButton.innerHTML = originalButtonText;
        }
    });
}

/* ===========================
   PDF INVOICE GENERATION
============================ */

/**
 * Download PDF Button Handler
 * Generates and downloads invoice as PDF file
 * 
 * Features:
 * - Converts invoice HTML to PDF
 * - Custom filename with booking ID and timestamp
 * - High quality output (scale: 2, quality: 0.98)
 * - A4 portrait format
 * 
 * @listens click - On "Download Invoice" button
 * @requires html2pdf library
 */
const downloadButton = document.getElementById("download-pdf");
if (downloadButton) {
    downloadButton.addEventListener("click", () => {
        const element = document.getElementById("invoice-box");

        /**
         * Check html2pdf Library
         * Verify library is loaded before attempting PDF generation
         */
        if (typeof html2pdf === 'undefined') {
            alert("PDF library not loaded. Please refresh the page.");
            return;
        }

        /**
         * PDF Generation Options
         * Configuration for html2pdf library
         * @type {Object}
         */
        const opt = {
            margin: 10,                                                      // 10mm margin
            filename: `Invoice_Booking_${bookingData?.bookingId}_${Date.now()}.pdf`,  // Dynamic filename
            image: { type: 'jpeg', quality: 0.98 },                         // High quality images
            html2canvas: { scale: 2, logging: false },                      // 2x scale for sharp text
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }   // A4 portrait
        };

        /**
         * Generate and Download PDF
         * Converts HTML element to PDF and triggers download
         */
        html2pdf().set(opt).from(element).save().then(() => {
            // Show success notification
            if (typeof Toastify !== 'undefined') {
                Toastify({
                    text: "✓ Invoice downloaded successfully!",
                    duration: 2000,
                    gravity: "top",
                    position: "center",
                    backgroundColor: "#10b981",
                }).showToast();
            } else {
                alert("✓ Invoice downloaded successfully!");
            }
        }).catch(err => {
            // Handle PDF generation errors
            console.error("PDF generation error:", err);
            alert("Failed to generate PDF. Please try again.");
        });
    });
}
