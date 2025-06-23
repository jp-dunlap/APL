document.addEventListener('DOMContentLoaded', () => {

    const dossierData = {
        'boozman': {
            name: 'Senator John Boozman',
            category: 'Political Actor',
            summary: 'A consistent enabler of Israeli state violence through legislative action and public support.',
            points: [
                'Voted in favor of H.R. 5323 (2016), which provided $38 billion in military aid to Israel over 10 years, directly funding the military occupation of Palestine.',
                'Cosponsored S.Res.6 (2017), a resolution objecting to UN Security Council Resolution 2334, which condemned illegal Israeli settlements.',
                'Maintains a 100% pro-Israel voting record according to major lobby group scorecards, demonstrating unwavering allegiance to the apartheid state over principles of international law and human rights.',
                'Received significant campaign contributions from pro-Israel lobbying groups, creating a clear financial incentive to perpetuate policies of occupation.'
            ]
        },
        'cotton': {
            name: 'Senator Tom Cotton',
            category: 'Political Actor',
            summary: 'An aggressive proponent of militarism and an ideological hawk defending Israeli apartheid.',
            points: [
                'Advocated for moving the U.S. Embassy to Jerusalem, a move that defies international consensus and further entrenches the illegal occupation.',
                'Authored and promoted anti-BDS (Boycott, Divestment, Sanctions) legislation, attempting to criminalize non-violent protest against Israeli human rights abuses.',
                'Consistently frames military aid to Israel not as assistance, but as a strategic necessity for U.S. imperial interests in the Middle East, ignoring the cost in Palestinian lives.',
                'Uses inflammatory rhetoric to dehumanize Palestinians and justify collective punishment, contributing to a climate of violence.'
            ]
        },
        'tyson': {
            name: 'Tyson Foods, Inc.',
            category: 'Corporate Entity',
            summary: 'Profits from and invests in the Israeli technology sector, directly supporting the economy of an apartheid state.',
            points: [
                'In 2018, Tyson Ventures, the company\'s venture capital arm, was a lead investor in the Israeli "future of food" startup SuperMeat, integrating Tyson into the Israeli tech ecosystem.',
                'Partnerships with Israeli companies provide economic normalization and legitimize a state engaged in ongoing violations of international law.',
                'These investments violate the principles of the Palestinian-led BDS movement, which calls for a boycott of companies complicit in the occupation.',
                'Profits generated in Arkansas are funneled into an economy that sustains illegal settlements, a military occupation, and an apartheid system.'
            ]
        }
    };

    const modalContainer = document.getElementById('dossier-modal');
    const modalCloseButton = document.getElementById('modal-close-button');
    const modalBody = document.getElementById('modal-body');
    const dossierButtons = document.querySelectorAll('.details-button');

    function displayDossier(targetId) {
        const targetData = dossierData[targetId];
        if (!targetData) {
            console.error('No dossier data found for target ID:', targetId);
            return;
        }

        let contentHtml = `<h3>${targetData.name}</h3>`;
        contentHtml += `<p><strong>Category:</strong> ${targetData.category}</p>`;
        contentHtml += `<p><em>${targetData.summary}</em></p>`;
        contentHtml += '<ul>';
        targetData.points.forEach(point => {
            contentHtml += `<li>• ${point}</li>`;
        });
        contentHtml += '</ul>';

        modalBody.innerHTML = contentHtml;
        modalContainer.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
    }

    function hideDossier() {
        modalContainer.classList.remove('is-visible');
        document.body.style.overflow = '';
    }

    dossierButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.closest('.dossier-card').dataset.targetId;
            displayDossier(targetId);
        });
    });

    modalCloseButton.addEventListener('click', hideDossier);

    modalContainer.addEventListener('click', (event) => {
        if (event.target === modalContainer) {
            hideDossier();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
            hideDossier();
        }
    });

});
