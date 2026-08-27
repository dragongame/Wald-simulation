const statusEl = document.getElementById("app-status");
const versionEl = document.getElementById("app-version-hinweis");
const resetButton = document.getElementById("app-reset-button");

function setStatus(text) {
  if (statusEl) {
    statusEl.textContent = text;
  }
}

// Versionskennung fuer Tests: Hash aus sw-precache-manifest.json (wird von
// scripts/pwa/build_precache_manifest.py bei jeder Aenderung neu berechnet,
// siehe dortige Kommentare) - so laesst sich pruefen, ob wirklich die
// neueste Version getestet wird.
fetch("./sw-precache-manifest.json")
  .then((res) => res.json())
  .then((manifest) => {
    if (versionEl && manifest.version) {
      versionEl.textContent = `Version ${manifest.version.slice(0, 8)}`;
    }
  })
  .catch(() => {
    /* Versionsanzeige ist nicht kritisch fuer die Funktion der App */
  });

if (resetButton) {
  resetButton.addEventListener("click", () => {
    const bestaetigt = window.confirm(
      "App wirklich zuruecksetzen? Loescht das Forscherheft und die Freischaltung der Wissenschaftlerin/des Wissenschaftlers auf diesem Geraet und laedt die Seite neu. Das kann nicht rueckgaengig gemacht werden."
    );
    if (!bestaetigt) return;
    WaldsimStorage.clearAll();
    window.location.reload();
  });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then(() => setStatus(""))
      .catch((err) => {
        console.error("Service Worker Registrierung fehlgeschlagen:", err);
        setStatus("Offline-Modus konnte nicht eingerichtet werden – für den ersten Start ist eine Internetverbindung nötig.");
      });
  });
} else {
  setStatus("Dieser Browser unterstützt keine Offline-Nutzung.");
}

WaldsimNav.init();
WaldsimForscherheft.init();
WaldsimGraph.init();
WaldsimLexikon.init();
WaldsimLehrkraft.init();

WaldsimStartScreen.init().catch((err) => {
  console.error("Start-Screen konnte nicht geladen werden:", err);
  setStatus("Die Inhalte konnten nicht geladen werden. Bitte Seite neu laden.");
});
