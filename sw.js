/**
 * Service Worker: cached beim Install-Event alle in sw-precache-manifest.json
 * gelisteten Dateien fuer vollstaendigen Offline-Betrieb nach dem ersten
 * Laden (Technikdokument 5.2). Der Cache-Name enthaelt einen aus dem Inhalt
 * aller gecachten Dateien abgeleiteten Hash (siehe
 * scripts/pwa/build_precache_manifest.py); aendert sich irgendeine gecachte
 * Datei, aendert sich automatisch der Cache-Name, wodurch beim naechsten
 * Laden zuverlaessig eine neue Version erkannt und der alte Cache geloescht
 * wird (skipWaiting/clients.claim).
 *
 * WICHTIG: Browser erkennen ein Service-Worker-Update ausschliesslich per
 * Byte-Vergleich DIESER Datei selbst - Inhalte, die sie zur Laufzeit per
 * fetch() nachlaedt (wie das Precache-Manifest), zaehlen dafuer nicht. Die
 * Versions-Konstante unten wird deshalb von build_precache_manifest.py bei
 * jedem Build neu eingesetzt, damit sich sw.js bei jeder Content-Aenderung
 * garantiert auch selbst aendert und der Browser zuverlaessig eine neue
 * Version installiert. sw.js NIE direkt editieren, sondern dieses Template
 * unter scripts/pwa/sw.template.js.
 *
 * Pfade ausschliesslich relativ zum Scope dieses Service Workers, damit die
 * App auch im GitHub-Pages-Unterordner funktioniert.
 */
const SW_BUILD_VERSION = "aa0a3567a4fc901b";
const MANIFEST_URL = "./sw-precache-manifest.json";
const CACHE_PREFIX = "waldsim-precache-";

async function loadManifest() {
  const response = await fetch(MANIFEST_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Precache-Manifest konnte nicht geladen werden: ${response.status}`);
  }
  return response.json();
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const manifest = await loadManifest();
      const cache = await caches.open(manifest.cacheName);
      await cache.addAll(manifest.files);
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const manifest = await loadManifest();
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== manifest.cacheName)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    (async () => {
      const cached = await caches.match(event.request);
      if (cached) {
        return cached;
      }

      try {
        // event.request NIE direkt an fetch() weiterreichen: bei einer
        // Top-Level-Navigation (Seite laden/neu laden) hat event.request
        // den Modus "navigate" - fetch() wirft dafuer sofort einen
        // TypeError ("'navigate' mode is not allowed"), was Folgefehler bei
        // parallel nachgeladenen Skripten/Bildern ausloesen kann. Ueber die
        // reine URL erneut anfragen umgeht das zuverlaessig.
        return await fetch(event.request.url);
      } catch (err) {
        if (event.request.mode === "navigate") {
          const fallback = await caches.match("./");
          if (fallback) {
            return fallback;
          }
        }
        throw err;
      }
    })()
  );
});
