document.addEventListener("DOMContentLoaded", () => {
    
    // --- PARTIE 1 : ANIMATION DE DEFILEMENT (SCROLL REVEAL) ---
    const reveals = document.querySelectorAll(".reveal");

    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });


    // --- PARTIE 2 : FILTRAGE DYNAMIQUE INTERACTIF (CE -> PROJETS) ---
    const ceCards = document.querySelectorAll(".ce-card:not(.disabled)");
    const projectCards = document.querySelectorAll(".project-card");
    const resetBtn = document.getElementById("reset-filter-btn");
    const voisinsSection = document.getElementById("projets");

    ceCards.forEach(card => {
        card.addEventListener("click", (e) => {
            e.stopPropagation(); // Évite le déclenchement de la pop-up au clic sur le bouton de tri

            const selectedCE = card.getAttribute("data-target-ce");
            
            projectCards.forEach(project => {
                const projectCEs = project.getAttribute("data-ce").split(" ");
                
                if (projectCEs.includes(selectedCE)) {
                    project.classList.remove("fade-out");
                    project.classList.add("highlight-target");
                } else {
                    project.classList.remove("highlight-target");
                    project.classList.add("fade-out");
                }
            });

            resetBtn.classList.remove("hidden");
            voisinsSection.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    // --- PARTIE 3 : RÉINITIALISATION DU FILTRE ---
    resetBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        projectCards.forEach(project => {
            project.classList.remove("fade-out");
            project.classList.remove("highlight-target");
        });
        resetBtn.classList.add("hidden");
    });


    // --- PARTIE 4 : OUVERTURE ET NAVIGATION DANS LA POP-UP (TEXTE <-> IMAGE) ---
    const modal = document.getElementById("project-modal");
    const modalContent = modal.querySelector(".modal-content");
    const modalBody = document.getElementById("modal-body");
    const modalClose = document.querySelector(".modal-close");

    // Variable globale pour sauvegarder les détails du projet actif
    let currentProjectHTML = ""; 

    projectCards.forEach(card => {
        card.addEventListener("click", (e) => {
            // Sécurité pour ne pas ouvrir le projet si on clique par erreur sur le bouton reset
            if (e.target.closest('#reset-filter-btn')) return;

            modalContent.classList.remove("modal-image-view");

            // Extraction des données de la carte
            const title = card.querySelector("h3").innerText;
            const badge = card.querySelector(".badge").innerText;
            const isOutline = card.querySelector(".badge").classList.contains("outline");
            const subtitle = card.querySelector("h4").innerText;
            const desc = card.querySelector(".project-desc").innerHTML;
            const proofs = card.querySelector(".preuves").innerHTML;
            const badgesCe = card.querySelector(".badges-ce").innerHTML;
            const tags = card.querySelector(".tags").innerHTML;

            const badgeClass = isOutline ? "badge outline" : "badge";

            // Structuration et sauvegarde du HTML du projet
            currentProjectHTML = `
                <div class="modal-project-header">
                    <h3>${title}</h3>
                    <span class="${badgeClass}">${badge}</span>
                </div>
                <h4 class="modal-project-subtitle">${subtitle}</h4>
                <div class="modal-project-desc">${desc}</div>
                <div class="preuves">${proofs}</div>
                <div class="badges-ce" style="margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">${badgesCe}</div>
                <div class="tags" style="margin-top: 0.5rem; border-top: none; padding-top: 0;">${tags}</div>
            `;
            
            // Injection initiale (Vue Projet)
            modalBody.innerHTML = currentProjectHTML;
            modal.classList.add("active");
            document.body.classList.add("modal-open");
        });
    });

    // ÉCOUTEUR DYNAMIQUE INTERNE AUX CRÉATIONS (Gestion des clics dans le Modal)
    modalBody.addEventListener("click", (e) => {
        // Cas A : Tu cliques sur une image du projet -> Elle passe en plein écran (Vue Image)
        if (e.target.classList.contains("project-img") && !modalContent.classList.contains("modal-image-view")) {
            e.stopPropagation();
            modalContent.classList.add("modal-image-view");
            modalBody.innerHTML = `<img src="${e.target.src}" alt="${e.target.alt}" class="modal-image-focused">`;
        } 
        // Cas B : Tu recliques sur l'image zoomée -> Tu retournes aux détails du projet
        else if (e.target.classList.contains("modal-image-focused")) {
            e.stopPropagation();
            modalContent.classList.remove("modal-image-view");
            modalBody.innerHTML = currentProjectHTML;
        }
    });

    // Fonction de fermeture complète de la Pop-up
    const closeModal = () => {
        modal.classList.remove("active");
        modalContent.classList.remove("modal-image-view");
        document.body.classList.remove("modal-open");
    };

    modalClose.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
            closeModal();
        }
    });
});
