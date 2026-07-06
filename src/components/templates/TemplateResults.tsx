// src/components/templates/TemplateResults.tsx
// Renders immediate search result cards.
// onSelect now triggers GET /api/v1/templates/:template_id via the hook.

import React from "react";
import type { SearchResult } from "../../hooks/useTemplateSearch";

interface TemplateResultsProps {
  results: SearchResult[];
  query: string;
  /** Called with template_id — hook fetches and caches the full template */
  onSelect: (templateId: string) => void;
  onNewSearch: () => void;
  /** True while the selected template is being fetched */
  isLoadingTemplate?: boolean;
  /** template_id currently being loaded — highlights the active card */
  loadingTemplateId?: string;
}

// ── Similarity badge ──────────────────────────────────────────────────────────
const SimilarityBadge: React.FC<{ score: number, criteria: string | null }> = ({ score, criteria }) => {
  const pct = Math.round(score * 100);
  const label = pct >= 85 ? "Strong match" : pct >= 70 ? "Good match" : "Possible match";
  const color =
    pct >= 85
      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
      : pct >= 70
      ? "text-[#A8872E] bg-[#FBF5E6] border-[#E8D5A3]"
      : "text-[#5C5C5C] bg-[#F5F5F5] border-[#E0E0E0]";

  return (
    <span className={`font-sans text-[10px] uppercase tracking-widest border px-2 py-0.5 ${color}`}>
      {label} · {pct}% {criteria}
    </span>
  );
};

// ── Result card ───────────────────────────────────────────────────────────────
const ResultCard: React.FC<{
  result: SearchResult;
  onSelect: (templateId: string) => void;
  isLoading: boolean;
  isActive: boolean;
}> = ({ result, onSelect, isLoading, isActive }) => (
  <button
    type="button"
    onClick={() => !isLoading && onSelect(result.template_id)}
    disabled={isLoading}
    className={`
      w-full text-left p-6 bg-white border transition-colors duration-200
      group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]
      ${isActive
        ? "border-[#C9A84C] opacity-70 cursor-wait"
        : "border-[#E8D5A3] hover:border-[#C9A84C]"}
      ${isLoading && !isActive ? "opacity-50 cursor-not-allowed" : ""}
    `}
  >
    <div className="flex items-start justify-between gap-4 mb-3">
      <h3
        className={`text-xl font-semibold leading-snug transition-colors duration-150
          ${isActive ? "text-[#C9A84C]" : "text-[#1C1C1C] group-hover:text-[#C9A84C]"}`}
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >
        {result.title}
      </h3>
      <SimilarityBadge score={result.similarity} criteria={`by ${result.match_type}`}/>
    </div>

    {result.description && result.description !== result.title && (
      <p className="font-sans text-sm text-[#5C5C5C] leading-relaxed mb-3">
        {result.description}
      </p>
    )}

    <div className="flex items-center justify-between">
      {result.practice_area ? (
        <span className="font-sans text-[10px] uppercase tracking-widest text-[#C9A84C] border border-[#E8D5A3] px-2 py-0.5">
          {result.practice_area}
        </span>
      ) : (
        <span />
      )}

      {/* Loading spinner on the active card, arrow on others */}
      {isActive ? (
        <span className="flex items-center gap-1.5 font-sans text-xs text-[#C9A84C]">
          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Loading…
        </span>
      ) : (
        <span className="font-sans text-xs text-[#C9A84C] opacity-0 group-hover:opacity-100
          transition-opacity duration-150 flex items-center gap-1">
          View template
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      )}
    </div>
  </button>
);

// ── Section ───────────────────────────────────────────────────────────────────
const TemplateResults: React.FC<TemplateResultsProps> = ({
  results,
  query,
  onSelect,
  onNewSearch,
  isLoadingTemplate = false,
  loadingTemplateId,
}) => (
  <div className="w-full max-w-2xl mx-auto">
    <div className="flex items-center justify-between mb-6">
      <div>
        <p className="font-sans text-xs uppercase tracking-widest text-[#C9A84C] mb-1">
          Search results
        </p>
        <h2
          className="text-2xl text-[#1C1C1C] font-light"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Templates for{" "}
          <em className="not-italic text-[#C9A84C]">"{query}"</em>
        </h2>
      </div>
      <button
        type="button"
        onClick={onNewSearch}
        disabled={isLoadingTemplate}
        className="font-sans text-xs text-[#5C5C5C] hover:text-[#C9A84C]
          underline underline-offset-4 transition-colors duration-150
          flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        New search
      </button>
    </div>

    {results.length === 0 ? (
      <div className="py-12 text-center border border-dashed border-[#E8D5A3]">
        <p className="font-sans text-sm text-[#5C5C5C]">
          No templates found for this query.
        </p>
        <button
          type="button"
          onClick={onNewSearch}
          className="mt-4 font-sans text-sm text-[#C9A84C] underline underline-offset-4"
        >
          Try a different search
        </button>
      </div>
    ) : (
      <div className="flex flex-col gap-4">
        {results.map((result) => (
          <ResultCard
            key={result.template_id}
            result={result}
            onSelect={onSelect}
            isLoading={isLoadingTemplate}
            isActive={loadingTemplateId === result.template_id}
          />
        ))}
      </div>
    )}
  </div>
);

export default TemplateResults;
