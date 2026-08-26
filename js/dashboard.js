/**
 * Live-Dashboard (Meilenstein M5, Umsetzungsauftrag 3.3, Styleguide
 * Abschnitt 6): Zeitsteuerung (Play/Pause/Einzelschritt/Zeitachse 0-20
 * Jahre) über die vorab berechnete Zeitreihe, Feldmessinstrumente-Optik für
 * die 6 Dashboard-Indikatoren, Art-Sprites mit Zustandswechsel per
 * Crossfade, zwei Wald-Plätze nebeneinander im Vergleich.
 *
 * Bewusst NICHT Teil dieses Meilensteins: der Analyse-Screen mit frei
 * kombinierbaren Kurven (M6) und die Reflexionsfrage/das Forscherheft (M7,
 * Umsetzungsauftrag 2.4/2.5) - siehe Abschluss-Hinweis am Ende eines Laufs.
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

  function ermittleRelevanteArten(zeitreihe) {
    return ARTEN.filter((art) => Object.keys(zeitreihe).some((jahrKey) => (zeitreihe[jahrKey][art.indikator] || 0) > 0));
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

  function speciesSpriteHtml(id, name, emoji) {
    return `
      <div class="art-sprite" id="${id}">
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

  function waldPanelHtml(i, wt, hypothese, artenRelevant, instrumente) {
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

  function updateArtenFuerWald(i, zr, artenRelevant) {
    artenRelevant.forEach((art) => {
      const value = zr[art.indikator] || 0;
      const zustand = zustandFuer(art, value);
      const container = document.getElementById(`w${i}-art-${art.id}`);
      updateSpeciesSprite(container, zustand.src, `${art.name}: ${bucket(value)}`);
      if (container) container.style.opacity = value > 0 ? "1" : "0.18";
    });

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
      <p class="form-hint">Die ausführliche Kurven-Analyse und die Reflexionsfrage folgen in einer späteren Ausbaustufe.</p>
    `;
  }

  function updateJahr(jahr) {
    aktuellesJahr = jahr;
    document.getElementById("dash-slider").value = String(jahr);
    document.getElementById("dash-jahr-label").textContent = `Jahr ${jahr} von ${JAHRE_GESAMT}`;

    [0, 1].forEach((i) => {
      const zr = lauf.zeitreihen[i].zeitreihe[`jahr_${jahr}`];
      updateArtenFuerWald(i, zr, lauf.artenRelevant[i]);
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
      instrumente: INSTRUMENTE_META.map((meta) => ({ ...meta, label: indikatorenById[meta.id].name })),
    };

    document.getElementById("dash-subtitle").textContent =
      `${beschreibeEreignisse(data, lauf.resolved)} · Wildverbiss-Regler: ${kapitalisiere(lauf.regler)}`;

    document.getElementById("dash-waelder").innerHTML = [0, 1]
      .map((i) => waldPanelHtml(i, lauf.waldtypen[i], lauf.hypothesen[i], lauf.artenRelevant[i], lauf.instrumente))
      .join("");

    wireEvents();
    pause();
    updateJahr(0);

    showScreen("screen-dashboard");
  }

  return { start };
})();
