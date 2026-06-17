document.addEventListener("DOMContentLoaded", () => {
	// --- PARTIE 1 : ANIMATION DE DEFILEMENT (SCROLL REVEAL) ---
	const reveals = document.querySelectorAll(".reveal");

	const observerOptions = {
		root: null,
		rootMargin: "0px",
		threshold: 0.1
	};

	const revealObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add("active");
				observer.unobserve(entry.target);
			}
		});
	}, observerOptions);

	reveals.forEach((reveal) => {
		revealObserver.observe(reveal);
	});

	// --- PARTIE 2 : FILTRAGE DYNAMIQUE INTERACTIF (CE -> PROJETS) ---
	const ceCards = document.querySelectorAll(".ce-card:not(.disabled)");
	const projectCards = document.querySelectorAll(".project-card");
	const resetBtn = document.getElementById("reset-filter-btn");
	const voisinsSection = document.getElementById("projets");

	ceCards.forEach((card) => {
		card.addEventListener("click", (e) => {
			e.stopPropagation(); // Évite le déclenchement de la pop-up au clic sur le bouton de tri

			const selectedCE = card.getAttribute("data-target-ce");

			projectCards.forEach((project) => {
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
		projectCards.forEach((project) => {
			project.classList.remove("fade-out");
			project.classList.remove("highlight-target");
		});
		resetBtn.classList.add("hidden");
	});

	// --- PARTIE 4 : OUVERTURE ET AFFICHAGE EN FOCUS (MODAL POP-UP) ---
	const modal = document.getElementById("project-modal");
	const modalBody = document.getElementById("modal-body");
	const modalClose = document.querySelector(".modal-close");

	projectCards.forEach((card) => {
		card.addEventListener("click", () => {
			const title = card.querySelector("h3").innerText;
			const badge = card.querySelector(".badge").innerText;
			const isOutline = card.querySelector(".badge").classList.contains("outline");
			const subtitle = card.querySelector("h4").innerText;
			const desc = card.querySelector(".project-desc").innerHTML;
			const proofs = card.querySelector(".preuves").innerHTML;
			const badgesCe = card.querySelector(".badges-ce").innerHTML;
			const tags = card.querySelector(".tags").innerHTML;

			const badgeClass = isOutline ? "badge outline" : "badge";

			modalBody.innerHTML = `
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

			modal.classList.add("active");
			document.body.classList.add("modal-open");
		});
	});

	const closeModal = () => {
		modal.classList.remove("active");
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
