document.addEventListener("DOMContentLoaded", async () => {
  // --- instant skeleton so the page never looks blank while Firestore loads ---
  const shelf = document.getElementById("hero-shelf");
  const grid = document.getElementById("portfolio-grid");
  shelf.innerHTML = Array.from({ length: 6 })
    .map(() => `<div class="spine spine-skeleton" style="height:${150 + Math.floor(Math.random() * 130)}px"></div>`)
    .join("");
  grid.innerHTML = Array.from({ length: 6 }).map(() => `<div class="card-skeleton"></div>`).join("");
  grid.style.display = "grid";

  const schools = await ZadaData.getAllSchools();
  function approxPlus(n, step = 5) {
  if (n <= 0) return "0";
  const rounded = Math.floor(n / step) * step;
  return rounded > 0 ? `${rounded}+` : `${n}`;
}

  // --- hero stats ---
const totalEditions = schools.reduce(
    (sum, s) => sum + (s.editionCount !== undefined ? s.editionCount : (s.editions || []).length),
    0
  );
  const years = new Set();
  schools.forEach((s) => s.editions.forEach((e) => years.add(e.year)));
  document.getElementById("stat-total").textContent = approxPlus(totalEditions);
  document.getElementById("stat-schools").textContent = schools.length;
  document.getElementById("stat-years").textContent = years.size;
  // --- signature shelf (one spine per school) ---
  shelf.innerHTML = "";
  schools.slice(0, 10).forEach((s) => {
    const pal = ZadaData.palette(s.palette);
    const spine = document.createElement("div");
    spine.className = "spine";
    spine.style.background = pal.base;
    const seed = s.school.length * 13 + s.editions.length * 29;
    spine.style.height = `${150 + (seed % 130)}px`;
    spine.innerHTML = `<span>${s.school}</span>`;
    shelf.appendChild(spine);
  });

  // --- portfolio grid + filters ---
  const empty = document.getElementById("empty-state");
  const resultCount = document.getElementById("result-count");
  const qInput = document.getElementById("q");
  const levelSelect = document.getElementById("f-level");
  const yearSelect = document.getElementById("f-year");
  const themeSelect = document.getElementById("f-theme") || document.getElementById("f-category");

  populateYearFilter(yearSelect, schools);
  if (themeSelect) {
    populateThemeFilter(themeSelect, schools);
  }

  function render() {
    const q = qInput.value.trim().toLowerCase();
    const level = levelSelect.value;
    const year = yearSelect.value;
    const theme = themeSelect ? themeSelect.value.trim().toLowerCase() : "";

    const filtered = schools.filter((s) => {
      const sThemes = typeof ZadaData.getSchoolThemes === "function"
        ? ZadaData.getSchoolThemes(s)
        : (typeof getSchoolThemes === "function" ? getSchoolThemes(s) : []);
      const sThemesLower = sThemes.map((t) => t.toLowerCase());

      // Search query matches school name OR any book themes OR edition summaries / titles
      const matchQ =
        !q ||
        s.school.toLowerCase().includes(q) ||
        sThemesLower.some((t) => t.includes(q)) ||
        (s.editions || []).some((e) => {
          const eThemes = typeof ZadaData.getEditionThemes === "function"
            ? ZadaData.getEditionThemes(e)
            : (typeof getEditionThemes === "function" ? getEditionThemes(e) : []);
          return (
            eThemes.some((t) => t.toLowerCase().includes(q)) ||
            (e.summary && e.summary.toLowerCase().includes(q)) ||
            (e.title && e.title.toLowerCase().includes(q))
          );
        });

      const matchLevel = !level || s.level === level;
      const matchYear = !year || (s.editions || []).some((e) => String(e.year) === year);
      
      // Theme selection filter
      const matchTheme = !theme || sThemesLower.some((t) => t === theme || t.includes(theme));

      return matchQ && matchLevel && matchYear && matchTheme;
    });

    resultCount.innerHTML = `Menampilkan <strong>${filtered.length}</strong> dari <strong>${schools.length}</strong> sekolah &middot; <strong>${approxPlus(totalEditions, 5)}</strong> total edisi buku tahunan`;
    grid.innerHTML = filtered.map(schoolCardHTML).join("");
    empty.style.display = filtered.length ? "none" : "block";
    grid.style.display = filtered.length ? "grid" : "none";
  }

  const filterElements = [qInput, levelSelect, yearSelect, themeSelect].filter(Boolean);
  filterElements.forEach((el) => el.addEventListener("input", render));

  document.getElementById("btn-reset").addEventListener("click", () => {
    qInput.value = "";
    levelSelect.value = "";
    yearSelect.value = "";
    if (themeSelect) themeSelect.value = "";
    render();
  });

  render();
  initCardHoverPopups(grid);
});
