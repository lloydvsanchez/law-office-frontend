// src/components/templates/TemplateDisplay.tsx
// Renders the completed AI-generated template from the polling flow.
// Handles content_raw (primary), content string, sections array, or raw JSON fallback.
// Force Regenerate calls POST /api/v1/templates/regenerate via onRegenerate.

import React, { useState } from "react";
import type { GeneratedTemplate } from "../../hooks/useTemplateSearch";

interface TemplateDisplayProps {
  template: GeneratedTemplate;
  query: string;
  onNewSearch: () => void;
  onRegenerate: (templateId: string) => void;
}

// ── Unescape helper ───────────────────────────────────────────────────────────
const unescape = (raw: string): string => {
  try {
    if (raw.includes("\\n") || raw.includes("\\t")) {
      return JSON.parse(`"${raw.replace(/"/g, '\\"')}"`) as string;
    }
    return raw;
  } catch {
    return raw;
  }
};

// ── Content renderer ──────────────────────────────────────────────────────────
const renderContent = (template: GeneratedTemplate): React.ReactNode => {
  // Case 1: content_raw — the real field from the API (confirmed schema)
  if (typeof template.content_raw === "string") {
    return (
      <pre className="font-mono text-sm text-[#1C1C1C] leading-relaxed whitespace-pre-wrap break-words">
        {unescape(template.content_raw)}
      </pre>
    );
  }

  // Case 2: content string field
  if (typeof template.content === "string") {
    return (
      <pre className="font-mono text-sm text-[#1C1C1C] leading-relaxed whitespace-pre-wrap break-words">
        {template.content}
      </pre>
    );
  }

  // Case 3: sections array
  if (Array.isArray(template.sections)) {
    return (
      <div className="flex flex-col gap-6">
        {(template.sections as Array<{ heading?: string; body?: string }>).map((section, i) => (
          <div key={i}>
            {section.heading && (
              <h3 className="text-lg text-[#1C1C1C] font-semibold mb-2"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                {section.heading}
              </h3>
            )}
            {section.body && (
              <p className="font-sans text-sm text-[#1C1C1C] leading-relaxed whitespace-pre-wrap">
                {section.body}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Case 4: unknown shape — raw JSON fallback for development
  return (
    <div>
      <p className="font-sans text-xs text-[#A8872E] mb-3 uppercase tracking-widest">
        ⚠ Template schema not yet mapped — showing raw response
      </p>
      <pre className="font-mono text-xs text-[#1C1C1C] bg-[#F5F0E8] p-4 overflow-x-auto border border-[#E8D5A3] leading-relaxed">
        {JSON.stringify(template, null, 2)}
      </pre>
    </div>
  );
};

// ── Force Regenerate button ───────────────────────────────────────────────────
// Copper (#B87333) — same color as TemplateViewer for consistency.
const RegenerateButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    title="Discard this version and generate a new template from scratch"
    className="font-sans text-xs px-4 py-2 flex items-center gap-1.5
      border border-[#B87333] text-[#B87333]
      hover:bg-[#B87333] hover:text-white
      transition-colors duration-150"
  >
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993
           0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0
           0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
    Force Regenerate
  </button>
);

// ── Component ─────────────────────────────────────────────────────────────────
const TemplateDisplay: React.FC<TemplateDisplayProps> = ({
  template,
  query,
  onNewSearch,
  onRegenerate,
}) => {
  const [copied, setCopied] = useState(false);

  const contentForCopy =
    typeof template.content_raw === "string"
      ? unescape(template.content_raw)
      : typeof template.content === "string"
      ? template.content
      : JSON.stringify(template, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(contentForCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const title = typeof template.title === "string" ? template.title : `Template for "${query}"`;
  const templateId = typeof template.id === "string" ? template.id : String(template.id ?? "");

  return (
    <div className="w-full max-w-3xl mx-auto">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="font-sans text-xs uppercase tracking-widest text-[#C9A84C] mb-1">
            Generated template
          </p>
          <h2 className="text-2xl md:text-3xl text-[#1C1C1C] font-light leading-snug"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            {title}
          </h2>
        </div>

        <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
          <button
            type="button"
            onClick={handleCopy}
            className="font-sans text-xs border border-[#E8D5A3] px-4 py-2
              hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors
              duration-150 flex items-center gap-1.5 text-[#5C5C5C]"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638
                  m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0
                  01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11
                  1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0
                  01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057
                  1.907-2.185a48.208 48.208 0 011.927-.184" />
            </svg>
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            type="button"
            onClick={onNewSearch}
            className="font-sans text-xs bg-[#C9A84C] text-white px-4 py-2
              hover:bg-[#A8872E] transition-colors duration-150"
          >
            New search
          </button>
          {templateId && <RegenerateButton onClick={() => onRegenerate(templateId)} />}
        </div>
      </div>

      <div className="w-16 h-0.5 bg-[#C9A84C] mb-6" />

      {/* ── Legal disclaimer ── */}
      <div className="bg-[#FBF5E6] border border-[#E8D5A3] px-5 py-4 mb-6">
        <p className="font-sans text-xs text-[#A8872E] leading-relaxed">
          <strong>Note:</strong> This template is generated as a starting reference
          and does not constitute legal advice. All documents should be reviewed
          by a qualified lawyer before use.
        </p>
      </div>

      {/* ── Template content ── */}
      <div className="bg-white border border-[#E8D5A3] p-8 overflow-x-auto">
        {renderContent(template)}
      </div>

    </div>
  );
};

export default TemplateDisplay;
