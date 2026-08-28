/**
 * Start & Auswahl (Meilenstein M4, Umsetzungsauftrag 2.1/2.2/2.10, 3.2):
 * zwei Pflicht-Wälder mit zwingend unterschiedlichen Waldtypen, freie
 * Auswahl von 0-2 Ereignis-Störungen, unabhängiger Wildverbiss-Regler,
 * Hypothese je Wald, Play-Sperre ohne Abweichung vom Ausgangszustand.
 *
 * Seit M14: alle drei Waldtypen stehen nebeneinander; die Reihenfolge der
 * Anwahl (erster Klick, zweiter Klick) bestimmt automatisch Wald 1/Wald 2
 * statt fester Plätze. `state.wald` ist dadurch ein dynamisches Array
 * (Länge 0-2) statt eines Paars fester Slots.
 *
 * Seit „Erstkontakt"-Redesign (Design-Canvas-Projekt, siehe Styleguide
 * Abschnitt 10): statt einer langen Scroll-Seite ein 4-Schritt-Wizard
 * (`state.schritt`, 1-4) mit live mitschreibendem „Protokoll"-Panel. Die
 * Render-Funktionen für die einzelnen Felder (Wald/Störung/Regler/
 * Hypothese) bleiben inhaltlich für sich stehende Template-Funktionen,
 * neu ist nur die Sichtbarkeits-/Fortschritts-Steuerung drumherum
 * (`gehezuSchritt`, `aktualisiereAnzeige`) plus `renderProtokoll` und
 * `renderForschungsfrage`, die rein aus dem bestehenden `state`/`data`
 * gespeist werden - kein neuer Datenbedarf.
 *
 * Löst die Auswahl zur passenden vorab berechneten Zeitreihe auf
 * (WaldsimConfig) und übergibt sie an WaldsimDashboard (M5).
 */
