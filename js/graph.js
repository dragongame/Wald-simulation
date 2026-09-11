/**
 * Netzwerk-Graph & Rachel-Carson-Freischaltmechanik (Meilenstein M8,
 * Umsetzungsauftrag 2.3, Styleguide Abschnitt 5, Technikdokument 4.3).
 *
 * Zu Beginn ist der Graph gesperrt. Ein durchgängig sichtbarer Button
 * (Start-Bildschirm-Header) öffnet ein tolerant geprüftes Namens-Eingabefeld;
 * bei "Rachel Carson" (siehe data/rachel_carson_brief.json, editierbarer
 * Content-Baustein) schaltet sich das Feature dauerhaft frei (localStorage)
 * und ein einmaliger, editierbarer Brief wird angezeigt. Danach ist der
 * Graph auch rückwirkend für jede bereits gespeicherte Forscherheft-Seite
 * nutzbar (WaldsimForscherheft ruft dafür oeffneFuerEintrag() auf).
 *
 * Knoten/Kanten kommen aus data/nodes.json + data/edges.json (single source
 * of truth aus M1). Standardmäßig ("vereinfacht") zeigt der Graph nur die
 * für die gespielte Waldtyp/Störung/Regler-Kombination relevante Teilmenge,
 * mit explizitem Umschalter aufs vollständige Netzwerk (Technikdokument 4.3).
 * Seit M32 wird diese Teilmenge aus der szenario-genauen Beitragsanalyse
 * (M29, `projektion.wichtig` je vorab berechneter Zeitreihen-Datei) abgeleitet
 * statt aus dem vorher handgepflegten `relevante_knoten` in
 * data/stoerungen.json - siehe relevanteKnotenFuerKontext()/oeffneFuerEintrag().
 * Relevante Knoten, die weder "wichtig" noch Teil des tatsächlich abgelaufenen
 * Kaskadenpfads sind, fasst je ökologischer Kategorie ein antippbarer
 * Sammelknoten ("Stapel-Karte" mit Anzahl) zusammen, siehe anwendeStapelung().
 * Der Kaskadenpfad selbst wird weiterhin per Breitensuche entlang der
 * relevanten Kanten ab einem je Störung kuratierten Startknoten ermittelt
 * und als "Tinten-Spur" hervorgehoben (Styleguide Abschnitt 5) - siehe
 * Milestones-Dokument für die Begründung dieser UI-Entscheidung.
 *
 * Seit M15: Sidebar mit an-/abwählbaren Art-Icons (gruppiert nach Kategorie,
 * inkl. Sammelgruppen-Pseudoknoten) filtert zusätzlich zur Vollständig-/
 * Kaskade-Teilmenge, welche Knoten/Kanten gezeichnet werden
 * (sichtbareMenge() = basisMenge() ∩ nicht-ausgeblendet). Kanten sind
 * zusätzlich zu Farbe/Symbol per Strichmuster unterscheidbar (KANTE_STYLE.dash).
 */
