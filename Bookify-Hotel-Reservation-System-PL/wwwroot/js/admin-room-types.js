/* ===========================
   Admin Room Types Management Scripts
   =========================== */

$(document).ready(function() {
    // Initialize DataTable
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
    $('#addRoomTypeForm').on('submit', function(e) {
        e.preventDefault();
        
        // PLACEHOLDER: Replace with actual AJAX call to backend
        const roomTypeData = {
            name: $('#roomTypeName').val(),
            description: $('#roomTypeDescription').val(),
            area: $('#roomTypeArea').val(),
            guests: $('#roomTypeGuests').val(),
            price: $('#roomTypePrice').val()
        };

        // Simulate adding to table
        const newId = roomTypesTable.rows().count() + 1;
        roomTypesTable.row.add([
            newId,
            '<strong>' + roomTypeData.name + '</strong>',
            roomTypeData.description,
            roomTypeData.area + ' sq ft',
            '<span class="badge badge-guests"><i class="fas fa-users"></i> ' + roomTypeData.guests + '</span>',
            '<strong class="text-success">$' + parseFloat(roomTypeData.price).toFixed(2) + '</strong>',
            '<div class="action-buttons">' +
            '<button class="btn btn-sm btn-edit" data-id="' + newId + '"><i class="fas fa-edit"></i></button>' +
            '<button class="btn btn-sm btn-delete" data-id="' + newId + '"><i class="fas fa-trash"></i></button>' +
            '</div>'
        ]).draw();

        $('#addRoomTypeModal').modal('hide');
        this.reset();
        toastr.success('Room Type added successfully!');
    });

    // Edit Room Type Button Click
    $('#roomTypesTable').on('click', '.btn-edit', function() {
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
    $('#editRoomTypeForm').on('submit', function(e) {
        e.preventDefault();
        
        // PLACEHOLDER: Replace with actual AJAX call to backend
        const roomTypeId = $('#editRoomTypeId').val();
        const roomTypeData = {
            name: $('#editRoomTypeName').val(),
            description: $('#editRoomTypeDescription').val(),
            area: $('#editRoomTypeArea').val(),
            guests: $('#editRoomTypeGuests').val(),
            price: $('#editRoomTypePrice').val()
        };

        $('#editRoomTypeModal').modal('hide');
        toastr.success('Room Type updated successfully!');
        
        // Optionally reload the page to show updated data
        // location.reload();
    });

    // Delete Room Type Button Click
    $('#roomTypesTable').on('click', '.btn-delete', function() {
        const roomTypeId = $(this).data('id');
        const row = $(this).closest('tr');

        if (confirm('Are you sure you want to delete this room type? This may affect existing rooms.')) {
            // PLACEHOLDER: Replace with actual AJAX call to backend
            roomTypesTable.row(row).remove().draw();
            toastr.error('Room Type deleted successfully!');
        }
    });
});
