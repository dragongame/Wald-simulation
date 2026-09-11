/**
 * Analyse-Screen (Meilenstein M6, Umsetzungsauftrag 2.5, User Stories
 * 3.7/3.8): eigener Vollbild-Screen nach Ende der Live-Simulation, frei
 * kombinierbare Kurven für ALLE Indikatoren (nicht nur die 6
 * Dashboard-Instrumente), kaskadenrelevante Kurven vorausgewählt/optisch
 * hervorgehoben, bis zu 3 Kurven-Kombinationen als Snapshot merkbar.
 *
 * Seit M30 zwei Ansichten: die standardmäßig aktive "vereinfachte" Ansicht
 * nutzt die in M29 im Build-Schritt vorberechnete `projektion` (pro
 * Zeitreihen-Datei `wichtig`/`abweichungen`/`gruppen`) und zeigt nur die
 * höchstens 6 Kurven mit der größten Abweichung vom Jahr-0-Wert (Vereinigung
 * beider Wälder, siehe `ermittleVereinfachteAuswahl()`) plus optisch
 * zurückhaltende Kategorie-Sammelkurven für den Rest; ein Umschalter
 * (`#analyse-vollstaendig-toggle`) wechselt zur bisherigen vollständigen
 * Indikatorenliste. Reine Anzeige-Auswahl im Browser (Set-Vereinigung,
 * Sortierung nach bereits vorberechneten Abweichungswerten) - keine eigene
 * ökologische Berechnung, die bleibt vollständig in model.py/
 * build_simulationen.py (Umsetzungsauftrag 2.11).
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

  // Reduktionsgrad der vereinfachten Ansicht: Nutzer-Entscheidung
  // 2026-09-11 (Milestones-Dokument, M29-M32-Zuschnitt) - harte Obergrenze
  // unabhängig vom Szenario, damit die Kurvenzahl auf dem iPad sicher lesbar
  // bleibt.
  const MAX_EINZELKURVEN_VEREINFACHT = 6;

  let lauf = null;
  let indikatoren = []; // alle 35, in fester Reihenfolge + Farbe/Dash
  let kaskadenrelevant = new Set();
  let ausgewaehlt = new Set();
  let vereinfacht = true;
  let einzelIds = []; // vereinfachte Ansicht: bis zu MAX_EINZELKURVEN_VEREINFACHT ids
  let gruppenAnzeige = []; // vereinfachte Ansicht: Kategorien mit Sammelkurve in beiden Wäldern
  let snapshots = [];
  let wired = false;

  function ermittleKaskadenrelevant(resolved, regler) {
    const set = new Set();
    resolved.events.forEach((e) => (KASKADE_JE_STOERUNG[e.typ] || []).forEach((id) => set.add(id)));
    if (regler !== "beide") {
      KASKADE_WILDVERBISS.forEach((id) => set.add(id));
    }
    if (set.size === 0) {
      set.add("gesamtvitalitaet");
    }
    return set;
  }

  /**
   * Vereinigung der `wichtig`-Mengen beider Wälder (M30), auf die
   * MAX_EINZELKURVEN_VEREINFACHT stärksten begrenzt - "stärkste" per
   * bereits im Build vorberechnetem `abweichungen`-Wert (Maximum aus beiden
   * Wäldern), keine eigene ökologische Berechnung im Browser.
   */
  function ermittleVereinfachteAuswahl(zrA, zrB) {
    const abwA = zrA.projektion.abweichungen;
    const abwB = zrB.projektion.abweichungen;
    const union = new Set([...zrA.projektion.wichtig, ...zrB.projektion.wichtig]);
    const staerke = (id) => Math.max(abwA[id] ?? 0, abwB[id] ?? 0);
    return Array.from(union)
      .sort((a, b) => staerke(b) - staerke(a))
      .slice(0, MAX_EINZELKURVEN_VEREINFACHT);
  }

  /**
   * Schnittmenge (nicht Vereinigung!) der Kategorien, für die BEIDE Wälder
   * eine vorberechnete Sammelkurve haben - Randfall: sind in einem Wald
   * ausnahmsweise alle Mitglieder einer Kategorie einzeln "wichtig", gibt es
   * dort für diese Kategorie keine Sammelkurve mehr. Schnittmenge stellt
   * sicher, dass beide Panels immer dieselben Sammelkurven zeigen können.
   */
  function ermittleGruppenAnzeige(zrA, zrB) {
    const katA = new Set(zrA.projektion.gruppen.map((g) => g.kategorie));
    const katB = new Set(zrB.projektion.gruppen.map((g) => g.kategorie));
    return Array.from(katA).filter((k) => katB.has(k));
  }

  function ausgewaehlteIndikatoren() {
    return indikatoren.filter((ind) => ausgewaehlt.has(ind.id));
  }

  function kurvenFuer(i) {
    const zeitreihe = lauf.zeitreihen[i].zeitreihe;

    if (!vereinfacht) {
      return ausgewaehlteIndikatoren().map((ind) => ({
        werte: WaldsimChart.werteAusZeitreihe(zeitreihe, ind.id),
        farbe: ind.farbe,
        dash: ind.dash,
      }));
    }

    const gruppenKurven = gruppenAnzeige.map((kategorie) => {
      const eintrag = lauf.zeitreihen[i].projektion.gruppen.find((g) => g.kategorie === kategorie);
      const stil = WaldsimChart.gruppenStil();
      return { werte: WaldsimChart.werteAusKurve(eintrag.kurve), farbe: stil.farbe, dash: stil.dash, gruppiert: true };
    });
    const einzelKurven = einzelIds
      .filter((id) => ausgewaehlt.has(id))
      .map((id) => {
        const ind = indikatoren.find((x) => x.id === id);
        return { werte: WaldsimChart.werteAusZeitreihe(zeitreihe, id), farbe: ind.farbe, dash: ind.dash };
      });
    return [...gruppenKurven, ...einzelKurven];
  }

  /** Bezeichnungen + ids in exakt derselben Reihenfolge wie kurvenFuer() liefert - für Snapshot-Legenden. */
  function ausgewaehlteBezeichnungen() {
    if (!vereinfacht) {
      const ind = ausgewaehlteIndikatoren();
      return { ids: ind.map((x) => x.id), namen: ind.map((x) => x.name) };
    }
    const gruppenNamen = gruppenAnzeige.map((k) => `Sammelkurve ${KATEGORIE_LABEL[k] || k}`);
    const gruppenIds = gruppenAnzeige.map((k) => `gruppe:${k}`);
    const einzel = einzelIds.filter((id) => ausgewaehlt.has(id)).map((id) => indikatoren.find((x) => x.id === id));
    return {
      ids: [...gruppenIds, ...einzel.map((ind) => ind.id)],
      namen: [...gruppenNamen, ...einzel.map((ind) => ind.name)],
    };
  }

  function chartSvg(waldName, i) {
    return WaldsimChart.svg(waldName, kurvenFuer(i));
  }

  function renderCharts() {
    document.getElementById("analyse-charts").innerHTML = [0, 1]
      .map((i) => {
        const wt = lauf.waldtypen[i];
        return `
          <article class="analyse-wald-panel">
            <h2>${escapeHtml(wt.kurzname)}</h2>
            ${chartSvg(wt.kurzname, i)}
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
        ${WaldsimChart.legendenChipSvg(ind.farbe, ind.dash)}
        <span class="analyse-indikator-name">${escapeHtml(ind.name)}</span>
        ${relevant ? '<span class="analyse-kaskaden-badge" title="Teil des tatsächlich abgelaufenen Kaskadenpfads">★</span>' : ""}
      </label>
    `;
  }

  function renderVollstaendigHtml() {
    const gruppen = new Map();
    indikatoren.forEach((ind) => {
      if (!gruppen.has(ind.kategorie)) gruppen.set(ind.kategorie, []);
      gruppen.get(ind.kategorie).push(ind);
    });

    return Array.from(gruppen.entries())
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

  function renderVereinfachtHtml() {
    const einzelHtml = einzelIds
      .map((id) => indikatoren.find((ind) => ind.id === id))
      .filter(Boolean)
      .map(indikatorZeileHtml)
      .join("");

    const gruppenLegendeHtml = gruppenAnzeige
      .map((kategorie) => {
        const stil = WaldsimChart.gruppenStil();
        return `
          <li class="analyse-gruppen-legende-zeile">
            ${WaldsimChart.legendenChipSvg(stil.farbe, stil.dash)}
            <span>Sammelkurve „${escapeHtml(KATEGORIE_LABEL[kategorie] || kategorie)}“ (Durchschnitt der übrigen Indikatoren dieser Kategorie)</span>
          </li>
        `;
      })
      .join("");

    return `
      <div class="analyse-indikator-gruppe">
        <h3>Stärkste Einzelkurven</h3>
        ${einzelHtml || '<p class="form-hint">Keine einzeln hervorgehobene Kurve in diesem Lauf.</p>'}
      </div>
      <div class="analyse-indikator-gruppe">
        <h3>Kategorie-Sammelkurven</h3>
        <ul class="analyse-gruppen-legende">
          ${gruppenLegendeHtml || '<li class="form-hint">Keine weiteren Kategorien in diesem Lauf.</li>'}
        </ul>
      </div>
    `;
  }

  function renderIndikatorenListe() {
    document.getElementById("analyse-indikatoren-liste").innerHTML = vereinfacht
      ? renderVereinfachtHtml()
      : renderVollstaendigHtml();
    document.getElementById("analyse-modus-hinweis").textContent = vereinfacht
      ? "Vereinfachte Ansicht: die stärksten Veränderungen einzeln, alles andere als Kategorie-Sammelkurve."
      : "Vollständige Liste: Kaskadenrelevante Kurven (★) sind vorausgewählt – frei weitere dazu- oder abwählen.";
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
    button.disabled = snapshots.length >= MAX_SNAPSHOTS || ausgewaehlteBezeichnungen().namen.length === 0;
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
      const { ids, namen } = ausgewaehlteBezeichnungen();
      if (snapshots.length >= MAX_SNAPSHOTS || namen.length === 0) return;
      snapshots.push({
        indikatorIds: ids,
        namen,
        // Kurvendaten direkt mitgespeichert (nicht nur die IDs), damit M16
        // (Forscherheft) den Snapshot später ohne Zugriff auf die
        // Original-Zeitreihe als tatsächliche Kurvengrafik nachbauen kann.
        kurven: [0, 1].map((i) => kurvenFuer(i)),
      });
      renderSnapshots();
    });

    document.getElementById("analyse-snapshots").addEventListener("click", (event) => {
      const button = event.target.closest(".analyse-snapshot-entfernen");
      if (!button) return;
      snapshots.splice(Number(button.dataset.index), 1);
      renderSnapshots();
    });

    document.getElementById("analyse-vollstaendig-toggle").addEventListener("change", (event) => {
      vereinfacht = !event.target.checked;
      ausgewaehlt = new Set(vereinfacht ? einzelIds : kaskadenrelevant);
      renderIndikatorenListe();
      renderCharts();
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
    indikatoren = data.indikatoren.map((ind) => ({
      ...ind,
      farbe: WaldsimChart.farbeFuer(ind.id),
      dash: WaldsimChart.linienstilFuer(ind.id),
    }));
    kaskadenrelevant = ermittleKaskadenrelevant(lauf.resolved, lauf.regler);
    vereinfacht = true;
    einzelIds = ermittleVereinfachteAuswahl(lauf.zeitreihen[0], lauf.zeitreihen[1]);
    gruppenAnzeige = ermittleGruppenAnzeige(lauf.zeitreihen[0], lauf.zeitreihen[1]);
    ausgewaehlt = new Set(einzelIds);
    snapshots = [];
    document.getElementById("analyse-vollstaendig-toggle").checked = false;

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
