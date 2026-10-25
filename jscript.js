const rentalRates = {
    zeekr: 150,
    audi: 300,
    battista: 1200
};

const priceVehicle = document.getElementById("vehicle");
const pickupDate = document.getElementById("pickup-date");
const returnDate = document.getElementById("return-date");

function calculateRentalPrice() {

    const dailyRate = rentalRates[priceVehicle.value] || 0;

    const start = pickupDate.value;
    const end = returnDate.value;

    let rentalDays = 0;

    if (start && end) {
        const difference = new Date(end) - new Date(start);

        rentalDays = Math.max(
            0,
            Math.round(difference / (1000 * 60 * 60 * 24))
        );
    }

    const totalPrice = dailyRate * rentalDays;

    document.getElementById("daily-rate").textContent =
        "S$" + dailyRate.toLocaleString();

    document.getElementById("rental-days").textContent =
        rentalDays + " days";

    document.getElementById("total-price").textContent =
        "S$" + totalPrice.toLocaleString();

    return totalPrice;
}

if (priceVehicle && pickupDate && returnDate) {
    priceVehicle.addEventListener("change", calculateRentalPrice);
    pickupDate.addEventListener("change", calculateRentalPrice);
    returnDate.addEventListener("change", calculateRentalPrice);
}

const loginLink = document.getElementById("login-link");
const loginModal = document.getElementById("login-modal");
const logoutLink = document.getElementById("logout-link");
const loginForm = document.getElementById("login-form");
const closeLogin = document.getElementById("close-login");

if (loginLink && logoutLink) {

    if (localStorage.getItem("isLoggedIn") === "true") {
        loginLink.style.display = "none";
        logoutLink.style.display = "inline";
    }

    logoutLink.addEventListener("click", function(event) {
        event.preventDefault();

        localStorage.removeItem("isLoggedIn");

        loginLink.style.display = "inline";
        logoutLink.style.display = "none";
    });
}

if (loginLink && loginModal) {
    loginLink.addEventListener("click", function(event) {
        event.preventDefault();
        loginModal.style.display = "flex";
    });
}

if (loginForm && loginModal) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        localStorage.setItem("isLoggedIn", "true");

        if (loginLink && logoutLink) {
            loginLink.style.display = "none";
            logoutLink.style.display = "inline";
        }

        loginModal.style.display = "none";
        alert("You have successfully logged in!");
    });
}

if (closeLogin && loginModal) {
    closeLogin.addEventListener("click", function() {
        loginModal.style.display = "none";
    });
}

const fleetLinks = document.querySelectorAll(".fleet-nav a");
const fleetCategories = document.querySelectorAll(".fleet-category");

fleetLinks.forEach(function(link) {

    link.addEventListener("click", function(event) {
        event.preventDefault();

        const selectedCategory = link.getAttribute("href").substring(1);

        // First, hide all categories
        fleetCategories.forEach(function(category) {
            category.classList.remove("active");
        });

        // If All Vehicles was clicked, show everything
        if (selectedCategory === "all") {

            fleetCategories.forEach(function(category) {
                category.classList.add("active");
            });

        } else {

            
            document.getElementById(selectedCategory).classList.add("active");

        }

    });

});

const vehicleSelect = document.getElementById("vehicle");
const carImage = document.getElementById("selected-car-image");
const preview = document.querySelector(".vehicle-preview");

if (vehicleSelect && carImage && preview) {

    vehicleSelect.addEventListener("change", function() {

        const selectedCar = vehicleSelect.value;

        if (selectedCar === "zeekr") {
            carImage.src = "Images/zeekr-001.png";
        }
        else if (selectedCar === "audi") {
            carImage.src = "Images/Audi e-tron GT at Sunset.png";
        }
        else if (selectedCar === "battista") {
            carImage.src = "Images/pininfarina battista.png";
        }
        else {
            preview.style.display = "none";
            carImage.removeAttribute("src");
            return;
        }

        preview.style.display = "block";

    });

}

const reservationForm = document.getElementById("reservation-form");

if (reservationForm) {
    reservationForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const booking = {
            vehicle: document.getElementById("vehicle").value,
            location: document.getElementById("pickup-location").value,
            pickupDate: document.getElementById("pickup-date").value,
            returnDate: document.getElementById("return-date").value
        };

        if (booking.returnDate <= booking.pickupDate) {
            showError("Return date must be after pickup date!");
            return;
        }

        sessionStorage.setItem("booking", JSON.stringify(booking));

        window.location.href = "payment.html";
    });
}



function showError(message) {

    const existingError = document.querySelector(".error-notification");

    if (existingError) {
        existingError.remove();
    }

    const notification = document.createElement("div");

    notification.className = "error-notification";
    notification.textContent = "⚠ " + message;

    document.body.appendChild(notification);

    setTimeout(function() {
        notification.remove();
    }, 4000);
}


const savedBooking = sessionStorage.getItem("booking");

const summaryVehicle = document.getElementById("summary-vehicle");

