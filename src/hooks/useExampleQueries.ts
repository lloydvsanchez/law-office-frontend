// src/hooks/useExampleQueries.ts
// Fetches example queries from GET /api/v1/examples.
// Falls back to FALLBACK_EXAMPLES if:
//   - the fetch fails
//   - the API returns fewer than MIN_EXAMPLES results
//
// Returns a stable array of ExampleQuery objects with title + description.
// The title is shown as the button label; description is the tooltip.

import { useState, useEffect } from "react";

const BASE_URL = "http://localhost:3000/api/v1";
const MIN_EXAMPLES = 5;

export interface ExampleQuery {
  title: string;
  description: string;
}

// ── Fallback data ─────────────────────────────────────────────────────────────
// Used when API is unavailable or returns fewer than MIN_EXAMPLES results.
export const FALLBACK_EXAMPLES: ExampleQuery[] = [
  {
    title: "Special Power of Attorney",
    description: "Generate a Special Power of Attorney template for authorizing a representative to act on your behalf.",
  },
  {
    title: "Deed of Absolute Sale",
    description: "Generate a Deed of Absolute Sale template for transferring ownership of real property.",
  },
  {
    title: "Affidavit of Loss",
    description: "Generate an Affidavit of Loss template for reporting and documenting a lost document or item.",
  },
  {
    title: "Contract to Sell",
    description: "Generate a Contract to Sell template for a conditional sale of real or personal property.",
  },
  {
    title: "Demand Letter for unpaid debt",
    description: "Generate a demand letter template for formally requesting payment of an outstanding obligation.",
  },
];

// ── API response shape ────────────────────────────────────────────────────────
interface ExamplesApiResponse {
  data: Array<{ title: string; description: string }>;
  meta: { size: number };
  errors: string[];
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useExampleQueries() {
  const [examples, setExamples] = useState<ExampleQuery[]>(FALLBACK_EXAMPLES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchExamples = async () => {
      try {
        const res = await fetch(`${BASE_URL}/examples`);

        if (!res.ok) throw new Error(`Examples fetch failed (${res.status})`);

        const json: ExamplesApiResponse = await res.json();
        const apiExamples: ExampleQuery[] = json.data.map((item) => ({
          title: item.title,
          description: item.description,
        }));

        if (cancelled) return;

        // Use API results only if we got at least MIN_EXAMPLES
        if (apiExamples.length >= MIN_EXAMPLES) {
          setExamples(apiExamples);
        }
        // else: keep FALLBACK_EXAMPLES already set as initial state
      } catch {
        // Fetch failed — FALLBACK_EXAMPLES already in state, nothing to do
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchExamples();

    return () => {
      cancelled = true;
    };
  }, []); // runs once on mount

  return { examples, loading };
}
