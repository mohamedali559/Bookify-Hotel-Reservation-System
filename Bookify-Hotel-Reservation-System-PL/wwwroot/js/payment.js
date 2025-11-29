  // Load Data from LocalStorage
  const formData = JSON.parse(localStorage.getItem("bookingData"));
  const roomData = JSON.parse(localStorage.getItem("selectedRoom"));

  // Fill user info above payment form
  document.getElementById("name").value = formData?.name || "";
  document.getElementById("email").value = formData?.email || "";

  // حساب عدد الليالي
  const nights =
    (new Date(formData.checkout) - new Date(formData.checkin)) /
    (1000 * 60 * 60 * 24);

  const totalPrice = nights * roomData.price;

  // Fill Invoice Dynamic Content
  document.getElementById("invoice-content").innerHTML = `
    <p><strong>Full Name:</strong><br> ${formData?.name}</p>
    <p><strong>Email:</strong><br> ${formData?.email}</p>
    <p><strong>Room:</strong><br> ${roomData?.name}</p>
    <p><strong>Guests:</strong><br> ${formData?.guests}</p>
    <p><strong>Check-in:</strong><br> ${formData?.checkin}</p>
    <p><strong>Check-out:</strong><br> ${formData?.checkout}</p>
    <p><strong>Price per Night:</strong><br> $${roomData?.price}</p>
    <p><strong>Nights:</strong><br> ${nights}</p>
  `;

  document.getElementById("total-price").textContent = `$${totalPrice}`;

  // Stripe Setup (Frontend placeholder)
  const stripe = Stripe("YOUR_PUBLISHABLE_KEY"); //متنسيش يا منه هنغير المفناح افتكرررررررررري
  const elements = stripe.elements();
  const cardElement = elements.create("card");
  cardElement.mount("#card-element");

  // Pay button alert
  document.getElementById("pay-btn").addEventListener("click", async () => {
    alert("Stripe Payment Integration is ready. Backend required!");
  });

  // PDF Download
  document.getElementById("download-pdf").addEventListener("click", () => {
    const element = document.getElementById("invoice-box");

    html2pdf()
      .from(element)
      .set({
        margin: 10,
        filename: "Invoice_Golden_Horizon.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .save();
  });
