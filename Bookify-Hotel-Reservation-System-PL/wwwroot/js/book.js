  const room = JSON.parse(localStorage.getItem("selectedRoom"));
  const detailsDiv = document.getElementById("room-details");

  if (room) {
    detailsDiv.innerHTML = `
      <h2>${room.name}</h2>
      <p>${room.description}</p>
      <div class="room-meta">
        <p><strong>Price:</strong> $${room.price}/night</p>
        <p><strong>Beds:</strong> ${room.beds}</p>
        <p><strong>Guests:</strong> ${room.guests}</p>
        <p><strong>Size:</strong> ${room.size}</p>
      </div>
    `;
  } else {
    detailsDiv.innerHTML = `<p>No room selected. <a href="rooms.html" style="color:#25408f;">Go back</a></p>`;
  }

  document.getElementById("bookingForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const bookingData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      guests: document.getElementById("guests").value,
      roomSelect: document.getElementById("room").value,
      checkin: document.getElementById("checkin").value,
      checkout: document.getElementById("checkout").value,
    };

    localStorage.setItem("bookingData", JSON.stringify(bookingData));

    window.location.href = "payment.html";
  });
  document.getElementById("goPayment").addEventListener("click", function () {

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const guests = document.getElementById("guests").value;
  const checkin = document.getElementById("checkin").value;
  const checkout = document.getElementById("checkout").value;

  //  Validation: Required Fields
  if (!name || !email || !guests || !checkin || !checkout) {
    return Toastify({
      text: " Please fill all fields",
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "#d9534f",
    }).showToast();
  }

  //  Validation: Check-in must be before Check-out
  if (new Date(checkin) >= new Date(checkout)) {
    return Toastify({
      text: " Check-In date must be BEFORE Check-Out",
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "#c9302c",
    }).showToast();
  }

  //  Save data in localStorage
  const bookingData = { name, email, guests, checkin, checkout };
  localStorage.setItem("bookingData", JSON.stringify(bookingData));

  //  Success Toaster
  Toastify({
    text: " All Good! Redirecting to Payment...",
    duration: 1500,
    gravity: "top",
    position: "center",
    backgroundColor: "#28a745",
  }).showToast();

  //  Redirect after short delay
  setTimeout(() => {
    window.location.href = "/payment";
  }, 1600);

});


