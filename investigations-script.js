/*
    APL | Arkansas Palestine Liberation
    Script File: investigations-script.js
    Description: This script controls the modal functionality for the
                 investigations.html page. It fetches and displays report
                 content dynamically, creating an interactive intelligence hub.
*/

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENT SELECTION ---
    const modal = document.getElementById('dossier-modal');
    const modalContent = document.getElementById('modal-content');
    const modalClose = document.getElementById('modal-close');
    const reportCards = document.querySelectorAll('.report-card');

    // --- FUNCTION TO FETCH AND DISPLAY REPORT ---
    const showReport = async (reportPath) => {
        if (!reportPath) return;

        try {
            // Initial state: Show loading message and display the modal
            modalContent.innerHTML = '<p class="text-center text-lg p-8 font-serif">Accessing file...</p>';
            document.body.style.overflow = 'hidden'; 
            modal.classList.remove('hidden');

            // Fetch the external report HTML
            const response = await fetch(reportPath);
            if (!response.ok) {
                throw new Error(`Network response was not ok. Status: ${response.status}`);
            }
            const html = await response.text();

            // Parse the fetched HTML into a document object
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Isolate the main content container from the fetched file
            const allContainers = doc.querySelectorAll('.container');
            const reportBody = allContainers.length > 1 ? allContainers[1] : allContainers[0];

            if (reportBody) {
                // Create a wrapper div with the .report-body class to constrain the width.
                const contentWrapper = document.createElement('div');
                contentWrapper.className = 'report-body'; // Apply the CSS class for readability
                contentWrapper.innerHTML = reportBody.innerHTML;

                // Clear the loading message and append the new, styled content
                modalContent.innerHTML = ''; 
                modalContent.appendChild(contentWrapper);

            } else {
                throw new Error("Could not find the main '.container' in the fetched report file.");
            }
            
        } catch (error) {
            console.error('Failed to fetch report:', error);
            modalContent.innerHTML = `<div class="p-8 text-center"><h3 class="font-serif text-2xl text-[#B91C1C] mb-4">Access Denied</h3><p class="text-lg">Error: Could not load report. The file may be missing or the connection was interrupted. Please try again.</p></div>`;
        }
    };

    // --- EVENT LISTENERS ---
    reportCards.forEach(card => {
        card.addEventListener('click', () => {
            const reportPath = card.dataset.report;
            showReport(reportPath);
        });
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const reportPath = card.dataset.report;
                showReport(reportPath);
            }
        });
    });

    // --- MODAL CLOSE FUNCTIONALITY ---
    const closeModal = () => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto'; // Restore background scrolling
        modalContent.innerHTML = ''; // Clear content to free up memory
    };

    modalClose.addEventListener('click', closeModal);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Close modal if user clicks on the background overlay
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    console.log("APL Report Terminal is active. Awaiting selection.");
});
