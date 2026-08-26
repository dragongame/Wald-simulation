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

  const JAHRE_GESAMT = 20;
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
    "verjuengung_mischbaumarten", "wilddichte", "eiche_vitalitaet", "biodiversitaet",
    "eichelhaeher_indikator", "eichhoernchen_indikator",
  ];

  // Feste Farb-/Strichzuordnung je Indikator (Reihenfolge aus
  // data/indikatoren.json), damit Legende und beide Wald-Diagramme
  // konsistent bleiben. Signalrot bleibt bewusst ausgespart (laut
  // Styleguide reserviert für den Fichtenmonokultur-Kollaps im Dashboard).
  const INDIKATOR_FARBEN = {
    gesamtvitalitaet: "#4C6E4A",
    borkenkaefer_dichte: "#B5651D",
    totholzmenge: "#6B4A34",
    kronendach: "#6E9B6B",
    bodenfeuchte: "#5C7A8A",
    biodiversitaet: "#6E5A63",
    fichte_vitalitaet: "#2F5233",
    buche_vitalitaet: "#A67C3D",
    eiche_vitalitaet: "#7A8B3F",
    kiefer_vitalitaet: "#C08A4E",
    birke_anteil: "#B79A6B",
    verjuengung_mischbaumarten: "#3D6B4F",
    wilddichte: "#8C6349",
    brandrisiko: "#A8522E",
    // Erweiterung um bislang nur im Lexikon/Netzwerk-Graph vorhandene Arten
    // (siehe docs/Wissensbasis_Erweiterung_weitere_Arten.md) - Paletten an
    // Kategorie angelehnt: Sträucher bräunlich-grün, Pilze dunkel-holzig,
    // Kräuter grasgrün, Prädatoren erdig-warm.
    hasel_anteil: "#8A9B5E",
    holunder_anteil: "#6F7D3F",
    brombeere_anteil: "#7C4A5E",
    zunderschwamm_indikator: "#5A4433",
    blaeuepilz_indikator: "#4A5F7A",
    hallimasch_indikator: "#8B5A2B",
    brennnessel_indikator: "#4F7A3D",
    eichelhaeher_indikator: "#5E7A9B",
    buntspecht_indikator: "#8B4A3A",
    ameisenbuntkaefer_indikator: "#9B6B2E",
    buschwindroeschen_indikator: "#7FA0C4",
    waldmeister_indikator: "#3F8B5C",
    heidelbeere_indikator: "#5C4B8A",
    eichhoernchen_indikator: "#C06B2E",
    raupen_indikator: "#7A8B3F",
    blattlaeuse_indikator: "#8FA85E",
    habicht_indikator: "#6B5A4A",
    sperber_indikator: "#8A7A6A",
    kleinsaeuger_indikator: "#9B8A6B",
    fuchs_indikator: "#C1732E",
  };
  const DASH_MUSTER = ["", "6 3", "2 3", "8 2 2 2"];

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
  let indikatoren = []; // alle 34, in fester Reihenfolge + Farbe/Dash
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

  function punktePfad(zeitreihe, indikatorId) {
    const punkte = [];
    for (let jahr = 0; jahr <= JAHRE_GESAMT; jahr++) {
      const x = 30 + (jahr / JAHRE_GESAMT) * 280;
      const wert = zeitreihe[`jahr_${jahr}`][indikatorId] ?? 0;
      const y = 150 - (wert / 100) * 140;
      punkte.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return punkte.join(" ");
  }

  function chartSvg(waldName, zeitreihe) {
    const gitter = [0, 25, 50, 75, 100]
      .map((v) => {
        const y = 150 - (v / 100) * 140;
        return `<line x1="30" y1="${y}" x2="310" y2="${y}" class="analyse-gitter"/><text x="26" y="${y + 3}" class="analyse-achsentext" text-anchor="end">${v}</text>`;
      })
      .join("");
    const xAchse = [0, 5, 10, 15, 20]
      .map((jahr) => {
        const x = 30 + (jahr / JAHRE_GESAMT) * 280;
        return `<text x="${x}" y="168" class="analyse-achsentext" text-anchor="middle">${jahr}</text>`;
      })
      .join("");
    const linien = indikatoren
      .filter((ind) => ausgewaehlt.has(ind.id))
      .map(
        (ind, idx) =>
          `<polyline points="${punktePfad(zeitreihe, ind.id)}" class="analyse-linie" style="stroke:${ind.farbe}" stroke-dasharray="${DASH_MUSTER[idx % DASH_MUSTER.length]}"/>`
      )
      .join("");

    return `
      <svg viewBox="0 0 320 180" class="analyse-chart" role="img" aria-label="Kurvendiagramm ${escapeHtml(waldName)}, Jahr 0 bis 20, Skala 0 bis 100">
        ${gitter}${xAchse}${linien}
      </svg>
    `;
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
      const namen = indikatoren.filter((ind) => ausgewaehlt.has(ind.id)).map((ind) => ind.name);
      snapshots.push({ indikatorIds: Array.from(ausgewaehlt), namen });
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
    indikatoren = data.indikatoren.map((ind) => ({ ...ind, farbe: INDIKATOR_FARBEN[ind.id] || "#888888" }));
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
