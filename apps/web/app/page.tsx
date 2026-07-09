"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchDemo, getApiUrl, runEstimate } from "@/lib/api";
import type { CaseSummary, DemoSummary, EstimateResponse } from "@/types";

const STEPS = [
  { id: "case", label: "1. Caso" },
  { id: "question", label: "2. Pergunta" },
  { id: "assumptions", label: "3. Hipóteses" },
  { id: "estimate", label: "4. Evidência" },
  { id: "memo", label: "5. Memo" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

const FALLBACK_CASES: CaseSummary[] = [
  {
    id: "promo_campaign",
    title: "Promo campaign (retail panel)",
    title_pt: "Campanha promocional (painel de varejo)",
    description: "",
    description_pt: "",
    recommended_method: "diff_in_diff",
    outcome: "revenue",
    intervention: "promo_campaign",
    treated_region: "South",
    story: "",
    story_pt: "Growth lançou uma promoção regional.",
    expected_signal: "positive_clear",
    notice: "Synthetic data only.",
  },
  {
    id: "support_sla",
    title: "Support SLA coaching",
    title_pt: "Coaching de SLA de atendimento",
    description: "",
    description_pt: "",
    recommended_method: "matching",
    outcome: "resolution_hours",
    intervention: "sla_coaching",
    treated_region: "coached",
    story: "",
    story_pt: "Ops treinou metade dos agentes em SLA.",
    expected_signal: "inconclusive_likely",
    notice: "Synthetic data only.",
  },
];

export default function HomePage() {
  const [step, setStep] = useState<StepId>("case");
  const [caseId, setCaseId] = useState<"promo_campaign" | "support_sla">("promo_campaign");
  const [demo, setDemo] = useState<DemoSummary | null>(null);
  const [cases, setCases] = useState<CaseSummary[]>(FALLBACK_CASES);
  const [method, setMethod] = useState<"diff_in_diff" | "matching">("diff_in_diff");
  const [result, setResult] = useState<EstimateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCase = useCallback(async (id: "promo_campaign" | "support_sla") => {
    setError(null);
    setResult(null);
    try {
      const data = await fetchDemo(id);
      setDemo(data);
      if (data.cases?.length) setCases(data.cases);
      setMethod(data.recommended_method);
    } catch (err) {
      setError(
        err instanceof Error
          ? `${err.message} (API: ${getApiUrl()})`
          : "Failed to load demo",
      );
    }
  }, []);

  useEffect(() => {
    void loadCase(caseId);
  }, [caseId, loadCase]);

  const selectedCase = useMemo(
    () => cases.find((c) => c.id === caseId) ?? FALLBACK_CASES[0],
    [cases, caseId],
  );

  async function onEstimate() {
    setLoading(true);
    setError(null);
    try {
      const data = await runEstimate({
        case_id: caseId,
        method,
      });
      setResult(data);
      setStep("memo");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Estimate failed");
    } finally {
      setLoading(false);
    }
  }

  function selectCase(id: "promo_campaign" | "support_sla") {
    setCaseId(id);
    setStep("question");
  }

  return (
    <main>
      <section className="hero">
        <div className="brand">CausalForge</div>
        <h1>Demo mínima de inferência causal responsável</h1>
        <p className="lead">
          Escolha um caso sintético, declare hipóteses, estime com Diff-in-Diff ou matching e
          leia um decision memo com caveats — sem prometer causalidade automática.
        </p>
        <div className="notice">
          <strong>Responsible Causal Notice:</strong> estimativas observacionais dependem de
          pressupostos. Resultados são <em>suggestive</em> ou <em>inconclusive</em> sob
          hipóteses declaradas — nunca “prova” de impacto.
        </div>
      </section>

      <nav className="steps" aria-label="Jornada causal">
        {STEPS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`step ${step === s.id ? "active" : ""}`}
            onClick={() => setStep(s.id)}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {error ? <p className="error">{error}</p> : null}

      {step === "case" ? (
        <section className="grid">
          {cases.map((c) => (
            <article
              key={c.id}
              className={`panel clickable ${caseId === c.id ? "selected" : ""}`}
              onClick={() => selectCase(c.id as "promo_campaign" | "support_sla")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  selectCase(c.id as "promo_campaign" | "support_sla");
                }
              }}
              role="button"
              tabIndex={0}
            >
              <h2>{c.title_pt}</h2>
              <p className="muted">{c.story_pt || c.description_pt}</p>
              <p className="muted">
                Método sugerido:{" "}
                <strong>
                  {c.recommended_method === "diff_in_diff" ? "Diff-in-Diff" : "Matching"}
                </strong>
                {" · "}
                sinal esperado: <code>{c.expected_signal}</code>
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  selectCase(c.id as "promo_campaign" | "support_sla");
                }}
              >
                Usar este caso
              </button>
            </article>
          ))}
        </section>
      ) : null}

      {step === "question" && demo ? (
        <section className="grid">
          <article className="panel">
            <h2>Pergunta causal</h2>
            <p className="muted">{demo.story_pt}</p>
            <ul className="list">
              <li>
                <strong>Intervenção:</strong> {demo.intervention}
              </li>
              <li>
                <strong>Outcome:</strong> {demo.outcome}
              </li>
              <li>
                <strong>Unidade tratada:</strong> {demo.treated_region}
              </li>
              <li>
                <strong>N:</strong> {demo.rows} linhas · {demo.regions.length} unidades · períodos{" "}
                {demo.periods.join(" / ")}
              </li>
            </ul>
            <button type="button" onClick={() => setStep("assumptions")}>
              Revisar hipóteses →
            </button>
          </article>
          <article className="panel">
            <h2>Dataset sintético</h2>
            <p className="muted">{demo.description_pt}</p>
            <p className="kpi">{demo.rows}</p>
            <p className="muted">{demo.notice}</p>
          </article>
        </section>
      ) : null}

      {step === "assumptions" ? (
        <section className="grid">
          <article className="panel">
            <h2>Checklist de hipóteses (antes de estimar)</h2>
            <p className="muted">
              Declarar pressupostos <em>antes</em> do número reduz overclaim. Status abaixo é o
              padrão do MVP para o método escolhido.
            </p>
            <div className="controls">
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
            </div>
            {method === "diff_in_diff" ? (
              <ul className="list">
                <li>
                  <span className="badge assumed">assumed</span>
                  <strong>Parallel trends</strong> — sem a intervenção, tratados e controles
                  seguiriam tendências similares.
                </li>
                <li>
                  <span className="badge assumed">assumed</span>
                  <strong>No anticipation</strong> — sem mudança de comportamento antes do início.
                </li>
                <li>
                  <span className="badge checked">checked</span>
                  <strong>Stable composition</strong> — painel demo mantém as mesmas unidades.
                </li>
              </ul>
            ) : (
              <ul className="list">
                <li>
                  <span className="badge assumed">assumed</span>
                  <strong>Unconfoundedness</strong> — covariáveis observadas bloqueiam
                  confundimento.
                </li>
                <li>
                  <span className="badge unverified">unverified</span>
                  <strong>Overlap</strong> — suporte comum ainda sem diagnóstico de propensity.
                </li>
                <li>
                  <span className="badge assumed">assumed</span>
                  <strong>SUTVA</strong> — sem interferência entre unidades.
                </li>
              </ul>
            )}
            <button type="button" onClick={() => setStep("estimate")}>
              Ir para estimação →
            </button>
          </article>
          <article className="panel">
            <h2>O que isto NÃO é</h2>
            <ul className="list">
              <li>Não é causalidade automática com um clique.</li>
              <li>Não substitui RCT quando o desenho exige.</li>
              <li>Não é recomendação operacional sobre pessoas.</li>
              <li>Caso atual: <strong>{selectedCase.title_pt}</strong></li>
            </ul>
          </article>
        </section>
      ) : null}

      {step === "estimate" ? (
        <section>
          <div className="controls">
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
            <button type="button" onClick={onEstimate} disabled={loading}>
              {loading ? "Estimando…" : "Estimar impacto"}
            </button>
          </div>

          {result ? (
            <section className="grid">
              <article className="panel">
                <h2>Effect estimator</h2>
                <p className={`evidence ${result.evidence_label}`}>
                  {result.evidence_label === "inconclusive" ? "INCONCLUSIVE" : "SUGGESTIVE"}
                </p>
                <p className="kpi">{result.effect_estimate.toFixed(2)}</p>
                <p className="muted">
                  SE {result.std_error.toFixed(2)} · 95% CI [{result.ci_low.toFixed(2)},{" "}
                  {result.ci_high.toFixed(2)}]
                  {result.crosses_zero ? " · inclui zero" : " · exclui zero"}
                </p>
                <p className="muted">
                  n treated={result.n_treated} · n control={result.n_control} · {result.method}
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
                <button type="button" onClick={() => setStep("memo")}>
                  Abrir decision memo →
                </button>
              </article>
            </section>
          ) : (
            <article className="panel">
              <h2>Pronto para estimar</h2>
              <p className="muted">
                Caso <strong>{caseId}</strong> · método{" "}
                <strong>{method === "diff_in_diff" ? "Diff-in-Diff" : "Matching"}</strong>. O
                número só faz sentido junto com hipóteses e caveats.
              </p>
            </article>
          )}
        </section>
      ) : null}

      {step === "memo" ? (
        result ? (
          <section className="grid">
            <article className="panel wide">
              <h2>Decision memo</h2>
              <p className={`evidence ${result.evidence_label}`}>
                {result.evidence_label === "inconclusive" ? "INCONCLUSIVE" : "SUGGESTIVE — not proven"}
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
              <button type="button" onClick={() => setStep("case")}>
                Trocar de caso
              </button>
            </article>
          </section>
        ) : (
          <article className="panel">
            <h2>Memo ainda vazio</h2>
            <p className="muted">Estime um efeito na etapa 4 para gerar o decision memo.</p>
            <button type="button" onClick={() => setStep("estimate")}>
              Ir para evidência →
            </button>
          </article>
        )
      ) : null}

      <footer>
        CausalForge · Felipe Alirio Baruja · MIT · Synthetic demo only · API {getApiUrl()}
      </footer>
    </main>
  );
}