const WaldsimStartScreen = (() => {
  const WALD_EMOJI = { mischwald: "🌳", fichtenmonokultur: "🌲", kiefernwald: "🌲" };
  const STOERUNG_EMOJI = { borkenkaefer: "🐛", trockenheit: "🏜️", temperatur: "🌡️", sturm: "🌬️", totholzentnahme: "🪚" };
  const KATEGORIE_KURZ = { naturereignis: "Naturereignis", bewirtschaftungsmassnahme: "Bewirtschaftung" };
  const PRAEDATOR_EMOJI = { luchs: "🦊", wolf: "🐺" };

  const { escapeHtml, spriteFrameHtml, showScreen } = WaldsimUI;

  // Rein UI-seitige Begleittexte/Reihenfolge des Wizards - keine fachlichen
  // Aussagen, nur Ablauf-Hinweise (CLAUDE.md: keine erfundenen Fachinhalte).
  const SCHRITT_META = [
    { titel: "Vergleichsflächen wählen", checklisteLabel: "Vergleichsflächen", hinweis: "Tippe zwei verschiedene Waldtypen an. Der erste wird Fläche 1, der zweite Fläche 2.", punktKlasse: "" },
    { titel: "Belegblatt Störungen", checklisteLabel: "Störung", hinweis: "Eine Störung reicht. Zwei zeigen, wie sich Wirkungen überlagern.", punktKlasse: "ist-ockerorange" },
    { titel: "Luchs und Wolf", checklisteLabel: "Luchs und Wolf", hinweis: "Strukturelles Ungleichgewicht, unabhängig von der Störungsauswahl. Standard: beide anwesend, kaum Effekt.", punktKlasse: "" },
    { titel: "Deine Vermutung", checklisteLabel: "Deine Vermutung", hinweis: "Was denkst du, wird passieren?", punktKlasse: "ist-ockerorange" },
  ];

  const FUSSNOTIZ = [
    { sprite: "reh_portrait.png", emoji: "🦌", text: "Beide Flächen starten gesund. 20 Jahre hast du, um zu beobachten, was sich unterscheidet." },
    { sprite: "luchs_portrait.png", emoji: "🦊", text: "Als Nächstes: Luchs und Wolf – auch was fehlt, ist eine Störung." },
    { sprite: "wolf_portrait.png", emoji: "🐺", text: "Danach: deine Vermutung – es gibt kein „richtig\", nur eine Hypothese zum Prüfen." },
    { sprite: "reh_portrait.png", emoji: "🦌", text: "Bereit? Die Simulation läuft 20 Jahre – du kannst jederzeit pausieren." },
  ];

  let data = null;
  let lastResolved = null;

  const state = {
    schritt: 1,
    wald: [],
    ereignisse: [],
    reihenfolge: null,
    regler: "beide", // Ausgangszustand: Luchs + Wolf anwesend, kein Effekt
    hypothesen: ["", ""],
  };

  function stoerungName(id) {
    const eintrag = data.stoerungen.ereignis_stoerungen.find((s) => s.id === id);
    return eintrag ? eintrag.name : id;
  }

  function waldKurzname(id) {
    const wt = data.waldtypen.find((w) => w.id === id);
    return wt ? wt.kurzname : id;
  }

  function toggleWald(id) {
    const idx = state.wald.indexOf(id);
    if (idx !== -1) {
      state.wald.splice(idx, 1);
    } else if (state.wald.length >= 2) {
      state.wald.shift();
      state.wald.push(id);
    } else {
      state.wald.push(id);
    }
  }

  // ---- Feldkarten (Schritt 1/2/3) ----

  function waldFeldkarteHtml(wt) {
    const slotIndex = state.wald.indexOf(wt.id);
    const checked = slotIndex !== -1;
    return `
      <label class="feldkarte">
        <input type="checkbox" value="${wt.id}" ${checked ? "checked" : ""}>
        ${checked ? `<span class="feldkarte-etikett">Fläche ${slotIndex + 1}</span>` : ""}
        ${spriteFrameHtml(`./assets/sprites/${wt.startbildschirm_kartenbild}`, wt.langname, WALD_EMOJI[wt.id] || "🌲", "feldkarte-bild sprite-16-9")}
        <span class="feldkarte-text">
          <span class="feldkarte-name">${escapeHtml(wt.kurzname)}</span>
          <span class="feldkarte-beschreibung">${escapeHtml(wt.kurzbeschreibung)}</span>
        </span>
        <span class="feldkarte-haken"></span>
      </label>
    `;
  }

  function renderWaldSlots() {
    const container = document.getElementById("wald-slots");
    const cards = data.waldtypen.map((wt) => waldFeldkarteHtml(wt)).join("");
    container.innerHTML = `<div class="feldkarte-liste" role="group" aria-label="Waldtypen auswählen">${cards}</div>`;
  }

  function stoerungFeldkarteHtml(s, checked, disabled) {
    const bewirtschaftungKlasse = s.kategorie === "bewirtschaftungsmassnahme" ? " ist-bewirtschaftung" : "";
    return `
      <label class="feldkarte${bewirtschaftungKlasse}${disabled ? " is-disabled" : ""}">
        <input type="checkbox" value="${s.id}" ${checked ? "checked" : ""} ${disabled ? "disabled" : ""}>
        ${checked ? `<span class="feldkarte-etikett">gewählt</span>` : ""}
        ${spriteFrameHtml(`./assets/sprites/${s.icon_sprite}`, s.name, STOERUNG_EMOJI[s.id] || "⚠️", "feldkarte-bild sprite-1-1")}
        <span class="feldkarte-text">
          <span class="feldkarte-name">${escapeHtml(s.name)}</span>
          <span class="feldkarte-badge">${KATEGORIE_KURZ[s.kategorie] || s.kategorie}</span>
          <span class="feldkarte-beschreibung">${escapeHtml(s.kurzbeschreibung)}</span>
        </span>
        <span class="feldkarte-haken"></span>
      </label>
    `;
  }

  function renderStoerungen() {
    const container = document.getElementById("stoerungs-liste");
    const maxErreicht = state.ereignisse.length >= 2;

    container.innerHTML = data.stoerungen.kategorien
      .filter((k) => k.id !== "strukturelles_ungleichgewicht")
      .map((kategorie) => {
        const items = data.stoerungen.ereignis_stoerungen.filter((s) => s.kategorie === kategorie.id);
        const cards = items
          .map((s) => stoerungFeldkarteHtml(s, state.ereignisse.includes(s.id), !state.ereignisse.includes(s.id) && maxErreicht))
          .join("");
        return `
          <div class="wizard-gruppe">
            <h3 class="feldkarte-gruppen-titel kategorie-${kategorie.id}">${escapeHtml(kategorie.name)}</h3>
            <div class="feldkarte-liste">${cards}</div>
          </div>
        `;
      })
      .join("");
  }

  function renderReihenfolge() {
    const container = document.getElementById("reihenfolge-auswahl");
    const resolved = WaldsimConfig.resolveEreignisKonfiguration(data.stoerungen, state.ereignisse, state.reihenfolge);
    lastResolved = resolved;

    if (!resolved.brauchtReihenfolge) {
      container.hidden = true;
      container.innerHTML = "";
      return;
    }

    const [x, y] = resolved.reihenfolgeOptionen;
    const abstand = resolved.abstandJahre;
    const jahrLabel = abstand === 0 ? "im selben Jahr" : `${abstand} Jahr${abstand === 1 ? "" : "e"} später`;
    const gewaehltErst = state.reihenfolge ? state.reihenfolge[0] : null;

    container.hidden = false;
    container.innerHTML = `
      <p class="wizard-hinweis">In welcher Reihenfolge?</p>
      <div class="reihenfolge-optionen" role="radiogroup" aria-label="Reihenfolge der Störungen">
        <label class="reihenfolge-option">
          <input type="radio" name="reihenfolge" value="${x}|${y}" ${gewaehltErst === x ? "checked" : ""}>
          ${stoerungName(x)} zuerst, ${stoerungName(y)} ${jahrLabel}
        </label>
        <label class="reihenfolge-option">
          <input type="radio" name="reihenfolge" value="${y}|${x}" ${gewaehltErst === y ? "checked" : ""}>
          ${stoerungName(y)} zuerst, ${stoerungName(x)} ${jahrLabel}
        </label>
      </div>
    `;
  }

  function reglerCodeAus(luchsAktiv, wolfAktiv) {
    if (luchsAktiv && wolfAktiv) return "beide";
    if (luchsAktiv) return "luchs";
    if (wolfAktiv) return "wolf";
    return "keine";
  }

  function reglerFeldkarteHtml(p, aktiv) {
    return `
      <label class="feldkarte">
        <input type="checkbox" name="praedator-${p.id}" ${aktiv ? "checked" : ""}>
        ${aktiv ? `<span class="feldkarte-etikett">anwesend</span>` : ""}
        ${spriteFrameHtml(`./assets/sprites/${p.id}_portrait.png`, p.name, PRAEDATOR_EMOJI[p.id] || "🐾", "feldkarte-bild sprite-1-1")}
        <span class="feldkarte-text">
          <span class="feldkarte-name">${escapeHtml(p.name)}</span>
        </span>
        <span class="feldkarte-haken"></span>
      </label>
    `;
  }

  function renderRegler() {
    const container = document.getElementById("regler-control");
    const regler = data.stoerungen.wildverbiss_regler;
    // Ersetzt seit 2026-08-26 den früheren 3-Stufen-Regler durch zwei
    // unabhängige Schalter für die tatsächliche Ursache (Wolf/Luchs
    // anwesend), siehe Milestones-Dokument.
    const aktivById = {
      luchs: state.regler === "beide" || state.regler === "luchs",
      wolf: state.regler === "beide" || state.regler === "wolf",
    };
    container.innerHTML = `
      <div class="regler-intro">
        ${spriteFrameHtml(`./assets/sprites/${regler.icon_sprite}`, regler.name, "🦌", "sprite-1-1 sprite-small")}
      </div>
      <div class="feldkarte-reihe" role="group" aria-label="${escapeHtml(regler.name)}">
        ${regler.praedatoren.map((p) => reglerFeldkarteHtml(p, aktivById[p.id])).join("")}
      </div>
    `;
  }

  function renderHypothesen() {
    const container = document.getElementById("hypothesen");
    const waldtypenById = Object.fromEntries(data.waldtypen.map((w) => [w.id, w]));
    container.innerHTML = [0, 1]
      .map((i) => {
        const wt = state.wald[i] ? waldtypenById[state.wald[i]] : null;
        return `
        <div class="hypothese-feld">
          <label for="hypothese-${i}">${wt ? escapeHtml(wt.kurzname) : `Wald ${i + 1}`}</label>
          <textarea id="hypothese-${i}" data-slot="${i}" rows="3" placeholder="Was denkst du, wird passieren?">${escapeHtml(state.hypothesen[i])}</textarea>
        </div>
      `;
      })
      .join("");
  }

  // ---- Protokoll (rechte Buchseite) ----

  function protokollWaldKarteHtml(id, index) {
    const wt = data.waldtypen.find((w) => w.id === id);
    return `
      <div class="protokoll-wald-karte">
        ${spriteFrameHtml(`./assets/sprites/${wt.startbildschirm_kartenbild}`, wt.langname, WALD_EMOJI[wt.id] || "🌲", "sprite-16-9")}
        <span class="protokoll-wald-rolle">Fläche ${index + 1}</span>
        <span class="protokoll-wald-name">${escapeHtml(wt.kurzname)}</span>
      </div>
    `;
  }

  function stoerungZeileHtml(id) {
    const s = data.stoerungen.ereignis_stoerungen.find((x) => x.id === id);
    return `
      <div class="protokoll-stoerung-zeile">
        ${spriteFrameHtml(`./assets/sprites/${s.icon_sprite}`, s.name, STOERUNG_EMOJI[s.id] || "⚠️", "sprite-1-1")}
        <span class="protokoll-stoerung-name">${escapeHtml(s.name)}</span>
      </div>
    `;
  }

  function protokollOffenHtml() {
    const eintraege = SCHRITT_META.map((meta, i) => ({ label: meta.checklisteLabel, schritt: i + 1 })).filter((e) => e.schritt > state.schritt);
    if (eintraege.length === 0) return "";
    return `
      <div class="protokoll-abschnitt">
        <div class="protokoll-abschnitt-titel">Noch offen</div>
        <div class="protokoll-offen-liste">
          ${eintraege.map((e) => `<div class="protokoll-offen-eintrag"><span class="protokoll-offen-punkt"></span>${escapeHtml(e.label)} – Schritt ${e.schritt}</div>`).join("")}
        </div>
      </div>
    `;
  }

  // Nur bereits an anderer Stelle verwendete/geprüfte Wissensbasis-Texte
  // (kurzbeschreibung) - keine neu erfundenen fachlichen Aussagen.
  function protokollFaktHtml() {
    if (state.ereignisse.length === 0) {
      return `<p class="protokoll-fakt">Eine Störung allein sagt wenig. Erst der Vergleich zweier Wälder zeigt, ob eine Veränderung an der Störung liegt – oder am Wald.</p>`;
    }
    const texte = state.ereignisse.map((id) => {
      const s = data.stoerungen.ereignis_stoerungen.find((x) => x.id === id);
      return `<strong>${escapeHtml(s.name)}:</strong> ${escapeHtml(s.kurzbeschreibung)}`;
    });
    return `<p class="protokoll-fakt">${texte.join(" ")}</p>`;
  }

  function renderProtokoll() {
    const container = document.getElementById("protokoll-inhalt");

    if (state.wald.length === 0) {
      container.innerHTML = `
        <p class="protokoll-leerhinweis">Noch nichts ausgewählt – sobald du zwei Waldtypen wählst, wächst hier das Protokoll.</p>
        ${protokollOffenHtml()}
      `;
      return;
    }

    const waelderHtml = state.wald.map((id, i) => protokollWaldKarteHtml(id, i)).join("");
    const stoerungAbschnitt =
      state.ereignisse.length > 0
        ? `
      <div class="protokoll-abschnitt">
        <div class="protokoll-abschnitt-titel">Störung</div>
        ${state.ereignisse.map((id) => stoerungZeileHtml(id)).join("")}
      </div>
    `
        : "";
    const fussnotiz = FUSSNOTIZ[state.schritt - 1] || FUSSNOTIZ[0];

    container.innerHTML = `
      <div class="protokoll-waelder">${waelderHtml}</div>
      ${stoerungAbschnitt}
      ${protokollOffenHtml()}
      <div class="protokoll-abschnitt">
        <div class="protokoll-abschnitt-titel">${state.ereignisse.length > 0 ? "Zur Störung" : "Warum immer zwei?"}</div>
        ${protokollFaktHtml()}
      </div>
      <div class="protokoll-fussnotiz">
        ${spriteFrameHtml(`./assets/sprites/${fussnotiz.sprite}`, "", fussnotiz.emoji, "sprite-1-1")}
        <span class="protokoll-fussnotiz-text">${escapeHtml(fussnotiz.text)}</span>
      </div>
    `;
  }

  function renderForschungsfrage() {
    const el = document.getElementById("wizard-frage-text");
    const w1 = state.wald[0] ? `<b>${escapeHtml(waldKurzname(state.wald[0]))}</b>` : `<span class="ist-offen">………</span>`;
    const w2 = state.wald[1] ? `<b>${escapeHtml(waldKurzname(state.wald[1]))}</b>` : `<span class="ist-offen">………</span>`;
    let stoerungTeil;
    if (state.schritt < 2) {
      stoerungTeil = `<span class="ist-offen">………</span>`;
    } else if (state.ereignisse.length === 0) {
      stoerungTeil = "keiner zusätzlichen Störung";
    } else {
      stoerungTeil = state.ereignisse.map((id) => `<b>${escapeHtml(stoerungName(id))}</b>`).join(" + ");
    }
    el.innerHTML = `Ich vergleiche ${w1} mit ${w2} unter ${stoerungTeil}.`;
  }

  // ---- Schritt-Navigation ----

  function schrittFortschrittText(n) {
    if (n === 1) return `${state.wald.length} von 2`;
    if (n === 2) return `${state.ereignisse.length} von 2 gewählt`;
    return "";
  }

  // Punkte fuer bereits abgeschlossene Schritte sind anklickbar (Zurueck-
  // Navigation) - vorwaerts geht es bewusst nur ueber den "Weiter"-Button,
  // damit die Schritt-Gates (aktualisiereAnzeige) nicht umgangen werden.
  // Als <button> mit 44px-Ziel statt der kleinen sichtbaren Punkte direkt,
  // damit das Touch-Ziel trotz kompakter Optik gross genug bleibt.
  function renderPunkte() {
    const container = document.getElementById("wizard-punkte");
    container.innerHTML = SCHRITT_META
      .map((_, i) => {
        const n = i + 1;
        const klickbar = n < state.schritt;
        const klasse = n < state.schritt ? "ist-erledigt" : n === state.schritt ? "ist-aktuell" : "";
        return `<button type="button" class="wizard-punkt-button" data-schritt-ziel="${n}" ${klickbar ? "" : "disabled"} aria-label="Zu Schritt ${n} zurück"><span class="wizard-punkt ${klasse}"></span></button>`;
      })
      .join("");
    document.getElementById("wizard-schritt-label").textContent = `Schritt ${state.schritt} von ${SCHRITT_META.length}`;
  }

  function aktualisiereAnzeige() {
    const resolved = WaldsimConfig.resolveEreignisKonfiguration(data.stoerungen, state.ereignisse, state.reihenfolge);
    lastResolved = resolved;

    document.getElementById("wizard-schritt-fortschritt").textContent = schrittFortschrittText(state.schritt);
    renderPunkte();
    renderProtokoll();
    renderForschungsfrage();

    const weiterButton = document.getElementById("play-button");
    const hint = document.getElementById("play-hint");

    let grund = "";
    if (state.schritt === 1 && state.wald.length < 2) {
      grund = "Wähle zwei unterschiedliche Waldtypen aus.";
    } else if (state.schritt === 2 && resolved.brauchtReihenfolge) {
      grund = "Wähle die Reihenfolge der beiden Störungen.";
    }

    if (state.schritt < SCHRITT_META.length) {
      weiterButton.textContent = "Weiter →";
      weiterButton.disabled = !!grund;
      hint.textContent = grund;
    } else {
      const gueltig = WaldsimConfig.istGueltigeAbweichung(state.ereignisse, state.regler);
      weiterButton.textContent = "Simulation starten";
      weiterButton.disabled = !gueltig;
      hint.textContent = gueltig ? "Bereit zum Start." : "Wähle mindestens eine Störung oder entferne Luchs und/oder Wolf.";
    }
  }

  function gehezuSchritt(n) {
    state.schritt = n;
    document.querySelectorAll(".wizard-schritt").forEach((el) => {
      el.hidden = Number(el.dataset.schritt) !== n;
    });
    const meta = SCHRITT_META[n - 1];
    document.getElementById("wizard-schritt-titel").textContent = meta.titel;
    document.getElementById("wizard-schritt-hinweis").textContent = meta.hinweis;
    document.getElementById("wizard-kopf-punkt").className = `wizard-kopf-punkt ${meta.punktKlasse}`;
    aktualisiereAnzeige();
  }

  async function handlePlay() {
    const resolved = lastResolved;
    const dateien = state.wald.map((waldId) => WaldsimConfig.dateiname(waldId, resolved.konfigId, state.regler));

    const indexSet = new Set(data.simulationenIndex.eintraege.map((e) => e.datei));
    for (const name of dateien) {
      if (!indexSet.has(`simulationen/${name}`)) {
        throw new Error(`Keine vorab berechnete Simulation gefunden: ${name}`);
      }
    }

    const zeitreihen = await Promise.all(dateien.map((name) => WaldsimData.ladeZeitreihe(`simulationen/${name}`)));
    await WaldsimDashboard.start({
      waldIds: [...state.wald],
      hypothesen: [...state.hypothesen],
      resolved,
      regler: state.regler,
      zeitreihen,
    });
  }

  function wireEvents() {
    const screenStart = document.getElementById("screen-start");

    screenStart.addEventListener("change", (event) => {
      const target = event.target;

      if (target.matches('.feldkarte input[type="checkbox"]') && target.closest("#wald-slots")) {
        toggleWald(target.value);
        renderWaldSlots();
        renderHypothesen();
        aktualisiereAnzeige();
        return;
      }

      if (target.matches('.feldkarte input[type="checkbox"]') && target.closest("#stoerungs-liste")) {
        const id = target.value;
        if (target.checked) {
          if (state.ereignisse.length >= 2) {
            target.checked = false;
            return;
          }
          state.ereignisse.push(id);
        } else {
          state.ereignisse = state.ereignisse.filter((e) => e !== id);
        }
        state.reihenfolge = null;
        renderStoerungen();
        renderReihenfolge();
        aktualisiereAnzeige();
        return;
      }

      if (target.matches('input[name="reihenfolge"]')) {
        const [erst, zweit] = target.value.split("|");
        state.reihenfolge = [erst, zweit];
        aktualisiereAnzeige();
        return;
      }

      if (target.matches('input[name="praedator-luchs"]') || target.matches('input[name="praedator-wolf"]')) {
        const luchsBox = screenStart.querySelector('input[name="praedator-luchs"]');
        const wolfBox = screenStart.querySelector('input[name="praedator-wolf"]');
        state.regler = reglerCodeAus(luchsBox.checked, wolfBox.checked);
        aktualisiereAnzeige();
      }
    });

    screenStart.addEventListener("input", (event) => {
      if (event.target.matches("textarea[data-slot]")) {
        state.hypothesen[Number(event.target.dataset.slot)] = event.target.value;
      }
    });

    document.getElementById("wizard-punkte").addEventListener("click", (event) => {
      const button = event.target.closest(".wizard-punkt-button");
      if (button && !button.disabled) {
        gehezuSchritt(Number(button.dataset.schrittZiel));
      }
    });

    document.getElementById("play-button").addEventListener("click", async () => {
      if (state.schritt < SCHRITT_META.length) {
        gehezuSchritt(state.schritt + 1);
        return;
      }
      try {
        await handlePlay();
      } catch (err) {
        console.error(err);
        document.getElementById("play-hint").textContent = "Fehler beim Laden der Simulation – bitte erneut versuchen.";
      }
    });
  }

  async function init() {
    document.getElementById("app").addEventListener(
      "error",
      (event) => {
        if (event.target.tagName === "IMG") {
          const frame = event.target.closest(".sprite-frame");
          if (frame) {
            frame.classList.add("sprite-missing");
          }
        }
      },
      true
    );

    data = await WaldsimData.load();

    renderWaldSlots();
    renderStoerungen();
    renderReihenfolge();
    renderRegler();
    renderHypothesen();
    gehezuSchritt(1);
    wireEvents();

    showScreen("screen-start");
  }

  function zurueckZurAuswahl() {
    gehezuSchritt(1);
    showScreen("screen-start");
  }

  return { init, zurueckZurAuswahl };
})();
