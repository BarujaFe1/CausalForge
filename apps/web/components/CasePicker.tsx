"use client";

import type { CaseSummary } from "@/types";

type Props = {
  cases: CaseSummary[];
  selectedId: string;
  onSelect: (id: "promo_campaign" | "support_sla") => void;
};

export function CasePicker({ cases, selectedId, onSelect }: Props) {
  return (
    <section className="grid" aria-label="Casos demo sintéticos">
      {cases.map((c) => {
        const id = c.id as "promo_campaign" | "support_sla";
        const selected = selectedId === c.id;
        return (
          <article
            key={c.id}
            className={`panel clickable ${selected ? "selected" : ""}`}
            onClick={() => onSelect(id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(id);
              }
            }}
            role="button"
            tabIndex={0}
            aria-pressed={selected}
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
                onSelect(id);
              }}
            >
              Usar este caso
            </button>
          </article>
        );
      })}
    </section>
  );
}
