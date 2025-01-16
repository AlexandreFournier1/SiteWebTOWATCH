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

// Assurez-vous que les films de chaque catégorie sont définis dans un fichier JavaScript (par exemple, data_action.js, data_drame.js, etc.)
document.addEventListener("DOMContentLoaded", () => {
    // Charger et afficher les films de chaque catégorie
    loadFilmsByCategory('action');
    loadFilmsByCategory('comedie');
    //loadFilmsByCategory('drame');
    loadFilmsByCategory('horreur');
    loadFilmsByCategory('scifi');
    loadFilmsByCategory('thriller');
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

    // Charge les films de la catégorie depuis la variable window
    const filmsData = window[`data_${category}`] || [];

    // Si la catégorie est vide, masquer la section
    if (filmsData.length === 0) {
        console.error(`Aucun film trouvé pour la catégorie "${category}".`);
        return;
    }

    // Générer la liste de films pour cette catégorie
    generateFilmList(container, filmsData);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

// Générer la liste de films dans le conteneur spécifié
function generateFilmList(container, films) {
    films.forEach(film => {
        if (!film || !film.type) return;

        const listItem = document.createElement("li");

        // Structure du film
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
                        <li style="list-style: none;"><a href="${item.lien_info}" target="_blank" style="background-color: #00DD00">INFORMATIONS</a></li>
                        <li style="list-style: none;"><a href="${item.lien_trailer}" target="_blank" style="background-color: #00DD00">TRAILER</a></li>
                        <li style="list-style: none;"><a href="${item.lien_vo}" target="_blank" style="background-color: #00DD00">FULL ANGLAIS</a></li>
                        <li style="list-style: none;"><a href="${item.lien_vf}" target="_blank" style="background-color: #00DD00">FULL FRANCAIS</a></li>
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
                        <li style="list-style: none;"><a href="${film.lien_info}" target="_blank" style="background-color: #00DD00">INFORMATIONS</a></li>
                        <li style="list-style: none;"><a href="${film.lien_trailer}" target="_blank" style="background-color: #00DD00">TRAILER</a></li>
                        <li style="list-style: none;"><a href="${film.lien_vo}" target="_blank" style="background-color: #00DD00">FULL ANGLAIS</a></li>
                        <li style="list-style: none;"><a href="${film.lien_vf}" target="_blank" style="background-color: #00DD00">FULL FRANCAIS</a></li>
                    </ul>
                </div>
            </li>
        `;
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

// Fonction de bascule pour afficher ou masquer les descriptions
function toggleExplanation(id) {
    // Trouver le film dans toutes les catégories
    const allCategories = [window.data_action, window.data_drame, window.data_comedie, window.data_horreur, window.data_scifi, window.data_thriller];
    let film = null;

    for (const category of allCategories) {
        film = category.find(f => f.id === id);
        if (film) break;
    }

    const explanation = document.getElementById(`${id}-description`);
    if (!explanation) return;

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
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

// Fonction pour basculer les sous-catégories
function toggleDropdown(menuId) {
    const menu = document.getElementById(menuId);

    if (menu.classList.contains("hidden")) {
        menu.classList.remove("hidden");
        menu.style.display = "block";
    } else {
        menu.classList.add("hidden");
        menu.style.display = "none";
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

// Fonction utilitaire pour capitaliser la première lettre (pour les noms de catégorie)
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
