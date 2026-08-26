/**
 * Lehrkraft-Übersicht (M19, siehe Milestones-Dokument, Backlog "Erstelle
 * eine Liste den Interessantesten 2er Kombinationen"): zeigt die Top-20-
 * Rangliste aus data/generated/lehrkraft_kombinationen.json (build-time
 * vorberechnet, siehe scripts/simulation/build_lehrkraft_kombinationen.py -
 * hier wird nichts nachgerechnet, nur formatiert). Dient der Lehrkraft zur
 * gezielten Verteilung besonders kontrastreicher Wald×Störung-Kombinationen
 * an Gruppen. Rein informativ, kein Teil des Schüler:innen-Durchlaufs -
 * eigener, dezenter Button im Start-Bildschirm-Header wie Forscherheft/
 * Netzwerk/Lexikon.
 */
const WaldsimLehrkraft = (() => {
  const { escapeHtml, showScreen } = WaldsimUI;

  let wired = false;

  function eintragHtml(eintrag, waldtypNamen) {
    const nameA = waldtypNamen[eintrag.waldtyp_a] || eintrag.waldtyp_a;
    const nameB = waldtypNamen[eintrag.waldtyp_b] || eintrag.waldtyp_b;
    const unterschiede = eintrag.staerkste_unterschiede.map((u) => escapeHtml(u)).join(", ");

    return `
      <li class="lehrkraft-eintrag">
        <div class="lehrkraft-eintrag-kopf">
          <span class="lehrkraft-rang">#${eintrag.rang}</span>
          <span class="lehrkraft-waelder">${escapeHtml(nameA)} ⇄ ${escapeHtml(nameB)}</span>
        </div>
        <p class="lehrkraft-stoerung"><strong>Störung:</strong> ${escapeHtml(eintrag.ereignis_label)}</p>
        <p class="lehrkraft-regler"><strong>Prädator-Regler:</strong> ${escapeHtml(eintrag.regler_label)}</p>
        <p class="lehrkraft-endzustand">
          <strong>${escapeHtml(nameA)}:</strong> ${escapeHtml(eintrag.waldtyp_a_endzustand.label)}
          (Baumbestand ${eintrag.waldtyp_a_endzustand.gesamtvitalitaet} von 100)
          &nbsp;·&nbsp;
          <strong>${escapeHtml(nameB)}:</strong> ${escapeHtml(eintrag.waldtyp_b_endzustand.label)}
          (Baumbestand ${eintrag.waldtyp_b_endzustand.gesamtvitalitaet} von 100)
        </p>
        <p class="lehrkraft-unterschiede form-hint">Größte Unterschiede: ${unterschiede}</p>
      </li>
    `;
  }

  function render(daten, waldtypen) {
    const waldtypNamen = {};
    waldtypen.forEach((wt) => {
      waldtypNamen[wt.id] = wt.kurzname;
    });

    document.getElementById("lehrkraft-hinweis").textContent =
      `Rangliste der ${daten.kombinationen.length} kontrastreichsten von ${daten.__meta_bewertet} geprüften Wald×Störung-Kombinationen ` +
      "(gemessen an der Differenz der 6 Dashboard-Anzeigen bei Jahr 20) - zur gezielten Verteilung an Gruppen.";

    document.getElementById("lehrkraft-liste").innerHTML = daten.kombinationen
      .map((eintrag) => eintragHtml(eintrag, waldtypNamen))
      .join("");
  }

  function wireEvents() {
    if (wired) return;
    wired = true;

    document.getElementById("lehrkraft-oeffnen-button").addEventListener("click", async () => {
      const [daten, { waldtypen }] = await Promise.all([
        WaldsimData.ladeZeitreihe("lehrkraft_kombinationen.json"),
        WaldsimData.load(),
      ]);
      daten.__meta_bewertet = daten._meta.bewertete_waldtyp_ereignis_kombinationen_gesamt;
      render(daten, waldtypen);
      showScreen("screen-lehrkraft");
    });

    document.getElementById("lehrkraft-zurueck-button").addEventListener("click", () => {
      showScreen("screen-start");
    });
  }

  function init() {
    wireEvents();
  }

  return { init };
})();
