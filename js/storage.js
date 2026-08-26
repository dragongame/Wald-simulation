/**
 * Grundlage fuer die lokale Speicherung (Forscherheft, Fortschritt).
 * localStorage genuegt fuer die erwartete Datenmenge (< 100 kleine Eintraege
 * pro Geraet); IndexedDB ist fuer dieses Projekt nicht noetig.
 * Kapselt Zugriffe, damit z. B. privater Browser-Modus (localStorage wirft)
 * die App nicht abstuerzen laesst.
 */
const WaldsimStorage = (() => {
  const PREFIX = "waldsim.";

  function isAvailable() {
    try {
      const testKey = `${PREFIX}__test__`;
      window.localStorage.setItem(testKey, "1");
      window.localStorage.removeItem(testKey);
      return true;
    } catch (err) {
      return false;
    }
  }

  function get(key, fallback = null) {
    try {
      const raw = window.localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (err) {
      return fallback;
    }
  }

  function set(key, value) {
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (err) {
      return false;
    }
  }

  function remove(key) {
    try {
      window.localStorage.removeItem(PREFIX + key);
    } catch (err) {
      /* ignorieren */
    }
  }

  return { isAvailable, get, set, remove };
})();
