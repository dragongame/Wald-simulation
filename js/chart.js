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

  // Feste Farbzuordnung je Indikator (Reihenfolge aus data/indikatoren.json),
  // damit Legende und Diagramme über Analyse-Screen und Forscherheft hinweg
  // konsistent bleiben. Signalrot bleibt bewusst ausgespart (laut Styleguide
  // reserviert für den Fichtenmonokultur-Kollaps im Dashboard).
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
    reh_dichte: "#8C6349",
    rothirsch_dichte: "#6B4E3D",
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

  function farbeFuer(indikatorId) {
    return INDIKATOR_FARBEN[indikatorId] || "#888888";
  }

  function werteAusZeitreihe(zeitreihe, indikatorId) {
    const werte = [];
    for (let jahr = 0; jahr <= JAHRE_GESAMT; jahr++) {
      werte.push(zeitreihe[`jahr_${jahr}`][indikatorId] ?? 0);
    }
    return werte;
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
   * @param {{werte: number[], farbe: string, dash?: string}[]} kurven
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
          `<polyline points="${punktePfad(k.werte)}" class="analyse-linie" style="stroke:${k.farbe}" stroke-dasharray="${k.dash || ""}"/>`
      )
      .join("");

    return `
      <svg viewBox="0 0 320 180" class="analyse-chart" role="img" aria-label="Kurvendiagramm ${escapeHtml(waldName)}, Jahr 0 bis 20, Skala 0 bis 100">
        ${gitter}${xAchse}${linien}
      </svg>
    `;
  }

  return { JAHRE_GESAMT, DASH_MUSTER, farbeFuer, werteAusZeitreihe, svg };
})();
