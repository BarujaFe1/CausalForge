"use client";

import type { EstimateResponse } from "@/types";

type Props = {
  result: EstimateResponse;
  onSwitchCase: () => void;
};

export function DecisionMemo({ result, onSwitchCase }: Props) {
  return (
    <section className="grid">
      <article className="panel wide">
        <h2>Decision memo</h2>
        <p className={`evidence ${result.evidence_label}`}>
          {result.evidence_label === "inconclusive"
            ? "INCONCLUSIVE"
            : "SUGGESTIVE — not proven"}
        </p>
        <p className="muted">{result.decision_memo}</p>
      </article>
      <article className="panel">
        <h2>Limitations</h2>
        <ul className="list">
          {result.limitations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
      <article className="panel">
        <h2>Caveats</h2>
        <ul className="list">
          {result.caveats.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="muted" style={{ marginTop: "0.8rem" }}>
          {result.disclaimer}
        </p>
      </article>
      <article className="panel">
        <h2>Próximo passo responsável</h2>
        <ul className="list">
          <li>Se INCONCLUSIVE: não escale; melhore desenho ou poder.</li>
          <li>Se SUGGESTIVE: valide parallel trends / balance antes de agir.</li>
          <li>Documente hipóteses e custo de erro falso-positivo.</li>
        </ul>
        <button type="button" onClick={onSwitchCase}>
          Trocar de caso
        </button>
      </article>
    </section>
  );
}
