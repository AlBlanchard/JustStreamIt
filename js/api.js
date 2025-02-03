const API_URL = "http://localhost:8000/api/v1/";

export async function fetchMovies(category) {
    const response = await fetch(`${API_URL}?category=${category}`);
    return response.json();
}

export async function fetchMovieDetails(movieId) {
    const response = await fetch(`${API_URL}/${movieId}`);
    return response.json();
}