/**
 * Start & Auswahl (Meilenstein M4, Umsetzungsauftrag 2.1/2.2/2.10, 3.2):
 * zwei Pflicht-Wald-Plätze mit zwingend unterschiedlichen Waldtypen, freie
 * Auswahl von 0-2 Ereignis-Störungen, unabhängiger Wildverbiss-Regler,
 * Hypothese je Wald, Play-Sperre ohne Abweichung vom Ausgangszustand.
 *
 * Löst die Auswahl zur passenden vorab berechneten Zeitreihe auf
 * (WaldsimConfig) und übergibt sie an WaldsimDashboard (M5).
 */
const WaldsimStartScreen = (() => {
  const WALD_EMOJI = { mischwald: "🌳", fichtenmonokultur: "🌲", kiefernwald: "🌲" };
  const STOERUNG_EMOJI = { borkenkaefer: "🐛", trockenheit: "🏜️", temperatur: "🌡️", sturm: "🌬️", totholzentnahme: "🪚" };
  const KATEGORIE_KURZ = { naturereignis: "Naturereignis", bewirtschaftungsmassnahme: "Bewirtschaftung" };

  const { escapeHtml, kapitalisiere, spriteFrameHtml, showScreen } = WaldsimUI;

  let data = null;
  let lastResolved = null;

  const state = {
    wald: [null, null],
    ereignisse: [],
    reihenfolge: null,
    regler: "beide", // Ausgangszustand: Luchs + Wolf anwesend, kein Effekt
    hypothesen: ["", ""],
  };

  function stoerungName(id) {
    const eintrag = data.stoerungen.ereignis_stoerungen.find((s) => s.id === id);
    return eintrag ? eintrag.name : id;
  }

  function waldCardHtml(wt, slotIndex, checked, disabled) {
    return `
      <label class="wald-card ${disabled ? "is-disabled" : ""}">
        <input type="radio" name="wald-slot-${slotIndex}" value="${wt.id}" data-slot="${slotIndex}" ${checked ? "checked" : ""} ${disabled ? "disabled" : ""}>
        ${spriteFrameHtml(`./assets/sprites/${wt.startbildschirm_kartenbild}`, wt.langname, WALD_EMOJI[wt.id] || "🌲", "sprite-16-9")}
        <span class="wald-card-name">${wt.kurzname}</span>
        ${disabled ? `<span class="wald-card-note">bereits bei Wald ${slotIndex === 0 ? 2 : 1} gewählt</span>` : ""}
      </label>
    `;
  }

  function renderWaldSlots() {
    const container = document.getElementById("wald-slots");
    const waldtypenById = Object.fromEntries(data.waldtypen.map((w) => [w.id, w]));

    container.innerHTML = [0, 1].map((slotIndex) => {
      const selected = state.wald[slotIndex];
      const otherSelected = state.wald[1 - slotIndex];
      const cards = data.waldtypen
        .map((wt) => waldCardHtml(wt, slotIndex, selected === wt.id, otherSelected === wt.id && selected !== wt.id))
        .join("");
      const beschreibung = selected ? `<p class="wald-beschreibung">${escapeHtml(waldtypenById[selected].kurzbeschreibung)}</p>` : "";

      return `
        <div class="wald-slot">
          <h3>Wald ${slotIndex + 1}</h3>
          <div class="wald-card-group" role="radiogroup" aria-label="Waldtyp für Wald ${slotIndex + 1}">${cards}</div>
          ${beschreibung}
        </div>
      `;
    }).join("");
  }

  function stoerungCardHtml(s, checked, disabled) {
    return `
      <label class="stoerung-card kategorie-${s.kategorie} ${disabled ? "is-disabled" : ""}">
        <input type="checkbox" value="${s.id}" ${checked ? "checked" : ""} ${disabled ? "disabled" : ""}>
        ${spriteFrameHtml(`./assets/sprites/${s.icon_sprite}`, s.name, STOERUNG_EMOJI[s.id] || "⚠️", "sprite-1-1")}
        <span class="stoerung-card-name">${s.name}</span>
        <span class="stoerung-card-kategorie-badge">${KATEGORIE_KURZ[s.kategorie] || s.kategorie}</span>
        <span class="stoerung-card-beschreibung">${escapeHtml(s.kurzbeschreibung)}</span>
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
          .map((s) => stoerungCardHtml(s, state.ereignisse.includes(s.id), !state.ereignisse.includes(s.id) && maxErreicht))
          .join("");
        return `
          <div class="stoerungs-gruppe">
            <h3 class="stoerungs-gruppe-titel kategorie-${kategorie.id}">${kategorie.name}</h3>
            <div class="stoerungs-karten">${cards}</div>
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
      <p class="form-hint">In welcher Reihenfolge?</p>
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

  function renderRegler() {
    const container = document.getElementById("regler-control");
    const regler = data.stoerungen.wildverbiss_regler;
    // Ersetzt seit 2026-08-26 den früheren 3-Stufen-Regler durch zwei
    // unabhängige Schalter für die tatsächliche Ursache (Wolf/Luchs
    // anwesend), siehe Milestones-Dokument. Wiederverwendet bewusst die
    // bestehenden .regler-segmente/.regler-segment-Klassen (funktionieren
    // unverändert mit type="checkbox" statt type="radio").
    const luchsAktiv = state.regler === "beide" || state.regler === "luchs";
    const wolfAktiv = state.regler === "beide" || state.regler === "wolf";
    container.innerHTML = `
      <div class="regler-control">
        ${spriteFrameHtml(`./assets/sprites/${regler.icon_sprite}`, regler.name, "🦌", "sprite-1-1 sprite-small")}
        <div class="regler-segmente" role="group" aria-label="${escapeHtml(regler.name)}">
          <label class="regler-segment">
            <input type="checkbox" name="praedator-luchs" ${luchsAktiv ? "checked" : ""}>
            Luchs
          </label>
          <label class="regler-segment">
            <input type="checkbox" name="praedator-wolf" ${wolfAktiv ? "checked" : ""}>
            Wolf
          </label>
        </div>
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
          <label for="hypothese-${i}">${wt ? wt.kurzname : `Wald ${i + 1}`}</label>
          <textarea id="hypothese-${i}" data-slot="${i}" rows="2" placeholder="Was denkst du, wird passieren?">${escapeHtml(state.hypothesen[i])}</textarea>
        </div>
      `;
      })
      .join("");
  }

  function updatePlayState() {
    const playButton = document.getElementById("play-button");
    const playHint = document.getElementById("play-hint");

    const [w0, w1] = state.wald;
    const resolved = WaldsimConfig.resolveEreignisKonfiguration(data.stoerungen, state.ereignisse, state.reihenfolge);
    lastResolved = resolved;

    const gruende = [];
    if (!w0 || !w1) {
      gruende.push("Wähle für beide Wald-Plätze einen Waldtyp.");
    } else if (w0 === w1) {
      gruende.push("Die beiden Wald-Plätze müssen unterschiedliche Waldtypen sein.");
    }

    if (resolved.brauchtReihenfolge) {
      gruende.push("Wähle die Reihenfolge der beiden Störungen.");
    }

    if (!WaldsimConfig.istGueltigeAbweichung(state.ereignisse, state.regler)) {
      gruende.push("Wähle mindestens eine Störung oder entferne Luchs und/oder Wolf.");
    }

    const bereit = gruende.length === 0;
    playButton.disabled = !bereit;
    playHint.textContent = bereit ? "Bereit zum Start." : gruende[0];
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

      if (target.matches('.wald-card input[type="radio"]')) {
        state.wald[Number(target.dataset.slot)] = target.value;
        renderWaldSlots();
        renderHypothesen();
        updatePlayState();
        return;
      }

      if (target.matches('.stoerung-card input[type="checkbox"]')) {
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
        updatePlayState();
        return;
      }

      if (target.matches('input[name="reihenfolge"]')) {
        const [erst, zweit] = target.value.split("|");
        state.reihenfolge = [erst, zweit];
        updatePlayState();
        return;
      }

      if (target.matches('input[name="praedator-luchs"]') || target.matches('input[name="praedator-wolf"]')) {
        const luchsBox = screenStart.querySelector('input[name="praedator-luchs"]');
        const wolfBox = screenStart.querySelector('input[name="praedator-wolf"]');
        state.regler = reglerCodeAus(luchsBox.checked, wolfBox.checked);
        updatePlayState();
      }
    });

    screenStart.addEventListener("input", (event) => {
      if (event.target.matches("textarea[data-slot]")) {
        state.hypothesen[Number(event.target.dataset.slot)] = event.target.value;
      }
    });

    document.getElementById("play-button").addEventListener("click", async () => {
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
    updatePlayState();
    wireEvents();

    showScreen("screen-start");
  }

  function zurueckZurAuswahl() {
    showScreen("screen-start");
  }

  return { init, zurueckZurAuswahl };
})();
