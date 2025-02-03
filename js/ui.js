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
                <button class="category__film-button" data-id="${film.id}">Détails</button>
            </div>
            <div class="category__image-container">
                <img src="${film.image_url}" alt="Image de ${film.title}" class="category__image">
            </div>
        </div>
    `).join("");
};

function htmlDropDown(htmlDropDownOptions) {
    const htmlDropDown = `
            <div class="category__selector">
                <h2 class="section-title">Autres: </h2>
                <div class="category__dropdown">
                    <div class="category__dropdown-trigger">
                        <span class="category__dropdown-selected">Comédies</span> 
                        <span>▼</span>
                    </div>
                    <ul class="category__dropdown-options">
                        ${htmlDropDownOptions}
                    </ul>
                </div>
            </div>`;

    return htmlDropDown;
};

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

export function renderHomePage(bestFilm = {}, categoryFilms = []) {
    const headerElement = document.querySelector(".header");
    const mainElement = document.querySelector(".main");

    if (headerElement) {
        headerElement.innerHTML = htmlHeader();
    } else {
        console.warn("Elément '.header' non trouvé dans le DOM.");
    }

    if (mainElement) {
        const bestFilmHtml = Object.keys(bestFilm).length
            ? htmlBestFilmSection(bestFilm)
            : `<section class="best-film"><p>Aucun meilleur film disponible.</p></section>`;

        const categoryHtml = categoryFilms.length
            ? htmlCategorySection("Comédies", htmlFilms(categoryFilms))
            : `<section class="category"><p>Aucune catégorie disponible.</p></section>`;

        mainElement.innerHTML = `
            ${bestFilmHtml}
            ${categoryHtml}
            ${htmlDropDown(htmlDropDownOptions())}
        `;
    } else {
        console.warn("Elément '.main' non trouvé dans le DOM.");
    }
}


export function renderMovies(movies) {
    const container = document.querySelector(".category__list");
    container.innerHTML = ""; // On vide avant de re-remplir

    movies.forEach(movie => {
        const movieElement = document.createElement("div");
        movieElement.classList.add("category__item");
        movieElement.innerHTML = `
            <div class="category__banner">
                <h3 class="category__title">${movie.title}</h3>
                <button class="category__button" data-id="${movie.id}">Détails</button>
            </div>
            <div class="category__image-container">
                <img src="${movie.image}" alt="${movie.title}" class="category__image">
            </div>
        `;
        container.appendChild(movieElement);
    });

    // Ajoute les événements sur les boutons "Détails"
    document.querySelectorAll(".category__button").forEach(button => {
        button.addEventListener("click", () => {
            window.location.hash = `#film/${button.dataset.id}`;
        });
    });
};