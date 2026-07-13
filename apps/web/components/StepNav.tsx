"use client";

import { STEPS, type StepId } from "@/lib/fallback-cases";

type Props = {
  step: StepId;
  onChange: (id: StepId) => void;
};

export function StepNav({ step, onChange }: Props) {
  return (
    <nav className="steps" aria-label="Jornada causal">
      {STEPS.map((s) => (
        <button
          key={s.id}
          type="button"
          className={`step ${step === s.id ? "active" : ""}`}
          aria-current={step === s.id ? "step" : undefined}
          onClick={() => onChange(s.id)}
        >
          {s.label}
        </button>
      ))}
    </nav>
  );
}
