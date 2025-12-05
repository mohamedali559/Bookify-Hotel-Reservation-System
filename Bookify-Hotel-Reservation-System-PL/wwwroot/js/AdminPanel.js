/**
 * Bookify Hotel Admin Panel - JavaScript
 * Handles all admin panel interactivity including CRUD operations,
 * DataTables, charts, and modals
 */

$(document).ready(function () {
    // ===========================
    // Configuration
    // ===========================
    
    // Toastr configuration
    toastr.options = {
        "closeButton": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "timeOut": "3000",
        "preventDuplicates": true
    };

    // ===========================
    // Utility Functions
    // ===========================
    
    function showToast(type, message) {
        toastr[type](message);
    }

    function showLoader() {
        // PLACEHOLDER: Add loader overlay if needed
    }

    function hideLoader() {
        // PLACEHOLDER: Hide loader overlay
    }

    // ===========================
    // Sidebar Toggle
    // ===========================
    
    $('#sidebarToggle').on('click', function() {
        $('.admin-sidebar').addClass('show');
    });

    $('#sidebarClose').on('click', function() {
        $('.admin-sidebar').removeClass('show');
    });

    // Close sidebar when clicking outside on mobile
    $(document).on('click', function(event) {
        if (!$(event.target).closest('.admin-sidebar, #sidebarToggle').length) {
            $('.admin-sidebar').removeClass('show');
        }
    });

    // ===========================
    // ROOMS MANAGEMENT
    // ===========================
    
    if ($('#roomsTable').length) {
        const roomsTable = $('#roomsTable').DataTable({
            responsive: true,
            pageLength: 10,
            order: [[0, 'asc']],
            language: {
                search: "Search Rooms:",
                lengthMenu: "Show _MENU_ rooms per page"
            }
        });

        // Add Room Form Submit
        $('#addRoomForm').on('submit', function (e) {
            e.preventDefault();
            
            // PLACEHOLDER: Replace with actual AJAX call to backend API
            const roomData = {
                roomNumber: $('#roomNumber').val(),
                floor: $('#floor').val(),
                roomTypeId: $('#roomType').val(),
                isAvailable: $('#availability').val() === 'true',
                imageUrl: $('#imageUrl').val()
            };

            // TODO: Implement actual API call
            // Example:
            // $.ajax({
            //     url: '/Admin/AddRoom',
            //     type: 'POST',
            //     contentType: 'application/json',
            //     data: JSON.stringify(roomData),
            //     success: function(response) {
            //         if (response.success) {
            //             location.reload();
            //             showToast('success', 'Room added successfully!');
            //         }
            //     }
            // });

            $('#addRoomModal').modal('hide');
            this.reset();
            showToast('success', 'Room added successfully! (Reload page to see changes)');
        });

        // Edit Room Button Click
        $('#roomsTable').on('click', '.btn-edit', function () {
            const roomId = $(this).data('id');
            
            // PLACEHOLDER: Load actual data from backend
            // TODO: Fetch room details via AJAX
            
            $('#editRoomId').val(roomId);
            $('#editRoomModal').modal('show');
        });

        // Edit Room Form Submit
        $('#editRoomForm').on('submit', function (e) {
            e.preventDefault();
            
            // PLACEHOLDER: Replace with actual AJAX call to backend API
            const roomId = $('#editRoomId').val();
            const roomData = {
                id: roomId,
                roomNumber: $('#editRoomNumber').val(),
                floor: $('#editFloor').val(),
                roomTypeId: $('#editRoomType').val(),
                isAvailable: $('#editAvailability').val() === 'true',
                imageUrl: $('#editImageUrl').val()
            };

            // TODO: Implement actual API call

            $('#editRoomModal').modal('hide');
            showToast('success', 'Room updated successfully! (Reload page to see changes)');
        });

        // Delete Room Button Click
        $('#roomsTable').on('click', '.btn-delete', function () {
            const roomId = $(this).data('id');

            if (confirm('Are you sure you want to delete this room?')) {
                // PLACEHOLDER: Replace with actual AJAX call to backend API
                // TODO: Implement delete API call
                
                showToast('error', 'Room deleted successfully! (Reload page to see changes)');
            }
        });
    }

    // ===========================
    // ROOM TYPES MANAGEMENT
    // ===========================
    
    if ($('#roomTypesTable').length) {
        const roomTypesTable = $('#roomTypesTable').DataTable({
            responsive: true,
            pageLength: 10,
            order: [[0, 'asc']],
            language: {
                search: "Search Room Types:",
                lengthMenu: "Show _MENU_ room types per page"
            }
        });

        // Add Room Type Form Submit
        $('#addRoomTypeForm').on('submit', function (e) {
            e.preventDefault();
            
            // PLACEHOLDER: Replace with actual AJAX call to backend API
            const roomTypeData = {
                name: $('#roomTypeName').val(),
                description: $('#roomTypeDescription').val(),
                area: parseFloat($('#roomTypeArea').val()),
                guests: parseInt($('#roomTypeGuests').val()),
                basePrice: parseFloat($('#roomTypePrice').val())
            };

            // TODO: Implement actual API call

            $('#addRoomTypeModal').modal('hide');
            this.reset();
            showToast('success', 'Room Type added successfully! (Reload page to see changes)');
        });

        // Edit Room Type Button Click
        $('#roomTypesTable').on('click', '.btn-edit', function () {
            const btn = $(this);
            
            $('#editRoomTypeId').val(btn.data('id'));
            $('#editRoomTypeName').val(btn.data('name'));
            $('#editRoomTypeDescription').val(btn.data('description'));
            $('#editRoomTypeArea').val(btn.data('area'));
            $('#editRoomTypeGuests').val(btn.data('guests'));
            $('#editRoomTypePrice').val(btn.data('price'));
            
            $('#editRoomTypeModal').modal('show');
        });

        // Edit Room Type Form Submit
        $('#editRoomTypeForm').on('submit', function (e) {
            e.preventDefault();
            
            // PLACEHOLDER: Replace with actual AJAX call to backend API
            const roomTypeData = {
                id: parseInt($('#editRoomTypeId').val()),
                name: $('#editRoomTypeName').val(),
                description: $('#editRoomTypeDescription').val(),
                area: parseFloat($('#editRoomTypeArea').val()),
                guests: parseInt($('#editRoomTypeGuests').val()),
                basePrice: parseFloat($('#editRoomTypePrice').val())
            };

            // TODO: Implement actual API call

            $('#editRoomTypeModal').modal('hide');
            showToast('success', 'Room Type updated successfully! (Reload page to see changes)');
        });

        // Delete Room Type Button Click
        $('#roomTypesTable').on('click', '.btn-delete', function () {
            const roomTypeId = $(this).data('id');

            if (confirm('Are you sure you want to delete this room type? This may affect existing rooms.')) {
                // PLACEHOLDER: Replace with actual AJAX call to backend API
                // TODO: Implement delete API call
                
                showToast('error', 'Room Type deleted successfully! (Reload page to see changes)');
            }
        });
    }

    // ===========================
    // BOOKINGS MANAGEMENT
    // ===========================
    
    if ($('#bookingsTable').length) {
        const bookingsTable = $('#bookingsTable').DataTable({
            responsive: true,
            pageLength: 10,
            order: [[0, 'desc']],
            language: {
                search: "Search Bookings:",
                lengthMenu: "Show _MENU_ bookings per page"
            }
        });

        // Apply Filters
        $('#applyFilters').on('click', function () {
            const status = $('#filterStatus').val();
            const dateFrom = $('#filterDateFrom').val();
            const dateTo = $('#filterDateTo').val();

            // PLACEHOLDER: Implement actual filtering with backend API
            // For now, just filter by status in DataTable
            if (status) {
                bookingsTable.column(6).search(status).draw();
            } else {
                bookingsTable.search('').columns().search('').draw();
            }

            showToast('info', 'Filters applied');
        });

        // View Booking Details
        $('#bookingsTable').on('click', '.btn-view', function () {
            const btn = $(this);
            const checkInDate = new Date(btn.data('checkin'));
            const checkOutDate = new Date(btn.data('checkout'));
            const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

            $('#viewBookingId').text('#' + btn.data('id'));
            $('#viewCustomerName').text(btn.data('customer'));
            $('#viewRoomNumber').text(btn.data('room'));
            $('#viewPrice').text('$' + parseFloat(btn.data('price')).toFixed(2));
            $('#viewCheckIn').text(checkInDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
            $('#viewCheckOut').text(checkOutDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
            $('#viewStatus').html('<span class="badge badge-info">' + btn.data('status') + '</span>');
            $('#viewNights').text(nights + ' night' + (nights > 1 ? 's' : ''));

            $('#viewBookingModal').modal('show');
        });

        // Cancel Booking
        $('#bookingsTable').on('click', '.btn-cancel', function () {
            const bookingId = $(this).data('id');
            const row = $(this).closest('tr');

            if (confirm('Are you sure you want to cancel this booking?')) {
                // Call backend API to cancel booking
                $.ajax({
                    url: '/Admin/CancelBooking',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(bookingId),
                    success: function (response) {
                        if (response.success) {
                            showToast('success', response.message);
                            // Update the status in the table
                            bookingsTable.cell(row, 6).data('<span class="badge badge-danger"><i class="fas fa-times-circle"></i> Cancelled</span>').draw();
                            
                            // Remove cancel button
                            const actionCell = bookingsTable.cell(row, 8).node();
                            $(actionCell).find('.btn-cancel').remove();
                        } else {
                            showToast('error', response.message);
                        }
                    },
                    error: function () {
                        showToast('error', 'Error cancelling booking');
                    }
                });
            }
        });

        // Export Button
        $('#exportBtn').on('click', function () {
            // PLACEHOLDER: Implement export functionality (CSV, PDF, Excel)
            showToast('info', 'Export functionality will be implemented with backend');
        });
    }

    // ===========================
    // DASHBOARD CHARTS
    // ===========================
    
    // Revenue Chart - Line Chart
    if (document.getElementById('revenueChart')) {
        const revenueCtx = document.getElementById('revenueChart').getContext('2d');
        const revenueChart = new Chart(revenueCtx, {
            type: 'line',
            data: {
                // PLACEHOLDER: Replace with dynamic data from backend
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Revenue ($)',
                    data: [12000, 19000, 15000, 22000, 28000, 25000, 30000, 32000, 29000, 35000, 38000, 42000],
                    borderColor: '#08306C',
                    backgroundColor: 'rgba(8, 48, 108, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function (value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    // Bookings Chart - Doughnut Chart
    if (document.getElementById('bookingsChart')) {
        const bookingsCtx = document.getElementById('bookingsChart').getContext('2d');
        const bookingsChart = new Chart(bookingsCtx, {
            type: 'doughnut',
            data: {
                // PLACEHOLDER: Replace with dynamic data from backend
                labels: ['Single', 'Double', 'Suite', 'Deluxe'],
                datasets: [{
                    data: [45, 35, 15, 25],
                    backgroundColor: [
                        '#08306C',
                        '#3b82f6',
                        '#60a5fa',
                        '#93c5fd'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // ===========================
    // Form Validation
    // ===========================
    
    // Add custom validation for all forms
    $('form').on('submit', function (e) {
        const form = $(this);
        if (form[0].checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
            showToast('error', 'Please fill in all required fields');
        }
        form.addClass('was-validated');
    });

    // ===========================
    // Real-time Search Enhancement
    // ===========================
    
    // Add debounce to DataTables search
    let searchTimer;
    $('.dataTables_filter input').off('keyup.DT input.DT');
    $('.dataTables_filter input').on('keyup', function () {
        const that = this;
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function () {
            $(that).closest('.dataTables_wrapper').find('table').DataTable().search(that.value).draw();
        }, 400);
    });

    // ===========================
    // Confirmation Dialogs
    // ===========================
    
    // Add confirmation for all delete actions
    $(document).on('click', '[data-confirm]', function (e) {
        const message = $(this).data('confirm') || 'Are you sure?';
        if (!confirm(message)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });

    // ===========================
    // Tooltips & Popovers
    // ===========================
    
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // ===========================
    // Auto-refresh Data (Optional)
    // ===========================
    
    // PLACEHOLDER: Implement auto-refresh for dashboard stats
    // setInterval(function() {
    //     // Refresh dashboard data every 5 minutes
    //     refreshDashboardStats();
    // }, 300000);

    // ===========================
    // Print Functionality
    // ===========================
    
    $('.btn-print').on('click', function () {
        window.print();
    });

    // ===========================
    // Console Welcome Message
    // ===========================
    
    console.log('%c Bookify Admin Panel ', 'background: #08306C; color: white; font-size: 20px; padding: 10px;');
    console.log('%c Ready to manage your hotel! ', 'color: #3b82f6; font-size: 14px;');
});

// ===========================
// Helper Functions (Global)
// ===========================

/**
 * Format currency
 */
function formatCurrency(amount) {
    return '$' + parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

/**
 * Format date
 */
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

/**
 * Calculate nights between dates
 */
function calculateNights(checkIn, checkOut) {
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = new Date(checkIn);
    const secondDate = new Date(checkOut);
    return Math.round(Math.abs((firstDate - secondDate) / oneDay));
}
