var data;
var filters = {
    "selectedEvidences": [],
    "strikethroughEvidences": []
};

var filt = false;

document.addEventListener('DOMContentLoaded', () => {
    initialize();
});

function initialize() {
    fetch('data.json')
    .then(response => response.json())
    .then(d => {
        data = d; 
        filterGhosts();

        initializeGhostFilter();

        initializeCursedPossessionsSidebar();
    })
    .catch(error => console.error('Error:', error));
}

function filterGhosts(textToSearch, alteredSpeed, alteredBlink) {
    let container = document.getElementById('div_ghosts');
    container.innerHTML = "";
    let filteredData;
    let filteredByEvidences = filters.selectedEvidences.length > 0 || filters.strikethroughEvidences.length > 0;
    let filteredByText = (textToSearch != null && textToSearch != "") || (document.getElementById('textSearch').value != "");
    let filteredBySpeed = (alteredSpeed != null && alteredSpeed) || (document.getElementById('alteredSpeed').checked);
    let filteredByBlink = (alteredBlink != null && alteredBlink) || (document.getElementById('alteredBlink').checked);

    textToSearch = filteredByText ? document.getElementById('textSearch').value : "";
    filteredBySpeed = filteredBySpeed ? document.getElementById('alteredSpeed').checked : false;
    filteredByBlink = filteredByBlink ? document.getElementById('alteredBlink').checked : false;

    if (!filteredByEvidences && !filteredByText && !filteredBySpeed && !filteredByBlink) {
        filteredData = data.ghosts;
    } else {
        filteredData = data.ghosts.filter(ghost => {
            let arrayOfChecks = []

            const hasSelectedEvidences = filters.selectedEvidences != "" ? filters.selectedEvidences.every(evidence => ghost.evidences.includes(parseInt(evidence))) : false;
            const hasNoStrikethroughEvidences = filters.strikethroughEvidences != "" ? filters.strikethroughEvidences.every(evidence => !ghost.evidences.includes(parseInt(evidence))) : false;

            if (filteredByEvidences) {
                if (hasSelectedEvidences || hasNoStrikethroughEvidences) {
                    arrayOfChecks.push(true);
                } else {
                    arrayOfChecks.push(false);
                }
            }

            const hasTextToSearch = textToSearch != null && textToSearch != "" ? (ghost.name.toLowerCase().includes(textToSearch.toLowerCase()) 
                || ghost.hunt.some(item => item.toLowerCase().includes(textToSearch.toLowerCase()))
                || ghost.more_info.some(item => item.toLowerCase().includes(textToSearch.toLowerCase()))) : false;

            if (filteredByText) {
                if (hasTextToSearch) {
                    arrayOfChecks.push(true);
                } else {
                    arrayOfChecks.push(false);
                }
            }

            if (filteredBySpeed) {
                if (ghost.altered_speed) {
                    arrayOfChecks.push(true);
                } else {
                    arrayOfChecks.push(false);
                }
            }

            if (filteredByBlink) {
                if (ghost.altered_blink) {
                    arrayOfChecks.push(true);
                } else {
                    arrayOfChecks.push(false);
                }
            }

            return arrayOfChecks.every(value => value === true)
        });
    }
        

    filteredData.forEach(element => {
        let card = document.createElement('div');
        card.className = "ghostCard";
         
        if (element.discarded) {
            card.style.opacity = '0.5';
            card.classList.add("discarded");
        }

        let groupNameAndEvidencesCard = document.createElement('div');
        groupNameAndEvidencesCard.className = "groupNameAndEvidencesCard";

        let nameSection = document.createElement('section');
        nameSection.innerHTML = element.name;
        nameSection.className = "nameSectionCard";
        nameSection.setAttribute('onclick', "discardGhost(this.closest('.ghostCard'), " + element.id + ")");
        nameSection.style.cursor = "pointer";

        let evidencesDiv = document.createElement('div');
        let evidence1Section = document.createElement('section');
        let evidence2Section = document.createElement('section');
        let evidence3Section = document.createElement('section');
        evidencesDiv.className = "evidencesDivCard";
        
        evidence1Section.innerHTML = data.evidences.find(item => item.id === element.evidences[0]).name;
        evidence1Section.style.color = filters.selectedEvidence != "" && filters.selectedEvidences.includes(parseInt(element.evidences[0])) ? 'aquamarine' : '';
        evidence2Section.innerHTML = data.evidences.find(item => item.id === element.evidences[1]).name;
        evidence2Section.style.color = filters.selectedEvidence != "" && filters.selectedEvidences.includes(parseInt(element.evidences[1])) ? 'aquamarine' : '';
        evidence3Section.innerHTML = data.evidences.find(item => item.id === element.evidences[2]).name;
        evidence3Section.style.color = filters.selectedEvidence != "" && filters.selectedEvidences.includes(parseInt(element.evidences[2])) ? 'aquamarine' : '';

        evidencesDiv.appendChild(evidence1Section);
        evidencesDiv.appendChild(evidence2Section);
        evidencesDiv.appendChild(evidence3Section);

        groupNameAndEvidencesCard.appendChild(nameSection);
        groupNameAndEvidencesCard.appendChild(evidencesDiv);

        let infoSection = document.createElement('section');
        infoSection.className = "infoSectionCard";
        element.hunt.forEach(huntInfo => {
            let p = document.createElement('p');
            p.innerHTML = huntInfo;
            p.style = "color: rgb(138, 0, 0);"
            infoSection.appendChild(p);
        })

        element.more_info.forEach(moreInfo => {
            let p = document.createElement('p');
            p.innerHTML = moreInfo;
            infoSection.appendChild(p);
        })

        card.appendChild(groupNameAndEvidencesCard);
        card.appendChild(infoSection);
        container.appendChild(card);
    });

}

