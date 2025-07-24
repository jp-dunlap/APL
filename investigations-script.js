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
    const dataUrl = 'targets.json'; // The central intelligence data file

    // --- DOM ELEMENT SELECTION ---
    const modal = document.getElementById('dossier-modal');
    const modalContent = document.getElementById('modal-content');
    const modalClose = document.getElementById('modal-close');
    const adversaryGrid = document.getElementById('adversary-ledger-grid');
    
    /**
     * Creates the HTML for a single report card.
     * @param {object} report - The report data object from targets.json.
     * @returns {HTMLElement} - The fully constructed card element.
     */
    const createReportCard = (report) => {
        const card = document.createElement('div');
        card.className = 'report-card';
        card.dataset.report = report.report_file; // Link to the full HTML report
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');

        card.innerHTML = `
            <div>
                <p class="text-sm font-semibold text-[#B91C1C] uppercase tracking-wider font-serif">${report.subtitle}</p>
                <h3 class="text-2xl font-bold mt-2 font-serif">${report.title}</h3>
                <p class="mt-3 text-gray-800">${report.description}</p>
            </div>
            <div class="mt-6">
                <span class="font-bold text-gray-900 font-serif">View Report &rarr;</span>
            </div>
        `;
        return card;
    };

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
            
            // --- FIX ---
            // The original script correctly identified that the report files have multiple
            // containers. The first is the nav, the second is the main content.
            // This logic correctly targets the main content container.
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
     * Main function to initialize the page. Fetches data and builds the UI.
     */
    const initializePage = async () => {
        try {
            const response = await fetch(dataUrl);
            if (!response.ok) {
                throw new Error(`Failed to load intelligence file: ${response.statusText}`);
            }
            const reports = await response.json();

            // Clear any placeholder content
            if(adversaryGrid) {
                adversaryGrid.innerHTML = '';

                // Create and append a card for each report
                reports.forEach(report => {
                    if (report.category === 'Adversary Ledger') {
                        const card = createReportCard(report);
                        adversaryGrid.appendChild(card);
                    }
                });

                // Add event listeners to the newly created cards
                attachCardListeners();
            }

        } catch (error) => {
            console.error(error);
            if(adversaryGrid) {
                adversaryGrid.innerHTML = `<p class="text-center text-red-700 col-span-full">Error: Could not load the intelligence ledger. The network may be compromised.</p>`;
            }
        }
    };

    /**
     * Attaches click and keyboard event listeners to all report cards.
     */
    const attachCardListeners = () => {
        const reportCards = document.querySelectorAll('.report-card');
        reportCards.forEach(card => {
            const reportPath = card.dataset.report;
            card.addEventListener('click', () => showReportModal(reportPath));
            card.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    showReportModal(reportPath);
                }
            });
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
    console.log("APL Report Terminal v2.1 is active. Initializing dynamic intelligence ledger.");
    initializePage();
});
