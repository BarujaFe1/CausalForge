export type AssumptionItem = {
  id: string;
  label: string;
  status: "assumed" | "checked" | "unverified" | "violated";
  note: string;
};

export type CaseSummary = {
  id: string;
  title: string;
  title_pt: string;
  description: string;
  description_pt: string;
  recommended_method: "diff_in_diff" | "matching";
  outcome: string;
  intervention: string;
  treated_region: string;
  story: string;
  story_pt: string;
  expected_signal: string;
  notice: string;
};

export type EstimateResponse = {
  case_id: string;
  method: string;
  intervention: string;
  outcome: string;
  effect_estimate: number;
  std_error: number;
  ci_low: number;
  ci_high: number;
  n_treated: number;
  n_control: number;
  crosses_zero: boolean;
  evidence_label: "suggestive" | "inconclusive" | "not_estimable";
  assumptions: AssumptionItem[];
  limitations: string[];
  decision_memo: string;
  caveats: string[];
  disclaimer: string;
};

export type DemoSummary = {
  id: string;
  name: string;
  title: string;
  title_pt: string;
  description: string;
  description_pt: string;
  story: string;
  story_pt: string;
  rows: number;
  columns: string[];
  regions: string[];
  periods: string[];
  treatment_rate: number;
  outcome: string;
  intervention: string;
  treated_region: string;
  recommended_method: "diff_in_diff" | "matching";
  expected_signal: string;
  path: string;
  notice: string;
  cases: CaseSummary[];
};
