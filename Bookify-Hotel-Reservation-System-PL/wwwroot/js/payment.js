// Load booking data from localStorage
const bookingData = JSON.parse(localStorage.getItem("bookingData"));

if (!bookingData || !bookingData.bookingId) {
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
    
    setTimeout(() => {
        window.location.href = "/Room";
    }, 3000);
}

// Fill user info above payment form
if (document.getElementById("name")) {
    document.getElementById("name").value = bookingData?.guestName || "";
}
if (document.getElementById("email")) {
    document.getElementById("email").value = bookingData?.guestEmail || "";
}

// Calculate totals
const nights = bookingData?.numberOfNights || 0;
const pricePerNight = bookingData?.pricePerNight || 0;
const totalPrice = bookingData?.totalPrice || 0;

// Fill Invoice Dynamic Content
const invoiceContent = document.getElementById("invoice-content");
if (invoiceContent) {
    invoiceContent.innerHTML = `
        <p><strong>Booking ID:</strong><br> #${bookingData?.bookingId}</p>
        <p><strong>Full Name:</strong><br> ${bookingData?.guestName}</p>
        <p><strong>Email:</strong><br> ${bookingData?.guestEmail}</p>
        <p><strong>Room Type:</strong><br> ${bookingData?.roomTypeName}</p>
        <p><strong>Guests:</strong><br> ${bookingData?.numberOfGuests}</p>
        <p><strong>Check-in:</strong><br> ${new Date(bookingData?.checkInDate).toLocaleDateString()}</p>
        <p><strong>Check-out:</strong><br> ${new Date(bookingData?.checkOutDate).toLocaleDateString()}</p>
        <p><strong>Price per Night:</strong><br> $${pricePerNight.toFixed(2)}</p>
        <p><strong>Number of Nights:</strong><br> ${nights}</p>
    `;
}

const totalPriceElement = document.getElementById("total-price");
if (totalPriceElement) {
    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
}

const subtotalElement = document.getElementById("subtotal-price");
if (subtotalElement) {
    subtotalElement.textContent = `$${totalPrice.toFixed(2)}`;
}

// Simple Card Input (Demo Mode - No Stripe)
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

// Validate card inputs
function validateCardInputs() {
    const cardNumber = document.getElementById("demo-card-number")?.value.trim();
    const expiry = document.getElementById("demo-card-expiry")?.value.trim();
    const cvc = document.getElementById("demo-card-cvc")?.value.trim();
    const errorDiv = document.getElementById("card-errors");

    if (!cardNumber || cardNumber.length < 13) {
        if (errorDiv) errorDiv.textContent = "Please enter a valid card number";
        return false;
    }
    if (!expiry || !expiry.match(/^\d{2}\/\d{2}$/)) {
        if (errorDiv) errorDiv.textContent = "Please enter expiry in MM/YY format";
        return false;
    }
    if (!cvc || cvc.length < 3) {
        if (errorDiv) errorDiv.textContent = "Please enter a valid CVC";
        return false;
    }

    if (errorDiv) errorDiv.textContent = "";
    return true;
}

// Pay button handler
const payButton = document.getElementById("pay-btn");
if (payButton) {
    payButton.addEventListener("click", async () => {
        const originalButtonText = payButton.innerHTML;
        
        // Validate inputs
        if (!validateCardInputs()) {
            return;
        }
        
        // Disable button and show loading
        payButton.disabled = true;
        payButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Payment...';

        try {
            // Prepare payment data
            const paymentData = {
                bookingId: bookingData.bookingId,
                amount: totalPrice,
                paymentMethod: "Credit Card",
                cardHolderName: bookingData.guestName,
                cardNumber: "**** **** **** " + document.getElementById("demo-card-number").value.slice(-4)
            };

            console.log("Sending payment request:", paymentData);

            // Call backend to process payment
            const response = await fetch('/Payment/ProcessPayment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paymentData)
            });

            console.log("Response status:", response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Payment result:", result);

            if (result.success) {
                // Save payment info
                const paymentInfo = {
                    paymentId: result.paymentId,
                    transactionId: result.transactionId,
                    bookingId: bookingData.bookingId,
                    amount: totalPrice,
                    paymentDate: new Date().toISOString(),
                    status: 'Completed'
                };
                
                localStorage.setItem("paymentInfo", JSON.stringify(paymentInfo));

                // Show success message
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

                // Show invoice section
                const cardContainer = document.querySelector('.card-container');
                const invoiceBox = document.querySelector('.invoice');
                if (cardContainer) cardContainer.style.display = 'none';
                if (invoiceBox) invoiceBox.style.display = 'block';

                // Clear booking data from cart
                let cart = JSON.parse(localStorage.getItem('reservationRooms') || '[]');
                cart = cart.filter(room => room.roomId !== bookingData.roomId);
                localStorage.setItem('reservationRooms', JSON.stringify(cart));

            } else {
                throw new Error(result.message || 'Payment failed');
            }
        } catch (error) {
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

            // Re-enable button
            payButton.disabled = false;
            payButton.innerHTML = originalButtonText;
        }
    });
}

// PDF Download
const downloadButton = document.getElementById("download-pdf");
if (downloadButton) {
    downloadButton.addEventListener("click", () => {
        const element = document.getElementById("invoice-box");

        if (typeof html2pdf === 'undefined') {
            alert("PDF library not loaded. Please refresh the page.");
            return;
        }

        const opt = {
            margin: 10,
            filename: `Invoice_Booking_${bookingData?.bookingId}_${Date.now()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
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
            console.error("PDF generation error:", err);
            alert("Failed to generate PDF. Please try again.");
        });
    });
}
