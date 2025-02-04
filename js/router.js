import { fetchBestFilm, fetchHomeCategories, fetchCategories, fetchTopRatedFilmsByCategory } from "./api.js";
import { renderHomePage, renderCategorySection } from "./ui.js";
import { CATEGORY_TRANSLATIONS } from "./constants.js";

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
 * Met à jour la liste des films de la catégorie sélectionnée dans `.category--custom`.
 * @param {string} categoryName - Nom de la catégorie sélectionnée.
 */
export async function loadSelectedCategory(categoryName) {
    try {
        const films = await fetchTopRatedFilmsByCategory(categoryName);
        const categoryContainer = document.querySelector(".category--custom .category__film-list");

        if (!categoryContainer) {
            console.warn("Elément '.category--custom .category__film-list' non trouvé !");
            return;
        }

        // Remplace le contenu avec les nouveaux films
        categoryContainer.innerHTML = films.length
            ? htmlFilms(films) + `<button class="category__see-more">Voir plus</button>`
            : `<p>Aucun film disponible pour cette catégorie.</p>`;

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