const WaldsimGraph = (() => {
  const { escapeHtml, kapitalisiere, spriteFrameHtml, showScreen } = WaldsimUI;

  const FREISCHALTUNG_KEY = "netzwerk_freigeschaltet";
  const ANIMATION_STEP = 0.4;

  // Layout: Knoten werden nach oekologischer Kategorie in Zeilen gruppiert
  // (grobe Trophie-Reihenfolge oben->unten), innerhalb der Zeile in der
  // Reihenfolge aus data/nodes.json. Reine UI-Layout-Entscheidung, keine
  // Modellaussage.
  const KATEGORIE_ZEILE = {
    abiotisch: 0,
    baum: 1,
    strauch: 2,
    kraut: 3,
    pilz: 4,
    destruent: 5,
    anthropogen: 5,
    herbivor: 6,
    verbreiter: 6,
    praedator: 7,
  };
  const GRUPPEN_ZEILE = 8;

  const KATEGORIE_EMOJI = {
    baum: "🌳",
    strauch: "🌿",
    pilz: "🍄",
    kraut: "🌾",
    herbivor: "🦌",
    verbreiter: "🐦",
    praedator: "🦊",
    destruent: "🪵",
    anthropogen: "🧑‍🌾",
  };
  const KNOTEN_EMOJI_AUSNAHMEN = { licht: "☀️", wasser: "💧", temperatur: "🌡️", borkenkaefer: "🐛" };

  // Gruppierung/Reihenfolge der Filter-Sidebar (M15) - dieselben Kategorien
  // wie KATEGORIE_ZEILE, nur mit sprechbarem Label statt Zeilen-Index.
  const KATEGORIE_LABEL = {
    abiotisch: "Abiotische Faktoren",
    baum: "Bäume",
    strauch: "Sträucher",
    kraut: "Kräuter",
    pilz: "Pilze",
    destruent: "Destruenten",
    anthropogen: "Mensch",
    herbivor: "Pflanzenfresser",
    verbreiter: "Verbreiter",
    praedator: "Prädatoren",
  };

  // "ziel_kategorie" aus data/edges.json steht für eine generische Gruppe
  // ohne eigenen Knoten (siehe dortiges _meta.generisches_ziel_hinweis).
  // Für den Graphen braucht jede Kante trotzdem ein Ziel - deshalb kleine,
  // klar als Sammelgruppe gekennzeichnete Pseudo-Knoten.
  const GRUPPEN_KNOTEN = {
    kraut: { name: "Krautschicht (allgemein)", emoji: "🌾", erklaerung: "Steht in der Wissensbasis für mehrere Kräuter zusammen (z. B. Buschwindröschen, Waldmeister), nicht für eine einzelne Art." },
    kleinsaeuger: { name: "Kleinsäuger (allgemein)", emoji: "🐁", erklaerung: "Sammelbegriff für mehrere kleine Säugetierarten, die im reduzierten Modell keinen eigenen Knoten haben." },
    voegel_generisch: { name: "Vögel (allgemein)", emoji: "🐦", erklaerung: "Sammelbegriff für mehrere Vogelarten, die im reduzierten Modell keinen eigenen Knoten haben." },
    baumverjuengung_allgemein: { name: "Baumverjüngung (allgemein)", emoji: "🌱", erklaerung: "Junge Bäume aller Arten, nicht auf eine einzelne Baumart eingegrenzt." },
  };

  // Namensbrücke zwischen den zwei bestehenden ID-Räumen data/nodes.json
  // (Graph-Knoten) und data/indikatoren.json (Simulation) - dieselbe
  // Art/derselbe Faktor hat dort aus historischen Gründen unterschiedliche
  // IDs (z. B. Knoten "fichte" <-> Indikator "fichte_vitalitaet"). Reine
  // Umbenennung, keine neue fachliche Zuordnung: für die meisten Arten schon
  // in js/dashboard.js (ARTEN/WEITERE_ARTEN) genauso hinterlegt. Knoten ohne
  // Eintrag hier (mykorrhizapilz, licht, temperatur, mensch_bewirtschaftung,
  // luchs, wolf sowie die generischen Sammelgruppen "kraut"/"voegel_generisch")
  // haben keinen eigenen numerischen Indikator und werden nie automatisch als
  // "wichtig" erkannt - Trigger-/Regler-Knoten bleiben trotzdem über
  // ermittleStartknoten()/den Regler-Wechsel-Fall sichtbar (M32).
  const KNOTEN_INDIKATOR = {
    fichte: "fichte_vitalitaet",
    buche: "buche_vitalitaet",
    eiche: "eiche_vitalitaet",
    kiefer: "kiefer_vitalitaet",
    birke: "birke_anteil",
    hasel: "hasel_anteil",
    holunder: "holunder_anteil",
    brombeere: "brombeere_anteil",
    hallimasch: "hallimasch_indikator",
    zunderschwamm: "zunderschwamm_indikator",
    blaeuepilz: "blaeuepilz_indikator",
    buschwindroeschen: "buschwindroeschen_indikator",
    waldmeister: "waldmeister_indikator",
    brennnessel: "brennnessel_indikator",
    heidelbeere: "heidelbeere_indikator",
    borkenkaefer: "borkenkaefer_dichte",
    reh: "reh_dichte",
    rothirsch: "rothirsch_dichte",
    eichhoernchen: "eichhoernchen_indikator",
    raupen: "raupen_indikator",
    blattlaeuse: "blattlaeuse_indikator",
    eichelhaeher: "eichelhaeher_indikator",
    buntspecht: "buntspecht_indikator",
    ameisenbuntkaefer: "ameisenbuntkaefer_indikator",
    fuchs: "fuchs_indikator",
    habicht: "habicht_indikator",
    sperber: "sperber_indikator",
    totholz: "totholzmenge",
    wasser: "bodenfeuchte",
  };
  const INDIKATOR_ZU_KNOTEN = Object.fromEntries(Object.entries(KNOTEN_INDIKATOR).map(([knotenId, indikatorId]) => [indikatorId, knotenId]));

  // Styleguide Abschnitt 5 definiert Farbe+Symbol für die fünf ursprünglichen
  // Beziehungstypen. "bewirtschaftung"/"strukturell" (Szenario 5/6) lösen den
  // in data/edges.json dokumentierten M8-TODO auf - neue Farben, die sich
  // klar von den bestehenven fünf unterscheiden, neue Symbole in js/icons.js.
  // "dash" (M15, eigene UI-Entscheidung, kein Quelldokument-Bezug): zusätzlich
  // zu Farbe+Symbol ein eigenes Strichmuster je Beziehungstyp, damit Kanten
  // nicht allein über Farbe unterscheidbar sind (gleiches Prinzip wie bei den
  // Dashboard-Instrumenten, Umsetzungsauftrag/Styleguide "nie Farbe allein").
  const KANTE_STYLE = {
    fraess: { farbe: "var(--bernstein)", icon: "biss", label: "Fraß (trophisch)", dash: null },
    symbiose: { farbe: "var(--moosgruen)", icon: "ringe", label: "Symbiose", dash: "1 6" },
    konkurrenz: { farbe: "var(--rindenbraun)", icon: "kronen", label: "Konkurrenz", dash: "9 5" },
    zersetzung: { farbe: "var(--zersetzung)", icon: "spirale", label: "Zersetzung", dash: "1 4 7 4" },
    abiotisch: { farbe: "var(--himmelblau)", icon: "regen", label: "Abiotische Kopplung", dash: "4 4" },
    bewirtschaftung: { farbe: "var(--bewirtschaftung)", icon: "saege", label: "Bewirtschaftung (Totholzentnahme)", dash: "14 5" },
    strukturell: { farbe: "var(--strukturell)", icon: "huf", label: "Strukturelles Ungleichgewicht (Wildverbiss)", dash: "1 3 1 3 8 3" },
  };
  const ABIOTISCH_ICON_JE_QUELLE = { licht: "sonne", wasser: "regen", temperatur: "thermometer" };

  const STAERKE_BREITE = { schwach: 1.2, schwach_mittel: 1.6, mittel: 1.8, mittel_stark: 2.2, stark: 2.6, variabel_reglerabhaengig: 2 };
  const STAERKE_LABEL = {
    schwach: "schwach",
    schwach_mittel: "schwach–mittel",
    mittel: "mittel",
    mittel_stark: "mittel–stark",
    stark: "stark",
    variabel_reglerabhaengig: "abhängig vom Wildverbiss-Regler",
  };

  // Kuratierte Startknoten je Störung/Regler für die Kaskadenpfad-Suche -
  // wie KASKADE_JE_STOERUNG in js/analyse.js (M6) eine eigene, plausible
  // UI-Entscheidung, nicht 1:1 aus einem Quelldokument ableitbar.
  const STARTKNOTEN_JE_STOERUNG = {
    borkenkaefer: "borkenkaefer",
    trockenheit: "wasser",
    temperatur: "temperatur",
    sturm: "fichte",
    totholzentnahme: "mensch_bewirtschaftung",
  };
  const STARTKNOTEN_WILDVERBISS = "reh";

  const CARD_W = 108;
  const CARD_H = 78;
  const GAP_X = 18;
  const GAP_Y = 36;
  const MARGIN = 24;

  let data = null;
  let rueckkehrScreen = "screen-start";
  let sperreWeiterAktion = null;
  let letterRueckkehr = null;
  let aktuellerKontext = null;
  let aktuelleKaskade = { relevanteSet: null, relevanteKanten: [], kaskadenKanten: [], kaskadenKnotenReihenfolge: [] };
  let aktuellVollstaendig = true;
  let wired = false;
  // Sidebar-Filter (M15): pro Graph-Aufruf zurückgesetzte Menge ausgeblendeter
  // Knoten-IDs (inkl. "gruppe_<id>" für die Sammelgruppen), wirkt zusätzlich
  // zur Vollständig/Kaskade-Teilmenge aus sichtbareMenge().
  let ausgeblendeteKnoten = new Set();
  // Sammelknoten-Stapel (M32): Kategorien, deren Stapel-Karte der/die
  // Nutzer:in in der aktuellen Ansicht aufgeklappt hat (siehe anwendeStapelung()).
  let aufgeklappteStapel = new Set();

  // ---- Freischaltung ----

  function istFreigeschaltet() {
    return !!WaldsimStorage.get(FREISCHALTUNG_KEY, false);
  }

  function normalisiereName(str) {
    return str.trim().toLowerCase().replace(/\s+/g, " ");
  }

  function pruefeName(eingabe) {
    const normalisiert = normalisiereName(eingabe);
    return data.brief.gueltige_namen.some((n) => normalisiereName(n) === normalisiert);
  }

  function aktualisiereTriggerButton() {
    const icon = document.getElementById("netzwerk-tab-icon");
    const button = document.getElementById("netzwerk-oeffnen-button");
    if (!icon || !button) return;
    const frei = istFreigeschaltet();
    icon.textContent = frei ? "🕸️" : "🔬";
    button.title = frei ? "Netzwerk-Graph" : "Wissenschaftler:in um Hilfe bitten";
  }

  // ---- Knoten-/Kanten-Hilfsfunktionen ----

  function baueKnotenIndex() {
    const byId = new Map();
    data.knoten.forEach((k) => byId.set(k.id, k));
    Object.entries(GRUPPEN_KNOTEN).forEach(([id, g]) => {
      byId.set(`gruppe_${id}`, { id: `gruppe_${id}`, name: g.name, emoji: g.emoji, erklaerung: g.erklaerung, istGruppe: true });
    });
    return byId;
  }

  function kanteZielId(kante) {
    return kante.ziel || `gruppe_${kante.ziel_kategorie}`;
  }

  function kanteSchluessel(kante) {
    return `${kante.quelle}=>${kante.zielId}=>${kante.typ}`;
  }

  function standardSpriteSrc(knoten) {
    if (!knoten.sprite || !knoten.sprite.dateimuster || !knoten.sprite.zustandsvarianten || knoten.sprite.zustandsvarianten.length === 0) {
      return null;
    }
    return knoten.sprite.dateimuster.replace("<zustand>", knoten.sprite.zustandsvarianten[0]);
  }

  function emojiFuer(knoten) {
    return KNOTEN_EMOJI_AUSNAHMEN[knoten.id] || KATEGORIE_EMOJI[knoten.kategorie] || "❔";
  }

  function stoerungName(id) {
    const eintrag = data.stoerungen.ereignis_stoerungen.find((s) => s.id === id);
    return eintrag ? eintrag.name : id;
  }

  function ereignisText(kontext) {
    return kontext.ereignisse.length === 0
      ? "keine Ereignis-Störung"
      : kontext.ereignisse.map((e) => `${stoerungName(e.typ)} (Jahr ${e.trigger_jahr})`).join(" + ");
  }

  // ---- Relevante Teilmenge & Kaskadenpfad ----

  /**
   * Seit M32 aus der szenario-genauen Beitragsanalyse (M29, `projektion.wichtig`
   * je Zeitreihen-Datei) abgeleitet statt aus dem handgepflegten
   * `relevante_knoten` in data/stoerungen.json - `kontext.projektionWichtig`
   * (eine Menge Indikator-IDs, von oeffneFuerEintrag() vorab geladen und über
   * INDIKATOR_ZU_KNOTEN zurückübersetzt) muss dafür vorliegen. Trigger-Knoten
   * (Startknoten je Störung, Luchs/Wolf bei Regler-Abweichung) bleiben
   * unabhängig davon immer Teil der Teilmenge, da sie keinen eigenen
   * numerischen Indikator haben, aber die Ursache der Kaskade sind.
   */
  function relevanteKnotenFuerKontext(kontext) {
    if (!kontext || !kontext.projektionWichtig) return null;
    const set = new Set(ermittleStartknoten(kontext));
    // "beide" (Wolf + Luchs anwesend) ist seit 2026-08-26 der Ausgangszustand
    // ohne Effekt, ersetzt das frühere "niedrig" (siehe Milestones-Dokument).
    if (kontext.regler && kontext.regler !== "beide") {
      set.add("luchs");
      set.add("wolf");
    }
    kontext.projektionWichtig.forEach((indikatorId) => {
      const knotenId = INDIKATOR_ZU_KNOTEN[indikatorId];
      if (knotenId) set.add(knotenId);
    });
    return set;
  }

  function kantenInnerhalb(nodeSet) {
    const treffer = [];
    data.kanten.forEach((kante) => {
      if (!nodeSet.has(kante.quelle)) return;
      if (kante.ziel && !nodeSet.has(kante.ziel)) return;
      treffer.push({ ...kante, zielId: kanteZielId(kante) });
    });
    return treffer;
  }

  function traversiereKaskade(kanten, startKnoten) {
    const besucht = new Set(startKnoten);
    const queue = [...startKnoten];
    const pfad = [];
    const genutzt = new Set();

    while (queue.length > 0) {
      const aktuell = queue.shift();
      kanten.forEach((kante, idx) => {
        if (genutzt.has(idx)) return;
        if (kante.quelle === aktuell && !besucht.has(kante.zielId)) {
          genutzt.add(idx);
          pfad.push(kante);
          besucht.add(kante.zielId);
          queue.push(kante.zielId);
        } else if (kante.zielId === aktuell && !besucht.has(kante.quelle)) {
          genutzt.add(idx);
          pfad.push(kante);
          besucht.add(kante.quelle);
          queue.push(kante.quelle);
        }
      });
    }
    return pfad;
  }

  function ermittleStartknoten(kontext) {
    const sortiert = [...kontext.ereignisse].sort((a, b) => a.trigger_jahr - b.trigger_jahr);
    const start = sortiert.map((e) => STARTKNOTEN_JE_STOERUNG[e.typ]).filter(Boolean);
    // "beide" (Wolf + Luchs anwesend) ist seit 2026-08-26 der Ausgangszustand
    // ohne Effekt, ersetzt das frühere "niedrig" (siehe Milestones-Dokument).
    if (kontext.regler && kontext.regler !== "beide") {
      start.push(STARTKNOTEN_WILDVERBISS);
    }
    return start;
  }

  function baueKaskade(kontext) {
    const relevanteSet = relevanteKnotenFuerKontext(kontext);
    if (!relevanteSet) {
      return { relevanteSet: null, relevanteKanten: [], kaskadenKanten: [], kaskadenKnotenReihenfolge: [] };
    }

    const relevanteKanten = kantenInnerhalb(relevanteSet);
    relevanteKanten.forEach((k) => relevanteSet.add(k.zielId));

    const startknoten = ermittleStartknoten(kontext).filter((id) => relevanteSet.has(id));
    const kaskadenKanten = startknoten.length > 0 ? traversiereKaskade(relevanteKanten, startknoten) : [];

    const kaskadenKnotenReihenfolge = [...startknoten];
    kaskadenKanten.forEach((k) => {
      if (!kaskadenKnotenReihenfolge.includes(k.quelle)) kaskadenKnotenReihenfolge.push(k.quelle);
      if (!kaskadenKnotenReihenfolge.includes(k.zielId)) kaskadenKnotenReihenfolge.push(k.zielId);
    });

    return { relevanteSet, relevanteKanten, kaskadenKanten, kaskadenKnotenReihenfolge };
  }

  function basisMenge() {
    if (!aktuellerKontext || aktuellVollstaendig || !aktuelleKaskade.relevanteSet || aktuelleKaskade.relevanteSet.size === 0) {
      const knotenIds = new Set(data.knoten.map((k) => k.id));
      const kanten = data.kanten.map((k) => ({ ...k, zielId: kanteZielId(k) }));
      kanten.forEach((k) => {
        if (!k.ziel) knotenIds.add(k.zielId);
      });
      return { knoten: knotenIds, kanten };
    }
    return { knoten: aktuelleKaskade.relevanteSet, kanten: aktuelleKaskade.relevanteKanten };
  }

  function sichtbareMenge() {
    const basis = basisMenge();
    if (ausgeblendeteKnoten.size === 0) return basis;

    const knoten = new Set([...basis.knoten].filter((id) => !ausgeblendeteKnoten.has(id)));
    const kanten = basis.kanten.filter((k) => knoten.has(k.quelle) && knoten.has(k.zielId));
    return { knoten, kanten };
  }

  /**
   * Sammelknoten (M32): die vereinfachte Ansicht zeigt nur die szenario-genau
   * relevante Teilmenge (relevanteKnotenFuerKontext(), aus M29 abgeleitet) -
   * alle 35 Knoten aus data/nodes.json, die NICHT in dieser Teilmenge stehen,
   * fasst je ökologischer Kategorie ein antippbarer Sammelknoten ("+N weitere
   * <Kategorie>") zusammen, statt einfach zu verschwinden. Der tatsächlich
   * abgelaufene Kaskadenpfad besteht per Konstruktion ausschließlich aus
   * bereits einzeln sichtbaren Knoten (relevanteKnotenFuerKontext() ist die
   * Grundlage von baueKaskade()) und wird von der Stapelung nie berührt - die
   * Tinten-Spur-Animation funktioniert deshalb unverändert in beiden Ansichten.
   * Aufklappen (aufgeklappteStapel) reicht die versteckten Knoten dieser
   * Kategorie einzeln nach; die Kanten werden für die dann größere Knotenmenge
   * neu ermittelt (kantenInnerhalb ist bereits eine reine Funktion, kein neuer
   * Berechnungsweg).
   */
  function anwendeStapelung(sichtbar) {
    if (aktuellVollstaendig || !aktuellerKontext || !aktuellerKontext.projektionWichtig) {
      return { knoten: sichtbar.knoten, kanten: sichtbar.kanten, stapelById: new Map() };
    }

    const neueKnotenIds = new Set(sichtbar.knoten);
    const versteckteProKategorie = new Map(); // kategorie -> [knotenId]

    data.knoten.forEach((knoten) => {
      if (sichtbar.knoten.has(knoten.id)) return; // schon einzeln sichtbar
      if (aufgeklappteStapel.has(knoten.kategorie)) {
        neueKnotenIds.add(knoten.id); // Kategorie aufgeklappt: einzeln nachreichen
        return;
      }
      if (!versteckteProKategorie.has(knoten.kategorie)) versteckteProKategorie.set(knoten.kategorie, []);
      versteckteProKategorie.get(knoten.kategorie).push(knoten.id);
    });

    const stapelById = new Map();
    versteckteProKategorie.forEach((mitglieder, kategorie) => {
      const stapelId = `stapel_${kategorie}`;
      stapelById.set(stapelId, {
        id: stapelId,
        name: `+${mitglieder.length} weitere ${KATEGORIE_LABEL[kategorie] || kategorie}`,
        emoji: KATEGORIE_EMOJI[kategorie] || "📦",
        istStapel: true,
        kategorie,
        mitglieder,
      });
      neueKnotenIds.add(stapelId);
    });

    const kanten = aufgeklappteStapel.size > 0 ? kantenInnerhalb(neueKnotenIds) : sichtbar.kanten;
    return { knoten: neueKnotenIds, kanten, stapelById };
  }

  // ---- Layout ----

  function berechneLayout(sichtbareKnotenIds, knotenById) {
    const zeilen = new Map();
    sichtbareKnotenIds.forEach((id) => {
      const knoten = knotenById.get(id);
      if (!knoten) return;
      const zeile = KATEGORIE_ZEILE[knoten.kategorie] ?? GRUPPEN_ZEILE;
      if (!zeilen.has(zeile)) zeilen.set(zeile, []);
      zeilen.get(zeile).push(id);
    });

    const zeilenIndizes = Array.from(zeilen.keys()).sort((a, b) => a - b);
    const positionen = new Map();
    let maxBreite = 0;

    zeilenIndizes.forEach((zeileIdx, zeilenPosition) => {
      const ids = zeilen.get(zeileIdx);
      const breite = ids.length * CARD_W + (ids.length - 1) * GAP_X;
      maxBreite = Math.max(maxBreite, breite);
      const y = MARGIN + zeilenPosition * (CARD_H + GAP_Y);
      ids.forEach((id, i) => positionen.set(id, { x: i * (CARD_W + GAP_X), y }));
    });

    zeilenIndizes.forEach((zeileIdx) => {
      const ids = zeilen.get(zeileIdx);
      const breite = ids.length * CARD_W + (ids.length - 1) * GAP_X;
      const offset = (maxBreite - breite) / 2 + MARGIN;
      ids.forEach((id) => {
        positionen.get(id).x += offset;
      });
    });

    return {
      positionen,
      breite: maxBreite + MARGIN * 2,
      hoehe: MARGIN + zeilenIndizes.length * (CARD_H + GAP_Y),
    };
  }

  // ---- Rendering ----

  function knotenKarteHtml(knoten, pos, breite, hoehe, kaskadeIdx) {
    const istKaskade = kaskadeIdx >= 0;
    const styleTeile = [
      `left:${((pos.x / breite) * 100).toFixed(2)}%`,
      `top:${((pos.y / hoehe) * 100).toFixed(2)}%`,
      `width:${((CARD_W / breite) * 100).toFixed(2)}%`,
      `height:${((CARD_H / hoehe) * 100).toFixed(2)}%`,
    ];
    if (istKaskade) styleTeile.push(`--verzoegerung:${(kaskadeIdx * ANIMATION_STEP).toFixed(2)}s`);

    const istPseudo = knoten.istGruppe || knoten.istStapel;
    const src = istPseudo ? null : standardSpriteSrc(knoten);
    const inhalt = src
      ? spriteFrameHtml(`./assets/sprites/${src}`, knoten.name, emojiFuer(knoten), "sprite-1-1")
      : `<span class="graph-knoten-emoji" aria-hidden="true">${istPseudo ? knoten.emoji : emojiFuer(knoten)}</span>`;

    return `
      <button type="button" class="graph-knoten ${knoten.istGruppe ? "ist-gruppe" : ""} ${knoten.istStapel ? "ist-stapel" : ""} ${istKaskade ? "ist-kaskade" : ""}" data-knoten="${knoten.id}" ${knoten.istStapel ? `data-stapel-kategorie="${escapeHtml(knoten.kategorie)}" title="Antippen zum Aufklappen"` : ""} style="${styleTeile.join("; ")}">
        ${inhalt}
        <span class="graph-knoten-name">${escapeHtml(knoten.name)}</span>
      </button>
    `;
  }

  function kanteSvgHtml(kante, positionen, knotenById, idx) {
    const von = positionen.get(kante.quelle);
    const bis = positionen.get(kante.zielId);
    if (!von || !bis) return "";

    const x1 = von.x + CARD_W / 2;
    const y1 = von.y + CARD_H / 2;
    const x2 = bis.x + CARD_W / 2;
    const y2 = bis.y + CARD_H / 2;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const stil = KANTE_STYLE[kante.kategorie] || KANTE_STYLE.fraess;
    const iconId = kante.kategorie === "abiotisch" ? ABIOTISCH_ICON_JE_QUELLE[kante.quelle] || stil.icon : stil.icon;
    const breite = STAERKE_BREITE[kante.staerke] || 1.5;
    const istKaskade = idx >= 0;

    const quelleKnoten = knotenById.get(kante.quelle);
    const zielKnoten = knotenById.get(kante.zielId);
    const quelleName = quelleKnoten ? quelleKnoten.name : kante.quelle;
    const zielName = zielKnoten ? zielKnoten.name : kante.zielId;

    return `
      <g class="kante ${istKaskade ? "ist-kaskade" : ""}" data-typ="${escapeHtml(kante.typ)}" data-staerke="${kante.staerke || ""}" data-beschreibung="${escapeHtml(kante.beschreibung || "")}" data-quelle-name="${escapeHtml(quelleName)}" data-ziel-name="${escapeHtml(zielName)}">
        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="kante-linie" style="stroke:${stil.farbe}; stroke-width:${breite}; stroke-dasharray:${stil.dash || "none"}"></line>
        ${istKaskade ? `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" pathLength="1" class="kante-tinte" style="--verzoegerung:${(idx * ANIMATION_STEP).toFixed(2)}s"></line>` : ""}
        <g class="kante-symbol" style="color:${stil.farbe}">${WaldsimIcons.inline(iconId, mx, my, 14)}</g>
      </g>
    `;
  }

  function legendeHtml() {
    return Object.values(KANTE_STYLE)
      .map(
        (stil) => `
        <li class="graph-legende-item">
          <svg class="graph-legende-swatch" viewBox="0 0 40 14" aria-hidden="true">
            <line x1="2" y1="7" x2="38" y2="7" style="stroke:${stil.farbe}; stroke-width:2.4; stroke-dasharray:${stil.dash || "none"}; stroke-linecap:round"></line>
            <g style="color:${stil.farbe}">${WaldsimIcons.inline(stil.icon, 20, 7, 12)}</g>
          </svg>
          <span>${escapeHtml(stil.label)}</span>
        </li>
      `
      )
      .join("");
  }

  // ---- Sidebar-Filter (M15) ----

  function filterChipHtml(id, name, emoji) {
    const aktiv = !ausgeblendeteKnoten.has(id);
    return `
      <button type="button" class="graph-filter-chip ${aktiv ? "" : "ist-ausgeblendet"}" data-filter-knoten="${id}" aria-pressed="${aktiv}" title="${escapeHtml(name)}">
        <span aria-hidden="true">${emoji}</span>
      </button>
    `;
  }

  function filterSidebarHtml() {
    const proKategorie = new Map();
    data.knoten.forEach((k) => {
      if (!proKategorie.has(k.kategorie)) proKategorie.set(k.kategorie, []);
      proKategorie.get(k.kategorie).push(k);
    });

    const kategorienHtml = Object.keys(KATEGORIE_LABEL)
      .filter((kat) => proKategorie.has(kat))
      .map((kat) => {
        const chips = proKategorie.get(kat).map((k) => filterChipHtml(k.id, k.name, emojiFuer(k))).join("");
        return `<div class="graph-filter-gruppe"><h3>${escapeHtml(KATEGORIE_LABEL[kat])}</h3><div class="graph-filter-chips">${chips}</div></div>`;
      })
      .join("");

    const sammelgruppenChips = Object.entries(GRUPPEN_KNOTEN)
      .map(([id, g]) => filterChipHtml(`gruppe_${id}`, g.name, g.emoji))
      .join("");

    return `
      ${kategorienHtml}
      <div class="graph-filter-gruppe">
        <h3>Sammelgruppen</h3>
        <div class="graph-filter-chips">${sammelgruppenChips}</div>
      </div>
    `;
  }

  function renderFilterSidebar() {
    document.getElementById("graph-filter-liste").innerHTML = filterSidebarHtml();
  }

  function toggleFilterKnoten(id) {
    if (ausgeblendeteKnoten.has(id)) {
      ausgeblendeteKnoten.delete(id);
    } else {
      ausgeblendeteKnoten.add(id);
    }
    renderFilterSidebar();
    renderSeiten();
  }

  function alleFilterAnzeigen() {
    ausgeblendeteKnoten.clear();
    renderFilterSidebar();
    renderSeiten();
  }

  function einzelSeiteHtml(ueberschrift, untertitel, sichtbareIds, sichtbareKanten, layout, knotenById, kaskadeKantenIndex) {
    const knotenHtml = Array.from(sichtbareIds)
      .map((id) => {
        const knoten = knotenById.get(id);
        const pos = layout.positionen.get(id);
        if (!knoten || !pos) return "";
        const kaskadeIdx = aktuelleKaskade.kaskadenKnotenReihenfolge.indexOf(id);
        return knotenKarteHtml(knoten, pos, layout.breite, layout.hoehe, kaskadeIdx);
      })
      .join("");

    const kantenHtml = sichtbareKanten
      .filter((k) => layout.positionen.has(k.quelle) && layout.positionen.has(k.zielId))
      .map((k) => kanteSvgHtml(k, layout.positionen, knotenById, kaskadeKantenIndex.has(kanteSchluessel(k)) ? kaskadeKantenIndex.get(kanteSchluessel(k)) : -1))
      .join("");

    return `
      <article class="graph-seite">
        <h2>${escapeHtml(ueberschrift)}</h2>
        ${untertitel ? `<p class="graph-seite-meta">${escapeHtml(untertitel)}</p>` : ""}
        <div class="graph-canvas-scroll">
          <div class="graph-canvas" style="width:${layout.breite}px; height:${layout.hoehe}px">
            <svg class="graph-kanten" viewBox="0 0 ${layout.breite} ${layout.hoehe}" preserveAspectRatio="none" aria-hidden="true">${kantenHtml}</svg>
            ${knotenHtml}
          </div>
        </div>
      </article>
    `;
  }

  function renderSeiten() {
    const { knoten: sichtbareIds, kanten: sichtbareKanten, stapelById } = anwendeStapelung(sichtbareMenge());
    const knotenById = baueKnotenIndex();
    stapelById.forEach((knoten, id) => knotenById.set(id, knoten));
    const layout = berechneLayout(sichtbareIds, knotenById);
    const kaskadeKantenIndex = new Map(aktuelleKaskade.kaskadenKanten.map((k, idx) => [kanteSchluessel(k), idx]));

    const container = document.getElementById("graph-seiten");
    const kaskadeHinweis = aktuelleKaskade.kaskadenKanten.length > 0 ? "Tatsächlich abgelaufener Kaskadenpfad als Tinten-Spur hervorgehoben." : "";

    if (aktuellerKontext && aktuellerKontext.modusVergleich) {
      container.className = "graph-seiten graph-seiten--doppelseite";
      container.innerHTML = aktuellerKontext.waelder
        .map((w) => einzelSeiteHtml(w.name, kaskadeHinweis, sichtbareIds, sichtbareKanten, layout, knotenById, kaskadeKantenIndex))
        .join("");
    } else {
      container.className = "graph-seiten";
      container.innerHTML = einzelSeiteHtml("Vollständiges Netzwerk", kaskadeHinweis, sichtbareIds, sichtbareKanten, layout, knotenById, kaskadeKantenIndex);
    }

    const replayButton = document.getElementById("graph-kaskade-replay-button");
    replayButton.hidden = aktuelleKaskade.kaskadenKanten.length === 0;
  }

  function zeigeKnotenSteckbrief(id) {
    const knotenById = baueKnotenIndex();
    const knoten = knotenById.get(id);
    if (!knoten) return;

    document.querySelectorAll(".graph-knoten.ist-ausgewaehlt").forEach((el) => el.classList.remove("ist-ausgewaehlt"));
    document.querySelectorAll(`.graph-knoten[data-knoten="${id}"]`).forEach((el) => el.classList.add("ist-ausgewaehlt"));

    const panel = document.getElementById("graph-steckbrief");
    if (knoten.istGruppe) {
      panel.innerHTML = `<h3>${escapeHtml(knoten.name)}</h3><p>${escapeHtml(knoten.erklaerung)}</p>`;
    } else {
      const fakten = (knoten.steckbrief_fakten || []).map((f) => `<li>${escapeHtml(f)}</li>`).join("");
      panel.innerHTML = `
        <h3>${escapeHtml(knoten.name)}</h3>
        ${knoten.wissenschaftlicher_name ? `<p class="graph-steckbrief-wiss"><em>${escapeHtml(knoten.wissenschaftlicher_name)}</em></p>` : ""}
        <ul>${fakten}</ul>
        ${knoten.kontext_abwesenheit ? `<p class="graph-steckbrief-hinweis">${escapeHtml(knoten.kontext_abwesenheit)}</p>` : ""}
      `;
    }
    panel.hidden = false;
  }

  function zeigeKantenSteckbrief(dataset) {
    document.querySelectorAll(".graph-knoten.ist-ausgewaehlt").forEach((el) => el.classList.remove("ist-ausgewaehlt"));
    const staerkeText = STAERKE_LABEL[dataset.staerke] || "nicht näher beziffert";
    const panel = document.getElementById("graph-steckbrief");
    panel.innerHTML = `
      <h3>${escapeHtml(dataset.quelleName)} → ${escapeHtml(dataset.zielName)}</h3>
      <p><strong>${escapeHtml(dataset.typ)}</strong> · Stärke: ${escapeHtml(staerkeText)}</p>
      ${dataset.beschreibung ? `<p>${escapeHtml(dataset.beschreibung)}</p>` : ""}
    `;
    panel.hidden = false;
  }

  function spieleKaskadeAb() {
    const elemente = document.querySelectorAll("#graph-seiten .kante-tinte, #graph-seiten .graph-knoten.ist-kaskade");
    elemente.forEach((el) => {
      el.style.animation = "none";
    });
    void document.getElementById("graph-seiten").offsetWidth;
    elemente.forEach((el) => {
      el.style.animation = "";
    });
  }

  // ---- Bildschirme ----

  function renderBrief() {
    document.getElementById("brief-fiktionshinweis").textContent = data.brief.fiktionshinweis;
    document.getElementById("brief-anrede").textContent = data.brief.anrede;
    document.getElementById("brief-text").innerHTML = data.brief.absaetze.map((p) => `<p>${escapeHtml(p)}</p>`).join("");
    document.getElementById("brief-gruss").textContent = data.brief.grussformel;
    document.getElementById("brief-unterschrift").textContent = data.brief.unterschrift;
  }

  function zeigeBrief(weiterAktion) {
    letterRueckkehr = weiterAktion;
    renderBrief();
    showScreen("screen-brief");
  }

  function zeigeSperre(weiterAktion) {
    sperreWeiterAktion = weiterAktion;
    document.getElementById("netzwerk-name-eingabe").value = "";
    document.getElementById("netzwerk-sperre-hinweis").textContent = "";
    showScreen("screen-netzwerk-sperre");
  }

  function versucheFreischalten() {
    const input = document.getElementById("netzwerk-name-eingabe");
    const hinweis = document.getElementById("netzwerk-sperre-hinweis");
    if (!input.value.trim()) {
      hinweis.textContent = "Bitte einen Namen eingeben.";
      return;
    }
    if (pruefeName(input.value)) {
      WaldsimStorage.set(FREISCHALTUNG_KEY, true);
      aktualisiereTriggerButton();
      const weiter = sperreWeiterAktion;
      sperreWeiterAktion = null;
      zeigeBrief(weiter);
    } else {
      hinweis.textContent = "Das war nicht der gesuchte Name – frag deine Lehrkraft.";
    }
  }

  function zeigeGraph(kontext) {
    aktuellerKontext = kontext;
    ausgeblendeteKnoten = new Set();
    aufgeklappteStapel = new Set();
    aktuelleKaskade = baueKaskade(kontext);
    const hatTeilmenge = !!(aktuelleKaskade.relevanteSet && aktuelleKaskade.relevanteSet.size > 0);
    aktuellVollstaendig = !kontext || !hatTeilmenge;

    const steuerung = document.getElementById("graph-steuerung");
    const toggle = document.getElementById("graph-vollstaendig-toggle");
    steuerung.hidden = !(kontext && hatTeilmenge);
    toggle.checked = aktuellVollstaendig;

    document.getElementById("graph-subtitle").textContent = kontext
      ? `${ereignisText(kontext)} · Wildverbiss-Regler: ${kapitalisiere(kontext.regler)}`
      : "Vollständiges Beziehungsnetzwerk aller Arten und Faktoren aus der Simulation.";

    document.getElementById("graph-steckbrief").hidden = true;
    document.getElementById("graph-legende").innerHTML = legendeHtml();
    renderFilterSidebar();

    renderSeiten();
    showScreen("screen-graph");
  }

  // ---- Öffentliche Einstiegspunkte ----

  async function oeffneAllgemein() {
    data = await WaldsimData.load();
    // Der Trigger ist seit M20 durchgaengig (auf jedem Bildschirm ueber die
    // Feldbuch-Navigation) erreichbar, nicht mehr nur vom Start-Bildschirm -
    // "Zurueck" muss darum zum tatsaechlich sichtbaren Bildschirm fuehren.
    const sichtbar = document.querySelector(".screen:not([hidden])");
    rueckkehrScreen = sichtbar ? sichtbar.id : "screen-start";
    if (!istFreigeschaltet()) {
      zeigeSperre(() => zeigeGraph(null));
      return;
    }
    zeigeGraph(null);
  }

  /**
   * Lädt für jeden Wald des Forscherheft-Eintrags die exakt passende, bereits
   * vorab berechnete Zeitreihen-Datei (kein erneutes Berechnen) und liefert
   * die Vereinigung ihrer `projektion.wichtig` (M29) - Fundament für die
   * szenario-genaue Teilmenge in M32.
   *
   * Bevorzugt `eintrag.konfigId` (seit M34, siehe js/forscherheft.js) für den
   * direkten Dateinamen über WaldsimConfig.dateiname() - seit der wählbaren
   * Trockenheitsdauer sehen zwei Konfigurationen mit unterschiedlicher Dauer
   * über `ereignisse` allein identisch aus (Dauer steckt nur im konfigId-
   * Suffix), ein Abgleich allein über `ereignisse` wäre dafür mehrdeutig.
   * Vor M34 gespeicherte Einträge kennen `konfigId` noch nicht - für sie war
   * `ereignisse` allein damals noch eindeutig, der Index-Abgleich bleibt also
   * als Rückfalloption korrekt.
   */
  async function ladeProjektionWichtig(eintrag) {
    const union = new Set();
    for (const wald of eintrag.waelder) {
      let datei = eintrag.konfigId
        ? `simulationen/${WaldsimConfig.dateiname(wald.waldtypId, eintrag.konfigId, eintrag.regler)}`
        : null;
      if (datei && !data.simulationenIndex.eintraege.some((e) => e.datei === datei)) {
        datei = null; // unerwartet fehlende Datei - nicht crashen, siehe Rückfall unten
      }
      if (!datei) {
        const treffer = data.simulationenIndex.eintraege.find(
          (e) =>
            e.waldtyp === wald.waldtypId &&
            e.wildverbiss_regler === eintrag.regler &&
            JSON.stringify(e.ereignisse) === JSON.stringify(eintrag.ereignisse)
        );
        datei = treffer && treffer.datei;
      }
      if (!datei) continue;
      const zeitreihenDatei = await WaldsimData.ladeZeitreihe(datei);
      (zeitreihenDatei.projektion.wichtig || []).forEach((id) => union.add(id));
    }
    return union;
  }

  async function oeffneFuerEintrag(eintrag) {
    data = await WaldsimData.load();
    rueckkehrScreen = "screen-forscherheft";
    const projektionWichtig = await ladeProjektionWichtig(eintrag);
    const kontext = {
      modusVergleich: true,
      waelder: eintrag.waelder.map((w) => ({ id: w.waldtypId, name: w.waldtypName })),
      ereignisse: eintrag.ereignisse,
      regler: eintrag.regler,
      projektionWichtig,
    };
    if (!istFreigeschaltet()) {
      zeigeSperre(() => zeigeGraph(kontext));
      return;
    }
    zeigeGraph(kontext);
  }

  function wireEvents() {
    if (wired) return;
    wired = true;

    document.getElementById("netzwerk-oeffnen-button").addEventListener("click", () => {
      oeffneAllgemein();
    });

    document.getElementById("netzwerk-freischalten-button").addEventListener("click", versucheFreischalten);
    document.getElementById("netzwerk-name-eingabe").addEventListener("keydown", (event) => {
      if (event.key === "Enter") versucheFreischalten();
    });
    document.getElementById("netzwerk-sperre-zurueck-button").addEventListener("click", () => showScreen(rueckkehrScreen));

    document.getElementById("brief-weiter-button").addEventListener("click", () => {
      const aktion = letterRueckkehr;
      letterRueckkehr = null;
      if (aktion) {
        aktion();
      } else {
        showScreen(rueckkehrScreen);
      }
    });

    document.getElementById("graph-vollstaendig-toggle").addEventListener("change", (event) => {
      aktuellVollstaendig = event.target.checked;
      renderSeiten();
    });

    document.getElementById("graph-kaskade-replay-button").addEventListener("click", spieleKaskadeAb);

    document.getElementById("graph-filter-alle-button").addEventListener("click", alleFilterAnzeigen);
    document.getElementById("graph-filter-liste").addEventListener("click", (event) => {
      const chip = event.target.closest(".graph-filter-chip");
      if (chip) toggleFilterKnoten(chip.dataset.filterKnoten);
    });

    document.getElementById("graph-seiten").addEventListener("click", (event) => {
      const knotenButton = event.target.closest(".graph-knoten");
      if (knotenButton) {
        if (knotenButton.dataset.stapelKategorie) {
          aufgeklappteStapel.add(knotenButton.dataset.stapelKategorie);
          renderSeiten();
          return;
        }
        zeigeKnotenSteckbrief(knotenButton.dataset.knoten);
        return;
      }
      const kanteGroup = event.target.closest("g.kante");
      if (kanteGroup) {
        zeigeKantenSteckbrief(kanteGroup.dataset);
      }
    });

    document.getElementById("graph-brief-erneut-button").addEventListener("click", () => {
      zeigeBrief(() => zeigeGraph(aktuellerKontext));
    });

    document.getElementById("graph-zurueck-button").addEventListener("click", () => {
      showScreen(rueckkehrScreen);
    });
  }

  function init() {
    wireEvents();
    aktualisiereTriggerButton();
  }

  return { init, oeffneAllgemein, oeffneFuerEintrag };
})();
