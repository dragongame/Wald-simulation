/**
 * Reine Konfigurations-Logik ohne DOM-Zugriff: bildet aus einer UI-Auswahl
 * (Ereignis-Störungen, ggf. gewählte Reihenfolge, Wildverbiss-Regler)
 * denselben Konfigurations-Namen, den scripts/simulation/build_simulationen.py
 * beim Build erzeugt hat, um die passende vorab berechnete Zeitreihe
 * aufzulösen (Umsetzungsauftrag 2.11). Muss mit dessen ID-Bildung in Sync
 * bleiben (EVENT_ORDER entspricht dort EVENTS_NATUR_UND_BEWIRTSCHAFTUNG,
 * "<erst>-dann-<zweit>", "temperatur+<partner>").
 */
const WaldsimConfig = (() => {
  const EVENT_ORDER = ["borkenkaefer", "trockenheit", "sturm", "totholzentnahme"];

  function findPaarEintrag(stoerungen, a, b) {
    const paar = new Set([a, b]);
    return stoerungen.paar_zeitabstaende.find(
      (p) => p.paar.length === 2 && paar.has(p.paar[0]) && paar.has(p.paar[1])
    );
  }

  /**
   * @param {object} stoerungen - Inhalt von data/stoerungen.json
   * @param {string[]} gewaehlteEreignisse - 0-2 Ereignis-IDs
   * @param {[string, string]|null} reihenfolge - vom Nutzer gewählte Reihenfolge [erst, zweit], falls schon getroffen
   * @returns {{konfigId: string|null, events: {typ: string, trigger_jahr: number}[]|null, brauchtReihenfolge: boolean, reihenfolgeOptionen: [string, string]|null, abstandJahre: number|null}}
   */
  function resolveEreignisKonfigurationBasis(stoerungen, gewaehlteEreignisse, reihenfolge) {
    if (gewaehlteEreignisse.length === 0) {
      return { konfigId: "keine", events: [], brauchtReihenfolge: false, reihenfolgeOptionen: null, abstandJahre: null };
    }

    if (gewaehlteEreignisse.length === 1) {
      const typ = gewaehlteEreignisse[0];
      return { konfigId: typ, events: [{ typ, trigger_jahr: 0 }], brauchtReihenfolge: false, reihenfolgeOptionen: null, abstandJahre: null };
    }

    if (gewaehlteEreignisse.length !== 2) {
      throw new Error("Es können höchstens 2 Ereignis-Störungen gewählt werden.");
    }

    const [x, y] = gewaehlteEreignisse;

    if (x === "temperatur" || y === "temperatur") {
      const partner = x === "temperatur" ? y : x;
      const triggerJahr = stoerungen.temperatur_kombinationen.partner_trigger_jahr[partner];
      return {
        konfigId: `temperatur+${partner}`,
        events: [
          { typ: "temperatur", trigger_jahr: 0 },
          { typ: partner, trigger_jahr: triggerJahr },
        ],
        brauchtReihenfolge: false,
        reihenfolgeOptionen: null,
        abstandJahre: triggerJahr,
      };
    }

    const eintrag = findPaarEintrag(stoerungen, x, y);
    if (!eintrag) {
      throw new Error(`Keine Zeitabstands-Regel für ${x} + ${y} gefunden.`);
    }

    if (!eintrag.reihenfolge_waehlbar) {
      // Reihenfolge ist fuer das Ergebnis egal (identisches Modellverhalten
      // in beide Richtungen) - kanonische Reihenfolge nach EVENT_ORDER, damit
      // der aufgeloeste Dateiname deterministisch ist.
      const [erst, zweit] = [x, y].sort((a, b) => EVENT_ORDER.indexOf(a) - EVENT_ORDER.indexOf(b));
      return {
        konfigId: `${erst}-dann-${zweit}`,
        events: [
          { typ: erst, trigger_jahr: 0 },
          { typ: zweit, trigger_jahr: eintrag.abstand_jahre },
        ],
        brauchtReihenfolge: false,
        reihenfolgeOptionen: null,
        abstandJahre: eintrag.abstand_jahre,
      };
    }

    if (!reihenfolge) {
      return { konfigId: null, events: null, brauchtReihenfolge: true, reihenfolgeOptionen: [x, y], abstandJahre: eintrag.abstand_jahre };
    }

    const [erst, zweit] = reihenfolge;
    return {
      konfigId: `${erst}-dann-${zweit}`,
      events: [
        { typ: erst, trigger_jahr: 0 },
        { typ: zweit, trigger_jahr: eintrag.abstand_jahre },
      ],
      brauchtReihenfolge: false,
      reihenfolgeOptionen: [x, y],
      abstandJahre: eintrag.abstand_jahre,
    };
  }

  /**
   * M34: hängt bei gewählter Trockenheit + Nicht-Standard-Dauer (8 statt 4
   * Jahre) einen Suffix an konfigId an, exakt wie scripts/simulation/
   * build_simulationen.py's erweitere_um_trockenheitsdauer() ihn beim Build
   * erzeugt hat. Die Standard-Dauer (4 Jahre) bleibt unverändert, damit vor
   * M34 gespeicherte Forscherheft-Einträge weiterhin auflösbar sind.
   *
   * @param {number} [trockenheitDauer] - 4 (Standard) oder 8, nur relevant wenn "trockenheit" gewählt ist
   */
  function resolveEreignisKonfiguration(stoerungen, gewaehlteEreignisse, reihenfolge, trockenheitDauer) {
    const ergebnis = resolveEreignisKonfigurationBasis(stoerungen, gewaehlteEreignisse, reihenfolge);
    const trockenheitEintrag = stoerungen.ereignis_stoerungen.find((s) => s.id === "trockenheit");
    const standardDauer = trockenheitEintrag.dauer_jahre;
    const brauchtSuffix = gewaehlteEreignisse.includes("trockenheit") && trockenheitDauer && trockenheitDauer !== standardDauer;
    if (ergebnis.konfigId && brauchtSuffix) {
      return { ...ergebnis, konfigId: `${ergebnis.konfigId}-dauer${trockenheitDauer}` };
    }
    return ergebnis;
  }

  function dateiname(waldtypId, konfigId, praedatorenCode) {
    return `${waldtypId}__${konfigId}__praedatoren-${praedatorenCode}.json`;
  }

  function istGueltigeAbweichung(gewaehlteEreignisse, praedatorenCode) {
    // "beide" (Wolf + Luchs anwesend) ist der Ausgangszustand ohne Effekt -
    // entspricht dem früheren "niedrig" (siehe Milestones-Dokument).
    return gewaehlteEreignisse.length > 0 || praedatorenCode !== "beide";
  }

  return { resolveEreignisKonfiguration, dateiname, istGueltigeAbweichung, EVENT_ORDER };
})();
