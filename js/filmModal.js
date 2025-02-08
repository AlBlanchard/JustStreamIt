export class FilmModal {
    constructor() {
        this.modal = document.createElement("div");
        this.modal.id = "modal";
        this.modal.classList.add("modal");
        this.modal.innerHTML = `
            <div class="modal__content" role="dialog" aria-labelledby="modal-title">
                <div class="modal__details">
                    <div class="modal__header">
                        <div class="modal__header-infos">
                            <h2 class="modal__title" id="modal-title"></h2>
                            <div><span class="modal__year"></span> - <span class="modal__genre"></span></div>
                            <div>PG-<span class="modal__PG"></span> - <span class="modal__duration"></span> <span class="modal__country"></span></div>
                            <div>IMDB score: <span class="modal__score"></span>/10</div>
                        </div>
                        <button class="modal__cross" aria-label="Fermer le modal">❌</button>
                    </div>

                    <div class="modal__realisator">
                        <strong>Réalisé par:</strong><br/>
                        <span class="modal__director"></span>
                    </div>

                    <p class="modal__description"></p>
                    <img class="modal__image" src="" alt="Affiche du film">

                    <div class="modal__cast">
                        <strong>Avec :</strong><br/>
                        <span class="modal__actors"></span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.modal);
        this.modalContent = this.modal.querySelector(".modal__content");

        // Fermer le modal en cliquant sur la croix
        this.modal.querySelector(".modal__cross").addEventListener("click", () => this.hide());

        // Fermer en cliquant en dehors du contenu
        this.modal.addEventListener("click", (event) => {
            if (event.target === this.modal) this.hide();
        });
    }

    /**
     * Met à jour les informations du modal et l'affiche.
     * @param {Object} film - Les données du film à afficher.
     */
    show(film) {
        const filmDuration = film.duration ? `${film.duration} minutes` : "Inconnue";
        const ratedValue = film.rated && !isNaN(film.rated) ? film.rated : "(Non classé)";
        const filmCountries = film.countries ? `(${film.countries.join(" / ")})` : "Non spécifié";

        this.modal.scrollTop = 0; // Réinitialise la position du scroll du modal
        this.modal.querySelector(".modal__title").textContent = film.title;
        this.modal.querySelector(".modal__image").src = film.image_url;
        this.modal.querySelector(".modal__description").textContent = film.long_description || "Aucune description disponible.";
        this.modal.querySelector(".modal__genre").textContent = film.genres.join(", ");
        this.modal.querySelector(".modal__year").textContent = film.year;
        this.modal.querySelector(".modal__PG").textContent = ratedValue;
        this.modal.querySelector(".modal__duration").textContent = filmDuration
        this.modal.querySelector(".modal__country").textContent = filmCountries;
        this.modal.querySelector(".modal__score").textContent = film.imdb_score;
        this.modal.querySelector(".modal__director").textContent = film.directors.join(", ");
        this.modal.querySelector(".modal__actors").textContent = film.actors.slice(0, 5).join(", ");

        this.modal.style.display = "flex";
        document.body.style.overflow = "hidden"; // Désactive le scroll du body
    }

    hide() {
        this.modal.style.display = "none";
        document.body.style.overflow = ""; // Réactive le scroll du body
    }
}