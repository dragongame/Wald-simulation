/**
 * Digitales Forscherheft (Meilenstein M7, Umsetzungsauftrag 2.4/2.9,
 * Technikdokument 4.4/5.6): Reflexionsfrage nach der Kurven-Analyse,
 * dauerhafte lokale Speicherung einer Forscherheft-Seite (Datenmodell v2:
 * 2× Wald-Datensatz inkl. Endzustandsbild/Kurzbeschreibung, Störung(en)
 * inkl. Reihenfolge/Zeitpunkt, Regler, bis zu 3 Kurven-Snapshots, ein
 * gemeinsamer Reflexionstext), Übersicht aller Durchläufe mit
 * Fortschrittsanzeige ohne festen Zielwert, Textexport je Seite,
 * „neue Sitzung" (löscht alle Einträge, für Geräte-Wiederverwendung durch
 * eine andere Klasse).
 *
 * Speicherung über js/storage.js (localStorage) - siehe dortige
 * Begründung, warum das für diese Datenmenge ausreicht.
 */
const WaldsimForscherheft = (() => {
  const { escapeHtml, kapitalisiere, spriteFrameHtml, showScreen } = WaldsimUI;

  const STORAGE_KEY = "forscherheft";
  const WALD_EMOJI = { mischwald: "🌳", fichtenmonokultur: "🌲", kiefernwald: "🌲" };

  // Reflexionsfragen wörtlich aus Wissensbasis Abschnitt 6.5 übernommen.
  const REFLEXIONSFRAGE_STANDARD = "Welche Art war betroffen, obwohl du sie nicht direkt gestört hast?";
  const REFLEXIONSFRAGE_TOTHOLZENTNAHME =
    "Hat die Maßnahme das Brandrisiko wirklich stark gesenkt? Was hat sich stattdessen sicher verändert?";

  let laufMitSnapshots = null; // wird von WaldsimAnalyse.starteReflexion() gesetzt

  function bucket(value) {
    if (value < 34) return "niedrig";
    if (value < 67) return "mittel";
    return "hoch";
  }

  function endzustandBild(waldtypId, regler, zr20) {
    if (waldtypId === "mischwald" && regler !== "niedrig" && zr20.verjuengung_mischbaumarten < 50 && zr20.gesamtvitalitaet >= 60) {
      return "wald_mischwald_verarmt_reinbestand.png";
    }
    const stufe = zr20.gesamtvitalitaet >= 67 ? "stabil" : zr20.gesamtvitalitaet >= 34 ? "geschaedigt" : "kollabiert";
    return `wald_${waldtypId}_${stufe}.png`;
  }

  function kurzbeschreibung(zr20) {
    return `Baumbestand am Ende: ${Math.round(zr20.gesamtvitalitaet)} von 100 (${bucket(zr20.gesamtvitalitaet)}). Biodiversität: ${Math.round(zr20.biodiversitaet)} (${bucket(zr20.biodiversitaet)}).`;
  }

  function stoerungName(data, id) {
    const eintrag = data.stoerungen.ereignis_stoerungen.find((s) => s.id === id);
    return eintrag ? eintrag.name : id;
  }

  function ereignisText(data, ereignisse) {
    return ereignisse.length === 0 ? "keine Ereignis-Störung" : ereignisse.map((e) => `${stoerungName(data, e.typ)} (Jahr ${e.trigger_jahr})`).join(" + ");
  }

  function ladeAlle() {
    return WaldsimStorage.get(STORAGE_KEY, []);
  }

  function speichereAlle(alle) {
    WaldsimStorage.set(STORAGE_KEY, alle);
  }

  function aktualisiereZaehler() {
    const anzahl = ladeAlle().length;
    const el = document.getElementById("forscherheft-zaehler");
    if (el) el.textContent = `(${anzahl})`;
  }

  function formatDatum(iso) {
    const d = new Date(iso);
    return `${d.toLocaleDateString("de-DE")} ${d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}`;
  }

  function exportText(data, eintrag) {
    const zeilen = [
      "Waldökosystem-Simulation – Forscherheft-Eintrag",
      formatDatum(eintrag.zeitpunkt),
      "",
      `Störung: ${ereignisText(data, eintrag.ereignisse)}`,
      `Wildverbiss-Regler: ${kapitalisiere(eintrag.regler)}`,
      "",
    ];
    eintrag.waelder.forEach((w) => {
      zeilen.push(`Wald: ${w.waldtypName}`);
      zeilen.push(`Hypothese: ${w.hypothese || "(keine angegeben)"}`);
      zeilen.push(`Ergebnis: ${w.kurzbeschreibung}`);
      zeilen.push("");
    });
    if (eintrag.snapshots.length > 0) {
      zeilen.push(`Gemerkte Kurven-Kombinationen: ${eintrag.snapshots.map((s) => s.namen.join(", ")).join(" | ")}`);
      zeilen.push("");
    }
    zeilen.push(`Reflexion: ${eintrag.reflexionstext || "(keine angegeben)"}`);
    return zeilen.join("\n");
  }

  // ---- Reflexion (nach der Analyse) ----

  async function starteReflexion(lauf) {
    laufMitSnapshots = lauf;
    const data = await WaldsimData.load();

    document.getElementById("reflexion-subtitle").textContent =
      `${ereignisText(data, lauf.resolved.events)} · Wildverbiss-Regler: ${kapitalisiere(lauf.regler)}`;

    const fragen = [REFLEXIONSFRAGE_STANDARD];
    if (lauf.resolved.events.some((e) => e.typ === "totholzentnahme")) {
      fragen.push(REFLEXIONSFRAGE_TOTHOLZENTNAHME);
    }
    document.getElementById("reflexion-fragen").innerHTML = fragen.map((f) => `<li>${escapeHtml(f)}</li>`).join("");

    document.getElementById("reflexion-text").value = "";
    showScreen("screen-reflexion");
  }

  function wireEvents() {
    document.getElementById("reflexion-zurueck-button").addEventListener("click", () => {
      showScreen("screen-analyse");
    });

    document.getElementById("reflexion-speichern-button").addEventListener("click", async () => {
      const reflexionstext = document.getElementById("reflexion-text").value.trim();
      await speichereEintrag(reflexionstext);
      zeigeUebersicht();
    });

    document.getElementById("forscherheft-oeffnen-button").addEventListener("click", () => {
      zeigeUebersicht();
    });

    document.getElementById("forscherheft-neuer-durchlauf-button").addEventListener("click", () => {
      WaldsimStartScreen.zurueckZurAuswahl();
    });

    document.getElementById("forscherheft-neue-sitzung-button").addEventListener("click", () => {
      const anzahl = ladeAlle().length;
      if (anzahl === 0) return;
      const bestaetigt = window.confirm(
        `Wirklich alle ${anzahl} Forscherheft-Einträge auf diesem Gerät löschen? Das kann nicht rückgängig gemacht werden - nur nutzen, wenn das iPad jetzt von einer anderen Klasse/Gruppe verwendet wird.`
      );
      if (!bestaetigt) return;
      speichereAlle([]);
      aktualisiereZaehler();
      renderUebersicht();
    });

    document.getElementById("forscherheft-liste").addEventListener("click", async (event) => {
      const loeschenButton = event.target.closest(".forscherheft-loeschen");
      if (loeschenButton) {
        const alle = ladeAlle();
        const index = Number(loeschenButton.dataset.index);
        if (window.confirm("Diesen Forscherheft-Eintrag löschen?")) {
          alle.splice(index, 1);
          speichereAlle(alle);
          aktualisiereZaehler();
          renderUebersicht();
        }
        return;
      }

      const netzwerkButton = event.target.closest(".forscherheft-netzwerk-button");
      if (netzwerkButton) {
        const eintrag = ladeAlle()[Number(netzwerkButton.dataset.index)];
        WaldsimGraph.oeffneFuerEintrag(eintrag);
        return;
      }

      const exportButton = event.target.closest(".forscherheft-export-button");
      if (exportButton) {
        const bereich = document.getElementById(`fb-export-${exportButton.dataset.index}`);
        const sichtbar = !bereich.hidden;
        bereich.hidden = sichtbar;
        return;
      }

      const kopierenButton = event.target.closest(".forscherheft-kopieren-button");
      if (kopierenButton) {
        const textarea = document.getElementById(`fb-export-text-${kopierenButton.dataset.index}`);
        try {
          await navigator.clipboard.writeText(textarea.value);
          kopierenButton.textContent = "Kopiert ✓";
          setTimeout(() => {
            kopierenButton.textContent = "In Zwischenablage kopieren";
          }, 2000);
        } catch (err) {
          textarea.focus();
          textarea.select();
        }
        return;
      }

      const teilenButton = event.target.closest(".forscherheft-teilen-button");
      if (teilenButton && navigator.share) {
        const textarea = document.getElementById(`fb-export-text-${teilenButton.dataset.index}`);
        try {
          await navigator.share({ title: "Forscherheft-Eintrag", text: textarea.value });
        } catch (err) {
          /* Nutzer hat abgebrochen oder Teilen nicht möglich - kein Fehlerzustand */
        }
      }
    });
  }

  async function speichereEintrag(reflexionstext) {
    const lauf = laufMitSnapshots;
    const zr20 = [0, 1].map((i) => lauf.zeitreihen[i].zeitreihe.jahr_20);

    const eintrag = {
      id: `fb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      zeitpunkt: new Date().toISOString(),
      regler: lauf.regler,
      ereignisse: lauf.resolved.events,
      waelder: [0, 1].map((i) => ({
        waldtypId: lauf.waldtypen[i].id,
        waldtypName: lauf.waldtypen[i].kurzname,
        hypothese: lauf.hypothesen[i] || "",
        endzustandBild: endzustandBild(lauf.waldtypen[i].id, lauf.regler, zr20[i]),
        kurzbeschreibung: kurzbeschreibung(zr20[i]),
      })),
      snapshots: lauf.snapshots || [],
      reflexionstext,
    };

    const alle = ladeAlle();
    alle.unshift(eintrag);
    speichereAlle(alle);
    aktualisiereZaehler();
  }

  // ---- Übersicht ----

  function waldTeilHtml(w) {
    return `
      <div class="forscherheft-wald">
        ${spriteFrameHtml(`./assets/sprites/${w.endzustandBild}`, `${w.waldtypName}: Endzustand`, WALD_EMOJI[w.waldtypId] || "🌲", "sprite-16-9")}
        <strong>${escapeHtml(w.waldtypName)}</strong>
        <p class="forscherheft-hypothese">Hypothese: ${w.hypothese ? escapeHtml(w.hypothese) : "(keine angegeben)"}</p>
        <p class="forscherheft-kurzbeschreibung">${escapeHtml(w.kurzbeschreibung)}</p>
      </div>
    `;
  }

  function eintragHtml(data, eintrag, index) {
    const stempelNamen = eintrag.waelder.map((w) => w.waldtypName).join(" / ");
    const waelderHtml = eintrag.waelder.map(waldTeilHtml).join("");
    const text = exportText(data, eintrag);

    return `
      <li class="forscherheft-eintrag">
        <div class="forscherheft-eintrag-kopf">
          <div class="feldbuch-stempel">
            <span class="feldbuch-stempel-zeile">${escapeHtml(stempelNamen)}</span>
            <span class="feldbuch-stempel-zeile">${escapeHtml(ereignisText(data, eintrag.ereignisse))}</span>
            <span class="feldbuch-stempel-datum">${formatDatum(eintrag.zeitpunkt)}</span>
          </div>
          <button type="button" class="forscherheft-loeschen" data-index="${index}" aria-label="Eintrag löschen">×</button>
        </div>
        <p class="forscherheft-konfiguration">Wildverbiss-Regler: ${kapitalisiere(eintrag.regler)}</p>
        <div class="forscherheft-waelder">${waelderHtml}</div>
        ${eintrag.snapshots.length > 0 ? `<p class="form-hint">${eintrag.snapshots.length} Kurven-Snapshot(s) gemerkt: ${eintrag.snapshots.map((s) => escapeHtml(s.namen.join(", "))).join(" · ")}</p>` : ""}
        ${eintrag.reflexionstext ? `<p class="forscherheft-reflexion"><strong>Reflexion:</strong> ${escapeHtml(eintrag.reflexionstext)}</p>` : `<p class="form-hint">(keine Reflexion angegeben)</p>`}
        <button type="button" class="secondary-button secondary-button--kompakt forscherheft-netzwerk-button" data-index="${index}">🕸️ Im Netzwerk ansehen</button>
        <button type="button" class="secondary-button secondary-button--kompakt forscherheft-export-button" data-index="${index}">Als Text exportieren</button>
        <div class="forscherheft-export-bereich" id="fb-export-${index}" hidden>
          <textarea id="fb-export-text-${index}" class="forscherheft-export-text" readonly rows="8">${escapeHtml(text)}</textarea>
          <div class="forscherheft-export-aktionen">
            <button type="button" class="secondary-button secondary-button--kompakt forscherheft-kopieren-button" data-index="${index}">In Zwischenablage kopieren</button>
            ${navigator.share ? `<button type="button" class="secondary-button secondary-button--kompakt forscherheft-teilen-button" data-index="${index}">Teilen</button>` : ""}
          </div>
        </div>
      </li>
    `;
  }

  async function renderUebersicht() {
    const data = await WaldsimData.load();
    const alle = ladeAlle();

    document.getElementById("forscherheft-fortschritt").textContent =
      alle.length === 0 ? "Noch keine Durchläufe dokumentiert." : `Bisher ${alle.length} Durchlauf${alle.length === 1 ? "" : "e"} dokumentiert.`;

    document.getElementById("forscherheft-neue-sitzung-button").disabled = alle.length === 0;

    document.getElementById("forscherheft-liste").innerHTML =
      alle.length === 0
        ? '<li class="form-hint">Noch keine gespeicherten Forscherheft-Seiten. Ein Durchlauf wird nach der Reflexionsfrage automatisch hier abgelegt.</li>'
        : alle.map((eintrag, index) => eintragHtml(data, eintrag, index)).join("");
  }

  async function zeigeUebersicht() {
    await renderUebersicht();
    showScreen("screen-forscherheft");
  }

  function init() {
    wireEvents();
    aktualisiereZaehler();
  }

  return { starteReflexion, zeigeUebersicht, init };
})();
