import { router } from "./router.js";

window.addEventListener("error", (event) => {
    if (event.target.tagName === "IMG") {
        console.warn(`Image introuvable, remplacement : ${event.target.src}`);
        event.target.src = "/images/default_cover.webp"; 
        event.preventDefault();
    }
}, true);

/**
 * Exécuter le routeur au chargement de la page
 */
document.addEventListener("DOMContentLoaded", () => {
    router();
});
