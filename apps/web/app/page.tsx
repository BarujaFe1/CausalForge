"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CasePicker } from "@/components/CasePicker";
import { DecisionMemo } from "@/components/DecisionMemo";
import { EvidencePanel } from "@/components/EvidencePanel";
import { StepNav } from "@/components/StepNav";
import { fetchDemo, getApiUrl, runEstimate } from "@/lib/api";
import { FALLBACK_CASES, type StepId } from "@/lib/fallback-cases";
import type { CaseSummary, DemoSummary, EstimateResponse } from "@/types";

export default function HomePage() {
  const [step, setStep] = useState<StepId>("case");
  const [caseId, setCaseId] = useState<"promo_campaign" | "support_sla">("promo_campaign");
  const [demo, setDemo] = useState<DemoSummary | null>(null);
  const [cases, setCases] = useState<CaseSummary[]>(FALLBACK_CASES);
  const [method, setMethod] = useState<"diff_in_diff" | "matching">("diff_in_diff");
  const [result, setResult] = useState<EstimateResponse | null>(null);
  const [loadingCase, setLoadingCase] = useState(true);
  const [loadingEstimate, setLoadingEstimate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiOnline, setApiOnline] = useState(true);

  const loadCase = useCallback(async (id: "promo_campaign" | "support_sla") => {
    setError(null);
    setResult(null);
    setLoadingCase(true);
    try {
      const data = await fetchDemo(id);
      setDemo(data);
      if (data.cases?.length) setCases(data.cases);
      setMethod(data.recommended_method);
      setApiOnline(true);
    } catch (err) {
      setApiOnline(false);
      const fallback = FALLBACK_CASES.find((c) => c.id === id) ?? FALLBACK_CASES[0];
      setCases(FALLBACK_CASES);
      setDemo({
        id: fallback.id,
        name: fallback.id,
        title: fallback.title,
        title_pt: fallback.title_pt,
        description: fallback.description,
        description_pt: fallback.description_pt,
        story: fallback.story,
        story_pt: fallback.story_pt,
        rows: 0,
        columns: [],
        regions: [fallback.treated_region],
        periods: ["pre", "post"],
        treatment_rate: 0,
        outcome: fallback.outcome,
        intervention: fallback.intervention,
        treated_region: fallback.treated_region,
        recommended_method: fallback.recommended_method,
        expected_signal: fallback.expected_signal,
        path: "",
        notice: fallback.notice,
        cases: FALLBACK_CASES,
      });
      setMethod(fallback.recommended_method);
      setError(
        err instanceof Error
          ? `API indisponível (${getApiUrl()}): ${err.message}. Você pode explorar a jornada; a estimativa exige a API.`
          : "API indisponível",
      );
    } finally {
      setLoadingCase(false);
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
    setLoadingEstimate(true);
    setError(null);
    try {
      const data = await runEstimate({ case_id: caseId, method });
      setResult(data);
      setApiOnline(true);
      setStep("memo");
    } catch (err) {
      setError(
        err instanceof Error
          ? `Falha ao estimar: ${err.message}. Confirme que a API está no ar (${getApiUrl()}).`
          : "Estimate failed",
      );
    } finally {
      setLoadingEstimate(false);
    }
  }

  function selectCase(id: "promo_campaign" | "support_sla") {
    setCaseId(id);
    setStep("question");
  }

  return (
    <main id="conteudo-principal">
      <section className="hero">
        <div className="brand">CausalForge</div>
        <h1>Demo mínima de inferência causal responsável</h1>
        <p className="lead">
          Escolha um caso sintético, declare hipóteses, estime com Diff-in-Diff ou matching e
          leia um decision memo com caveats — sem prometer causalidade automática.
        </p>
        <div className="notice" role="note">
          <strong>Responsible Causal Notice:</strong> estimativas observacionais dependem de
          pressupostos. Resultados são <em>suggestive</em> ou <em>inconclusive</em> sob
          hipóteses declaradas — nunca “prova” de impacto.
        </div>
        {!apiOnline ? (
          <div className="banner-warn" role="status">
            Modo degradado: API offline. Navegue pelos passos; rode a API local ou use o deploy
            para estimar.
          </div>
        ) : null}
      </section>

      <StepNav step={step} onChange={setStep} />

      {error ? (
        <p className="error" role="alert">
          {error}
        </p>
      ) : null}

      {step === "case" ? (
        loadingCase ? (
          <div className="skeleton-grid" aria-busy="true" aria-label="Carregando casos">
            <div className="skeleton panel" />
            <div className="skeleton panel" />
          </div>
        ) : (
          <CasePicker cases={cases} selectedId={caseId} onSelect={selectCase} />
        )
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
                <strong>N:</strong>{" "}
                {demo.rows > 0
                  ? `${demo.rows} linhas · ${demo.regions.length} unidades · períodos ${demo.periods.join(" / ")}`
                  : "carregue a API para ver o volume do seed"}
              </li>
            </ul>
            <button type="button" onClick={() => setStep("assumptions")}>
              Revisar hipóteses →
            </button>
          </article>
          <article className="panel">
            <h2>Dataset sintético</h2>
            <p className="muted">{demo.description_pt}</p>
            {demo.rows > 0 ? <p className="kpi">{demo.rows}</p> : <div className="skeleton line" />}
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
              <label htmlFor="method-assumptions">
                Método
                <select
                  id="method-assumptions"
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
                  <strong>Unconfoundedness</strong> — covariáveis observadas (z-scored) bloqueiam
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
              <li>
                Caso atual: <strong>{selectedCase.title_pt}</strong>
              </li>
            </ul>
          </article>
        </section>
      ) : null}

      {step === "estimate" ? (
        <section>
          <div className="controls">
            <label htmlFor="method-estimate">
              Método
              <select
                id="method-estimate"
                value={method}
                onChange={(e) => setMethod(e.target.value as "diff_in_diff" | "matching")}
              >
                <option value="diff_in_diff">Difference-in-Differences</option>
                <option value="matching">Matching (nearest neighbor)</option>
              </select>
            </label>
            <button type="button" onClick={onEstimate} disabled={loadingEstimate || !apiOnline}>
              {loadingEstimate ? "Estimando…" : "Estimar impacto"}
            </button>
          </div>

          {loadingEstimate ? (
            <div className="skeleton-grid" aria-busy="true">
              <div className="skeleton panel" />
              <div className="skeleton panel" />
            </div>
          ) : null}

          {!loadingEstimate && result ? (
            <EvidencePanel result={result} onOpenMemo={() => setStep("memo")} />
          ) : null}

          {!loadingEstimate && !result ? (
            <article className="panel">
              <h2>Pronto para estimar</h2>
              <p className="muted">
                Caso <strong>{caseId}</strong> · método{" "}
                <strong>{method === "diff_in_diff" ? "Diff-in-Diff" : "Matching"}</strong>. O
                número só faz sentido junto com hipóteses e caveats.
              </p>
            </article>
          ) : null}
        </section>
      ) : null}

      {step === "memo" ? (
        result ? (
          <DecisionMemo result={result} onSwitchCase={() => setStep("case")} />
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
