/**
 * Laedt die inhaltlichen Datendateien (single source of truth, siehe
 * Umsetzungsauftrag 4) einmalig und cached sie im Speicher fuer die
 * Laufzeit der Seite.
 */
const WaldsimData = (() => {
  let cache = null;

  async function fetchJson(path) {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Konnte ${path} nicht laden (HTTP ${response.status})`);
    }
    return response.json();
  }

  function load() {
    if (!cache) {
      cache = Promise.all([
        fetchJson("./data/waldtypen.json"),
        fetchJson("./data/stoerungen.json"),
        fetchJson("./data/generated/simulationen_index.json"),
        fetchJson("./data/indikatoren.json"),
        fetchJson("./data/nodes.json"),
        fetchJson("./data/edges.json"),
        fetchJson("./data/rachel_carson_brief.json"),
      ]).then(([waldtypenDatei, stoerungen, simulationenIndex, indikatorenDatei, nodesDatei, edgesDatei, brief]) => ({
        waldtypen: waldtypenDatei.waldtypen,
        stoerungen,
        simulationenIndex,
        indikatoren: indikatorenDatei.indikatoren,
        knoten: nodesDatei.knoten,
        kanten: edgesDatei.kanten,
        brief,
      }));
    }
    return cache;
  }

  async function ladeZeitreihe(relativerPfad) {
    return fetchJson(`./data/generated/${relativerPfad}`);
  }

  return { load, ladeZeitreihe };
})();
