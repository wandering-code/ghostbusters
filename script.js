var data;
var filters = {
    "selectedEvidences": [],
    "strikethroughEvidences": []
};

document.addEventListener('DOMContentLoaded', () => {
    initialize();
});

function initialize() {
    fetch('data.json')
    .then(response => response.json())
    .then(d => {
        data = d; 
        filterGhosts();
    })
    .catch(error => console.error('Error:', error));
}


function filterGhosts() {
    console.log("Filtering data...");
    let container = document.getElementById('div_ghosts');
    container.innerHTML = "";

    let filteredData = data.ghosts.filter(ghost => {
        const hasSelectedEvidences = filters.selectedEvidences.every(evidence => ghost.evidences.includes(parseInt(evidence)));
        const hasNoStrikethroughEvidences = filters.strikethroughEvidences.every(evidence => !ghost.evidences.includes(parseInt(evidence)));
        
        return hasSelectedEvidences && hasNoStrikethroughEvidences;
    });

    filteredData.forEach(element => {

        let card = document.createElement('div');
        card.className = "ghostCard";

        let groupNameAndEvidencesCard = document.createElement('div');
        groupNameAndEvidencesCard.className = "groupNameAndEvidencesCard";

        let nameSection = document.createElement('section');
        nameSection.innerHTML = element.name;
        nameSection.className = "nameSectionCard";

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
            p.style = "color: red;"
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
    console.log("Clicked in evidence with ID: " + id);

    if (element.dataset.state == "selected") {
        element.dataset.state = "strikethrough";
        filters.selectedEvidences = filters.selectedEvidences.filter(item => item !== id);
        filters.strikethroughEvidences.push(id);
        element.style.backgroundImage = 'url(images/strikethrough.png)';

    } else if (element.dataset.state == "strikethrough") { 
        element.dataset.state = "";
        filters.strikethroughEvidences = filters.strikethroughEvidences.filter(item => item !== id);
        element.style.backgroundImage = '';

    } else {
        element.dataset.state = "selected";
        filters.selectedEvidences.push(id);
        element.style.backgroundImage = 'url(images/selection3.png)';
    }

    filterGhosts();
}
