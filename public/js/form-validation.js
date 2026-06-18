// Gets the contact form from the page
const contactForm = document.getElementById("contactForm");

// Gets the paragraph used to display validation messages
const formMessage = document.getElementById("formMessage");

// Only runs the validation if the contact form exists on the current page
if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        // Gets the values entered by the user
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        // Clears any previous message
        formMessage.textContent = "";
        formMessage.style.display = "none";

        // Checks if any field is empty
        if (!name || !email || !subject || !message) {
            event.preventDefault();
            formMessage.textContent = "Please complete all fields before submitting the form.";
            formMessage.style.display = "block";
            return;
        }

        // Checks if the email includes basic email characters
        if (!email.includes("@") || !email.includes(".")) {
            event.preventDefault();
            formMessage.textContent = "Please enter a valid email address.";
            formMessage.style.display = "block";
            return;
        }

        // Checks if the message is long enough to be useful
        if (message.length < 10) {
            event.preventDefault();
            formMessage.textContent = "Please enter a message with at least 10 characters.";
            formMessage.style.display = "block";
        }
    });
}