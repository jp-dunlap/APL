/*
    APL | Arkansas Palestine Liberation
    Script File: investigations-script.js
    Description: This script controls the modal functionality for the
                 investigations.html page. It fetches and displays dossier
                 content dynamically, creating an interactive intelligence hub.
*/

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENT SELECTION ---
    // Select all necessary components of the modal interface.
    const modal = document.getElementById('dossier-modal');
    const modalContent = document.getElementById('modal-content');
    const modalClose = document.getElementById('modal-close');
    const caseFileCards = document.querySelectorAll('.case-file-card');

    // --- FUNCTION TO FETCH AND DISPLAY DOSSIER ---
    // This asynchronous function handles the core logic of loading the intelligence.
    const showDossier = async (dossierPath) => {
        // Guard clause: do nothing if the path is invalid.
        if (!dossierPath) return;

        try {
            // 1. Show a loading state to the user while fetching data.
            modalContent.innerHTML = '<p class="text-center text-lg p-8 font-serif">Accessing secure file...</p>';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            modal.classList.remove('hidden');

            // 2. Fetch the requested dossier file.
            const response = await fetch(dossierPath);
            if (!response.ok) {
                // If the file isn't found or another error occurs, throw an error.
                throw new Error(`Network response was not ok. Status: ${response.status}`);
            }
            const html = await response.text();

            // 3. Parse the fetched HTML to prevent loading a full document inside the modal.
            // This isolates only the main content we need.
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const dossierBody = doc.querySelector('.container'); // Selects the main content div from the target file.

            // 4. Inject the isolated content into the modal.
            if (dossierBody) {
                modalContent.innerHTML = dossierBody.innerHTML;
            } else {
                throw new Error("Could not find '.container' in the fetched dossier file.");
            }
            
        } catch (error) {
            // 5. If any step fails, display a clear error message in the modal.
            console.error('Failed to fetch dossier:', error);
            modalContent.innerHTML = `<div class="p-8 text-center"><h3 class="font-serif text-2xl text-[#B91C1C] mb-4">Access Denied</h3><p class="text-lg">Error: Could not load dossier. The file may be missing or the connection was interrupted. Please try again.</p></div>`;
        }
    };

    // --- EVENT LISTENERS ---

    // 1. Add a click event listener to each case file card.
    caseFileCards.forEach(card => {
        card.addEventListener('click', () => {
            const dossierPath = card.dataset.dossier;
            showDossier(dossierPath);
        });
        // Add keyboard accessibility (Enter or Space key).
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault(); // Prevent space from scrolling the page
                const dossierPath = card.dataset.dossier;
                showDossier(dossierPath);
            }
        });
    });

    // 2. Define the function to close the modal.
    const closeModal = () => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto'; // Restore background scrolling
        modalContent.innerHTML = ''; // Clear content for next use
    };

    // 3. Attach the close function to the close button.
    modalClose.addEventListener('click', closeModal);

    // 4. Attach the close function to the Escape key.
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // 5. Attach the close function to clicks on the background overlay.
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Log successful initialization to the console, maintaining our operational aesthetic.
    console.log("APL Dossier Terminal is active. Awaiting target selection.");
});
