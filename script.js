document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle Logic (Fix) ---
    const menuButton = document.getElementById('menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            // Toggles the Tailwind 'hidden' class to show/hide the menu.
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- Form Submission and Preview Logic ---
    const previewBtn = document.getElementById('previewBtn');
    const orderForm = document.getElementById('orderForm');

    // Attach preview function only if elements exist (on customize.html)
    if (previewBtn) {
        window.onload = generateMapPreview; 
        previewBtn.addEventListener('click', generateMapPreview);
    }

    function generateMapPreview() {
        const dateInput = document.getElementById('date');
        const locationInput = document.getElementById('location');
        const productInput = document.getElementById('product');
        const previewArea = document.getElementById('preview-area');

        if (!dateInput || !locationInput || !productInput || !previewArea) return;

        const date = dateInput.value || '[Date Missing]';
        const location = locationInput.value || '[Location Missing]';
        const product = productInput.value;

        if (!date || !location || !product) {
            previewArea.innerHTML = "Please enter a Date, Location, and select a Product to generate a simulated preview.";
            return;
        }

        const baseColor = product === 'coaster' ? '333333' : '0A0A1F'; 
        const accentColor = 'B3B4FF'; 
        
        const simulatedImage = `https://via.placeholder.com/600x600/${baseColor}/${accentColor}?text=Map+for+${location}`;
        const momentText = `The Sky over ${location} on ${date}.`;
        
        previewArea.innerHTML = `
            <div style="text-align: center;">
                <h4>${momentText}</h4>
                <img id="preview-image" src="${simulatedImage}" alt="Simulated Star Map Preview" class="max-w-full h-auto rounded-md">
                <p style="font-size: 0.9em; margin-top: 10px;">(Low-Resolution Preview - Final map is highly detailed and accurate)</p>
            </div>
        `;
    }

    if (orderForm) {
        orderForm.addEventListener('submit', function(event) {
            event.preventDefault(); 

            const form = event.target;
            const formspreeEndpoint = document.querySelector('meta[name="formspree-endpoint"]').content;
            const messageElement = document.getElementById('message');
            const submitButton = form.querySelector('button[type="submit"]');

            if (!formspreeEndpoint) {
                messageElement.textContent = "FATAL ERROR: Formspree endpoint is missing!";
                return;
            }

            messageElement.textContent = "Submitting data, please wait...";
            submitButton.disabled = true;

            const formData = new FormData(form);

            fetch(formspreeEndpoint, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    messageElement.textContent = "Success! Your custom order details have been submitted. We will be in touch shortly.";
                    form.reset();
                } else {
                    messageElement.textContent = "Error submitting data. Please try again.";
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
    }
});