function selectEvidence(element, id) {
    if (element.dataset.state == "selected") {
        element.dataset.state = "strikethrough";
        filters.selectedEvidences = filters.selectedEvidences.filter(item => item !== id);
        filters.strikethroughEvidences.push(id);
        element.style.backgroundImage = 'url(images/strikethrough.png)';
    } else if (element.dataset.state == "strikethrough") { 
        element.dataset.state = '';
        filters.strikethroughEvidences = filters.strikethroughEvidences.filter(item => item !== id);
        element.style.backgroundImage = '';
        filt = false;
    } else {
        element.dataset.state = "selected";
        filters.selectedEvidences.push(id);
        element.style.backgroundImage = 'url(images/selection.png)';
        filt = true;
    }

    filterGhosts();
}


function initializeCursedPossessionsSidebar() {
    let cursedPossessionsDiv = document.getElementById('cursedPossessions');
    let cursedPossessionsPanelsDiv = document.getElementById('cursedPossessionsPanel');
    const overlay = document.getElementById('overlay');
    const cursedPossessionsPanelCloseBtn = document.getElementById('cursedPossessionsPanelCloseBtn');

    for (let i = 0; i < data.cursed_possessions.length; i++) {
        let cursedPossession = data.cursed_possessions[i];

        // Create cursed possessions sidebar
        let a = document.createElement('a');
        a.href = '#';
        a.dataset.id = 'cursedPossessionPanel' + i;

        let img = document.createElement('img');
        img.classList.add('cursedPossessionImage');
        img.src = cursedPossession.image;

        a.appendChild(img);

        // Create cursed possessions sidebar content
        let div = document.createElement('div');
        div.id = 'cursedPossessionPanel' + i;
        div.classList.add('cursedPossessionPanelContent')
        div.classList.add('active');

        let h2 = document.createElement('h2');
        h2.innerHTML = cursedPossession.name;

        let p = document.createElement('p');
        p.innerHTML = cursedPossession.description;

        div.appendChild(h2);
        div.appendChild(p);

        cursedPossessionsDiv.appendChild(a);

        cursedPossessionsPanelsDiv.appendChild(div);

        a.addEventListener('click', (e) => {
            e.preventDefault();
            let cursedPossessionPanelContent = document.querySelectorAll('.cursedPossessionPanelContent');
            cursedPossessionPanelContent.forEach(content => content.classList.remove('active'));
            overlay.classList.add('active');
            cursedPossessionsPanelsDiv.classList.add('active');
            div.classList.add('active');
        });
    }

    cursedPossessionsPanelCloseBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
        cursedPossessionsPanelsDiv.classList.remove('active');
        let cursedPossessionPanelContent = document.querySelectorAll('.c');
        cursedPossessionPanelContent.forEach(content => content.classList.remove('active'));
    });

    overlay.addEventListener('click', () => {
        overlay.classList.remove('active');
        cursedPossessionsPanelsDiv.classList.remove('active');
        cursedPossessionPanelContent.forEach(content => content.classList.remove('active'));
    });
}

function initializeGhostFilter() {
    let divItemsMenu = document.getElementById('div_items_menu');

    data.evidences.forEach(evidence => {
        let section = document.createElement('section');
        section.setAttribute('onclick', 'selectEvidence(this, ' + evidence.id + ')');
        section.innerHTML = evidence.name;

        section.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            section.dataset.state = '';
            filters.strikethroughEvidences = filters.strikethroughEvidences.filter(item => item !== evidence.id);
            filters.selectedEvidences = filters.selectedEvidences.filter(item => item !== evidence.id);
            section.style.backgroundImage = '';
            filterGhosts();
        });

        divItemsMenu.appendChild(section);
    })
}

function clearAll() {
    filters.strikethroughEvidences = [];
    filters.selectedEvidences = [];

    document.querySelectorAll('#div_items_menu section').forEach((section, index) => {
        section.dataset.state = '';
        section.style.backgroundImage = '';
    });

    document.getElementById('alteredSpeed').checked = false;
    document.getElementById('alteredBlink').checked = false;
    document.getElementById('textSearch').value = "";

    data.ghosts.forEach(ghost => {
        ghost.discarded = false;
    })

    filterGhosts();
}

function discardGhost(div, ghostId) {
    if (div.classList.contains("discarded")) {
        div.style.opacity = '1';
        div.classList.remove("discarded");
        data.ghosts.find(ghost => ghost.id === ghostId).discarded = false;
    } else {
        div.style.opacity = '0.5';
        div.classList.add("discarded");
        data.ghosts.find(ghost => ghost.id === ghostId).discarded = true;
    }
}