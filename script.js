document.addEventListener('DOMContentLoaded', () => {
    const previewBtn = document.getElementById('previewBtn');
    const orderForm = document.getElementById('orderForm');
    
    // Set a default value to trigger a preview on load
    window.onload = generateMapPreview; 
    
    // --- Step 1: Simulated Map Preview Logic ---
    previewBtn.addEventListener('click', generateMapPreview);

    function generateMapPreview() {
        const date = document.getElementById('date').value || '[Date Missing]';
        const location = document.getElementById('location').value || '[Location Missing]';
        const product = document.getElementById('product').value;
        const previewArea = document.getElementById('preview-area');

        // Check for required inputs to display a helpful message
        if (!date || !location || !product) {
            previewArea.innerHTML = "Please enter a Date, Location, and select a Product to generate a simulated preview.";
            return;
        }

        // Simulating the image based on selected product and color
        const baseColor = product === 'coaster' ? '333333' : '0A0A1F'; // Darker for coaster simulation
        const accentColor = 'FFC300'; 
        
        // Use a placeholder service for visual simulation
        const simulatedImage = `https://via.placeholder.com/600x600/${baseColor}/${accentColor}?text=Map+for+${location}`;
        const momentText = `The Sky over ${location} on ${date}.`;
        
        previewArea.innerHTML = `
            <div style="text-align: center;">
                <h4>${momentText}</h4>
                <img id="preview-image" src="${simulatedImage}" alt="Simulated Star Map Preview">
                <p style="font-size: 0.9em; margin-top: 10px;">(Low-Resolution Preview - Final map is highly detailed and accurate)</p>
            </div>
        `;
    }

    // --- Step 2: Form Submission to Formspree (Data Capture) ---
    orderForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Stop default browser form submission

        const form = event.target;
        const formspreeEndpoint = document.querySelector('meta[name="formspree-endpoint"]').content;
        const messageElement = document.getElementById('message');
        const submitButton = form.querySelector('button[type="submit"]');

        messageElement.textContent = "Submitting data, please wait...";
        submitButton.disabled = true;

        // Use FormData to easily grab all form inputs
        const formData = new FormData(form);

        // Fetch API to submit the custom data in the background
        fetch(formspreeEndpoint, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                messageElement.textContent = "Success! Your order details have been submitted. Thank you!";
                // *** CRITICAL STEP: FUTURE PAYMENT INTEGRATION ***
                
                /* // STEP 3: Get the correct payment link from the hidden inputs 
                const product = document.getElementById('product').value;
                let paymentLink = '';

                if (product === 'plaque') {
                    paymentLink = document.getElementById('plaque_link').value;
                } else if (product === 'coaster') {
                    paymentLink = document.getElementById('coaster_link').value;
                } else if (product === 'charm') {
                    paymentLink = document.getElementById('charm_link').value;
                }

                // Redirect the user to the secure payment link after successful data capture
                if (paymentLink) {
                   // window.location.href = paymentLink;
                   messageElement.textContent = "Data submitted! Redirecting to payment...";
                } else {
                   messageElement.textContent = "Data submitted! (Awaiting Payment Link Integration)";
                }
                */
               
               // For MVP launch without payment, just clear the form and display a success message
               form.reset();
               
            } else {
                messageElement.textContent = "Error submitting data. Please check your Formspree endpoint and try again.";
            }
        })
        .catch(error => {
            console.error('Submission error:', error);
            messageElement.textContent = "An unexpected error occurred. Please try again.";
        })
        .finally(() => {
            submitButton.disabled = false;
        });
    });
});