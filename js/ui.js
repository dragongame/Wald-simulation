/**
 * Kleine, von mehreren Screens gemeinsam genutzte UI-Hilfsfunktionen:
 * HTML-Escaping und die Sprite-Kachel mit automatischem Emoji+Label-
 * Fallback, falls das externe Bild (noch) fehlt (siehe Milestones-Dokument,
 * "Bekannte Lücken"). Der Fallback greift über einen einzigen, in
 * startScreen.js registrierten `error`-Listener auf #app (capture-Phase,
 * da img-error-Events nicht bubbeln) - gilt automatisch auch für hier
 * erzeugte Kacheln.
 */
const WaldsimUI = (() => {
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function kapitalisiere(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function spriteFrameHtml(src, alt, emoji, extraClass) {
    return `
      <span class="sprite-frame ${extraClass || ""}">
        <img src="${src}" alt="${escapeHtml(alt)}" loading="lazy">
        <span class="sprite-fallback">
          <span class="sprite-fallback-emoji" aria-hidden="true">${emoji}</span>
          <span class="sprite-fallback-text">${escapeHtml(alt)}</span>
        </span>
      </span>
    `;
  }

  function showScreen(id) {
    document.querySelectorAll(".screen").forEach((el) => {
      el.hidden = el.id !== id;
    });
    // Feldbuch-Navigation (M20) haengt sich hier zentral ein, statt dass
    // jeder Aufrufer sie einzeln benachrichtigen muesste. typeof-Check statt
    // window.WaldsimNav, da "const"-Deklarationen oberster Ebene keine
    // window-Property erzeugen.
    if (typeof WaldsimNav !== "undefined") WaldsimNav.updateActiveState(id);
  }

  return { escapeHtml, kapitalisiere, spriteFrameHtml, showScreen };
})();
