/**
 * Handgezeichnete, einfache SVG-Icons für die Feldmessinstrumente des
 * Dashboards (Styleguide Abschnitt 8: "Format bevorzugt SVG für Icons,
 * Etiketten, UI-Elemente"; Abschnitt 5/7 der Fehlende_Grafiken_Bekannt-Liste
 * stellt klar, dass UI-Chrome wie Instrumenten-Rahmen/Zeiger direkt im Code
 * entstehen soll, keine externe Bildgenerierung). currentColor, damit CSS
 * die Farbe pro Instrument-Rolle setzt.
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
  };

  function svg(id, extraClass) {
    const inner = PATHS[id] || "";
    return `<svg class="instrument-icon-svg ${extraClass || ""}" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  }

  return { svg };
})();