if (summaryVehicle) {

    if (!savedBooking) {
        window.location.href = "reserve.html";
    } else {
        const booking = JSON.parse(savedBooking);

        const vehicleNames = {
            zeekr: "Zeekr 001",
            audi: "Audi e-tron GT",
            battista: "Pininfarina Battista"
        };

        summaryVehicle.textContent = vehicleNames[booking.vehicle] || booking.vehicle;

        document.getElementById("summary-location").textContent =
            booking.location === "main" ? "AZoom Main Branch" : booking.location;

        document.getElementById("summary-pickup").textContent =
            booking.pickupDate;

        document.getElementById("summary-return").textContent =
            booking.returnDate;
            // Calculate and display rental cost

        const dailyRate = rentalRates[booking.vehicle] || 0;

        const difference =
            new Date(booking.returnDate) - new Date(booking.pickupDate);

        const rentalDays = Math.max(
            0,
            Math.round(difference / (1000 * 60 * 60 * 24))
        );

        const totalPrice = dailyRate * rentalDays;

        document.getElementById("summary-rate").textContent =
            "S$" + dailyRate.toLocaleString();

        document.getElementById("summary-days").textContent =
            rentalDays + " days";

        document.getElementById("summary-total").textContent =
            "S$" + totalPrice.toLocaleString();
    }
}

// Payment Form - Demo Confirmation

const paymentForm = document.getElementById("payment-form");

if (paymentForm) {
    paymentForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const booking = sessionStorage.getItem("booking");

        if (!booking) {
            alert("Please make a reservation first.");
            window.location.href = "reserve.html";
            return;
        }

        // Generate a demo booking reference
        const reference = "AZ-" + Date.now();

        sessionStorage.setItem("bookingReference", reference);

        window.location.href = "confirmation.html";
        sessionStorage.removeItem("returnStatus");
    });
}


const confirmationReference = document.getElementById("confirmation-reference");

if (confirmationReference) {

    const savedBooking = sessionStorage.getItem("booking");
    const reference = sessionStorage.getItem("bookingReference");

    if (!savedBooking || !reference) {
        window.location.href = "reserve.html";
    } else {

        const booking = JSON.parse(savedBooking);

        const vehicleNames = {
            zeekr: "Zeekr 001",
            audi: "Audi e-tron GT",
            battista: "Pininfarina Battista"
        };

        confirmationReference.textContent = reference;

        document.getElementById("confirmation-vehicle").textContent =
            vehicleNames[booking.vehicle] || booking.vehicle;

        document.getElementById("confirmation-pickup").textContent =
            booking.pickupDate;

        document.getElementById("confirmation-return").textContent =
            booking.returnDate;
            const confirmationRate = rentalRates[booking.vehicle] || 0;

            const confirmationDifference =
                new Date(booking.returnDate) - new Date(booking.pickupDate);

            const confirmationDays = Math.max(
                0,
                Math.round(confirmationDifference / (1000 * 60 * 60 * 24))
            );

            const confirmationTotal = confirmationRate * confirmationDays;

            document.getElementById("confirmation-total").textContent =
                "S$" + confirmationTotal.toLocaleString();
    }
}


// Rent & Return - Find Booking

const findBookingForm = document.getElementById("find-booking-form");

if (findBookingForm) {

    findBookingForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const enteredReference = document.getElementById("booking-input")
            .value.trim().toUpperCase();

        const savedReference = sessionStorage.getItem("bookingReference");
        const savedBooking = sessionStorage.getItem("booking");

        const bookingError = document.getElementById("booking-error");
        const returnDetails = document.getElementById("return-details");
        const returnSuccess = document.getElementById("return-success");

        bookingError.textContent = "";
        returnDetails.style.display = "none";
        returnSuccess.style.display = "none";

        if (!savedReference || !savedBooking ||
            enteredReference !== savedReference.toUpperCase()) {

            bookingError.textContent = "Booking not found. Please check your reference number.";
            return;
        }

        const booking = JSON.parse(savedBooking);

        const vehicleNames = {
            zeekr: "Zeekr 001",
            audi: "Audi e-tron GT",
            battista: "Pininfarina Battista"
        };

        document.getElementById("return-vehicle").textContent =
            vehicleNames[booking.vehicle] || booking.vehicle;

        document.getElementById("return-pickup").textContent =
            booking.pickupDate;

        document.getElementById("return-date").textContent =
            booking.returnDate;

        if (sessionStorage.getItem("returnStatus") === "Returned") {
            returnSuccess.style.display = "block";
        } else {
            returnDetails.style.display = "block";
        }
    });
}


// Rent & Return - Confirm Vehicle Return

const returnForm = document.getElementById("return-form");

if (returnForm) {

    returnForm.addEventListener("submit", function(event) {
        event.preventDefault();

        sessionStorage.setItem("returnStatus", "Returned");

        document.getElementById("return-details").style.display = "none";

        document.getElementById("return-success").style.display = "block";

        const notification = document.createElement("div");

    notification.className = "return-notification";
    notification.textContent = "✓ Vehicle successfully returned!";

    document.body.appendChild(notification);

    setTimeout(function() {
        notification.remove();
    }, 4000);
    });
}


