/**
 * Live-Dashboard (Meilenstein M5, Umsetzungsauftrag 3.3, Styleguide
 * Abschnitt 6): Zeitsteuerung (Play/Pause/Einzelschritt/Zeitachse 0-20
 * Jahre) über die vorab berechnete Zeitreihe, Feldmessinstrumente-Optik für
 * die 6 Dashboard-Indikatoren, Art-Sprites mit Zustandswechsel per
 * Crossfade, zwei Wald-Plätze nebeneinander im Vergleich.
 *
 * Bei Jahr 20 führt ein Button im Abschluss-Hinweis zum Analyse-Screen
 * (WaldsimAnalyse, M6). Die Reflexionsfrage/das Forscherheft (M7,
 * Umsetzungsauftrag 2.4) sind bewusst noch nicht Teil dieses Ablaufs.
 */
const WaldsimDashboard = (() => {
  const { escapeHtml, kapitalisiere, showScreen } = WaldsimUI;

  const JAHRE_GESAMT = 20;
  const TICK_MS = 900;

  // Zustands-Sprites sind absteigend nach "min" sortiert (siehe Styleguide
  // Abschnitt 4). Buche/Kiefer/Eiche/Birke haben laut Umsetzungsauftrag 2.9
  // bewusst weniger Zustandsvarianten als Fichte (Asset-Abdeckung).
  const ARTEN = [
    {
      id: "fichte",
      indikator: "fichte_vitalitaet",
      name: "Fichte",
      emoji: "🌲",
      zustaende: [
        { min: 70, src: "fichte_gesund.png" },
        { min: 40, src: "fichte_gestresst.png" },
        { min: 15, src: "fichte_befallen.png" },
        { min: 0, src: "fichte_abgestorben.png" },
      ],
    },
    {
      id: "buche",
      indikator: "buche_vitalitaet",
      name: "Buche",
      emoji: "🌳",
      zustaende: [
        { min: 60, src: "buche_gesund.png" },
        { min: 0, src: "buche_gestresst.png" },
      ],
    },
    {
      id: "kiefer",
      indikator: "kiefer_vitalitaet",
      name: "Kiefer",
      emoji: "🌲",
      zustaende: [
        { min: 60, src: "kiefer_gesund.png" },
        { min: 0, src: "kiefer_gestresst.png" },
      ],
    },
    { id: "eiche", indikator: "eiche_vitalitaet", name: "Eiche", emoji: "🌳", zustaende: [{ min: 0, src: "eiche_gesund.png" }] },
    { id: "birke", indikator: "birke_anteil", name: "Birke (Pionier)", emoji: "🌳", zustaende: [{ min: 0, src: "birke_pionier.png" }] },
  ];

  const BORKENKAEFER_ART = {
    name: "Borkenkäfer",
    zustaende: [
      { min: 50, src: "borkenkaefer_massenvermehrung.png" },
      { min: 0, src: "borkenkaefer_einzeln.png" },
    ],
  };

  // Meilenstein M12: Dashboard-Kacheln für die 20 Arten-Indikatoren aus der
  // Analyse-Erweiterung (siehe Milestones-Dokument, Erweiterung 2026-08-26),
  // die bis hierhin nur als Kurve im Analyse-Screen wählbar waren. Jede Art
  // hat laut data/nodes.json genau eine Sprite-Zustandsvariante
  // ("portrait", kein Crossfade über Schwellenwerte wie bei der Fichte).
  // kleinsaeuger_indikator bleibt bewusst ausgenommen: rein strukturelle
  // Hilfsgröße ohne eigenen Lexikon-Knoten/Sprite (siehe indikatoren.json).
  const WEITERE_ARTEN = [
    { id: "hasel", indikator: "hasel_anteil", name: "Hasel", kategorie: "strauch" },
    { id: "holunder", indikator: "holunder_anteil", name: "Schwarzer Holunder", kategorie: "strauch" },
    { id: "brombeere", indikator: "brombeere_anteil", name: "Brombeere", kategorie: "strauch" },
    { id: "zunderschwamm", indikator: "zunderschwamm_indikator", name: "Zunderschwamm", kategorie: "pilz" },
    { id: "blaeuepilz", indikator: "blaeuepilz_indikator", name: "Bläuepilz", kategorie: "pilz" },
    { id: "hallimasch", indikator: "hallimasch_indikator", name: "Hallimasch", kategorie: "pilz" },
    { id: "brennnessel", indikator: "brennnessel_indikator", name: "Brennnessel", kategorie: "kraut" },
    { id: "buschwindroeschen", indikator: "buschwindroeschen_indikator", name: "Buschwindröschen", kategorie: "kraut" },
    { id: "waldmeister", indikator: "waldmeister_indikator", name: "Waldmeister", kategorie: "kraut" },
    { id: "heidelbeere", indikator: "heidelbeere_indikator", name: "Heidelbeere", kategorie: "kraut" },
    { id: "eichelhaeher", indikator: "eichelhaeher_indikator", name: "Eichelhäher", kategorie: "verbreiter" },
    { id: "eichhoernchen", indikator: "eichhoernchen_indikator", name: "Eichhörnchen", kategorie: "herbivor" },
    { id: "raupen", indikator: "raupen_indikator", name: "Schmetterlingsraupen", kategorie: "herbivor" },
    { id: "blattlaeuse", indikator: "blattlaeuse_indikator", name: "Blattläuse", kategorie: "herbivor" },
    { id: "buntspecht", indikator: "buntspecht_indikator", name: "Buntspecht", kategorie: "praedator" },
    { id: "ameisenbuntkaefer", indikator: "ameisenbuntkaefer_indikator", name: "Ameisenbuntkäfer", kategorie: "praedator" },
    { id: "habicht", indikator: "habicht_indikator", name: "Habicht", kategorie: "praedator" },
    { id: "sperber", indikator: "sperber_indikator", name: "Sperber", kategorie: "praedator" },
    { id: "fuchs", indikator: "fuchs_indikator", name: "Fuchs", kategorie: "praedator" },
  ].map((art) => ({ ...art, zustaende: [{ min: 0, src: `${art.id}_portrait.png` }] }));

  // Gleiche Kategorie-Label/Emoji-Konvention wie js/lexikon.js und
  // js/graph.js (dort jeweils eigene, screen-lokale Konstante statt
  // geteiltem Modul - hier fortgeführt).
  const WEITERE_ARTEN_KATEGORIE_LABEL = {
    strauch: "Sträucher",
    pilz: "Pilze",
    kraut: "Krautschicht",
    verbreiter: "Samenverbreiter",
    herbivor: "Pflanzenfresser",
    praedator: "Prädatoren",
  };
  const WEITERE_ARTEN_KATEGORIE_EMOJI = {
    strauch: "🌿",
    pilz: "🍄",
    kraut: "🌾",
    verbreiter: "🐦",
    herbivor: "🦌",
    praedator: "🦊",
  };
  const WEITERE_ARTEN_KATEGORIE_REIHENFOLGE = ["strauch", "pilz", "kraut", "verbreiter", "herbivor", "praedator"];

  const INSTRUMENTE_META = [
    { id: "gesamtvitalitaet", farbrolle: "moos", richtung: "hochGut", icon: "baum" },
    { id: "borkenkaefer_dichte", farbrolle: "bernstein", richtung: "hochWarnung", icon: "kaefer" },
    { id: "totholzmenge", farbrolle: "rindenbraun", richtung: "neutral", icon: "totholz" },
    { id: "kronendach", farbrolle: "moos", richtung: "hochGut", icon: "krone" },
    { id: "bodenfeuchte", farbrolle: "himmelblau", richtung: "hochGut", icon: "regen" },
    { id: "biodiversitaet", farbrolle: "moos", richtung: "hochGut", icon: "vielfalt" },
  ];

  let lauf = null; // { waldtypen, hypothesen, resolved, regler, zeitreihen, artenRelevant, instrumente }
  let aktuellesJahr = 0;
  let timerId = null;
  let wired = false;

  function bucket(value) {
    if (value < 34) return "niedrig";
    if (value < 67) return "mittel";
    return "hoch";
  }

  function instrumentFarbe(meta, value) {
    if (meta.richtung === "neutral") return "neutral";
    if (meta.richtung === "hochWarnung") return value > 0 ? "warnung" : "neutral";
    if (value < 15) return "kollaps";
    if (value < 34) return "warnung";
    return "gut";
  }

  function zustandFuer(art, value) {
    return art.zustaende.find((z) => value >= z.min) || art.zustaende[art.zustaende.length - 1];
  }

  function ermittleRelevanteArten(zeitreihe, artenListe = ARTEN) {
    return artenListe.filter((art) => Object.keys(zeitreihe).some((jahrKey) => (zeitreihe[jahrKey][art.indikator] || 0) > 0));
  }

  function gruppiereWeitereArten(artenRelevant) {
    return WEITERE_ARTEN_KATEGORIE_REIHENFOLGE.map((kategorie) => ({
      kategorie,
      label: WEITERE_ARTEN_KATEGORIE_LABEL[kategorie],
      arten: artenRelevant.filter((art) => art.kategorie === kategorie),
    })).filter((gruppe) => gruppe.arten.length > 0);
  }

  function stoerungName(data, id) {
    const eintrag = data.stoerungen.ereignis_stoerungen.find((s) => s.id === id);
    return eintrag ? eintrag.name : id;
  }

  function beschreibeEreignisse(data, resolved) {
    if (resolved.events.length === 0) {
      return "keine Ereignis-Störung";
    }
    return resolved.events.map((e) => `${stoerungName(data, e.typ)} (Jahr ${e.trigger_jahr})`).join(" + ");
  }

  function speciesSpriteHtml(id, name, emoji, klein) {
    return `
      <div class="art-sprite${klein ? " art-sprite--klein" : ""}" id="${id}">
        <div class="sprite-frame sprite-1-1">
          <img class="art-sprite-layer" alt="">
          <img class="art-sprite-layer" alt="">
          <span class="sprite-fallback">
            <span class="sprite-fallback-emoji" aria-hidden="true">${emoji}</span>
            <span class="sprite-fallback-text">${escapeHtml(name)}</span>
          </span>
        </div>
        <span class="art-sprite-name">${escapeHtml(name)}</span>
      </div>
    `;
  }

  function weitereArtenHtml(i, weitereArtenRelevant) {
    if (weitereArtenRelevant.length === 0) return "";
    const gruppen = gruppiereWeitereArten(weitereArtenRelevant);
    const gruppenHtml = gruppen
      .map((gruppe) => {
        const kachelnHtml = gruppe.arten
          .map((art) => speciesSpriteHtml(`w${i}-weitere-${art.id}`, art.name, WEITERE_ARTEN_KATEGORIE_EMOJI[gruppe.kategorie], true))
          .join("");
        return `
          <div class="weitere-arten-gruppe">
            <h3>${escapeHtml(gruppe.label)}</h3>
            <div class="art-reihe art-reihe--klein">${kachelnHtml}</div>
          </div>
        `;
      })
      .join("");
    return `
      <details class="weitere-arten-details">
        <summary>Weitere Arten anzeigen (${weitereArtenRelevant.length})</summary>
        <div class="weitere-arten-inhalt">${gruppenHtml}</div>
      </details>
    `;
  }

  function instrumentHtml(id, meta, label) {
    return `
      <div id="${id}" class="instrument instrument--neutral">
        <div class="instrument-icon instrument-icon--${meta.farbrolle}">${WaldsimIcons.svg(meta.icon)}</div>
        <div class="instrument-info">
          <span class="instrument-label">${escapeHtml(label)}</span>
          <div class="instrument-skala"><div class="instrument-skala-fill"></div></div>
          <span class="instrument-wert"></span>
        </div>
      </div>
    `;
  }

  function waldPanelHtml(i, wt, hypothese, artenRelevant, instrumente, weitereArtenRelevant) {
    const artenHtml = artenRelevant.map((art) => speciesSpriteHtml(`w${i}-art-${art.id}`, art.name, art.emoji)).join("");
    const kaeferHtml = speciesSpriteHtml(`w${i}-borkenkaefer`, "Borkenkäfer", "🐛");
    const totholzHtml = speciesSpriteHtml(`w${i}-totholz`, "Totholz", "🪵");
    const instrumenteHtml = instrumente.map((inst) => instrumentHtml(`w${i}-instrument-${inst.id}`, inst, inst.label)).join("");

    return `
      <article class="wald-panel">
        <h2>${escapeHtml(wt.kurzname)}</h2>
        <p class="hypothese-recap"><strong>Hypothese:</strong> ${hypothese ? escapeHtml(hypothese) : "(keine angegeben)"}</p>
        <div class="art-reihe">${artenHtml}${kaeferHtml}${totholzHtml}</div>
        <div class="instrumente-grid">${instrumenteHtml}</div>
        ${weitereArtenHtml(i, weitereArtenRelevant)}
      </article>
    `;
  }

  function updateSpeciesSprite(container, relSrc, altText) {
    if (!container) return;
    const layers = container.querySelectorAll(".art-sprite-layer");
    const active = container.querySelector(".art-sprite-layer.is-active");
    if (active && active.dataset.src === relSrc) {
      active.alt = altText;
      return;
    }
    const inactive = Array.from(layers).find((l) => l !== active) || layers[0];
    inactive.src = `./assets/sprites/${relSrc}`;
    inactive.alt = altText;
    inactive.dataset.src = relSrc;
    requestAnimationFrame(() => {
      inactive.classList.add("is-active");
      if (active) active.classList.remove("is-active");
    });
  }

  function updateArtenListe(i, zr, artenListe, idPraefix) {
    artenListe.forEach((art) => {
      const value = zr[art.indikator] || 0;
      const zustand = zustandFuer(art, value);
      const container = document.getElementById(`w${i}-${idPraefix}-${art.id}`);
      updateSpeciesSprite(container, zustand.src, `${art.name}: ${bucket(value)}`);
      if (container) container.style.opacity = value > 0 ? "1" : "0.18";
    });
  }

  function updateArtenFuerWald(i, zr, artenRelevant, weitereArtenRelevant) {
    updateArtenListe(i, zr, artenRelevant, "art");
    updateArtenListe(i, zr, weitereArtenRelevant, "weitere");

    const dichte = zr.borkenkaefer_dichte || 0;
    const kaeferContainer = document.getElementById(`w${i}-borkenkaefer`);
    updateSpeciesSprite(kaeferContainer, zustandFuer(BORKENKAEFER_ART, dichte).src, `Borkenkäfer: ${bucket(dichte)}`);
    if (kaeferContainer) kaeferContainer.style.opacity = dichte > 0.5 ? "1" : "0.12";

    const totholzContainer = document.getElementById(`w${i}-totholz`);
    updateSpeciesSprite(totholzContainer, "totholz_generisch.png", `Totholz: ${bucket(zr.totholzmenge || 0)}`);
    if (totholzContainer) totholzContainer.style.opacity = String(Math.min(1, 0.25 + ((zr.totholzmenge || 0) / 100) * 0.75));
  }

  function updateInstrumenteFuerWald(i, zr, instrumente) {
    instrumente.forEach((meta) => {
      const value = zr[meta.id] ?? 0;
      const farbe = instrumentFarbe(meta, value);
      const el = document.getElementById(`w${i}-instrument-${meta.id}`);
      if (!el) return;
      el.classList.remove("instrument--gut", "instrument--warnung", "instrument--kollaps", "instrument--neutral");
      el.classList.add(`instrument--${farbe}`);
      const fill = el.querySelector(".instrument-skala-fill");
      if (fill) fill.style.width = `${Math.max(2, Math.round(value))}%`;
      const wertEl = el.querySelector(".instrument-wert");
      if (wertEl) wertEl.textContent = `${Math.round(value)} · ${bucket(value)}`;
    });
  }

  function abschlussHtml() {
    const zeilen = [0, 1]
      .map((i) => {
        const wt = lauf.waldtypen[i];
        const zr20 = lauf.zeitreihen[i].zeitreihe.jahr_20;
        return `<li><strong>${escapeHtml(wt.kurzname)}:</strong> Baumbestand am Ende ${Math.round(zr20.gesamtvitalitaet)} von 100 (${bucket(zr20.gesamtvitalitaet)}), Biodiversität ${Math.round(zr20.biodiversitaet)} (${bucket(zr20.biodiversitaet)}).</li>`;
      })
      .join("");
    return `
      <p><strong>Durchlauf abgeschlossen (Jahr ${JAHRE_GESAMT}).</strong> Vergleiche die Endwerte mit euren Hypothesen:</p>
      <ul>${zeilen}</ul>
      <button type="button" id="dash-zur-analyse-button" class="secondary-button secondary-button--kompakt">Zur Kurven-Analyse</button>
      <p class="form-hint">Die Reflexionsfrage folgt in einer späteren Ausbaustufe (Forscherheft).</p>
    `;
  }

  function updateJahr(jahr) {
    aktuellesJahr = jahr;
    document.getElementById("dash-slider").value = String(jahr);
    document.getElementById("dash-jahr-label").textContent = `Jahr ${jahr} von ${JAHRE_GESAMT}`;

    [0, 1].forEach((i) => {
      const zr = lauf.zeitreihen[i].zeitreihe[`jahr_${jahr}`];
      updateArtenFuerWald(i, zr, lauf.artenRelevant[i], lauf.weitereArtenRelevant[i]);
      updateInstrumenteFuerWald(i, zr, lauf.instrumente);
    });

    const abschluss = document.getElementById("dash-abschluss");
    if (jahr >= JAHRE_GESAMT) {
      pause();
      abschluss.hidden = false;
      abschluss.innerHTML = abschlussHtml();
    } else {
      abschluss.hidden = true;
    }
  }

  function pause() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    document.getElementById("dash-play-pause").textContent = "▶ Play";
  }

  function play() {
    if (aktuellesJahr >= JAHRE_GESAMT) {
      updateJahr(0);
    }
    document.getElementById("dash-play-pause").textContent = "⏸ Pause";
    timerId = setInterval(() => {
      if (aktuellesJahr >= JAHRE_GESAMT) {
        pause();
        return;
      }
      updateJahr(aktuellesJahr + 1);
    }, TICK_MS);
  }

  function togglePlayPause() {
    if (timerId) {
      pause();
    } else {
      play();
    }
  }

  function step() {
    pause();
    if (aktuellesJahr < JAHRE_GESAMT) {
      updateJahr(aktuellesJahr + 1);
    }
  }

  function wireEvents() {
    if (wired) return;
    wired = true;

    document.getElementById("dash-play-pause").addEventListener("click", togglePlayPause);
    document.getElementById("dash-step").addEventListener("click", step);
    document.getElementById("dash-slider").addEventListener("input", (event) => {
      pause();
      updateJahr(Number(event.target.value));
    });
    document.getElementById("dash-back-button").addEventListener("click", () => {
      pause();
      WaldsimStartScreen.zurueckZurAuswahl();
    });

    document.getElementById("dash-abschluss").addEventListener("click", (event) => {
      if (event.target.id === "dash-zur-analyse-button") {
        WaldsimAnalyse.start(lauf);
      }
    });
  }

  /**
   * @param {{waldIds: string[], hypothesen: string[], resolved: object, regler: string, zeitreihen: object[]}} neuerLauf
   */
  async function start(neuerLauf) {
    const data = await WaldsimData.load();
    const waldtypenById = Object.fromEntries(data.waldtypen.map((w) => [w.id, w]));
    const indikatorenById = Object.fromEntries(data.indikatoren.map((ind) => [ind.id, ind]));

    lauf = {
      ...neuerLauf,
      waldtypen: neuerLauf.waldIds.map((id) => waldtypenById[id]),
      artenRelevant: neuerLauf.zeitreihen.map((z) => ermittleRelevanteArten(z.zeitreihe)),
      weitereArtenRelevant: neuerLauf.zeitreihen.map((z) => ermittleRelevanteArten(z.zeitreihe, WEITERE_ARTEN)),
      instrumente: INSTRUMENTE_META.map((meta) => ({ ...meta, label: indikatorenById[meta.id].name })),
    };

    document.getElementById("dash-subtitle").textContent =
      `${beschreibeEreignisse(data, lauf.resolved)} · Wildverbiss-Regler: ${kapitalisiere(lauf.regler)}`;

    document.getElementById("dash-waelder").innerHTML = [0, 1]
      .map((i) => waldPanelHtml(i, lauf.waldtypen[i], lauf.hypothesen[i], lauf.artenRelevant[i], lauf.instrumente, lauf.weitereArtenRelevant[i]))
      .join("");

    wireEvents();
    pause();
    updateJahr(0);

    showScreen("screen-dashboard");
  }

  return { start };
})();
