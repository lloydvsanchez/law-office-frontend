// src/pages/TemplateSearch.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Template Search page — Google-style single-purpose search experience.
//
// State machine:
//   idle             → full-page centered search bar
//   searching        → compact top bar + spinner
//   polling          → compact top bar + TemplateGenerating
//   results          → compact top bar + TemplateResults
//   loading_template → compact top bar + TemplateResults (cards disabled)
//   viewing_template → compact top bar + TemplateViewer
//   generated        → compact top bar + TemplateDisplay
//   regenerating     → compact top bar + TemplateGenerating (labeled differently)
//   error            → compact top bar + TemplateError
// ─────────────────────────────────────────────────────────────────────────────

import React, { useCallback, useRef } from "react";
import { useTemplateSearch } from "../hooks/useTemplateSearch";
import { useExampleQueries } from "../hooks/useExampleQueries";

import TemplateSearchBar  from "../components/templates/TemplateSearchBar";
import TemplateResults    from "../components/templates/TemplateResults";
import TemplateGenerating from "../components/templates/TemplateGenerating";
import TemplateViewer     from "../components/templates/TemplateViewer";
import TemplateDisplay    from "../components/templates/TemplateDisplay";
import TemplateError      from "../components/templates/TemplateError";

// ── Searching spinner ─────────────────────────────────────────────────────────
const SearchingIndicator: React.FC = () => (
  <div className="flex items-center gap-3 justify-center py-12 text-[#5C5C5C]">
    <div className="w-4 h-4 rounded-full border-2 border-[#C9A84C] border-t-transparent animate-spin" />
    <span className="font-sans text-sm">Searching templates…</span>
  </div>
);

// ── Page ──────────────────────────────────────────────────────────────────────
const TemplateSearch: React.FC = () => {
  const { state, search, selectTemplate, backToResults, regenerate, reset } = useTemplateSearch();
  const lastQueryRef = useRef<string>("");

  // Fetched once at page level — passed as props to TemplateSearchBar (idle only)
  const { examples, loading: examplesLoading } = useExampleQueries();

  const handleSearch = useCallback(
    (query: string) => {
      lastQueryRef.current = query;
      search(query);
    },
    [search]
  );

  const isIdle = state.stage === "idle";
  const isLoadingTemplate = state.stage === "loading_template";
  const isRegenerating = state.stage === "regenerating";

  const isCompactBarLoading =
    state.stage === "searching" ||
    state.stage === "polling" ||
    isLoadingTemplate ||
    isRegenerating;

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col">

      {/* ── Compact top bar — all non-idle states ── */}
      {!isIdle && (
        <header className="sticky top-0 z-40 bg-white border-b border-[#E8D5A3] shadow-sm">
          <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-6">
            <button
              type="button"
              onClick={reset}
              className="flex flex-col leading-none flex-shrink-0 focus:outline-none
                focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
              aria-label="Start new search"
            >
              <span className="text-base tracking-[0.12em] text-[#1C1C1C] font-light"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                L. SANCHEZ
              </span>
              <span className="font-sans text-[8px] tracking-[0.25em] text-[#C9A84C] uppercase font-medium">
                Templates
              </span>
            </button>
            <div className="flex-1 flex justify-center">
              <TemplateSearchBar
                compact
                onSearch={handleSearch}
                isLoading={isCompactBarLoading}
                initialValue={lastQueryRef.current}
              />
            </div>
          </div>
        </header>
      )}

      {/* ── Main content ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">

        {/* IDLE */}
        {state.stage === "idle" && (
          <TemplateSearchBar
            onSearch={handleSearch}
            examples={examples}
            examplesLoading={examplesLoading}
          />
        )}

        {/* SEARCHING */}
        {state.stage === "searching" && <SearchingIndicator />}

        {/* POLLING — initial generation */}
        {state.stage === "polling" && (
          <TemplateGenerating
            query={lastQueryRef.current}
            attempt={state.attempt}
          />
        )}

        {/* REGENERATING — same UI as polling but with different label */}
        {state.stage === "regenerating" && (
          <TemplateGenerating
            query={lastQueryRef.current}
            attempt={state.attempt}
            label="Regenerating template"
          />
        )}

        {/* RESULTS */}
        {state.stage === "results" && (
          <TemplateResults
            results={state.results}
            query={state.query}
            onSelect={selectTemplate}
            onNewSearch={reset}
          />
        )}

        {/* LOADING TEMPLATE — results still visible, cards disabled */}
        {state.stage === "loading_template" && (
          <TemplateResults
            results={state.results}
            query={state.query}
            onSelect={selectTemplate}
            onNewSearch={reset}
            isLoadingTemplate={true}
          />
        )}

        {/* VIEWING TEMPLATE */}
        {state.stage === "viewing_template" && (
          <TemplateViewer
            template={state.template}
            query={state.query}
            onBack={backToResults}
            onNewSearch={reset}
            onRegenerate={regenerate}
          />
        )}

        {/* GENERATED — AI-generated template */}
        {state.stage === "generated" && (
          <TemplateDisplay
            template={state.template}
            query={lastQueryRef.current}
            onNewSearch={reset}
            onRegenerate={regenerate}
          />
        )}

        {/* ERROR */}
        {state.stage === "error" && (
          <TemplateError
            message={state.message}
            retriable={state.retriable}
            onRetry={() => handleSearch(lastQueryRef.current)}
            onNewSearch={reset}
          />
        )}

      </main>

      {/* ── Minimal footer ── */}
      <footer className="py-4 border-t border-[#E8D5A3] text-center">
        <p className="font-sans text-xs text-[#A8A8A8]">
          L. Sanchez Law Office · Template Repository ·{" "}
          <a href="/" className="hover:text-[#C9A84C] transition-colors duration-150">
            Back to site
          </a>
        </p>
      </footer>

    </div>
  );
};

export { TemplateSearch };
