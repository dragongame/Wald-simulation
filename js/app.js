const statusEl = document.getElementById("app-status");

function setStatus(text) {
  if (statusEl) {
    statusEl.textContent = text;
  }
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

WaldsimForscherheft.init();
WaldsimGraph.init();

WaldsimStartScreen.init().catch((err) => {
  console.error("Start-Screen konnte nicht geladen werden:", err);
  setStatus("Die Inhalte konnten nicht geladen werden. Bitte Seite neu laden.");
});
