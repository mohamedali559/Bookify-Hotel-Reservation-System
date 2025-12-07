/**
 * Admin Dashboard Scripts
 * Initializes and manages dashboard charts and statistics
 * 
 * Features:
 * - Revenue trend line chart (monthly data)
 * - Room type bookings doughnut chart
 * - Chart.js integration for data visualization
 * 
 * Dependencies:
 * - jQuery
 * - Chart.js
 * 
 * @requires jquery
 * @requires chart.js
 */

$(document).ready(function() {
    /* ===========================
       REVENUE CHART
    ============================ */
    
    /**
     * Revenue Line Chart
     * Displays monthly revenue trends for the current year
     * 
     * Chart Type: Line
     * Data: Monthly revenue in USD
     * TODO: Replace placeholder data with real backend API data
     */
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    const revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
            // PLACEHOLDER: Replace with dynamic data from backend
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Revenue ($)',
                // Sample data showing revenue growth trend
                data: [12000, 19000, 15000, 22000, 28000, 25000, 30000, 32000, 29000, 35000, 38000, 42000],
                borderColor: '#08306C',                    // Dark blue line color
                backgroundColor: 'rgba(8, 48, 108, 0.1)',  // Light blue fill
                fill: true,                                 // Fill area under line
                tension: 0.4,                               // Smooth curve
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,                    // Responsive to container size
            maintainAspectRatio: false,         // Allow custom height
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,          // Start Y-axis at 0
                    ticks: {
                        // Format Y-axis labels as currency
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });

    /* ===========================
       BOOKINGS CHART
    ============================ */
    
    /**
     * Room Type Bookings Doughnut Chart
     * Shows distribution of bookings by room type
     * 
     * Chart Type: Doughnut
     * Data: Booking count per room type
     * TODO: Replace placeholder data with real backend API data
     */
    const bookingsCtx = document.getElementById('bookingsChart').getContext('2d');
    const bookingsChart = new Chart(bookingsCtx, {
        type: 'doughnut',
        data: {
            // PLACEHOLDER: Replace with dynamic data from backend
            labels: ['Single', 'Double', 'Suite', 'Deluxe'],
            datasets: [{
                // Sample data showing booking distribution
                data: [45, 35, 15, 25],
                // Color scheme: Shades of blue
                backgroundColor: [
                    '#08306C',  // Dark blue - Single rooms
                    '#3b82f6',  // Blue - Double rooms
                    '#60a5fa',  // Light blue - Suite rooms
                    '#93c5fd'   // Lighter blue - Deluxe rooms
                ],
                borderWidth: 0  // No borders between segments
            }]
        },
        options: {
            responsive: true,               // Responsive to container size
            maintainAspectRatio: false,    // Allow custom height
            plugins: {
                legend: {
                    position: 'bottom'      // Legend at bottom of chart
                }
            }
        }
    });
});
