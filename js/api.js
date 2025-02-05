import { API_BASE_URL, PRIMARY_CATEGORY, SECONDARY_CATEGORY, DEFAULT_CATEGORY_DROPDOWN } from "./constants.js";

/**
 * Effectue une requête GET sur une URL donnée.
 * @param {string} endpoint - L'URL à requêter (sans API_BASE_URL).
 * @returns {Promise<Object>} - Les données JSON retournées.
 */
async function fetchAPI(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`Erreur API: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        return null;
    }
}

/**
 * Récupère l'id du film le mieux noté, puis ses détails.
 * @returns {Promise<Object>} - Objet contenant les infos du meilleur film.
 */
export async function fetchBestFilm() {
    const data = await fetchAPI("/titles/?sort_by=-imdb_score&page_size=1");
    const bestFilmId = data?.results?.[0]?.id;

    if (!bestFilmId) return null;

    return await fetchAPI(`/titles/${bestFilmId}`);
}

/**
 * Récupère les 6 films les mieux notés.
 * @returns {Promise<Array>} - Liste des meilleurs films.
 */
export async function fetchTopRatedFilms() {
    const data = await fetchAPI("/titles/?sort_by=-imdb_score&page_size=6");
    return data?.results || []; // Retourne un tableau vide si aucune donnée
}

/**
 * Récupère les 6 films les mieux notés pour une catégorie donnée.
 * @param {string} category - Le nom de la catégorie (ex: "Comedy").
 * @returns {Promise<Array>} - Liste des films de la catégorie.
 */
export async function fetchTopRatedFilmsByCategory(category) {
    const data = await fetchAPI(`/titles/?genre=${category}&sort_by=-imdb_score&page_size=6`);
    return data?.results || [];
}

/**
 * Récupère les films pour les deux catégories choisies.
 * @returns {Promise<{primary: Array, secondary: Array}>}
 */
export async function fetchHomeCategories() {
    const [primaryFilms, secondaryFilms, customPlaceholderFilms] = await Promise.all([
        fetchTopRatedFilmsByCategory(PRIMARY_CATEGORY),
        fetchTopRatedFilmsByCategory(SECONDARY_CATEGORY),
        fetchTopRatedFilmsByCategory(DEFAULT_CATEGORY_DROPDOWN)
    ]);

    return { primary: primaryFilms, secondary: secondaryFilms, custom: customPlaceholderFilms};
}

/**
 * Récupère toutes les catégories de films (maximum 25).
 * @returns {Promise<Array>} - Liste des catégories disponibles.
 */
export async function fetchCategories() {
    const data = await fetchAPI("/genres/?page_size=25");
    return data?.results?.map(cat => cat.name) || [];
}

/**
 * Récupère les détails d'un film en fonction de son ID.
 * @param {string} movieId - L'ID du film à récupérer.
 * @returns {Promise<Object>} - Objet contenant les détails du film.
 */
export async function fetchMovieDetails(movieId) {
    return await fetchAPI(`/titles/${movieId}`);
}
