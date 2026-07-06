// src/components/templates/TemplateSearchBar.tsx
// Google-style centered search experience shown on initial load.
// Query max length: 120 characters (see MAX_QUERY_LENGTH).
// Shows character count as user approaches the limit.

import React, { useState, useRef, useEffect } from "react";

export const MAX_QUERY_LENGTH = 120;

// Suggested example queries shown below the search bar — helps users understand
// what kinds of documents they can ask for.
const EXAMPLE_QUERIES = [
  "Special Power of Attorney",
  "Deed of Absolute Sale",
  "Affidavit of Loss",
  "Contract to Sell",
  "Demand Letter for unpaid debt",
];

interface TemplateSearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  /** If provided, renders as a compact top bar instead of centered hero */
  compact?: boolean;
  initialValue?: string;
}

const TemplateSearchBar: React.FC<TemplateSearchBarProps> = ({
  onSearch,
  isLoading = false,
  compact = false,
  initialValue = "",
}) => {
  const [query, setQuery] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const remaining = MAX_QUERY_LENGTH - query.length;
  const isNearLimit = remaining <= 20;
  const isAtLimit = remaining <= 0;

  useEffect(() => {
    if (!compact) {
      // Auto-focus on load for the hero state
      inputRef.current?.focus();
    }
  }, [compact]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || isLoading) return;
    onSearch(trimmed);
  };

  if (compact) {
    // ── Compact top-bar variant (shown after search) ──
    return (
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 w-full max-w-2xl"
      >
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value.slice(0, MAX_QUERY_LENGTH))}
            placeholder="Search for another template..."
            disabled={isLoading}
            className="w-full font-sans text-sm text-[#1C1C1C] bg-white border border-[#E8D5A3]
              focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] focus:outline-none
              px-4 py-2.5 pr-16 placeholder:text-[#C0BAB0] transition-colors duration-150
              disabled:opacity-50"
          />
          {isNearLimit && (
            <span
              className={`absolute right-3 top-1/2 -translate-y-1/2 font-sans text-xs
                ${isAtLimit ? "text-red-400" : "text-[#A8A8A8]"}`}
            >
              {remaining}
            </span>
          )}
        </div>
        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="flex-shrink-0 bg-[#C9A84C] text-white font-sans text-xs font-medium
            uppercase tracking-wide px-5 py-2.5 hover:bg-[#A8872E] transition-colors
            duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Search
        </button>
      </form>
    );
  }

  // ── Hero / idle variant (full centered layout) ──
  return (
    <div className="flex flex-col items-center justify-center text-center px-6">
      {/* Wordmark */}
      <div className="mb-10">
        <p
          className="text-2xl tracking-[0.14em] text-[#1C1C1C] font-light"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          L. SANCHEZ
        </p>
        <p className="font-sans text-[9px] tracking-[0.28em] text-[#C9A84C] uppercase font-medium">
          Law Office
        </p>
      </div>

      {/* Main prompt */}
      <h1
        className="text-3xl md:text-4xl text-[#1C1C1C] font-light leading-snug mb-2"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >
        Describe the document you need.
      </h1>
      <p className="font-sans text-sm text-[#5C5C5C] mb-8 max-w-sm">
        The office will find or generate the right legal template for your matter.
      </p>

      {/* Search form */}
      <form onSubmit={handleSubmit} className="w-full max-w-xl">
        <div className="relative">
          {/* Search icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z"
              />
            </svg>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value.slice(0, MAX_QUERY_LENGTH))}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
            placeholder="e.g. Special Power of Attorney for property sale"
            disabled={isLoading}
            aria-label="Document template search"
            className="w-full font-sans text-base text-[#1C1C1C] bg-white
              border border-[#E8D5A3] shadow-sm focus:border-[#C9A84C]
              focus:ring-2 focus:ring-[#C9A84C] focus:outline-none
              pl-12 pr-20 py-4 placeholder:text-[#C0BAB0]
              transition-colors duration-150 disabled:opacity-50"
          />

          {/* Character counter — appears near limit */}
          {isNearLimit && (
            <span
              className={`absolute right-16 top-1/2 -translate-y-1/2 font-sans text-xs
                ${isAtLimit ? "text-red-400 font-semibold" : "text-[#A8A8A8]"}`}
            >
              {remaining}
            </span>
          )}

          {/* Submit button inside input */}
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2
              bg-[#C9A84C] text-white font-sans text-xs font-medium uppercase
              tracking-wide px-4 py-2 hover:bg-[#A8872E] transition-colors
              duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Search"
          >
            Find
          </button>
        </div>

        {/* Max length hint */}
        <p className="font-sans text-xs text-[#A8A8A8] mt-2 text-right">
          Up to {MAX_QUERY_LENGTH} characters
        </p>
      </form>

      {/* Example queries */}
      <div className="mt-8 flex flex-wrap justify-center gap-2 max-w-xl">
        <span className="font-sans text-xs text-[#A8A8A8] w-full mb-1">
          Try:
        </span>
        {EXAMPLE_QUERIES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => {
              setQuery(example);
              inputRef.current?.focus();
            }}
            className="font-sans text-xs text-[#5C5C5C] border border-[#E8D5A3]
              bg-white px-3 py-1.5 hover:border-[#C9A84C] hover:text-[#C9A84C]
              transition-colors duration-150"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateSearchBar;
