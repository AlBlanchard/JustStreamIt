import { PRIMARY_CATEGORY, SECONDARY_CATEGORY, CATEGORY_TRANSLATIONS } from "./constants.js";
import { navigateTo } from "./router.js";
import { loadSelectedCategory } from "./router.js";


function htmlHeader() {
    const htmlHeader = `
    <img src="../images/juststreamit_logo.svg" alt="Logo JustStreamIt" class="header__logo">
    <h1 class="header__title">Vidéos à la demande</h1>
    `;

    return htmlHeader;
}


function htmlBestFilmSection(bestFilm) {
    const htmlBestFilmSection = `
        <section class="best-film">
            <h2 class="section-title">Meilleur film</h2>
            <article class="best-film__article">
                <div class="best-film__image-container">
                    <img src=${bestFilm.image_url} alt="Image du filme ${bestFilm.title}" class="best-film__image">
                </div>
                <div class="best-film__description">
                    <h3 class="best-film__title">${bestFilm.title}</h3>
                    <p class="best-film__synopsis">${bestFilm.description}</p>
                    <button class="best-film__button" data-id="${bestFilm.id}">Détails</button>
                </div>
            </article>
        </section>
    `;

    return htmlBestFilmSection
};

function htmlCategorySection(categoryTitle, htmlFilmsInitial) {
    const htmlCategorySection = `
        <section class="category">
            <h2 class="section-title">${categoryTitle}</h2>
            <article class="category__film-list">
                ${htmlFilmsInitial}
                <button class="category__see-more">Voir plus</button>
            </article>
        </section>
    `;

    return htmlCategorySection
};

function htmlFilms(films) {
    return films.map(film => `
        <div class="category__film">
            <div class="category__film-banner">
                <h3 class="category__film-title">${film.title}</h3>
                <button class="category__film-button" onclick="navigateTo('/film/${film.id}')">Détails</button>
            </div>
            <div class="category__image-container">
                <img src="${film.image_url}" alt="Image de ${film.title}" class="category__image">
            </div>
        </div>
    `).join("");
};

/**
 * Génère le menu déroulant des catégories.
 * @param {Array} categories - Liste des catégories disponibles.
 * @returns {string} - HTML du menu déroulant.
 */
export function htmlDropDown(categories) {
    return `
        <div class="category__selector">
            <h2 class="section-title">Autres :</h2>
            <div class="category__dropdown">
                <div class="category__dropdown-trigger">
                    <span class="category__dropdown-selected">Sélectionner</span> 
                    <span>▼</span>
                </div>
                <ul class="category__dropdown-options">
                    ${categories.map(category => `
                        <li class="category__dropdown-option" data-value="${category}">
                            ${CATEGORY_TRANSLATIONS[category] || category}
                        </li>`).join("")}
                </ul>
            </div>
        </div>
    `;
}

/**
 * Active les événements du menu déroulant.
 */
function activateDropDown() {
    const trigger = document.querySelector(".category__dropdown-trigger");
    const options = document.querySelector(".category__dropdown-options");

    if (!trigger || !options) return;

    trigger.addEventListener("click", () => {
        options.classList.toggle("active");
    });

    document.querySelectorAll(".category__dropdown-option").forEach(option => {
        option.addEventListener("click", () => {
            const selectedCategory = option.dataset.value;

            document.querySelector(".category__dropdown-selected").textContent =
                CATEGORY_TRANSLATIONS[selectedCategory] || selectedCategory;

            options.classList.remove("active");

            loadSelectedCategory(selectedCategory); // 🔥 Charge les films de la catégorie sélectionnée
        });
    });

    document.addEventListener("click", (event) => {
        if (!trigger.contains(event.target) && !options.contains(event.target)) {
            options.classList.remove("active");
        }
    });
}

