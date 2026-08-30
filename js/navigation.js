/**
 * Feldbuch-Navigation (Meilenstein M20): eine durchgängig sichtbare, senkrechte
 * Reihe aus 5 "Post-it"-Registern am rechten Rand (assets/icons/post-it_*.webp,
 * aus docs/eingang/Bockmarks-3.png geschnitten), die die vier bisher nur im
 * Start-Bildschirm-Header verfügbaren Ziele (Forscherheft/Netzwerk/Lexikon/
 * Lehrkräfte) plus Start selbst app-weit erreichbar macht. Löst damit auch
 * die in M20 geforderte Prüfung von M8s Regel "Netzwerk-Trigger durchgängig
 * sichtbar" (Umsetzungsauftrag 2.3) - vorher existierte der Button nur auf
 * dem Start-Bildschirm.
 *
 * Die vier bestehenden Ziel-Buttons (IDs unverändert: forscherheft-oeffnen-
 * button, netzwerk-oeffnen-button, lexikon-oeffnen-button, lehrkraft-
 * oeffnen-button) sitzen jetzt hier in der Nav-Leiste statt im Start-Header,
 * ihre Klick-Logik bleibt vollständig in js/forscherheft.js/graph.js/
 * lexikon.js/lehrkraft.js - dieses Modul fügt nur den neuen Start-Button
 * hinzu und hält den "aktiv"-Zustand der Tabs + das Register-Etikett oben
 * (`post-it_lesezeichen.webp`) aktuell.
 *
 * Zustands-Tracking läuft zentral über WaldsimUI.showScreen() (js/ui.js),
 * das nach jedem Bildschirmwechsel updateActiveState() aufruft - kein
 * anderes Modul muss dafür geändert werden.
 */
const WaldsimNav = (() => {
  const { showScreen } = WaldsimUI;

  // Bildschirm -> (zugehöriger Tab, Anzeigetext fürs Register-Etikett).
  // Bildschirme ohne eigenen Tab (Dashboard/Analyse/Reflexion/Netzwerk-
  // Sperre/Brief) werden ihrem thematisch nächsten Tab zugeordnet, damit
  // die Nav-Leiste auch dort sinnvoll "aktiv" anzeigt.
  const SCREEN_INFO = {
    "screen-start": { tab: "screen-start", label: "Start" },
    "screen-dashboard": { tab: "screen-start", label: "Simulation läuft" },
    "screen-analyse": { tab: "screen-start", label: "Analyse" },
    "screen-reflexion": { tab: "screen-forscherheft", label: "Reflexion" },
    "screen-forscherheft": { tab: "screen-forscherheft", label: "Forscherheft" },
    "screen-netzwerk-sperre": { tab: "screen-graph", label: "Netzwerk (gesperrt)" },
    "screen-brief": { tab: "screen-graph", label: "Brief" },
    "screen-graph": { tab: "screen-graph", label: "Netzwerk-Graph" },
    "screen-lexikon": { tab: "screen-lexikon", label: "Arten-Lexikon" },
    "screen-lehrkraft": { tab: "screen-lehrkraft", label: "Für Lehrkräfte" },
  };

  function updateActiveState(screenId) {
    const info = SCREEN_INFO[screenId];
    document.querySelectorAll("#feldbuch-nav .post-it").forEach((button) => {
      const aktiv = !!info && button.dataset.navTarget === info.tab;
      button.classList.toggle("post-it--aktiv", aktiv);
      button.setAttribute("aria-current", aktiv ? "true" : "false");
    });
    const indikator = document.getElementById("feldbuch-nav-indikator");
    if (indikator) indikator.textContent = info ? info.label : "";
    positionNav();
  }

  // Positioniert die Register-Leiste an der tatsaechlichen rechten Kante der
  // aktuell sichtbaren "Buchseite" (bei screen-start ist das .wizard-buch,
  // die cremefarbenen Seiten - nicht .wizard-tisch/der volle Bildschirm, da
  // .wizard-screen bewusst fixed+inset:0 ist und der Holztisch-Rahmen deutlich
  // breiter ist als die eigentlichen Seiten). Ohne das haengt die Leiste rein
  // am Viewport-Rand und driftet auf breiten Bildschirmen von der
  // (zentrierten, max-width-begrenzten) Seite weg.
  const UEBERLAPPUNG_PX = 6;

  function positionNav() {
    const nav = document.getElementById("feldbuch-nav");
    const activeScreen = document.querySelector(".screen:not([hidden])");
    if (!nav || !activeScreen) return;
    const inhaltsElement =
      (activeScreen.id === "screen-start" && activeScreen.querySelector(".wizard-buch")) || activeScreen;
    const rect = inhaltsElement.getBoundingClientRect();
    if (rect.width === 0) return;
    nav.style.left = `${Math.round(rect.right - UEBERLAPPUNG_PX)}px`;
  }

  function wireEvents() {
    const startButton = document.getElementById("nav-start-button");
    if (startButton) {
      startButton.addEventListener("click", () => showScreen("screen-start"));
    }
    window.addEventListener("resize", positionNav);
  }

  function init() {
    wireEvents();
    positionNav();
  }

  return { init, updateActiveState };
})();
