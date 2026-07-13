"use client";

import type { EstimateResponse } from "@/types";

type Props = {
  result: EstimateResponse;
  onOpenMemo: () => void;
};

export function EvidencePanel({ result, onOpenMemo }: Props) {
  return (
    <section className="grid">
      <article className="panel">
        <h2>Effect estimator</h2>
        <p
          className={`evidence ${result.evidence_label}`}
          aria-label={`Evidence label ${result.evidence_label}`}
        >
          {result.evidence_label === "inconclusive" ? "INCONCLUSIVE" : "SUGGESTIVE"}
        </p>
        <p className="kpi" aria-live="polite">
          {result.effect_estimate.toFixed(2)}
        </p>
        <p className="muted">
          SE {result.std_error.toFixed(2)} · 95% CI [{result.ci_low.toFixed(2)},{" "}
          {result.ci_high.toFixed(2)}]
          {result.crosses_zero ? " · inclui zero" : " · exclui zero"}
        </p>
        <p className="muted">
          n treated={result.n_treated} · n control={result.n_control} · {result.method}
        </p>
        <p className="tip">
          {result.crosses_zero
            ? "Intervalo cruza zero → não reivindique impacto sob as hipóteses atuais."
            : "Intervalo exclui zero → evidência sugestiva, ainda condicionada a hipóteses."}
        </p>
      </article>
      <article className="panel">
        <h2>Assumption checklist (pós-estimativa)</h2>
        <ul className="list">
          {result.assumptions.map((a) => (
            <li key={a.id}>
              <span className={`badge ${a.status}`}>{a.status}</span>
              <strong>{a.label}</strong> — {a.note}
            </li>
          ))}
        </ul>
        <button type="button" onClick={onOpenMemo}>
          Abrir decision memo →
        </button>
      </article>
    </section>
  );
}
