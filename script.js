document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Menu Toggle Logic ---
    const menuButton = document.getElementById('menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- Form Submission and Payment Logic ---
    const orderForm = document.getElementById('orderForm');

    if (orderForm) {
        orderForm.addEventListener('submit', function(event) {
            event.preventDefault(); 

            const form = event.target;
            const formspreeEndpoint = document.querySelector('meta[name="formspree-endpoint"]').content;
            const messageElement = document.getElementById('message');
            const submitButton = form.querySelector('button[type="submit"]');
            
            const product = document.getElementById('product').value;
            
            if (!product) {
                 messageElement.textContent = "Please select a product option.";
                 return;
            }

            if (!formspreeEndpoint) {
                messageElement.textContent = "FATAL ERROR: Formspree endpoint is missing!";
                return;
            }

            messageElement.textContent = "Processing order... Submitting data and redirecting to payment.";
            submitButton.disabled = true;

            const formData = new FormData(form);

            // STEP 1: Submit data to Formspree in the background
            fetch(formspreeEndpoint, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    
                    // STEP 2: Handle Redirection on successful data capture
                    let paymentLink = '';

                    // Get links from hidden inputs
                    if (product === 'plaque') {
                        paymentLink = document.getElementById('plaque_link').value;
                    } else if (product === 'coaster') {
                        paymentLink = document.getElementById('coaster_link').value;
                    } else if (product === 'charm') {
                        paymentLink = document.getElementById('charm_link').value;
                    }

                    if (paymentLink) {
                       // Redirect the user to the secure payment link
                       window.location.href = paymentLink;
                    } else {
                       messageElement.textContent = "ERROR: Payment link not configured. Contact support.";
                    }
                    
                } else {
                    messageElement.textContent = "ERROR: Data submission failed. Please try again.";
                }
            })
            .catch(error => {
                console.error('Submission error:', error);
                messageElement.textContent = "An unexpected error occurred. Please check your network.";
            })
            .finally(() => {
                // If redirection fails, re-enable the button
                if (window.location.href === formspreeEndpoint) {
                    submitButton.disabled = false;
                }
            });
        });
    }
});