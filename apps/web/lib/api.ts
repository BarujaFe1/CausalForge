import type { DemoSummary, EstimateResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export async function fetchDemo(): Promise<DemoSummary> {
  const res = await fetch(`${API_URL}/api/demo`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load demo dataset summary");
  return res.json();
}

export async function runEstimate(body: {
  method: "diff_in_diff" | "matching";
  outcome?: string;
  intervention?: string;
  treated_region?: string;
}): Promise<EstimateResponse> {
  const res = await fetch(`${API_URL}/api/estimate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(detail || "Estimate request failed");
  }
  return res.json();
}
