/*
    APL | Arkansas Palestine Liberation
    Script File: investigations-script.js (v2.1 - Corrected)
    Description: This script builds the investigations page dynamically
                 by fetching data from targets.json. It creates the report
                 cards and manages the modal functionality for displaying
                 the full, detailed reports.
    
    CHANGE LOG (v2.1):
    - Corrected the DOM selector logic within showReportModal to accurately
      target the main content container of the fetched report files,
      restoring the modal's functionality.
*/

document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    // The dataUrl is a placeholder. The current investigations.html uses static cards.
    // This script will attach listeners to those static cards. If you wish to
    // load data dynamically, create a 'targets.json' file.
    const dataUrl = 'targets.json'; 

    // --- DOM ELEMENT SELECTION ---
    const modal = document.getElementById('dossier-modal');
    const modalContent = document.getElementById('modal-content');
    const modalClose = document.getElementById('modal-close');
    const adversaryGrid = document.getElementById('adversary-ledger-grid'); // This ID is assumed from the HTML structure
    
    /**
     * Fetches the full HTML of a report and displays it in the modal.
     * @param {string} reportPath - The path to the report's HTML file.
     */
    const showReportModal = async (reportPath) => {
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

            // Parse the fetched HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // --- CORE LOGIC ---
            // The report files have a consistent structure: the first element with class="container"
            // is the navigation bar, and the second is the main content body. This selector
            // precisely targets and extracts only the main content to display in the modal.
            const allContainers = doc.querySelectorAll('.container');
            const reportBody = allContainers.length > 1 ? allContainers[1] : allContainers[0];

            if (reportBody) {
                const contentWrapper = document.createElement('div');
                contentWrapper.className = 'report-body';
                contentWrapper.innerHTML = reportBody.innerHTML;
                modalContent.innerHTML = ''; 
                modalContent.appendChild(contentWrapper);
            } else {
                throw new Error("Could not find the main content in the fetched report file.");
            }
            
        } catch (error) {
            console.error('Failed to fetch report:', error);
            modalContent.innerHTML = `<div class="p-8 text-center"><h3 class="font-serif text-2xl text-[#B91C1C] mb-4">Access Denied</h3><p class="text-lg">Error: Could not load report. The file may be missing or the connection was interrupted.</p></div>`;
        }
    };

    /**
     * Attaches click and keyboard event listeners to all report cards.
     * This function targets the static cards already present in investigations.html.
     */
    const attachCardListeners = () => {
        const reportCards = document.querySelectorAll('.report-card');
        reportCards.forEach(card => {
            const reportPath = card.dataset.report;
            if (reportPath) {
                card.addEventListener('click', () => showReportModal(reportPath));
                card.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        showReportModal(reportPath);
                    }
                });
            }
        });
    };

    // --- MODAL CLOSE FUNCTIONALITY ---
    const closeModal = () => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        modalContent.innerHTML = '';
    };

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) closeModal();
        });
    }
    
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
    
    // --- INITIALIZE ---
    console.log("APL Report Terminal v2.1 is active. Attaching event listeners.");
    attachCardListeners();
});
