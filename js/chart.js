/**
 * Gemeinsame Kurvendiagramm-Erzeugung (SVG), genutzt von js/analyse.js
 * (Meilenstein M6, live über die aktuell ausgewählten Indikatoren) und
 * js/forscherheft.js (Meilenstein M16, statischer Nachbau der bis zu 3
 * gemerkten Kurven-Snapshots aus einem gespeicherten Forscherheft-Eintrag).
 * Ursprünglich Teil von js/analyse.js, für M16 hierher extrahiert, damit
 * beide Screens dieselbe Farb-/Achsen-/Pfad-Logik verwenden statt sie zu
 * duplizieren.
 */
const WaldsimChart = (() => {
  const { escapeHtml } = WaldsimUI;

  const JAHRE_GESAMT = 20;
  const DASH_MUSTER = ["", "6 3", "2 3", "8 2 2 2"];

  // Farbe + Linienstil sind gemeinsam fest je Indikator hinterlegt (statt wie
  // vor Backlog "Kurven-Darstellung verbessern" Farbe fix + Linienstil live
  // aus dem Auswahl-Index berechnet) - damit ändert sich beim An-/Abwählen
  // weiterer Kurven weder Farbe noch Linienstil bereits sichtbarer Kurven.
  // Farbe ist an die `kategorie` aus data/indikatoren.json gekoppelt (nicht
  // mehr an den einzelnen Indikator), damit z.B. alle Baumarten als
  // Grün-Familie erkennbar sind. Kategorien mit mehr als 4 Mitgliedern
  // (baumbestand, praedator) bekommen zwei eng verwandte Farbtöne entlang
  // einer fachlich sinnvollen Untergruppe (Nadel-/Laubbaum bzw. Vögel/
  // Boden-Rinden-Prädatoren, siehe Wissensbasis Nr. 23-26), damit jede
  // Farb-Untergruppe mit höchstens 4 Linienstilen auskommt. Signalrot bleibt
  // bewusst ausgespart (laut Styleguide reserviert für den
  // Fichtenmonokultur-Kollaps im Dashboard).
  //
  // Alle 16 Kategorie-Grundfarben wurden 2026-09-10 gegen die "dataviz"-Skill-
  // Checks (OKLCH-Helligkeitsband, Chroma-Untergrenze, CVD-Abstand Protan/
  // Deutan/Tritan, Kontrast gegen den Papier-Hintergrund #EFE9DC) neu über den
  // Farbkreis verteilt, weil die ursprüngliche Palette 6 Kategorien im selben
  // schmalen Braun/Orange-Tonband hatte (siehe Milestones-Doku, Abschnitt
  // "M24-Farbpalette"). Alle 16 bestehen jetzt Helligkeitsband + Chroma-
  // Untergrenze, der schlechteste Nachbar-Abstand liegt bei ΔE 4,5 (OKLab,
  // Deutan) statt vorher 0,3 - bei 16 gleichzeitig frei wählbaren Kategorien
  // ist ein durchgängiges ΔE ≥ 8 rechnerisch nicht erreichbar (die Skill-Doku
  // selbst beschreibt das schon für 8 Kategorien als Grenze); Linienmuster +
  // Textlabel im Legenden-Chip bleiben deshalb laut Styleguide 5.5 immer die
  // verbindliche zweite Kennung, nie Farbe allein.
  const INDIKATOR_STIL = {
    // baumbestand - Nadelbaum-Familie (dunkles Grün)
    gesamtvitalitaet: { farbe: "#087736", dash: 0 },
    fichte_vitalitaet: { farbe: "#087736", dash: 1 },
    kiefer_vitalitaet: { farbe: "#087736", dash: 2 },
    // baumbestand - Laubbaum-Familie (helleres Grün)
    buche_vitalitaet: { farbe: "#76923F", dash: 0 },
    eiche_vitalitaet: { farbe: "#76923F", dash: 1 },
    birke_anteil: { farbe: "#76923F", dash: 2 },

    borkenkaefer_dichte: { farbe: "#C06C4F", dash: 0 }, // schaedling

    totholzmenge: { farbe: "#A23C42", dash: 0 }, // struktur
    kronendach: { farbe: "#A23C42", dash: 1 },

    bodenfeuchte: { farbe: "#0C9C82", dash: 0 }, // abiotisch
    biodiversitaet: { farbe: "#8679C6", dash: 0 }, // biodiversitaet

    verjuengung_mischbaumarten: { farbe: "#BD6783", dash: 0 }, // wildverbiss
    reh_dichte: { farbe: "#BD6783", dash: 1 },
    rothirsch_dichte: { farbe: "#BD6783", dash: 2 },

    brandrisiko: { farbe: "#933F7B", dash: 0 }, // szenario5

    hasel_anteil: { farbe: "#AA7D25", dash: 0 }, // strauch
    holunder_anteil: { farbe: "#AA7D25", dash: 1 },
    brombeere_anteil: { farbe: "#AA7D25", dash: 2 },

    zunderschwamm_indikator: { farbe: "#B06AA2", dash: 0 }, // pilz
    blaeuepilz_indikator: { farbe: "#B06AA2", dash: 1 },
    hallimasch_indikator: { farbe: "#B06AA2", dash: 2 },

    brennnessel_indikator: { farbe: "#796600", dash: 0 }, // kraut
    buschwindroeschen_indikator: { farbe: "#796600", dash: 1 },
    waldmeister_indikator: { farbe: "#796600", dash: 2 },
    heidelbeere_indikator: { farbe: "#796600", dash: 3 },

    eichelhaeher_indikator: { farbe: "#0096A6", dash: 0 }, // verbreiter

    eichhoernchen_indikator: { farbe: "#994C00", dash: 0 }, // herbivor
    raupen_indikator: { farbe: "#994C00", dash: 1 },
    blattlaeuse_indikator: { farbe: "#994C00", dash: 2 },

    // praedator - Vögel-Familie (Buntspecht/Habicht/Sperber, schlagen v.a.
    // in der Baum-/Luftschicht zu, siehe Wissensbasis Nr. 23/26)
    buntspecht_indikator: { farbe: "#2D90C1", dash: 0 },
    habicht_indikator: { farbe: "#2D90C1", dash: 1 },
    sperber_indikator: { farbe: "#2D90C1", dash: 2 },
    // praedator - Boden-/Rinden-Familie (Ameisenbuntkäfer auf der Rinde,
    // Fuchs am Boden, siehe Wissensbasis Nr. 24/25)
    ameisenbuntkaefer_indikator: { farbe: "#3D5EAF", dash: 0 },
    fuchs_indikator: { farbe: "#3D5EAF", dash: 1 },

    kleinsaeuger_indikator: { farbe: "#7D499A", dash: 0 }, // kleinsaeuger
  };

  function stilFuer(indikatorId) {
    return INDIKATOR_STIL[indikatorId] || { farbe: "#888888", dash: 0 };
  }

  function farbeFuer(indikatorId) {
    return stilFuer(indikatorId).farbe;
  }

  function linienstilFuer(indikatorId) {
    return DASH_MUSTER[stilFuer(indikatorId).dash % DASH_MUSTER.length];
  }

  /** Kleines Linien-Icon für Legenden, exakt im selben Farb-/Dash-Muster wie die echte Kurve. */
  function legendenChipSvg(farbe, dash) {
    return `<svg class="analyse-farb-chip" viewBox="0 0 20 10" width="20" height="10" aria-hidden="true"><line x1="1" y1="5" x2="19" y2="5" stroke="${farbe}" stroke-width="2.5" stroke-dasharray="${dash || ""}"/></svg>`;
  }

  function werteAusZeitreihe(zeitreihe, indikatorId) {
    const werte = [];
    for (let jahr = 0; jahr <= JAHRE_GESAMT; jahr++) {
      werte.push(zeitreihe[`jahr_${jahr}`][indikatorId] ?? 0);
    }
    return werte;
  }

  // Sammelkurven der vereinfachten Projektion (M29/M30): `kurve` ist die
  // build-seitig bereits gemittelte {jahr_0..jahr_20}-Reihe eines einzelnen
  // Kategorie-Durchschnitts, kein Indikator-Objekt - eigene Extraktion statt
  // werteAusZeitreihe(), da dort pro Jahr mehrere Indikatoren stehen.
  function werteAusKurve(kurve) {
    const werte = [];
    for (let jahr = 0; jahr <= JAHRE_GESAMT; jahr++) {
      werte.push(kurve[`jahr_${jahr}`] ?? 0);
    }
    return werte;
  }

  // Einheitlicher, bewusst zurückhaltender Stil für alle Sammelkurven -
  // sollen als "Hintergrundrauschen" erkennbar bleiben statt mit der
  // INDIKATOR_STIL-Farbpalette der hervorgehobenen Einzelkurven zu
  // konkurrieren (Milestones-Dokument M30 "optisch abgesetzt").
  const GRUPPEN_STIL = { farbe: "#8C8272", dash: "3 3" };
  function gruppenStil() {
    return GRUPPEN_STIL;
  }

  function punktePfad(werte) {
    return werte
      .map((wert, jahr) => {
        const x = 30 + (jahr / JAHRE_GESAMT) * 280;
        const y = 150 - (wert / 100) * 140;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }

  /**
   * @param {string} waldName Für den aria-label-Text.
   * @param {{werte: number[], farbe: string, dash?: string, gruppiert?: boolean}[]} kurven
   */
  function svg(waldName, kurven) {
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
    const linien = kurven
      .map(
        (k) =>
          `<polyline points="${punktePfad(k.werte)}" class="analyse-linie${k.gruppiert ? " analyse-linie--gruppe" : ""}" style="stroke:${k.farbe}" stroke-dasharray="${k.dash || ""}"/>`
      )
      .join("");

    return `
      <svg viewBox="0 0 320 180" class="analyse-chart" role="img" aria-label="Kurvendiagramm ${escapeHtml(waldName)}, Jahr 0 bis 20, Skala 0 bis 100">
        ${gitter}${xAchse}${linien}
      </svg>
    `;
  }

  return {
    JAHRE_GESAMT,
    DASH_MUSTER,
    farbeFuer,
    linienstilFuer,
    legendenChipSvg,
    werteAusZeitreihe,
    werteAusKurve,
    gruppenStil,
    svg,
  };
})();
