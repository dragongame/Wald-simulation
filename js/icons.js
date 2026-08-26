/**
 * Handgezeichnete, einfache SVG-Icons für die Feldmessinstrumente des
 * Dashboards (Styleguide Abschnitt 8: "Format bevorzugt SVG für Icons,
 * Etiketten, UI-Elemente"; Abschnitt 5/7 der Fehlende_Grafiken_Bekannt-Liste
 * stellt klar, dass UI-Chrome wie Instrumenten-Rahmen/Zeiger direkt im Code
 * entstehen soll, keine externe Bildgenerierung). currentColor, damit CSS
 * die Farbe pro Instrument-Rolle setzt.
 *
 * Seit M8 zusätzlich: kleine Kanten-Symbole für den Netzwerk-Graphen
 * (Styleguide Abschnitt 5, "Kanten werden farbig UND mit einem kleinen
 * Symbol direkt auf der Linie gekennzeichnet"). "sonne"/"thermometer" sind
 * neu für die abiotische Kopplung von Licht/Temperatur ("regen" existierte
 * bereits für Wasser); "saege"/"huf" lösen den in data/edges.json
 * dokumentierten M8-TODO für die beiden Szenario-5/6-Kantentypen
 * (bewirtschaftung/strukturell) auf, siehe Milestones-Dokument.
 */
const WaldsimIcons = (() => {
  const PATHS = {
    baum: '<path d="M12 2 L18.5 12.5 L15.2 12.5 L20.5 20.5 L3.5 20.5 L8.8 12.5 L5.5 12.5 Z"/><rect x="10.7" y="20.5" width="2.6" height="2" rx="0.4"/>',
    kaefer:
      '<ellipse cx="12" cy="13" rx="5.5" ry="7.5"/><line x1="12" y1="6" x2="12" y2="20"/>' +
      '<line x1="7" y1="9" x2="3.5" y2="7"/><line x1="7" y1="13" x2="3" y2="13"/><line x1="7" y1="17" x2="3.5" y2="19"/>' +
      '<line x1="17" y1="9" x2="20.5" y2="7"/><line x1="17" y1="13" x2="21" y2="13"/><line x1="17" y1="17" x2="20.5" y2="19"/>' +
      '<line x1="10.5" y1="5.5" x2="9" y2="2.5"/><line x1="13.5" y1="5.5" x2="15" y2="2.5"/>',
    totholz:
      '<rect x="2" y="15" width="14" height="4.5" rx="2.25"/><circle cx="17.5" cy="17.25" r="2.6" fill="none" stroke-width="1.3"/>' +
      '<rect x="6" y="7.5" width="14" height="4.5" rx="2.25"/><circle cx="4.5" cy="9.75" r="2.6" fill="none" stroke-width="1.3"/>',
    krone: '<circle cx="8.3" cy="10.5" r="6"/><circle cx="15.7" cy="10.5" r="6"/><circle cx="12" cy="15.5" r="6"/>',
    regen: '<path d="M12 2.5 C12 2.5 5.5 11.5 5.5 15.8 A6.5 6.5 0 0 0 18.5 15.8 C18.5 11.5 12 2.5 12 2.5 Z"/>',
    vielfalt: '<circle cx="5.5" cy="13" r="3.2"/><path d="M13 6.5 L16.8 15.5 L9.2 15.5 Z"/><rect x="16" y="8.5" width="6" height="6" rx="1"/>',

    // ---- Netzwerk-Graph-Kantensymbole (M8, Styleguide Abschnitt 5) ----
    biss:
      '<path d="M4 12 L10 5 L12 9 L14 5 L20 12 L14 10 L12 14 L10 10 Z" fill="currentColor" stroke="none"/>',
    ringe:
      '<circle cx="9" cy="12" r="5" fill="none" stroke-width="1.6"/><circle cx="15" cy="12" r="5" fill="none" stroke-width="1.6"/>',
    kronen:
      '<circle cx="9" cy="11" r="6.5" fill="none" stroke-width="1.4"/><circle cx="15" cy="11" r="6.5" fill="none" stroke-width="1.4"/>',
    spirale:
      '<path d="M12 12 m0 -6 a6 6 0 1 1 -4.2 10.2 a4 4 0 1 1 2.8 -6.8 a2 2 0 1 1 -1.4 3.4" fill="none" stroke-width="1.4"/>',
    sonne:
      '<circle cx="12" cy="12" r="3.4" fill="currentColor" stroke="none"/><line x1="12" y1="3" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="21"/><line x1="3" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="21" y2="12"/><line x1="5.5" y1="5.5" x2="7.6" y2="7.6"/><line x1="16.4" y1="16.4" x2="18.5" y2="18.5"/><line x1="5.5" y1="18.5" x2="7.6" y2="16.4"/><line x1="16.4" y1="7.6" x2="18.5" y2="5.5"/>',
    thermometer:
      '<rect x="9.5" y="3" width="5" height="12" rx="2.5" fill="none" stroke-width="1.4"/><circle cx="12" cy="18" r="3.2" fill="currentColor" stroke="none"/><line x1="12" y1="6" x2="12" y2="15"/>',
    saege:
      '<line x1="3" y1="16" x2="21" y2="8"/><path d="M5 15.3 L7 14.4 L6.3 16.8 Z M9 13.5 L11 12.6 L10.3 15 Z M13 11.7 L15 10.8 L14.3 13.2 Z M17 9.9 L19 9 L18.3 11.4 Z" fill="currentColor" stroke="none"/>',
    huf:
      '<path d="M8 16 C6 14 6 9 8.5 6.5 C9.5 5.5 10.5 5.5 11.5 6.5 C12.5 7.5 12.5 8.5 11.5 9.5 C15 9.5 17 12 16 16 C15 19 9 19 8 16 Z" fill="none" stroke-width="1.4"/>',
  };

  function svg(id, extraClass) {
    const inner = PATHS[id] || "";
    return `<svg class="instrument-icon-svg ${extraClass || ""}" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  }

  /**
   * Icon als <g> statt als verschachteltes <svg> - fuer den Einsatz
   * INNERHALB eines anderen SVG-Koordinatensystems (Netzwerk-Graph, M8).
   * CSS-Groessensteuerung (width/height) auf einem verschachtelten <svg>
   * verhaelt sich browserabhaengig uneinheitlich (u. a. Safari/iPadOS);
   * eine <g> mit translate+scale-Transform ist dafuer robust.
   */
  function inline(id, cx, cy, size) {
    const inner = PATHS[id] || "";
    const skala = size / 24;
    const x = (cx - size / 2).toFixed(2);
    const y = (cy - size / 2).toFixed(2);
    return `<g transform="translate(${x} ${y}) scale(${skala.toFixed(4)})" fill="currentColor" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${inner}</g>`;
  }

  return { svg, inline };
})();
