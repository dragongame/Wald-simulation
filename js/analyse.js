/**
 * Analyse-Screen (Meilenstein M6, Umsetzungsauftrag 2.5, User Stories
 * 3.7/3.8): eigener Vollbild-Screen nach Ende der Live-Simulation, frei
 * kombinierbare Kurven für ALLE Indikatoren (nicht nur die 6
 * Dashboard-Instrumente), kaskadenrelevante Kurven vorausgewählt/optisch
 * hervorgehoben, bis zu 3 Kurven-Kombinationen als Snapshot merkbar.
 *
 * „Weiter zur Reflexion" übergibt den Lauf inkl. gemerkter Snapshots an
 * WaldsimForscherheft (M7), die daraus die gemeinsame Reflexionsfrage
 * einholt und die Seite dauerhaft im Forscherheft speichert.
 */
const WaldsimAnalyse = (() => {
  const { escapeHtml, showScreen } = WaldsimUI;

  const MAX_SNAPSHOTS = 3;

  // Kaskadenrelevante Indikatoren je Störung/Regler - kuratierte Zuordnung
  // (nicht 1:1 aus relevante_knoten ableitbar, da viele Knoten wie
  // Buntspecht/Hallimasch keinen eigenen numerischen Indikator haben,
  // siehe Milestones-Dokument M6-Umsetzungsentscheidung).
  const KASKADE_JE_STOERUNG = {
    borkenkaefer: [
      "fichte_vitalitaet", "borkenkaefer_dichte", "totholzmenge", "gesamtvitalitaet",
      "blaeuepilz_indikator", "buntspecht_indikator", "ameisenbuntkaefer_indikator",
    ],
    trockenheit: [
      "bodenfeuchte", "fichte_vitalitaet", "borkenkaefer_dichte", "gesamtvitalitaet",
      "hallimasch_indikator", "blattlaeuse_indikator",
    ],
    temperatur: ["borkenkaefer_dichte", "fichte_vitalitaet", "gesamtvitalitaet"],
    sturm: [
      "fichte_vitalitaet", "birke_anteil", "totholzmenge", "borkenkaefer_dichte",
      "hasel_anteil", "holunder_anteil", "brombeere_anteil", "eichelhaeher_indikator",
    ],
    totholzentnahme: [
      "totholzmenge", "biodiversitaet", "brandrisiko",
      "hallimasch_indikator", "zunderschwamm_indikator", "buntspecht_indikator", "ameisenbuntkaefer_indikator",
    ],
  };
  const KASKADE_WILDVERBISS = [
    "verjuengung_mischbaumarten", "reh_dichte", "rothirsch_dichte", "eiche_vitalitaet", "biodiversitaet",
    "eichelhaeher_indikator", "eichhoernchen_indikator",
  ];

  const KATEGORIE_LABEL = {
    baumbestand: "Baumbestand",
    schaedling: "Schädling",
    struktur: "Struktur",
    abiotisch: "Abiotisch",
    biodiversitaet: "Biodiversität",
    wildverbiss: "Wildverbiss",
    szenario5: "Totholzentnahme",
    strauch: "Sträucher",
    pilz: "Pilze",
    kraut: "Krautschicht",
    verbreiter: "Samenverbreiter",
    herbivor: "Pflanzenfresser",
    praedator: "Prädatoren",
    kleinsaeuger: "Sonstige Tiergruppen",
  };

  let lauf = null;
  let indikatoren = []; // alle 35, in fester Reihenfolge + Farbe/Dash
  let kaskadenrelevant = new Set();
  let ausgewaehlt = new Set();
  let snapshots = [];
  let wired = false;

  function ermittleKaskadenrelevant(resolved, regler) {
    const set = new Set();
    resolved.events.forEach((e) => (KASKADE_JE_STOERUNG[e.typ] || []).forEach((id) => set.add(id)));
    if (regler !== "niedrig") {
      KASKADE_WILDVERBISS.forEach((id) => set.add(id));
    }
    if (set.size === 0) {
      set.add("gesamtvitalitaet");
    }
    return set;
  }

  function ausgewaehlteIndikatoren() {
    return indikatoren.filter((ind) => ausgewaehlt.has(ind.id));
  }

  function kurvenFuer(zeitreihe) {
    return ausgewaehlteIndikatoren().map((ind, idx) => ({
      werte: WaldsimChart.werteAusZeitreihe(zeitreihe, ind.id),
      farbe: ind.farbe,
      dash: WaldsimChart.DASH_MUSTER[idx % WaldsimChart.DASH_MUSTER.length],
    }));
  }

  function chartSvg(waldName, zeitreihe) {
    return WaldsimChart.svg(waldName, kurvenFuer(zeitreihe));
  }

  function renderCharts() {
    document.getElementById("analyse-charts").innerHTML = [0, 1]
      .map((i) => {
        const wt = lauf.waldtypen[i];
        return `
          <article class="analyse-wald-panel">
            <h2>${escapeHtml(wt.kurzname)}</h2>
            ${chartSvg(wt.kurzname, lauf.zeitreihen[i].zeitreihe)}
          </article>
        `;
      })
      .join("");
  }

  function indikatorZeileHtml(ind) {
    const relevant = kaskadenrelevant.has(ind.id);
    return `
      <label class="analyse-indikator-zeile ${relevant ? "ist-kaskadenrelevant" : ""}">
        <input type="checkbox" value="${ind.id}" ${ausgewaehlt.has(ind.id) ? "checked" : ""}>
        <span class="analyse-farb-chip" style="background:${ind.farbe}"></span>
        <span class="analyse-indikator-name">${escapeHtml(ind.name)}</span>
        ${relevant ? '<span class="analyse-kaskaden-badge" title="Teil des tatsächlich abgelaufenen Kaskadenpfads">★</span>' : ""}
      </label>
    `;
  }

  function renderIndikatorenListe() {
    const gruppen = new Map();
    indikatoren.forEach((ind) => {
      if (!gruppen.has(ind.kategorie)) gruppen.set(ind.kategorie, []);
      gruppen.get(ind.kategorie).push(ind);
    });

    document.getElementById("analyse-indikatoren-liste").innerHTML = Array.from(gruppen.entries())
      .map(
        ([kategorie, items]) => `
        <div class="analyse-indikator-gruppe">
          <h3>${KATEGORIE_LABEL[kategorie] || kategorie}</h3>
          ${items.map(indikatorZeileHtml).join("")}
        </div>
      `
      )
      .join("");
  }

  function renderSnapshots() {
    const liste = document.getElementById("analyse-snapshots");
    liste.innerHTML = snapshots
      .map(
        (snap, idx) => `
        <li class="analyse-snapshot">
          <span>${snap.namen.map(escapeHtml).join(", ")}</span>
          <button type="button" class="analyse-snapshot-entfernen" data-index="${idx}" aria-label="Snapshot entfernen">×</button>
        </li>
      `
      )
      .join("");

    const button = document.getElementById("analyse-snapshot-button");
    button.disabled = snapshots.length >= MAX_SNAPSHOTS || ausgewaehlt.size === 0;
    document.getElementById("analyse-snapshot-hinweis").textContent =
      snapshots.length >= MAX_SNAPSHOTS ? `Maximal ${MAX_SNAPSHOTS} Snapshots erreicht.` : "";
  }

  function wireEvents() {
    if (wired) return;
    wired = true;

    document.getElementById("analyse-indikatoren-liste").addEventListener("change", (event) => {
      if (!event.target.matches('input[type="checkbox"]')) return;
      const id = event.target.value;
      if (event.target.checked) {
        ausgewaehlt.add(id);
      } else {
        ausgewaehlt.delete(id);
      }
      renderCharts();
      renderSnapshots();
    });

    document.getElementById("analyse-snapshot-button").addEventListener("click", () => {
      if (snapshots.length >= MAX_SNAPSHOTS || ausgewaehlt.size === 0) return;
      const ausgewaehlt_ = ausgewaehlteIndikatoren();
      snapshots.push({
        indikatorIds: ausgewaehlt_.map((ind) => ind.id),
        namen: ausgewaehlt_.map((ind) => ind.name),
        // Kurvendaten direkt mitgespeichert (nicht nur die IDs), damit M16
        // (Forscherheft) den Snapshot später ohne Zugriff auf die
        // Original-Zeitreihe als tatsächliche Kurvengrafik nachbauen kann.
        kurven: [0, 1].map((i) => kurvenFuer(lauf.zeitreihen[i].zeitreihe)),
      });
      renderSnapshots();
    });

    document.getElementById("analyse-snapshots").addEventListener("click", (event) => {
      const button = event.target.closest(".analyse-snapshot-entfernen");
      if (!button) return;
      snapshots.splice(Number(button.dataset.index), 1);
      renderSnapshots();
    });

    document.getElementById("analyse-back-button").addEventListener("click", () => {
      showScreen("screen-dashboard");
    });

    document.getElementById("analyse-weiter-button").addEventListener("click", () => {
      WaldsimForscherheft.starteReflexion({ ...lauf, snapshots });
    });
  }

  function stoerungName(data, id) {
    const eintrag = data.stoerungen.ereignis_stoerungen.find((s) => s.id === id);
    return eintrag ? eintrag.name : id;
  }

  /**
   * @param {{waldtypen: object[], hypothesen: string[], resolved: object, regler: string, zeitreihen: object[]}} neuerLauf
   */
  async function start(neuerLauf) {
    const data = await WaldsimData.load();

    lauf = neuerLauf;
    indikatoren = data.indikatoren.map((ind) => ({ ...ind, farbe: WaldsimChart.farbeFuer(ind.id) }));
    kaskadenrelevant = ermittleKaskadenrelevant(lauf.resolved, lauf.regler);
    ausgewaehlt = new Set(kaskadenrelevant);
    snapshots = [];

    const ereignisText =
      lauf.resolved.events.length === 0
        ? "keine Ereignis-Störung"
        : lauf.resolved.events.map((e) => `${stoerungName(data, e.typ)} (Jahr ${e.trigger_jahr})`).join(" + ");
    document.getElementById("analyse-subtitle").textContent = `${ereignisText} · Wildverbiss-Regler: ${WaldsimUI.kapitalisiere(lauf.regler)}`;

    renderIndikatorenListe();
    renderCharts();
    renderSnapshots();
    wireEvents();

    showScreen("screen-analyse");
  }

  return { start };
})();
