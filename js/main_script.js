function redirectToPlatform(type) {
    var select;

    if (type == "NavBar")
    {
        select = document.getElementById("Platforme");
    }
    
    if(type == "LiensFilms")
    {
        select = document.getElementById("Liens");
    }
    
    var selectedValue = select.value;
    if (selectedValue) {
        window.location.href = selectedValue;  // Redirige vers l'URL de la plateforme sélectionnée
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

// Charger les films de chaque catégorie depuis un fichier JSON
document.addEventListener("DOMContentLoaded", () => {
    const categories = ['action', 'comedie', 'horreur', 'scifi', 'thriller'];
    categories.forEach(category => loadFilmsByCategory(category));
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////

// Fonction pour charger et afficher les films par catégorie
function loadFilmsByCategory(category) {
    // Conteneur cible pour chaque catégorie
    const containerId = `filmListContainer_${capitalizeFirstLetter(category)}`;
    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`Le conteneur avec l'ID "${containerId}" est introuvable.`);
        return;
    }

    // Construction dynamique du chemin vers le fichier JSON
    const jsonPath = `../../json/films/data_${category}.json`;

    // Charger les données depuis le fichier JSON
    fetch(jsonPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status} pour la catégorie "${category}".`);
            }
            return response.json();
        })
        .then(data => {
            if (data[category] && data[category].length > 0) {
                generateFilmList(container, data[category]);
            } else {
                console.error(`Aucun film trouvé pour la catégorie "${category}".`);
            }
        })
        .catch(error => {
            console.error(`Erreur lors du chargement des données pour la catégorie "${category}":`, error);
        });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

// Fonction de bascule pour afficher ou masquer les descriptions
window.toggleExplanation = function (id) {
    const categories = ['action', 'drame', 'comedie', 'horreur', 'scifi', 'thriller'];
    let category = categories.find(cat => id.startsWith(cat));
    if (!category) {
        console.error("Catégorie introuvable pour l'ID :", id);
        return;
    }

    const jsonPath = `../../json/films/data_${category}.json`;

    fetch(jsonPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status} pour la catégorie "${category}".`);
            }
            return response.json();
        })
        .then(data => {
            let films = Array.isArray(data) ? data : data[category];
            if (!films) {
                console.error(`Aucun film trouvé dans le fichier JSON de la catégorie "${category}".`);
                return;
            }

            let film = films.find(f => f.id === id);
            const explanation = document.getElementById(`${id}-description`);
            if (!explanation) {
                console.error("Élément de description introuvable pour l'ID :", id);
                return;
            }

            if (film) {
                explanation.innerHTML = `${film.description}`;
            } else {
                explanation.textContent = "Film non trouvé.";
            }

            explanation.style.marginTop = "20px";
            explanation.style.marginBottom = "20px";
            explanation.style.padding = "10px";
            explanation.style.border = "3px ridge #028f02b0";
            explanation.style.borderRadius = "5px";
            explanation.style.backgroundColor = "#00DD00";
            explanation.style.fontSize = "14px";
            explanation.style.lineHeight = "1.5";
            explanation.style.color ="white";
            explanation.style.width ="450px";

            if (explanation.style.display === "none" || !explanation.style.display) {
                explanation.style.display = "block";
            } else {
                explanation.style.display = "none";
            }
        })
        .catch(error => {
            console.error(`Erreur lors du chargement des données pour la catégorie "${category}":`, error);
        });
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////

// Fonction pour basculer les sous-catégories
window.toggleDropdown = function (menuId) {
    const menu = document.getElementById(menuId);

    if (menu.classList.contains("hidden")) {
        menu.classList.remove("hidden");
        menu.style.display = "block";
    } else {
        menu.classList.add("hidden");
        menu.style.display = "none";
    }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////

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

/////////////////////////////////////////////////////////////////////////////////////////////////////////

// Générer les sous-catégories pour chaque film
function generateSubcategories(film) {
    if (!film || !film.type) return "";

    if (film.type === 1 && Array.isArray(film.list)) {
        return film.list.map(item => `
            <li style="list-style: none;" style="background-color: #00DD00">
                <div class="dropdown" style="background-color: #00DD00">
                    <p class="dropdown-header" onclick="toggleDropdown('${item.id}-dropdown')" style="background-color: #00DD00">
                        ${item.title}
                    </p>
                    <ul id="${item.id}-dropdown" class="dropdown-menu hidden">
                        <li style="list-style: none;" style="background-color: #00DD00"><a href="${item.lien_info}" style="background-color: #00DD00">INFORMATIONS</a></li>
                        <li style="list-style: none;" style="background-color: #00DD00"><a href="${item.lien_trailer}" style="background-color: #00DD00">TRAILER</a></li>
                        <li style="list-style: none;" style="background-color: #00DD00"><a href="${item.lien_vo}" style="background-color: #00DD00">FULL ANGLAIS</a></li>
                        <li style="list-style: none;" style="background-color: #00DD00"><a href="${item.lien_vf}" style="background-color: #00DD00">FULL FRANCAIS</a></li>
                    </ul>
                </div>
            </li>
        `).join("");
    } else if (film.type === -1) {
        return `
            <li style="list-style: none;" style="background-color: #00DD00">
                <div class="dropdown" style="background-color: #00DD00">
                    <p class="dropdown-header" onclick="toggleDropdown('${film.id}-dropdown')" style="background-color: #00DD00">
                        ${film.title}
                    </p>
                    <ul id="${film.id}-dropdown" class="dropdown-menu hidden">
                        <li style="list-style: none;" style="background-color: #00DD00"><a href="${film.lien_info}" style="background-color: #00DD00">INFORMATIONS</a></li>
                        <li style="list-style: none;" style="background-color: #00DD00"><a href="${film.lien_trailer}" style="background-color: #00DD00">TRAILER</a></li>
                        <li style="list-style: none;" style="background-color: #00DD00"><a href="${film.lien_vo}" style="background-color: #00DD00">FULL ANGLAIS</a></li>
                        <li style="list-style: none;" style="background-color: #00DD00"><a href="${film.lien_vf}" style="background-color: #00DD00">FULL FRANCAIS</a></li>
                    </ul>
                </div>
            </li>
        `;
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

// Fonction utilitaire pour capitaliser la première lettre
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}