async function loadCSV(filename) {
    const response = await fetch(filename);
    const text = await response.text();
    return text.split(',').map(item => item.trim());
}

async function init() {
    const tabs = await loadCSV('tabs.csv');
    const tabsContainer = document.getElementById('tabs-container');

    tabs.forEach(tab => {
        const btn = document.createElement('button');
        btn.innerText = tab;
        btn.onclick = () => loadTabContent(tab);
        tabsContainer.appendChild(btn);
    });

    // Load first tab by default
    if (tabs.length > 0) loadTabContent(tabs[0]);
}

async function loadTabContent(tabName) {
    const subjects = await loadCSV(`${tabName}_subjects.csv`);
    const categories = await loadCSV(`${tabName}_categories.csv`);

    renderSubjects(subjects);
    renderCategories(categories);
}

function renderSubjects(subjects) {
    const list = document.getElementById('subjects-list');
    list.innerHTML = '';
    subjects.forEach(s => {
        const card = document.createElement('div');
        card.className = 'card';
        card.draggable = true;
        card.innerText = s;
        card.id = `card-${Math.random().toString(36).substr(2, 9)}`;
        
        card.ondragstart = (e) => e.dataTransfer.setData('text/plain', e.target.id);
        list.appendChild(card);
    });
}

function renderCategories(categories) {
    const grid = document.getElementById('categories-grid');
    grid.innerHTML = '';
    categories.forEach(c => {
        const zone = document.createElement('div');
        zone.className = 'category-zone';
        zone.innerHTML = `<h4>${c}</h4><div class="drop-area"></div>`;
        
        const dropArea = zone.querySelector('.drop-area');
        
        dropArea.ondragover = (e) => e.preventDefault();
        dropArea.ondrop = (e) => {
            const id = e.dataTransfer.getData('text');
            const draggableElement = document.getElementById(id);
            dropArea.appendChild(draggableElement);
        };
        
        grid.appendChild(zone);
    });
}

init();
