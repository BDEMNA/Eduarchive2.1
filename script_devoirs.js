document.addEventListener("DOMContentLoaded", () => {
    const docName = document.getElementById("docName");
    const docFile = document.getElementById("docFile");
    const addBtn = document.getElementById("addBtn");
    const devoirList = document.getElementById("devoirList");
    const searchInput = document.getElementById("searchInput");

    let devoirs = JSON.parse(localStorage.getItem("devoirs")) || [];
    renderList();

    addBtn.addEventListener("click", () => {
        const name = docName.value.trim();
        const file = docFile.files[0];

        if (!name || !file) {
            alert("Veuillez entrer un nom et sélectionner un fichier PDF.");
            return;
        }

        if (file.type !== "application/pdf") {
            alert("Seuls les fichiers PDF sont autorisés.");
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const dateAjout = new Date().toLocaleString();
            const taille = (file.size / 1024).toFixed(1) + " Ko";

            devoirs.unshift({ // ajout en haut
                name: name,
                fileData: e.target.result,
                date: dateAjout,
                size: taille
            });

            localStorage.setItem("devoirs", JSON.stringify(devoirs));
            renderList();
            docName.value = "";
            docFile.value = "";
        };
        reader.readAsDataURL(file);
    });

    function renderList(filter = "") {
        devoirList.innerHTML = "";
        devoirs
            .filter(d => d.name.toLowerCase().includes(filter.toLowerCase()))
            .forEach((devoir, index) => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <div class="top-line">
                        <strong>${devoir.name}</strong>
                        <small>${devoir.date} - ${devoir.size}</small>
                    </div>
                    <div class="actions">
                        <a href="${devoir.fileData}" download="${devoir.name}.pdf" 
                           class="action-btn download" title="Télécharger">📥</a>
                        <button class="action-btn delete" data-index="${index}" title="Supprimer">🗑</button>
                    </div>
                `;
                devoirList.appendChild(li);
            });

        document.querySelectorAll(".delete").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = e.target.getAttribute("data-index");
                if (confirm("Voulez-vous vraiment supprimer ce devoir ?")) {
                    devoirs.splice(idx, 1);
                    localStorage.setItem("devoirs", JSON.stringify(devoirs));
                    renderList(searchInput.value);
                }
            });
        });
    }

    searchInput.addEventListener("input", () => {
        renderList(searchInput.value);
    });
});
