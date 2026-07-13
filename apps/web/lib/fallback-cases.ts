import type { CaseSummary } from "@/types";

export const FALLBACK_CASES: CaseSummary[] = [
  {
    id: "promo_campaign",
    title: "Promo campaign (retail panel)",
    title_pt: "Campanha promocional (painel de varejo)",
    description:
      "Synthetic retail panel: 5 regions, pre/post, promo on South in post. Outcome = revenue.",
    description_pt:
      "Painel sintético de varejo: 5 regiões, pre/post, promoção na South no pós. Outcome = revenue.",
    recommended_method: "diff_in_diff",
    outcome: "revenue",
    intervention: "promo_campaign",
    treated_region: "South",
    story:
      "Growth rolled a regional promo. Did revenue rise because of the campaign?",
    story_pt:
      "Growth lançou uma promoção regional. A receita subiu por causa da campanha, ou teria subido de qualquer forma?",
    expected_signal: "positive_clear",
    notice: "Synthetic data only. Method demonstration — not a production decision.",
  },
  {
    id: "support_sla",
    title: "Support SLA coaching (ops matching)",
    title_pt: "Coaching de SLA de atendimento (matching operacional)",
    description:
      "Synthetic support ops: coached vs similar uncoached agents. Outcome = resolution_hours.",
    description_pt:
      "Ops de suporte sintético: agentes com coaching vs similares sem coaching. Outcome = resolution_hours.",
    recommended_method: "matching",
    outcome: "resolution_hours",
    intervention: "sla_coaching",
    treated_region: "coached",
    story:
      "Ops coached half the agents on SLA. Did coaching shorten resolution time?",
    story_pt:
      "Ops treinou metade dos agentes em SLA. O coaching reduziu o tempo de resolução, ou os agentes já eram diferentes?",
    expected_signal: "inconclusive_likely",
    notice: "Synthetic data only. Inconclusive intervals are a feature, not a bug.",
  },
];

export const STEPS = [
  { id: "case", label: "1. Caso" },
  { id: "question", label: "2. Pergunta" },
  { id: "assumptions", label: "3. Hipóteses" },
  { id: "estimate", label: "4. Evidência" },
  { id: "memo", label: "5. Memo" },
] as const;

export type StepId = (typeof STEPS)[number]["id"];
