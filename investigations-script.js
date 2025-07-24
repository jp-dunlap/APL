/*
    APL | Arkansas Palestine Liberation
    Script File: investigations-script.js (v3.0 - Network Visualization)
    Description: This script fetches the APL knowledge graph data and renders
                 it as an interactive network graph using vis.js. It also
                 retains the modal functionality to display detailed reports
                 when a node in the graph is clicked.
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
     * Renders the interactive network graph.
     * @param {object} graphData - The parsed JSON data for the graph.
     */
    const renderNetworkGraph = (graphData) => {
        const nodes = new vis.DataSet(graphData.nodes.map(node => ({
            id: node.id,
            label: node.id,
            group: node.group,
            title: `Group: ${node.group}` // Tooltip
        })));

        const edges = new vis.DataSet(graphData.edges.map(edge => ({
            from: edge.source,
            to: edge.target,
            label: edge.label,
            value: edge.value > 1000 ? Math.log10(edge.value) : 1, // Log scale for better visualization
            title: `Value: ${edge.value.toLocaleString()}` // Tooltip
        })));

        const data = { nodes, edges };

        const options = {
            nodes: {
                shape: 'dot',
                size: 20,
                font: {
                    size: 14,
                    color: '#333'
                },
                borderWidth: 2
            },
            edges: {
                width: 2,
                color: {
                    color: '#848484',
                    highlight: '#B91C1C',
                    hover: '#B91C1C'
                },
                arrows: {
                    to: { enabled: true, scaleFactor: 0.5 }
                }
            },
            interaction: {
                hover: true,
                tooltipDelay: 200,
                dragNodes: true,
                dragView: true,
                zoomView: true
            },
            physics: {
                solver: 'forceAtlas2Based',
                forceAtlas2Based: {
                    gravitationalConstant: -50,
                    centralGravity: 0.01,
                    springLength: 200,
                    springConstant: 0.08,
                },
                maxVelocity: 50,
                minVelocity: 0.1,
                stabilization: {
                    iterations: 150
                }
            },
            groups: {
                "Corporate Hegemony": { color: { background: '#fca5a5', border: '#b91c1c' } },
                "Military-Industrial Complex": { color: { background: '#9ca3af', border: '#4b5563' } },
                "State Actor": { color: { background: '#a5b4fc', border: '#4338ca' } },
                "Influence Industry": { color: { background: '#fdba74', border: '#c2410c' } },
                "Academic-Normalization Complex": { color: { background: '#fde047', border: '#a16207' } },
                "Financial Complicity": { color: { background: '#6ee7b7', border: '#047857' } },
                "Healthcare-Apartheid Nexus": { color: { background: '#a78bfa', border: '#6d28d9' } },
                "Agribusiness-Apartheid Axis": { color: { background: '#bbf7d0', border: '#166534' } },
                "Ideological Apparatus": { color: { background: '#f9a8d4', border: '#9d174d' } },
                "Military-Police Nexus": { color: { background: '#7dd3fc', border: '#0369a1' } },
            }
        };

        const network = new vis.Network(graphContainer, data, options);
        
        // --- EVENT LISTENER FOR NODE CLICKS ---
        network.on("click", function (params) {
            if (params.nodes.length > 0) {
                const nodeId = params.nodes[0];
                const reportFileName = `investigation-${nodeId.toLowerCase().replace(/ \(.+\)/, '').replace(/ /g, '-')}.html`;
                showReportModal(reportFileName);
            }
        });
    };

    /**
     * Fetches and displays a report in the modal. (Retained from previous version)
     * @param {string} reportPath - The path to the report's HTML file.
     */
    const showReportModal = async (reportPath) => {
        // ... (The existing showReportModal function code remains unchanged)
    };

    /**
     * Initializes the page by fetching graph data and rendering the network.
     */
    const initialize = async () => {
        try {
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

    // --- MODAL CLOSE FUNCTIONALITY (Retained from previous version) ---
    const closeModal = () => {
        // ... (The existing closeModal function code remains unchanged)
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !modal.classList.contains('hidden')) closeModal(); });
    
    // --- INITIALIZE THE APPLICATION ---
    initialize();
});