function htmlDropDownOptions() {
    const htmlDropDownOptions = `
    <li class="category__dropdown-option" data-value="action">Films d'action</li>
    <li class="category__dropdown-option" data-value="comedy">Comédies</li>
    <li class="category__dropdown-option" data-value="family">Famille</li>
    <li class="category__dropdown-option" data-value="fantasy">Fantasy</li>
    <li class="category__dropdown-option" data-value="horror">Horreur</li>
    <li class="category__dropdown-option" data-value="sci-fi">Science-fiction</li>
    <li class="category__dropdown-option" data-value="westerns">Westerns</li>`;

    return htmlDropDownOptions;

};

/**
 * Affiche la page d'accueil avec les films des deux catégories sélectionnées.
 * @param {Object} bestFilm - Le meilleur film.
 * @param {Object} categories - Les films des deux catégories sélectionnées.
 * @param {Array} allCategories - Toutes les catégories disponibles.
 */
/**
 * Affiche la page d'accueil avec les films des deux catégories sélectionnées et une catégorie dynamique.
 * @param {Object} bestFilm - Le meilleur film.
 * @param {Object} categories - Les films des deux catégories principales.
 * @param {Array} allCategories - Toutes les catégories disponibles.
 * @param {string} defaultCategory - La catégorie affichée par défaut.
 * @param {Array} defaultFilms - Les films de la catégorie affichée par défaut.
 */
export function renderHomePage(bestFilm = {}, categories = { primary: [], secondary: [] }, allCategories = [], defaultCategory = "", defaultFilms = []) {
    const headerElement = document.querySelector(".header");
    const mainElement = document.querySelector(".main");

    if (headerElement) {
        headerElement.innerHTML = htmlHeader();
    } else {
        console.warn("Élément '.header' non trouvé dans le DOM.");
    }

    if (mainElement) {
        const bestFilmHtml = Object.keys(bestFilm).length
            ? htmlBestFilmSection(bestFilm)
            : `<section class="best-film"><p>Aucun meilleur film disponible.</p></section>`;

        const primaryCategoryHtml = categories.primary.length
            ? htmlCategorySection(CATEGORY_TRANSLATIONS[PRIMARY_CATEGORY], htmlFilms(categories.primary))
            : `<section class="category"><p>Aucune donnée disponible pour ${CATEGORY_TRANSLATIONS[PRIMARY_CATEGORY]}.</p></section>`;

        const secondaryCategoryHtml = categories.secondary.length
            ? htmlCategorySection(CATEGORY_TRANSLATIONS[SECONDARY_CATEGORY], htmlFilms(categories.secondary))
            : `<section class="category"><p>Aucune donnée disponible pour ${CATEGORY_TRANSLATIONS[SECONDARY_CATEGORY]}.</p></section>`;

        const defaultCategoryHtml = defaultFilms.length
            ? htmlCategorySection(CATEGORY_TRANSLATIONS[defaultCategory] || defaultCategory, htmlFilms(defaultFilms), "selected-category")
            : `<section class="category selected-category"><p>Aucune donnée disponible pour ${CATEGORY_TRANSLATIONS[defaultCategory] || defaultCategory}.</p></section>`;

        mainElement.innerHTML = `
            ${bestFilmHtml}
            ${primaryCategoryHtml}
            ${secondaryCategoryHtml}
            ${defaultCategoryHtml}
            ${htmlDropDown(allCategories)}
        `;

        activateDropDown();
    }
}

/**
 * Affiche une section avec les films d'une catégorie sélectionnée.
 * @param {string} category - Nom de la catégorie.
 * @param {Array} films - Liste des films de cette catégorie.
 */
export function renderCategorySection(category, films) {
    const mainElement = document.querySelector(".main");

    if (!mainElement) {
        console.warn("Elément '.main' non trouvé dans le DOM.");
        return;
    }

    const categoryHtml = films.length
        ? htmlCategorySection(CATEGORY_TRANSLATIONS[category] || category, htmlFilms(films))
        : `<section class="category"><p>Aucune donnée disponible pour ${CATEGORY_TRANSLATIONS[category] || category}.</p></section>`;

    mainElement.innerHTML = categoryHtml;
}