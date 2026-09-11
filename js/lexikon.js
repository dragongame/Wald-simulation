/**
 * Arten-Lexikon (Meilenstein M9, Umsetzungsauftrag 2.8): einfache, nach
 * Kategorie gruppierte Liste aller 32 Lexikon-Knoten (data/nodes.json,
 * `zaehlt_zu_32_knoten: true` - die drei abiotischen Sonderknoten
 * Licht/Wasser/Temperatur zählen laut Umsetzungsauftrag 2.7/2.8 nicht dazu),
 * je Knoten Bild + 1-2 Fakten (`steckbrief_fakten`). Bewusst OHNE Suche
 * (Umsetzungsauftrag 2.8, "einfache Liste") und unabhängig vom
 * Netzwerk-Graphen aufrufbar - keine Rachel-Carson-Freischaltung nötig,
 * eigener Button direkt im Start-Bildschirm-Header.
 */
const WaldsimLexikon = (() => {
  const { escapeHtml, showScreen, spriteFrameHtml } = WaldsimUI;

  const KATEGORIE_LABEL = {
    baum: "Bäume",
    strauch: "Sträucher",
    pilz: "Pilze",
    kraut: "Krautschicht",
    herbivor: "Pflanzenfresser",
    verbreiter: "Samenverbreiter",
    praedator: "Prädatoren",
    destruent: "Zersetzer",
    anthropogen: "Mensch",
  };
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

  let data = null;
  let wired = false;

  function standardSpriteSrc(knoten) {
    if (!knoten.sprite || !knoten.sprite.dateimuster || !knoten.sprite.zustandsvarianten || knoten.sprite.zustandsvarianten.length === 0) {
      return null;
    }
    return knoten.sprite.dateimuster.replace("<zustand>", knoten.sprite.zustandsvarianten[0]);
  }

  function knotenKarteHtml(knoten) {
    const src = standardSpriteSrc(knoten);
    const bildHtml = src
      ? spriteFrameHtml(`./assets/sprites/${src}`, knoten.name, KATEGORIE_EMOJI[knoten.kategorie] || "❔", "sprite-1-1")
      : "";
    const fakten = (knoten.steckbrief_fakten || []).map((f) => `<li>${escapeHtml(f)}</li>`).join("");

    return `
      <article class="lexikon-karte">
        ${bildHtml}
        <h3>${escapeHtml(knoten.name)}</h3>
        ${knoten.wissenschaftlicher_name ? `<p class="lexikon-wiss"><em>${escapeHtml(knoten.wissenschaftlicher_name)}</em></p>` : ""}
        <ul>${fakten}</ul>
      </article>
    `;
  }

  function renderGruppen() {
    const gruppen = new Map();
    data.knoten
      .filter((k) => k.zaehlt_zu_32_knoten)
      .forEach((k) => {
        if (!gruppen.has(k.kategorie)) gruppen.set(k.kategorie, []);
        gruppen.get(k.kategorie).push(k);
      });

    document.getElementById("lexikon-gruppen").innerHTML = Array.from(gruppen.entries())
      .map(
        ([kategorie, knoten]) => `
        <section class="lexikon-gruppe">
          <h2>${escapeHtml(KATEGORIE_LABEL[kategorie] || kategorie)}</h2>
          <div class="lexikon-karten">${knoten.map(knotenKarteHtml).join("")}</div>
        </section>
      `
      )
      .join("");
  }

  // M37: Waldbrand ist kein Art-/Faktor-Knoten (nicht Teil der 32 Lexikon-
  // Knoten laut Umsetzungsauftrag 2.8) - eigener, klar abgesetzter Block
  // statt einer weiteren "lexikon-karte" in der Knoten-Liste.
  function renderEreignisse() {
    const erklaerung = data.stoerungen.waldbrand_erklaerung;
    if (!erklaerung) return;
    const src = erklaerung.icon_sprite;
    document.getElementById("lexikon-ereignisse").innerHTML = `
      <h2>Ereignisse</h2>
      <article class="lexikon-karte lexikon-karte--ereignis">
        ${spriteFrameHtml(`./assets/sprites/${src}`, erklaerung.name, "🔥", "sprite-1-1")}
        <h3>${escapeHtml(erklaerung.name)}</h3>
        <p>${escapeHtml(erklaerung.kurzbeschreibung)}</p>
      </article>
    `;
  }

  function wireEvents() {
    if (wired) return;
    wired = true;

    document.getElementById("lexikon-oeffnen-button").addEventListener("click", async () => {
      data = await WaldsimData.load();
      renderGruppen();
      renderEreignisse();
      showScreen("screen-lexikon");
    });

    document.getElementById("lexikon-zurueck-button").addEventListener("click", () => {
      showScreen("screen-start");
    });
  }

  function init() {
    wireEvents();
  }

  return { init };
})();
