import { fetchBestFilm, fetchHomeCategories, fetchCategories, fetchTopRatedFilmsByCategory, fetchMovieDetails } from "./api.js";
import { renderHomePage, htmlFilms, setupSeeMoreButtons } from "./ui.js";
import { FilmModal } from "./filmModal.js";

/**
 * Charge la page d'accueil avec toutes les données nécessaires.
 */
async function loadHomePage() {
    try {
        const bestFilm = await fetchBestFilm();
        const categories = await fetchHomeCategories();
        const allCategories = await fetchCategories();

        renderHomePage(bestFilm, categories, allCategories);
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

const modal = new FilmModal();

async function showFilmDetails(filmId) {
    try {
        const film = await fetchMovieDetails(filmId); 
        if (!film) throw new Error("Aucune donnée reçue pour ce film.");

        modal.show(film); 
    } catch (error) {
        console.error("Erreur lors de la récupération des détails du film :", error);
    }
}

document.addEventListener("DOMContentLoaded", router);
window.addEventListener("popstate", router);
window.showFilmDetails = showFilmDetails; // Essentiel pour le modal, rend accessible la fonction showFilmDetails dans le contexte global

document.addEventListener("click", (event) => {
    const target = event.target.closest("a");
    if (target && target.href.startsWith(window.location.origin)) {
        event.preventDefault(); // Empêche le chargement de la page
        openModal(new URL(target.href).pathname);
    }
});
