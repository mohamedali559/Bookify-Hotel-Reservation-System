/* ===========================
   Admin Rooms Management Scripts
   =========================== */

$(document).ready(function() {
    // Initialize DataTable
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
    $('#addRoomForm').on('submit', function(e) {
        e.preventDefault();
        
        // PLACEHOLDER: Replace with actual AJAX call to backend
        const roomData = {
            roomNumber: $('#roomNumber').val(),
            floor: $('#floor').val(),
            roomType: $('#roomType option:selected').text(),
            availability: $('#availability').val() === 'true' ? 'Available' : 'Occupied',
            imageUrl: $('#imageUrl').val()
        };

        // Simulate adding to table
        const newId = roomsTable.rows().count() + 1;
        roomsTable.row.add([
            newId,
            '<strong>' + roomData.roomNumber + '</strong>',
            'Floor ' + roomData.floor,
            '<span class="badge badge-room-type">' + roomData.roomType + '</span>',
            '<strong>$150.00</strong>',
            '<span class="badge badge-success"><i class="fas fa-check"></i> ' + roomData.availability + '</span>',
            '<img src="' + roomData.imageUrl + '" alt="Room" class="room-thumb" />',
            '<div class="action-buttons">' +
            '<button class="btn btn-sm btn-edit" data-id="' + newId + '"><i class="fas fa-edit"></i></button>' +
            '<button class="btn btn-sm btn-delete" data-id="' + newId + '"><i class="fas fa-trash"></i></button>' +
            '</div>'
        ]).draw();

        $('#addRoomModal').modal('hide');
        this.reset();
        toastr.success('Room added successfully!');
    });

    // Edit Room Button Click
    $('#roomsTable').on('click', '.btn-edit', function() {
        const roomId = $(this).data('id');
        const row = $(this).closest('tr');
        const data = roomsTable.row(row).data();

        // PLACEHOLDER: Load actual data from backend
        $('#editRoomId').val(data[0]);
        $('#editRoomNumber').val(data[1].replace('<strong>', '').replace('</strong>', ''));
        $('#editFloor').val(data[2].replace('Floor ', ''));
        
        $('#editRoomModal').modal('show');
    });

    // Edit Room Form Submit
    $('#editRoomForm').on('submit', function(e) {
        e.preventDefault();
        
        // PLACEHOLDER: Replace with actual AJAX call to backend
        $('#editRoomModal').modal('hide');
        toastr.success('Room updated successfully!');
    });

    // Delete Room Button Click
    $('#roomsTable').on('click', '.btn-delete', function() {
        const roomId = $(this).data('id');
        const row = $(this).closest('tr');

        if (confirm('Are you sure you want to delete this room?')) {
            // PLACEHOLDER: Replace with actual AJAX call to backend
            roomsTable.row(row).remove().draw();
            toastr.error('Room deleted successfully!');
        }
    });
});
