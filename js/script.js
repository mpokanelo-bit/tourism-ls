document.addEventListener("DOMContentLoaded", () => {
  // Current year
  document.querySelectorAll(".current-year").forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // Dark/light mode with LocalStorage
  const themeButton = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("lesothoTheme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }

  if (themeButton) {
    themeButton.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const mode = document.body.classList.contains("dark-mode") ? "dark" : "light";
      localStorage.setItem("lesothoTheme", mode);
      themeButton.textContent = mode === "dark" ? "☀ Light Mode" : "🌙 Dark Mode";
    });
  }

  // Destination search and category filtering
  const searchInput = document.getElementById("destinationSearch");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const destinationCards = document.querySelectorAll(".destination-item");
  const noResults = document.getElementById("noResults");

  function filterDestinations() {
    if (!destinationCards.length) return;

    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const activeButton = document.querySelector(".filter-btn.active");
    const category = activeButton ? activeButton.dataset.category : "all";
    let visible = 0;

    destinationCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const cardCategory = card.dataset.category;
      const matchesSearch = text.includes(searchTerm);
      const matchesCategory = category === "all" || cardCategory === category;

      if (matchesSearch && matchesCategory) {
        card.classList.remove("hidden");
        visible++;
      } else {
        card.classList.add("hidden");
      }
    });

    if (noResults) noResults.classList.toggle("hidden", visible !== 0);
  }

  if (searchInput) searchInput.addEventListener("input", filterDestinations);

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      filterDestinations();
    });
  });

  // Gallery lightbox with next/previous controls
  const galleryImages = Array.from(document.querySelectorAll(".gallery-thumb"));
  let currentGalleryIndex = 0;
  const modalElement = document.getElementById("galleryModal");

  if (galleryImages.length && modalElement) {
    const galleryModal = new bootstrap.Modal(modalElement);
    const modalImage = document.getElementById("modalImage");
    const modalTitle = document.getElementById("modalTitle");

    function showGalleryImage(index) {
      currentGalleryIndex = (index + galleryImages.length) % galleryImages.length;
      const image = galleryImages[currentGalleryIndex];
      modalImage.src = image.src;
      modalImage.alt = image.alt;
      modalTitle.textContent = image.dataset.title || image.alt;
    }

    galleryImages.forEach((image, index) => {
      image.addEventListener("click", () => {
        showGalleryImage(index);
        galleryModal.show();
      });
    });

    document.getElementById("nextImage")?.addEventListener("click", () => {
      showGalleryImage(currentGalleryIndex + 1);
    });

    document.getElementById("previousImage")?.addEventListener("click", () => {
      showGalleryImage(currentGalleryIndex - 1);
    });
  }

  // Booking cost calculator
  const bookingForm = document.getElementById("bookingForm");
  const service = document.getElementById("service");
  const people = document.getElementById("people");
  const bookingTotal = document.getElementById("bookingTotal");

  const prices = {
    "Mountain Adventure": 450,
    "Cultural Tour": 300,
    "Pony Trekking": 500,
    "Scenic Sightseeing": 250
  };

  function updateBookingTotal() {
    if (!service || !people || !bookingTotal) return;
    const price = prices[service.value] || 0;
    const numberOfPeople = Math.max(1, parseInt(people.value) || 1);
    bookingTotal.textContent = `Estimated total: M${(price * numberOfPeople).toLocaleString()}`;
  }

  service?.addEventListener("change", updateBookingTotal);
  people?.addEventListener("input", updateBookingTotal);
  updateBookingTotal();

  // Booking form validation + LocalStorage
  if (bookingForm) {
    bookingForm.addEventListener("submit", event => {
      event.preventDefault();

      if (!bookingForm.checkValidity()) {
        bookingForm.classList.add("was-validated");
        return;
      }

      const booking = {
        name: document.getElementById("bookingName").value.trim(),
        email: document.getElementById("bookingEmail").value.trim(),
        service: service.value,
        people: people.value,
        date: document.getElementById("bookingDate").value
      };

      localStorage.setItem("latestBooking", JSON.stringify(booking));

      const success = document.getElementById("bookingSuccess");
      success.textContent = `Thank you, ${booking.name}. Your booking request has been saved successfully.`;
      success.classList.remove("d-none");

      bookingForm.reset();
      bookingForm.classList.remove("was-validated");
      updateBookingTotal();
    });
  }

  // Contact form validation
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", event => {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.classList.add("was-validated");
        return;
      }

      const success = document.getElementById("contactSuccess");
      success.textContent = "Your message has been sent successfully. Thank you for contacting Discover Lesotho.";
      success.classList.remove("d-none");

      contactForm.reset();
      contactForm.classList.remove("was-validated");
    });
  }

  // Registration form validation
  const registrationForm = document.getElementById("registrationForm");

  if (registrationForm) {
    registrationForm.addEventListener("submit", event => {
      event.preventDefault();

      const password = document.getElementById("password");
      const confirmPassword = document.getElementById("confirmPassword");
      const success = document.getElementById("registrationSuccess");

      if (password.value !== confirmPassword.value) {
        confirmPassword.setCustomValidity("Passwords do not match.");
      } else {
        confirmPassword.setCustomValidity("");
      }

      if (!registrationForm.checkValidity()) {
        registrationForm.classList.add("was-validated");
        return;
      }

      success.textContent = "Registration completed successfully.";
      success.classList.remove("d-none");
      registrationForm.reset();
      registrationForm.classList.remove("was-validated");
    });
  }
});
