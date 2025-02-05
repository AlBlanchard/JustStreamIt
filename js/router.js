import { fetchBestFilm, fetchHomeCategories, fetchCategories, fetchTopRatedFilmsByCategory } from "./api.js";
import { renderHomePage, htmlFilms, setupSeeMoreButtons } from "./ui.js";

const DEFAULT_CATEGORY = "Adventure";

/**
 * Charge la page d'accueil avec toutes les données nécessaires.
 */
async function loadHomePage() {
    try {
        const bestFilm = await fetchBestFilm();
        const categories = await fetchHomeCategories();
        const allCategories = await fetchCategories();
        const defaultFilms = await fetchTopRatedFilmsByCategory(DEFAULT_CATEGORY);

        renderHomePage(bestFilm, categories, allCategories, DEFAULT_CATEGORY, defaultFilms);
    } catch (error) {
        console.error("Erreur lors du chargement de la page d'accueil :", error);
    }
}

/**
 * Met à jour la liste des films de la catégorie sélectionnée via une requête API.
 * @param {string} categoryName - Nom de la catégorie sélectionnée.
 */
export async function loadSelectedCategory(categoryName) {
    try {
        console.log(`Chargement des films pour la catégorie : ${categoryName}`);

        const films = await fetchTopRatedFilmsByCategory(categoryName);
        const categoryContainer = document.querySelector(".category--custom .category__film-list");

        if (!categoryContainer) {
            console.warn("Elément '.category--custom .category__film-list' non trouvé !");
            return;
        }

        // Remplace le contenu avec les nouveaux films récupérés via l'API
        categoryContainer.innerHTML = films.length
            ? htmlFilms(films) + `<button class="category__see-more visible">Voir plus</button>` + `<button class="category__see-less">Voir moins</button>`
            : `<p>Aucun film disponible pour cette catégorie.</p>`;

        setupSeeMoreButtons();

    } catch (error) {
        console.error(`Erreur lors du chargement de la catégorie ${categoryName} :`, error);
    }
}



/**
 * Gère la navigation SPA.
 */
export function router() {
    const path = window.location.pathname;

    if (path === "/") {
        loadHomePage();
    }
}

/**
 * Change l'URL sans recharger la page et exécute le routeur.
 * @param {string} path - Le chemin de la nouvelle page.
 */
export function navigateTo(path) {
    window.history.pushState({}, "", path);
    router();
}

document.addEventListener("DOMContentLoaded", router);
window.addEventListener("popstate", router);

document.addEventListener("click", (event) => {
    const target = event.target.closest("a");
    if (target && target.href.startsWith(window.location.origin)) {
        event.preventDefault(); // Empêche le chargement de la page
        navigateTo(new URL(target.href).pathname);
    }
});
