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
  // M26: zwei weitere, allgemein einsetzbare Leitfragen (Wissensbasis Abschnitt 6.5, Ergänzung 2026-09-11).
  const REFLEXIONSFRAGE_VORHERSAGE_VERGLEICH =
    "Was hat dich am stärksten überrascht, wenn du deine Vorhersage mit dem tatsächlichen Ergebnis vergleichst?";
  const REFLEXIONSFRAGE_STAERKERE_STOERUNG =
    "Was würde vermutlich passieren, wenn die Störung noch stärker wäre oder deutlich länger anhalten würde?";

  let laufMitSnapshots = null; // wird von WaldsimAnalyse.starteReflexion() gesetzt
  let frischGestempeltId = null; // Eintrags-ID für den Stempel-Effekt beim nächsten Übersicht-Render (Styleguide 7)
  // M20: statt alle Einträge untereinander zu scrollen, zeigt die Übersicht
  // immer nur einen Eintrag, ausgewählt über eine Reihe kleiner Post-it-Tabs
  // (eine Seite nach der anderen umblättern). Neue Einträge landen per
  // unshift() vorn in der Liste, Index 0 zeigt also automatisch den zuletzt
  // gespeicherten Eintrag - der Stempel-Effekt (frischGestempeltId) bleibt
  // dadurch ohne Zusatzlogik korrekt.
  let aktiverEintragIndex = 0;

  function bucket(value) {
    if (value < 34) return "niedrig";
    if (value < 67) return "mittel";
    return "hoch";
  }

  function endzustandBild(waldtypId, regler, zr20) {
    // "beide" (Wolf + Luchs anwesend) ist seit 2026-08-26 der Ausgangszustand
    // ohne Effekt, ersetzt das frühere "niedrig" (siehe Milestones-Dokument).
    if (waldtypId === "mischwald" && regler !== "beide" && zr20.verjuengung_mischbaumarten < 50 && zr20.gesamtvitalitaet >= 60) {
      return "wald_mischwald_verarmt_reinbestand.png";
    }
    const stufe = zr20.gesamtvitalitaet >= 67 ? "stabil" : zr20.gesamtvitalitaet >= 34 ? "geschaedigt" : "kollabiert";
    return `wald_${waldtypId}_${stufe}.png`;
  }

  function kurzbeschreibung(zr20) {
    return `Baumbestand am Ende: ${Math.round(zr20.gesamtvitalitaet)} von 100 (${bucket(zr20.gesamtvitalitaet)}). Biodiversität: ${Math.round(zr20.biodiversitaet)} (${bucket(zr20.biodiversitaet)}).`;
  }

  function zr20Fuer(lauf) {
    return [0, 1].map((i) => lauf.zeitreihen[i].zeitreihe.jahr_20);
  }

  // M25: stellt vor den Reflexionsfragen die eingangs erfasste Hypothese (M4)
  // dem tatsächlichen Ergebnis gegenüber, statt den Vorhersage-Realität-
  // Abgleich dem Zufall zu überlassen.
  function vergleichHtml(lauf, zr20) {
    return [0, 1]
      .map((i) => {
        const hypothese = lauf.hypothesen[i];
        return `
          <div class="reflexion-vergleich-wald">
            <strong>${escapeHtml(lauf.waldtypen[i].kurzname)}</strong>
            <p class="reflexion-vergleich-hypothese"><span class="reflexion-vergleich-label">Deine Vorhersage:</span> ${hypothese ? escapeHtml(hypothese) : "(keine angegeben)"}</p>
            <p class="reflexion-vergleich-ergebnis"><span class="reflexion-vergleich-label">Tatsächliches Ergebnis:</span> ${escapeHtml(kurzbeschreibung(zr20[i]))}</p>
          </div>
        `;
      })
      .join("");
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
    if (el) el.textContent = String(anzahl);
  }

  function formatDatum(iso) {
    const d = new Date(iso);
    return `${d.toLocaleDateString("de-DE")} ${d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}`;
  }

  function formatDatumKurz(iso) {
    return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
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

    document.getElementById("reflexion-vergleich").innerHTML = vergleichHtml(lauf, zr20Fuer(lauf));

    const fragen = [REFLEXIONSFRAGE_STANDARD, REFLEXIONSFRAGE_VORHERSAGE_VERGLEICH, REFLEXIONSFRAGE_STAERKERE_STOERUNG];
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

    document.getElementById("forscherheft-tabs").addEventListener("click", (event) => {
      const tab = event.target.closest(".forscherheft-tab");
      if (!tab) return;
      aktiverEintragIndex = Number(tab.dataset.index);
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
          if (index < aktiverEintragIndex) aktiverEintragIndex -= 1;
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
    const zr20 = zr20Fuer(lauf);

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
    frischGestempeltId = eintrag.id;
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

  // Meilenstein M16: die gemerkten Kurven-Snapshots (seit M6/M7 als reine
  // Kurvendaten im Eintrag vorhanden, siehe js/analyse.js `kurvenFuer()`)
  // werden hier als echte Kurvengrafik gerendert statt nur als Textliste
  // der Indikatornamen referenziert. Legende zippt `namen`/`indikatorIds`
  // mit `kurven[0]` per Index - beide Arrays stammen aus derselben,
  // stabil sortierten Filterung in js/analyse.js, die Reihenfolge ist
  // also garantiert identisch.
  function snapshotHtml(eintrag, snap) {
    // Vor M16 gespeicherte Einträge haben noch keine `kurven`-Daten (nur
    // indikatorIds/namen) - für diese bleibt es beim reinen Textnamen,
    // da die Original-Zeitreihe zum Nachbau der Grafik nicht mehr vorliegt.
    if (!snap.kurven) {
      return `<p class="form-hint">Kurven-Kombination gemerkt (ohne Grafik, vor einem App-Update gespeichert): ${escapeHtml(snap.namen.join(", "))}</p>`;
    }
    const legendeHtml = snap.namen
      .map(
        (name, idx) =>
          `<li>${WaldsimChart.legendenChipSvg(snap.kurven[0][idx].farbe, snap.kurven[0][idx].dash)}${escapeHtml(name)}</li>`
      )
      .join("");
    const chartsHtml = eintrag.waelder
      .map(
        (w, i) => `
          <article class="analyse-wald-panel">
            <h2>${escapeHtml(w.waldtypName)}</h2>
            ${WaldsimChart.svg(w.waldtypName, snap.kurven[i])}
          </article>
        `
      )
      .join("");

    return `
      <div class="forscherheft-snapshot">
        <ul class="forscherheft-snapshot-legende">${legendeHtml}</ul>
        <div class="analyse-charts">${chartsHtml}</div>
      </div>
    `;
  }

  function eintragHtml(data, eintrag, index) {
    const stempelNamen = eintrag.waelder.map((w) => w.waldtypName).join(" / ");
    const waelderHtml = eintrag.waelder.map(waldTeilHtml).join("");
    const text = exportText(data, eintrag);
    const stempelKlasse = eintrag.id === frischGestempeltId ? "feldbuch-stempel feldbuch-stempel--frisch" : "feldbuch-stempel";

    return `
      <li class="forscherheft-eintrag">
        <div class="forscherheft-eintrag-kopf">
          <div class="${stempelKlasse}">
            <span class="feldbuch-stempel-zeile">${escapeHtml(stempelNamen)}</span>
            <span class="feldbuch-stempel-zeile">${escapeHtml(ereignisText(data, eintrag.ereignisse))}</span>
            <span class="feldbuch-stempel-datum">${formatDatum(eintrag.zeitpunkt)}</span>
          </div>
          <button type="button" class="forscherheft-loeschen" data-index="${index}" aria-label="Eintrag löschen">×</button>
        </div>
        <p class="forscherheft-konfiguration">Wildverbiss-Regler: ${kapitalisiere(eintrag.regler)}</p>
        <div class="forscherheft-waelder">${waelderHtml}</div>
        ${eintrag.snapshots.length > 0 ? `<div class="forscherheft-snapshots">${eintrag.snapshots.map((s) => snapshotHtml(eintrag, s)).join("")}</div>` : ""}
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

  function tabHtml(eintrag, index) {
    const stempelNamenKurz = eintrag.waelder.map((w) => w.waldtypName).join(" / ");
    const aktivKlasse = index === aktiverEintragIndex ? " forscherheft-tab--aktiv" : "";
    return `
      <button type="button" class="forscherheft-tab${aktivKlasse}" data-index="${index}" aria-current="${index === aktiverEintragIndex}">
        <span class="forscherheft-tab-datum">${formatDatumKurz(eintrag.zeitpunkt)}</span>
        <span class="forscherheft-tab-namen">${escapeHtml(stempelNamenKurz)}</span>
      </button>
    `;
  }

  async function renderUebersicht() {
    const data = await WaldsimData.load();
    const alle = ladeAlle();

    aktiverEintragIndex = Math.max(0, Math.min(aktiverEintragIndex, alle.length - 1));

    document.getElementById("forscherheft-fortschritt").textContent =
      alle.length === 0 ? "Noch keine Durchläufe dokumentiert." : `Bisher ${alle.length} Durchlauf${alle.length === 1 ? "" : "e"} dokumentiert.`;

    document.getElementById("forscherheft-neue-sitzung-button").disabled = alle.length === 0;

    document.getElementById("forscherheft-tabs").innerHTML = alle.map((eintrag, index) => tabHtml(eintrag, index)).join("");

    document.getElementById("forscherheft-liste").innerHTML =
      alle.length === 0
        ? '<li class="form-hint">Noch keine gespeicherten Forscherheft-Seiten. Ein Durchlauf wird nach der Reflexionsfrage automatisch hier abgelegt.</li>'
        : eintragHtml(data, alle[aktiverEintragIndex], aktiverEintragIndex);

    frischGestempeltId = null;
  }

  async function zeigeUebersicht() {
    aktiverEintragIndex = 0;
    await renderUebersicht();
    showScreen("screen-forscherheft");
  }

  function init() {
    wireEvents();
    aktualisiereZaehler();
  }

  return { starteReflexion, zeigeUebersicht, init };
})();
