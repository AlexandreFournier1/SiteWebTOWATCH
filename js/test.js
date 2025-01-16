// Charger les films de chaque catégorie depuis un fichier JSON
document.addEventListener("DOMContentLoaded", () => {
    const categories = ['action', 'comedie', 'horreur', 'scifi', 'thriller'];
    categories.forEach(category => loadFilmsByCategory(category));
});

// Fonction pour charger et afficher les films par catégorie
function loadFilmsByCategory(category) {
    const containerId = `filmListContainer_${capitalizeFirstLetter(category)}`;
    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`Le conteneur avec l'ID "${containerId}" est introuvable.`);
        return;
    }

    // Charger le fichier JSON correspondant
    fetch(`data_${category}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur lors du chargement des données pour la catégorie "${category}".`);
            }
            return response.json();
        })
        .then(filmsData => {
            if (!filmsData || filmsData.length === 0) {
                console.error(`Aucun film trouvé pour la catégorie "${category}".`);
                return;
            }
            generateFilmList(container, filmsData);
        })
        .catch(error => console.error(`Erreur: ${error.message}`));
}

// Générer la liste de films dans le conteneur spécifié
function generateFilmList(container, films) {
    films.forEach(film => {
        if (!film || !film.type) return;

        const listItem = document.createElement("li");

        listItem.innerHTML = `
            <div class="title-button-container" style="background-color: #00DD00">
                <h3 class="title" id="${film.id}" style="background-color: #00DD00">${film.title}</h3>
                <button class="button" onclick="toggleExplanation('${film.id}')">?</button>
            </div>
            <div id="${film.id}-description" class="hidden rendered">
                <p>${film.description}</p>
            </div>
            <ul>
                ${generateSubcategories(film)}
            </ul>
        `;

        container.appendChild(listItem);
    });
}

// Générer les sous-catégories pour chaque film
function generateSubcategories(film) {
    if (!film || !film.type) return "";

    if (film.type === 1 && Array.isArray(film.list)) {
        return film.list.map(item => `
            <li style="list-style: none;">
                <div class="dropdown">
                    <p class="dropdown-header" onclick="toggleDropdown('${item.id}-dropdown')">
                        ${item.title}
                    </p>
                    <ul id="${item.id}-dropdown" class="dropdown-menu hidden">
                        <li><a href="${item.lien_info}">INFORMATIONS</a></li>
                        <li><a href="${item.lien_trailer}">TRAILER</a></li>
                        <li><a href="${item.lien_vo}">FULL ANGLAIS</a></li>
                        <li><a href="${item.lien_vf}">FULL FRANCAIS</a></li>
                    </ul>
                </div>
            </li>
        `).join("");
    } else if (film.type === -1) {
        return `
            <li style="list-style: none;">
                <div class="dropdown">
                    <p class="dropdown-header" onclick="toggleDropdown('${film.id}-dropdown')">
                        ${film.title}
                    </p>
                    <ul id="${film.id}-dropdown" class="dropdown-menu hidden">
                        <li><a href="${film.lien_info}">INFORMATIONS</a></li>
                        <li><a href="${film.lien_trailer}">TRAILER</a></li>
                        <li><a href="${film.lien_vo}">FULL ANGLAIS</a></li>
                        <li><a href="${film.lien_vf}">FULL FRANCAIS</a></li>
                    </ul>
                </div>
            </li>
        `;
    }
}

// Fonction utilitaire pour capitaliser la première lettre
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}