export type AssumptionItem = {
  id: string;
  label: string;
  status: "assumed" | "checked" | "unverified" | "violated";
  note: string;
};

export type EstimateResponse = {
  method: string;
  intervention: string;
  outcome: string;
  effect_estimate: number;
  std_error: number;
  ci_low: number;
  ci_high: number;
  n_treated: number;
  n_control: number;
  assumptions: AssumptionItem[];
  limitations: string[];
  decision_memo: string;
  disclaimer: string;
};

export type DemoSummary = {
  name: string;
  description: string;
  rows: number;
  columns: string[];
  regions: string[];
  periods: string[];
  treatment_rate: number;
  outcome: string;
  intervention: string;
  path: string;
  notice: string;
};
