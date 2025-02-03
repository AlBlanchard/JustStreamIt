import { fetchMovies, fetchMovieDetails } from "./api.js";
import { renderMovies } from "./ui.js";

async function handleRouteChange() {
    const hash = window.location.hash;

    if (hash.startsWith("#film/")) {
        const movieId = hash.split("/")[1];
        const movie = await fetchMovieDetails(movieId);
        document.querySelector(".main").innerHTML = `
            <button onclick="window.history.back()">⬅ Retour</button>
            <h2>${movie.title}</h2>
            <img src="${movie.image}" alt="${movie.title}">
            <p>${movie.description}</p>
        `;
    } else {
        const movies = await fetchMovies("all");
        renderMovies(movies);
    }
}

// Écoute le changement d'URL pour gérer la navigation
window.addEventListener("hashchange", handleRouteChange);
window.addEventListener("load", handleRouteChange);