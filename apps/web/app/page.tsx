"use client";

import { useEffect, useState } from "react";
import { fetchDemo, runEstimate } from "@/lib/api";
import type { DemoSummary, EstimateResponse } from "@/types";

export default function HomePage() {
  const [demo, setDemo] = useState<DemoSummary | null>(null);
  const [method, setMethod] = useState<"diff_in_diff" | "matching">("diff_in_diff");
  const [region, setRegion] = useState("South");
  const [result, setResult] = useState<EstimateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDemo()
      .then(setDemo)
      .catch((err: Error) => setError(err.message));
  }, []);

  async function onEstimate() {
    setLoading(true);
    setError(null);
    try {
      const data = await runEstimate({
        method,
        treated_region: region,
        intervention: "promo_campaign",
        outcome: "revenue",
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Estimate failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <section className="hero">
        <div className="brand">CausalForge</div>
        <h1>Laboratório de inferência causal aplicada para intervenções de negócio</h1>
        <p className="lead">
          Monte a pergunta causal, declare hipóteses, estime o efeito com Diff-in-Diff ou
          matching básico e leia incerteza, limitações e um decision memo — sem prometer
          causalidade automática.
        </p>
        <div className="notice">
          <strong>Responsible Causal Notice:</strong> estimativas observacionais dependem de
          pressupostos. CausalForge reporta efeito com incerteza e limites declarados; não
          substitui desenho experimental nem julgamento de domínio.
        </div>
      </section>

      <section className="grid">
        <article className="panel">
          <h2>Demo dataset</h2>
          {demo ? (
            <>
              <p className="muted">{demo.description}</p>
              <p className="kpi">{demo.rows}</p>
              <p className="muted">linhas · {demo.regions.length} regiões · outcome: {demo.outcome}</p>
            </>
          ) : (
            <p className="muted">Carregando resumo do dataset sintético…</p>
          )}
        </article>
        <article className="panel">
          <h2>Jornada guiada</h2>
          <ol className="list">
            <li>Pergunta causal / intervenção</li>
            <li>Checklist de hipóteses</li>
            <li>Método (DiD ou matching)</li>
            <li>Efeito + intervalo de confiança</li>
            <li>Decision memo e limitações</li>
          </ol>
        </article>
      </section>

      <section className="controls">
        <label>
          Método
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as "diff_in_diff" | "matching")}
          >
            <option value="diff_in_diff">Difference-in-Differences</option>
            <option value="matching">Matching (nearest neighbor)</option>
          </select>
        </label>
        <label>
          Região tratada
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            {(demo?.regions ?? ["South", "North", "East", "West", "Central"]).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={onEstimate} disabled={loading}>
          {loading ? "Estimando…" : "Estimar impacto"}
        </button>
      </section>

      {error ? <p className="error">{error}</p> : null}

      {result ? (
        <section className="grid" style={{ marginTop: "0.5rem" }}>
          <article className="panel">
            <h2>Effect estimator</h2>
            <p className="kpi">{result.effect_estimate.toFixed(2)}</p>
            <p className="muted">
              SE {result.std_error.toFixed(2)} · 95% CI [{result.ci_low.toFixed(2)},{" "}
              {result.ci_high.toFixed(2)}]
            </p>
            <p className="muted">
              n treated={result.n_treated} · n control={result.n_control} · method={result.method}
            </p>
          </article>
          <article className="panel">
            <h2>Assumption checklist</h2>
            <ul className="list">
              {result.assumptions.map((a) => (
                <li key={a.id}>
                  <span className={`badge ${a.status}`}>{a.status}</span>
                  <strong>{a.label}</strong> — {a.note}
                </li>
              ))}
            </ul>
          </article>
          <article className="panel">
            <h2>Decision memo</h2>
            <p className="muted">{result.decision_memo}</p>
          </article>
          <article className="panel">
            <h2>Limitations</h2>
            <ul className="list">
              {result.limitations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="muted" style={{ marginTop: "0.8rem" }}>
              {result.disclaimer}
            </p>
          </article>
        </section>
      ) : null}

      <footer>
        CausalForge · Felipe Alirio Baruja · MIT License · Synthetic demo data only
      </footer>
    </main>
  );
}
