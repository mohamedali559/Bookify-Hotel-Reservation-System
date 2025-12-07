/**
 * Admin Bookings Management Scripts
 * Handles all booking management operations for the admin panel
 * 
 * Features:
 * - DataTables integration for bookings list
 * - Advanced filtering (status, date range)
 * - View booking details in modal
 * - Cancel booking functionality
 * - Export bookings data
 * 
 * Dependencies:
 * - jQuery
 * - DataTables
 * - Toastr (for notifications)
 * 
 * @requires jquery
 * @requires datatables
 * @requires toastr
 */

$(document).ready(function() {
    /* ===========================
       DATATABLES INITIALIZATION
    ============================ */
    
    // Initialize DataTable with custom configuration
    const bookingsTable = $('#bookingsTable').DataTable({
        responsive: true,           // Enable responsive design
        pageLength: 10,             // Show 10 bookings per page
        order: [[0, 'desc']],       // Sort by first column (ID) descending
        language: {
            search: "Search Bookings:",
            lengthMenu: "Show _MENU_ bookings per page"
        }
    });

    /* ===========================
       FILTERS
    ============================ */
    
    /**
     * Apply Filters Button Click Handler
     * Filters bookings by status and date range
     * TODO: Implement actual filtering with backend API
     */
    $('#applyFilters').on('click', function() {
        // Get filter values from inputs
        const status = $('#filterStatus').val();
        const dateFrom = $('#filterDateFrom').val();
        const dateTo = $('#filterDateTo').val();

        // PLACEHOLDER: Implement actual filtering with backend API
        let filteredData = bookingsTable.rows().data();
        
        // For demo, just search by status in DataTable
        if (status) {
            bookingsTable.column(6).search(status).draw();
        } else {
            bookingsTable.search('').columns().search('').draw();
        }

        toastr.info('Filters applied');
    });

    /* ===========================
       VIEW BOOKING DETAILS
    ============================ */
    
    /**
     * View Button Click Handler
     * Opens modal with detailed booking information
     * 
     * @listens click - On .btn-view elements in the table
     */
    $('#bookingsTable').on('click', '.btn-view', function() {
        const btn = $(this);
        
        // Parse dates for calculations
        const checkInDate = new Date(btn.data('checkin'));
        const checkOutDate = new Date(btn.data('checkout'));
        
        // Calculate number of nights
        const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

        // Populate modal with booking details
        $('#viewBookingId').text('#' + btn.data('id'));
        $('#viewCustomerName').text(btn.data('customer'));
        $('#viewRoomNumber').text(btn.data('room'));
        $('#viewPrice').text('$' + parseFloat(btn.data('price')).toFixed(2));
        $('#viewCheckIn').text(new Date(btn.data('checkin')).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
        $('#viewCheckOut').text(new Date(btn.data('checkout')).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
        $('#viewStatus').html('<span class="badge badge-info">' + btn.data('status') + '</span>');
        $('#viewNights').text(nights + ' night' + (nights > 1 ? 's' : ''));

        // Show the modal
        $('#viewBookingModal').modal('show');
    });

    /* ===========================
       CANCEL BOOKING
    ============================ */
    
    /**
     * Cancel Booking Button Click Handler
     * Sends request to backend to cancel a booking
     * Updates UI to reflect cancelled status
     * 
     * @listens click - On .btn-cancel elements in the table
     */
    $('#bookingsTable').on('click', '.btn-cancel', function() {
        const bookingId = $(this).data('id');
        const row = $(this).closest('tr');

        // Confirm cancellation with user
        if (confirm('Are you sure you want to cancel this booking?')) {
            // PLACEHOLDER: Replace with actual AJAX call to backend
            $.ajax({
                url: '/Admin/CancelBooking',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(bookingId),
                success: function(response) {
                    if (response.success) {
                        toastr.success(response.message);
                        
                        // Update the status badge in the table
                        const cellData = bookingsTable.cell(row, 6).data();
                        bookingsTable.cell(row, 6).data('<span class="badge badge-danger"><i class="fas fa-times-circle"></i> Cancelled</span>').draw();
                        
                        // Remove cancel button (can't cancel twice)
                        const actionCell = bookingsTable.cell(row, 8).node();
                        $(actionCell).find('.btn-cancel').remove();
                    } else {
                        toastr.error(response.message);
                    }
                },
                error: function() {
                    toastr.error('Error cancelling booking');
                }
            });
        }
    });

    /* ===========================
       EXPORT FUNCTIONALITY
    ============================ */
    
    /**
     * Export Button Click Handler
     * TODO: Implement export functionality (CSV, PDF, Excel)
     * 
     * @listens click - On #exportBtn
     */
    $('#exportBtn').on('click', function() {
        // PLACEHOLDER: Implement export functionality (CSV, PDF, Excel)
        toastr.info('Export functionality will be implemented with backend');
    });
});
