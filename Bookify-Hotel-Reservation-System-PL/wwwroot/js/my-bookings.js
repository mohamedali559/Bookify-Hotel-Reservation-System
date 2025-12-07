/**
 * My Bookings Page Scripts
 * Handles user's booking management functionality
 * 
 * Features:
 * - View user's booking history
 * - Cancel bookings with confirmation
 * - SweetAlert2 integration for user-friendly dialogs
 * 
 * Dependencies:
 * - SweetAlert2 (for confirmation dialogs and notifications)
 * - Fetch API (for AJAX requests)
 * 
 * @file my-bookings.js
 * @description User booking management functionality
 * @requires sweetalert2
 */

/**
 * Cancel Booking Function
 * Allows users to cancel their bookings with confirmation
 * 
 * Flow:
 * 1. Show confirmation dialog using SweetAlert2
 * 2. If confirmed, send POST request to backend
 * 3. Update UI based on response
 * 4. Show success/error message
 * 5. Reload page to reflect changes
 * 
 * @async
 * @function cancelBooking
 * @param {number} bookingId - The ID of the booking to cancel
 * @returns {Promise<void>}
 * 
 * @example
 * // Call from HTML button
 * <button onclick="cancelBooking(123)">Cancel</button>
 */
async function cancelBooking(bookingId) {
    // Show confirmation dialog
    const result = await Swal.fire({
        title: 'Cancel Booking?',
        text: "Are you sure you want to cancel this booking?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',  // Red color for cancel action
        cancelButtonColor: '#64748b',   // Gray color for keep booking
        confirmButtonText: 'Yes, cancel it!',
        cancelButtonText: 'No, keep it'
    });

    // Check if user confirmed the cancellation
    if (result.isConfirmed) {
        try {
            /**
             * Send POST request to backend API
             * Endpoint: /Book/CancelBooking
             * Payload: bookingId as JSON
             */
            const response = await fetch('/Book/CancelBooking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingId)
            });

            // Parse JSON response from server
            const data = await response.json();

            // Check if cancellation was successful
            if (data.success) {
                // Show success message
                await Swal.fire({
                    title: 'Cancelled!',
                    text: data.message,
                    icon: 'success'
                });
                
                // Reload page to update booking list
                location.reload();
            } else {
                // Show error message from server
                await Swal.fire({
                    title: 'Error!',
                    text: data.message,
                    icon: 'error'
                });
            }
        } catch (error) {
            /**
             * Handle network errors or exceptions
             * This catches:
             * - Network connectivity issues
             * - Server errors
             * - JSON parsing errors
             */
            await Swal.fire({
                title: 'Error!',
                text: 'Failed to cancel booking. Please try again.',
                icon: 'error'
            });
        }
    }
}
