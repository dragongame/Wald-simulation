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
      .then(() => setStatus("Waldökosystem-Simulation – Grundgerüst bereit. Inhalte folgen in den nächsten Ausbaustufen."))
      .catch((err) => {
        console.error("Service Worker Registrierung fehlgeschlagen:", err);
        setStatus("Waldökosystem-Simulation – Offline-Modus konnte nicht eingerichtet werden.");
      });
  });
} else {
  setStatus("Waldökosystem-Simulation – dieser Browser unterstützt keine Offline-Nutzung.");
}
