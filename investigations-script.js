/*
    APL | Arkansas Palestine Liberation
    Script File: investigations-script.js (v3.2 - Aesthetic & Functional Overhaul)
    Description: This script fetches the APL knowledge graph data and renders
                 it as a visually coherent, interactive network graph. This version
                 includes fine-tuned physics, improved aesthetics for readability,
                 and robust modal linkage for accessing detailed reports.
*/

document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const graphDataUrl = 'apl_knowledge_graph.json';
    const graphContainerId = 'network-graph';

    // --- DOM ELEMENT SELECTION ---
    const modal = document.getElementById('dossier-modal');
    const modalContent = document.getElementById('modal-content');
    const modalClose = document.getElementById('modal-close');
    const graphContainer = document.getElementById(graphContainerId);

    /**
     * Fetches the full HTML of a report and displays it in the modal.
     * @param {string} reportPath - The path to the report's HTML file.
     */
    const showReportModal = async (reportPath) => {
        if (!reportPath) return;

        try {
            modalContent.innerHTML = '<p class="text-center text-lg p-8 font-serif">Accessing file...</p>';
            document.body.style.overflow = 'hidden';
            modal.classList.remove('hidden');

            const response = await fetch(reportPath);
            if (!response.ok) {
                throw new Error(`Network response was not ok. Status: ${response.status}`);
            }
            const html = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
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
            modalContent.innerHTML = `<div class="p-8 text-center"><h3 class="font-serif text-2xl text-[#B91C1C] mb-4">Access Denied</h3><p class="text-lg">Error: Could not load report. The file '${reportPath}' may be missing or named incorrectly.</p></div>`;
        }
    };

    /**
     * Renders the interactive network graph with enhanced aesthetics and physics.
     * @param {object} graphData - The parsed JSON data for the graph.
     */
    const renderNetworkGraph = (graphData) => {
        // Map nodes and edges from the JSON data
        const nodes = new vis.DataSet(graphData.nodes.map(node => ({
            id: node.id,
            label: node.id,
            group: node.group,
            title: `Group: ${node.group}` // Tooltip on hover
        })));

        const edges = new vis.DataSet(graphData.edges.map(edge => ({
            from: edge.source,
            to: edge.target,
            label: edge.label,
            // Use logarithmic scaling for edge width to handle large value differences
            value: edge.value > 1000 ? Math.log(edge.value) : 1,
            title: `Value: ${edge.value.toLocaleString()}` // Tooltip on hover
        })));

        const data = { nodes, edges };

        // --- AESTHETIC & PHYSICS OVERHAUL ---
        const options = {
            nodes: {
                shape: 'dot',
                size: 25,
                font: {
                    size: 16,
                    color: '#1f2937', // Dark gray for text
                    strokeWidth: 3, // Thickness of the outline
                    strokeColor: 'rgba(255, 255, 255, 0.8)' // Semi-transparent white outline for readability
                },
                borderWidth: 3,
                shadow: true
            },
            edges: {
                width: 2,
                color: {
                    color: '#6b7280', // Medium gray
                    highlight: '#B91C1C',
                    hover: '#B91C1C'
                },
                arrows: {
                    to: { enabled: true, scaleFactor: 0.7 }
                },
                smooth: {
                    type: 'continuous' // Use curved edges
                }
            },
            physics: {
                // Use a solver that creates more space between nodes
                solver: 'barnesHut',
                barnesHut: {
                    gravitationalConstant: -8000, // Push nodes away from each other
                    centralGravity: 0.3,
                    springLength: 250, // Ideal length of an edge
                    springConstant: 0.04,
                    damping: 0.09,
                    avoidOverlap: 0.1
                },
                stabilization: {
                    iterations: 200, // Run more iterations for a stable layout
                    fit: true
                }
            },
            interaction: {
                hover: true,
                hoverConnectedEdges: true, // Highlight connected edges on node hover
                tooltipDelay: 200,
                dragNodes: true,
                dragView: true,
                zoomView: true
            },
            groups: {
                // Color scheme designed for clarity and visual distinction
                "Corporate Hegemony": { color: { background: '#ef4444', border: '#991b1b' } }, // Red
                "Military-Industrial Complex": { color: { background: '#6b7280', border: '#1f2937' } }, // Gray
                "State Actor": { color: { background: '#3b82f6', border: '#1d4ed8' } }, // Blue
                "Influence Industry": { color: { background: '#f97316', border: '#9a3412' } }, // Orange
                "Academic-Normalization Complex": { color: { background: '#eab308', border: '#854d0e' } }, // Yellow
                "Financial Complicity": { color: { background: '#10b981', border: '#047857' } }, // Green
                "Healthcare-Apartheid Nexus": { color: { background: '#8b5cf6', border: '#5b21b6' } }, // Violet
                "Agribusiness-Apartheid Axis": { color: { background: '#22c55e', border: '#15803d' } }, // Lime
                "Ideological Apparatus": { color: { background: '#ec4899', border: '#9d174d' } }, // Pink
                "Military-Police Nexus": { color: { background: '#0ea5e9', border: '#0369a1' } }, // Sky Blue
                "Legislation": { color: { background: '#a8a29e', border: '#44403c' } } // Stone
            }
        };

        const network = new vis.Network(graphContainer, data, options);

        // --- EVENT LISTENER FOR NODE CLICKS ---
        network.on("click", function (params) {
            if (params.nodes.length > 0) {
                const nodeId = params.nodes[0];
                // Create a URL-friendly filename from the node ID
                const reportFileName = `investigation-${nodeId.toLowerCase()
                    .replace(/ inc\.| \(.+\)/g, '') // Remove suffixes like ' Inc.' or '(Raytheon)'
                    .trim()
                    .replace(/ /g, '-')}.html`;
                
                showReportModal(reportFileName);
            }
        });
        
        // Stabilize the network after a short delay for a better initial view
        setTimeout(() => {
            network.stopSimulation();
        }, 5000);
    };

    /**
     * Initializes the page by fetching graph data and rendering the network.
     */
    const initialize = async () => {
        try {
            graphContainer.innerHTML = '<p class="text-center text-lg p-8 font-serif">Loading network intelligence...</p>';
            const response = await fetch(graphDataUrl);
            if (!response.ok) {
                throw new Error(`Failed to load graph data. Status: ${response.status}`);
            }
            const graphData = await response.json();
            renderNetworkGraph(graphData);
        } catch (error) {
            console.error(error);
            graphContainer.innerHTML = `<p class="text-center text-lg p-8 text-red-700 font-serif">Error: Could not load the network graph. Please ensure 'apl_knowledge_graph.json' is accessible.</p>`;
        }
    };

    // --- MODAL CLOSE FUNCTIONALITY ---
    const closeModal = () => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        modalContent.innerHTML = '';
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !modal.classList.contains('hidden')) closeModal(); });
    
    // --- INITIALIZE THE APPLICATION ---
    initialize();
});
