async function api(path, options) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) throw { status: res.status, data };
  return data;
}


// Filtrace
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector('input[placeholder="Vyhledejte..."]');
    const levelSelect = document.getElementById('choose-lvl');
    const cards = document.querySelectorAll('.karta');

    function filterCards() {
        const searchText = searchInput.value.toLowerCase();
        const selectedLvl = levelSelect.value;

        cards.forEach(card => {
            const en = card.dataset.en;
            const cz = card.dataset.cz;
            const lvl = card.dataset.lvl;

            const matchesText = en.includes(searchText) || cz.includes(searchText);
            
            const matchesLvl = selectedLvl === "" || lvl === selectedLvl;

            if (matchesText && matchesLvl) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    }

    if(searchInput && levelSelect) {
        searchInput.addEventListener('input', filterCards);
        levelSelect.addEventListener('change', filterCards);
    }
});



// CREATE (POST /api/users)
const createForm = document.getElementById("createForm");
if (createForm) {
  createForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(createForm);
    const payload = { cz: fd.get("cz"), en: fd.get("en"), lvl: fd.get("lvl") };

    const msg = document.getElementById("createMsg");
    try {
      await api("/api/users", { method: "POST", body: JSON.stringify(payload) });
      window.location.reload();
    } catch (err) {
      msg.textContent = "Chyba: " + JSON.stringify(err.data);
    }
  });
}

// EDIT (PUT /api/users/:id)
const editForm = document.getElementById("editForm");
if (editForm) {
  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = editForm.dataset.id;
    const fd = new FormData(editForm);
    const payload = { cz: fd.get("cz"), en: (fd.get("en")), lvl: (fd.get("lvl")) };

    const msg = document.getElementById("editMsg");
    try {
      await api(`/api/seznam/${id}`, { method: "PUT", body: JSON.stringify(payload) });
      window.location.href = `/seznam/${id}`;
    } catch (err) {
      msg.textContent = "Chyba: " + JSON.stringify(err.data);
    }
  });
}

// DELETE tlačítka (DELETE /api/users/:id)
document.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-delete-id]");
  if (!btn) return;

  const id = btn.dataset.deleteId;

  try {
    await api(`/api/users/${id}`, { method: "DELETE" });
    window.location.href = "/";
  } catch (err) {
    alert("Chyba: " + JSON.stringify(err.data));
  }
});
