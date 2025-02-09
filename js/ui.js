import { 
    PRIMARY_CATEGORY, 
    SECONDARY_CATEGORY, 
    CATEGORY_TRANSLATIONS, 
    DEFAULT_CATEGORY_DROPDOWN, 
    PAD_BREAKPOINT, 
    DESKTOP_BREAKPOINT, 
    PHONE_FILMS, PAD_FILMS, 
    DESKTOP_FILMS 
        } from "./constants.js";

import { loadSelectedCategory } from "./router.js";

/**
 * Récupère le nombre de films visibles en fonction de la largeur de la fenêtre.
 * @returns {number} - Nombre de films à afficher.
 */
function getVisibleFilmCount() {
    const width = window.innerWidth;

    if (width < PAD_BREAKPOINT) {
        return PHONE_FILMS;
    } else if (width >= PAD_BREAKPOINT && width < DESKTOP_BREAKPOINT) {
        return PAD_FILMS;
    } else {
        return DESKTOP_FILMS;
    }
}

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
                    <img src=${bestFilm.image_url} alt="Image du film ${bestFilm.title}" class="best-film__image">
                </div>
                <div class="best-film__description">
                    <h3 class="best-film__title">${bestFilm.title}</h3>
                    <p class="best-film__synopsis">${bestFilm.description}</p>
                    <button class="best-film__button" data-id="${bestFilm.id}" onclick="showFilmDetails(${bestFilm.id})">Détails</button>
                </div>
            </article>
        </section>
    `;

    return htmlBestFilmSection
};

export function htmlCategorySection(categoryTitle, htmlFilms) {
    return `
        <section class="category">
            <h2 class="section-title">${categoryTitle}</h2>
            <article class="category__film-list">
                ${htmlFilms}
            </article>
            <button class="category__button category__see-more visible">Voir plus</button>
            <button class="category__button category__see-less">Voir moins</button>
        </section>
    `;
}

export function htmlFilms(films) {
    return films.map((film, index) => `
        <div class="category__film ${index < getVisibleFilmCount() ? "visible" : ""}" onclick="showFilmDetails(${film.id})">
            <div class="category__film-banner">
                <h3 class="category__film-title">${film.title}</h3>
                <button class="category__film-button" onclick="event.stopPropagation(); showFilmDetails(${film.id})">Détails</button>
            </div>
            <div class="category__image-container">
                <img src="${film.image_url}" 
                     alt="Image du film ${film.title}" 
                     class="category__image"
                     onerror="this.onerror=null; this.src='/images/default_cover.webp';">
            </div>
        </div>
    `).join("");
}


/**
 * Génère le menu déroulant des catégories.
 * @param {Array} categories - Liste des catégories disponibles.
 * @returns {string} - HTML du menu déroulant.
 */
function htmlDropDown(allCategories) {
    return `
        <div class="category__selector">
            <h2 class="section-title">Autres :</h2>
            <div class="category__dropdown">
                <div class="category__dropdown-trigger">
                    <span class="category__dropdown-selected">${CATEGORY_TRANSLATIONS[DEFAULT_CATEGORY_DROPDOWN] || DEFAULT_CATEGORY_DROPDOWN}</span> 
                    <span>▼</span>
                </div>
                <ul class="category__dropdown-options">
                    ${allCategories.map(category => `
                        <li class="category__dropdown-option" data-value="${category}">
                            ${CATEGORY_TRANSLATIONS[category] || category} ${category === DEFAULT_CATEGORY_DROPDOWN ? "✅" : ""}
                        </li>`).join("")}
                </ul>
            </div>
        </div>
    `;
}

function htmlCategoryCustom(allCategories, htmlFilmsInitial) {
    return `
        <section class="category category--custom">
            ${htmlDropDown(allCategories)}
                            
            <article class="category__film-list">
                ${htmlFilmsInitial}
            </article>
            <button class="category__button category__see-more visible">Voir plus</button>
            <button class="category__button category__see-less">Voir moins</button>
        </section>
        `;
};

/**
 * Active les événements du menu déroulant avec ajout d'un ✅ à la sélection.
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

            // Met à jour le texte sélectionné dans le menu déroulant
            document.querySelector(".category__dropdown-selected").textContent =
                CATEGORY_TRANSLATIONS[selectedCategory] || selectedCategory;

            options.classList.remove("active");

            // Supprime la classe selected de toutes les options
            document.querySelectorAll(".category__dropdown-option").forEach(opt => {
                opt.classList.remove("selected");
                opt.innerHTML = opt.dataset.value in CATEGORY_TRANSLATIONS
                    ? CATEGORY_TRANSLATIONS[opt.dataset.value]
                    : opt.dataset.value; // Reset sans ✅
            });

            // Ajoute la classe `selected` à l'option cliquée et un ✅
            option.classList.add("selected");
            option.innerHTML = `${CATEGORY_TRANSLATIONS[selectedCategory] || selectedCategory} ✅`;

            // Charge les films de la catégorie sélectionnée
            loadSelectedCategory(selectedCategory);
        });
    });

    document.addEventListener("click", (event) => {
        if (!trigger.contains(event.target) && !options.contains(event.target)) {
            options.classList.remove("active");
        }
    });
}

/**
 * Affiche la page d'accueil avec les films des deux catégories sélectionnées.
 * @param {Object} bestFilm - Le meilleur film.
 * @param {Object} categories - Les films des catégories sélectionnées.
 * @param {Array} allCategories - Toutes les catégories disponibles.
 */
/**
 * Affiche la page d'accueil avec les films des deux catégories sélectionnées et une catégorie dynamique.
 * @param {Object} bestFilm - Le meilleur film.
 * @param {Object} categories - Les films des deux catégories principales.
 * @param {Array} allCategories - Toutes les catégories disponibles.
 */
export function renderHomePage(bestFilm = {}, categories = { primary: [], secondary: [], custom:[] }, allCategories = []) {
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

        const customCategoryHtml = categories.custom.length
            ? htmlCategoryCustom(allCategories, htmlFilms(categories.custom))
            : `<section class="category category--custom"><p>Aucune donnée disponible pour ${CATEGORY_TRANSLATIONS[DEFAULT_CATEGORY_DROPDOWN]}.</p></section>`;

        mainElement.innerHTML = `
            ${bestFilmHtml}
            ${primaryCategoryHtml}
            ${secondaryCategoryHtml}
            ${customCategoryHtml}
        `;

        setupSeeMoreButtons();
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

/**
 * Anime l'ouverture de la liste des films
 * @param {HTMLElement} filmList - L'élément contenant les films
 */
function expandList(filmList) {
    // Récupérer la hauteur actuelle (avec seulement les films visibles)
    const initialHeight = filmList.offsetHeight;
    filmList.style.maxHeight = `${initialHeight}px`; // Empêche un "saut" au début

    requestAnimationFrame(() => {
        // Ajouter .visible aux films cachés APRÈS avoir fixé la hauteur
        filmList.querySelectorAll(".category__film:not(.visible)").forEach(film => {
            film.classList.add("visible");
        });

        // Forcer un recalcul pour éviter que la transition soit ignorée
        requestAnimationFrame(() => {
            const newHeight = filmList.scrollHeight; // Nouvelle hauteur après apparition des films
            filmList.style.maxHeight = `${newHeight}px`;

            setTimeout(() => {
                filmList.style.maxHeight = "none"; // Supprime max-height après l'animation
            }, 1000); // Temps correspondant à la transition CSS
        });
    });
}


/**
 * Anime la fermeture de la liste des films
 * @param {HTMLElement} filmList - L'élément contenant les films
 * @param {number} visibleCount - Nombre de films à garder visibles
 */
function collapseList(filmList, visibleCount) {
    console.log("⏬ Début de l'animation de fermeture");

    // 🔹 Étape 1 : Récupérer la hauteur actuelle avant de modifier la liste
    const initialHeight = filmList.offsetHeight;
    filmList.style.maxHeight = `${initialHeight}px`; // 🔒 Fixe la hauteur pour éviter un "saut"

    requestAnimationFrame(() => {
        const allFilms = Array.from(filmList.querySelectorAll(".category__film"));
        const hiddenFilms = allFilms.slice(visibleCount); // Films à masquer
        const visibleFilms = allFilms.slice(0, visibleCount); // Films à garder visibles

        // 🔹 Étape 2 : Calcul précis de la hauteur totale des films visibles
        let adjustedHeight = 0;
        visibleFilms.forEach(film => {
            const styles = window.getComputedStyle(film);
            const marginBottom = parseFloat(styles.marginBottom) || 0;
            adjustedHeight += film.offsetHeight + marginBottom;
        });

        // 🔹 🔥 Correction de l'erreur de 27.94px
        const computedStyles = window.getComputedStyle(filmList);
        const gap = parseFloat(computedStyles.gap) || 0; // ✅ Prise en compte du gap du flexbox

        adjustedHeight = Math.ceil(adjustedHeight + gap); // ✅ Ajout du gap pour compenser

        console.log("📏 Hauteur ajustée exacte :", adjustedHeight, "px");

        // 🔹 Étape 3 : Appliquer la transition fluide
        filmList.style.transition = "max-height 1s ease-out";
        filmList.style.maxHeight = `${adjustedHeight}px`;

        // 🔹 Étape 4 : Attendre la fin de la transition avant de masquer les films
        setTimeout(() => {
            hiddenFilms.forEach(film => film.classList.remove("visible"));

            requestAnimationFrame(() => {
                filmList.style.transition = ""; // ✅ Reset pour éviter les glitchs
                filmList.style.maxHeight = "none"; // ✅ Suppressi*on du max-height après transition
            });
        }, 1000); // ✅ Synchronisé avec la transition CSS OK
    });
}






/**
 * Configure les boutons "Voir plus" et "Voir moins"
 */
export function setupSeeMoreButtons() {
    document.querySelectorAll(".category").forEach(category => {
        const seeMoreButton = category.querySelector(".category__see-more");
        const seeLessButton = category.querySelector(".category__see-less");
        const films = category.querySelectorAll(".category__film");
        const filmList = category.querySelector(".category__film-list");
        const visibleCount = getVisibleFilmCount(); // Nombre de films visibles par défaut

        if (films.length <= visibleCount) {
            seeMoreButton.classList.remove("visible"); // Cache le bouton si pas assez de films
        }

        seeMoreButton.addEventListener("click", () => {
            expandList(filmList);
            seeMoreButton.classList.remove("visible"); // Cache "Voir plus"
            seeLessButton.classList.add("visible"); // Affiche "Voir moins"
        });

        seeLessButton.addEventListener("click", () => {
            collapseList(filmList, visibleCount);
            seeMoreButton.classList.add("visible"); // Affiche "Voir plus"
            seeLessButton.classList.remove("visible"); // Cache "Voir moins"
        });
    });
}

function updateVisibleFilms() {
    document.querySelectorAll(".category").forEach(category => {
        const films = category.querySelectorAll(".category__film");
        const seeMoreButton = category.querySelector(".category__see-more");
        const seeLessButton = category.querySelector(".category__see-less");

        const visibleCount = getVisibleFilmCount();
        const isExpanded = seeLessButton?.classList.contains("visible"); // Vérifie si la liste est ouverte

        films.forEach((film, index) => {
            if (index < visibleCount) {
                film.classList.add("visible"); // ✅ Affiche les films
            } else {
                film.classList.remove("visible"); // ❌ Cache les films
            }
        });

        // Desktop : On affiche 6 films, mais on empêche "Voir moins" et "voir plus" d’apparaître
        if (visibleCount === DESKTOP_FILMS) {
            seeMoreButton.classList.remove("visible");
            seeLessButton.classList.remove("visible");
        } 
        // Mode Mobile/Tablette : Fonctionnement normal de "Voir plus / Voir moins"
        else {
            if (films.length > visibleCount && !isExpanded) {
                seeMoreButton.classList.add("visible");
                seeLessButton.classList.remove("visible");
            } else {
                seeMoreButton.classList.remove("visible");
                seeLessButton.classList.add("visible");
            }
        }
    });
}

updateVisibleFilms();
window.addEventListener("resize", updateVisibleFilms);



