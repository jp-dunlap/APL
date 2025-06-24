/*
    APL | Arkansas Palestine Liberation
    Script File: investigations-script.js
    Description: This script controls the modal functionality for the
                 investigations.html page. It fetches and displays dossier
                 content dynamically, creating an interactive intelligence hub.
*/

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENT SELECTION ---
    const modal = document.getElementById('dossier-modal');
    const modalContent = document.getElementById('modal-content');
    const modalClose = document.getElementById('modal-close');
    const caseFileCards = document.querySelectorAll('.case-file-card');

    // --- FUNCTION TO FETCH AND DISPLAY DOSSIER ---
    const showDossier = async (dossierPath) => {
        if (!dossierPath) return;

        try {
            modalContent.innerHTML = '<p class="text-center text-lg p-8 font-serif">Accessing secure file...</p>';
            document.body.style.overflow = 'hidden'; 
            modal.classList.remove('hidden');

            const response = await fetch(dossierPath);
            if (!response.ok) {
                throw new Error(`Network response was not ok. Status: ${response.status}`);
            }
            const html = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // --- BUG FIX ---
            // Original line was: const dossierBody = doc.querySelector('.container');
            // This was too generic. The corrected logic below specifically targets the main content container.
            const allContainers = doc.querySelectorAll('.container');
            // The main content is always the second container in the dossier files.
            // This check makes the code resilient.
            const dossierBody = allContainers.length > 1 ? allContainers[1] : allContainers[0];


            if (dossierBody) {
                modalContent.innerHTML = dossierBody.innerHTML;
            } else {
                throw new Error("Could not find the main '.container' in the fetched dossier file.");
            }
            
        } catch (error) {
            console.error('Failed to fetch dossier:', error);
            modalContent.innerHTML = `<div class="p-8 text-center"><h3 class="font-serif text-2xl text-[#B91C1C] mb-4">Access Denied</h3><p class="text-lg">Error: Could not load dossier. The file may be missing or the connection was interrupted. Please try again.</p></div>`;
        }
    };

    // --- EVENT LISTENERS ---
    caseFileCards.forEach(card => {
        card.addEventListener('click', () => {
            const dossierPath = card.dataset.dossier;
            showDossier(dossierPath);
        });
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const dossierPath = card.dataset.dossier;
                showDossier(dossierPath);
            }
        });
    });

    const closeModal = () => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        modalContent.innerHTML = '';
    };

    modalClose.addEventListener('click', closeModal);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    console.log("APL Dossier Terminal is active. Awaiting target selection.");
});
