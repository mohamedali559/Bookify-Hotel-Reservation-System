$(document).ready(function () {
    const roomsTable = $('#roomsTable').DataTable();
    const roomTypesTable = $('#roomTypesTable').DataTable();
    const bookingsTable = $('#bookingsTable').DataTable();

    function showToast(type, message) {
        toastr.options = { "positionClass": "toast-top-right", "timeOut": "3000" };
        toastr[type](message);
    }

    // Add Room
    $('#addRoomForm').submit(function (e) {
        e.preventDefault();
        const roomNumber = $('#roomNumber').val();
        const type = $('#roomType').val();
        const status = $('#roomStatus').val();
        const newId = roomsTable.rows().count() + 1;
        roomsTable.row.add([newId, roomNumber, type, status,
            `<button class="btn btn-secondary btn-sm edit-room">Edit</button>
       <button class="btn btn-secondary btn-sm delete-room">Delete</button>`]).draw();
        $('#addRoomModal').modal('hide');
        showToast('success', 'Room added successfully.');
        this.reset();
    });

    // Add Room Type
    $('#addRoomTypeForm').submit(function (e) {
        e.preventDefault();
        const name = $('#roomTypeName').val();
        const price = $('#roomTypePrice').val();
        const capacity = $('#roomTypeCapacity').val();
        const newId = roomTypesTable.rows().count() + 1;
        roomTypesTable.row.add([newId, name, price, capacity,
            `<button class="btn btn-secondary btn-sm edit-roomtype">Edit</button>
       <button class="btn btn-secondary btn-sm delete-roomtype">Delete</button>`]).draw();
        $('#addRoomTypeModal').modal('hide');
        showToast('success', 'Room Type added successfully.');
        this.reset();
    });

    // Delete handlers
    $('#roomsTable').on('click', '.delete-room', function () {
        roomsTable.row($(this).closest('tr')).remove().draw();
        showToast('error', 'Room deleted.');
    });
    $('#roomTypesTable').on('click', '.delete-roomtype', function () {
        roomTypesTable.row($(this).closest('tr')).remove().draw();
        showToast('error', 'Room Type deleted.');
    });

    // Edit Room Modal
    let editRoomRow;
    $('#roomsTable').on('click', '.edit-room', function () {
        editRoomRow = roomsTable.row($(this).closest('tr'));
        const data = editRoomRow.data();
        $('#editRoomId').val(data[0]);
        $('#editRoomNumber').val(data[1]);
        $('#editRoomType').val(data[2]);
        $('#editRoomStatus').val(data[3]);
        $('#editRoomModal').modal('show');
    });
    $('#editRoomForm').submit(function (e) {
        e.preventDefault();
        const updatedData = [
            $('#editRoomId').val(),
            $('#editRoomNumber').val(),
            $('#editRoomType').val(),
            $('#editRoomStatus').val(),
            `<button class="btn btn-secondary btn-sm edit-room">Edit</button>
       <button class="btn btn-secondary btn-sm delete-room">Delete</button>`
        ];
        editRoomRow.data(updatedData).draw();
        $('#editRoomModal').modal('hide');
        showToast('success', 'Room updated.');
    });

    // Edit Room Type Modal
    let editRoomTypeRow;
    $('#roomTypesTable').on('click', '.edit-roomtype', function () {
        editRoomTypeRow = roomTypesTable.row($(this).closest('tr'));
        const data = editRoomTypeRow.data();
        $('#editRoomTypeId').val(data[0]);
        $('#editRoomTypeName').val(data[1]);
        $('#editRoomTypePrice').val(data[2]);
        $('#editRoomTypeCapacity').val(data[3]);
        $('#editRoomTypeModal').modal('show');
    });
    $('#editRoomTypeForm').submit(function (e) {
        e.preventDefault();
        const updatedData = [
            $('#editRoomTypeId').val(),
            $('#editRoomTypeName').val(),
            $('#editRoomTypePrice').val(),
            $('#editRoomTypeCapacity').val(),
            `<button class="btn btn-secondary btn-sm edit-roomtype">Edit</button>
       <button class="btn btn-secondary btn-sm delete-roomtype">Delete</button>`
        ];
        editRoomTypeRow.data(updatedData).draw();
        $('#editRoomTypeModal').modal('hide');
        showToast('success', 'Room Type updated.');
    });

    // Cancel Booking
    $('#bookingsTable').on('click', '.cancel-booking', function () {
        const row = bookingsTable.row($(this).closest('tr'));
        const data = row.data();
        data[5] = 'Cancelled';
        row.data(data).draw();
        showToast('warning', 'Booking cancelled.');
    });

    // Charts
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
            datasets: [{
                label: 'Sales',
                data: [12, 19, 14, 23, 28, 25, 30, 32, 29],
                borderColor: '#4dabf7',
                backgroundColor: 'rgba(77,171,247,0.2)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            plugins: { legend: { labels: { color: '#4dabf7' } } },
            scales: {
                x: { ticks: { color: '#e0e7ff' } },
                y: { ticks: { color: '#e0e7ff' } }
            }
        }
    });

    const bookingsCtx = document.getElementById('bookingsChart').getContext('2d');
    new Chart(bookingsCtx, {
        type: 'bar',
        data: {
            labels: ['Single', 'Double', 'Suite', 'Deluxe'],
            datasets: [{
                label: 'Bookings',
                data: [50, 70, 30, 40],
                backgroundColor: ['#4dabf7', '#74c0fc', '#4dabf7', '#74c0fc']
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: '#e0e7ff' } },
                y: { ticks: { color: '#e0e7ff' } }
            }
        }
    });
});
