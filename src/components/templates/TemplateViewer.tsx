// src/components/templates/TemplateViewer.tsx
// Renders a fetched template from GET /api/v1/templates/:id.
// content_raw is the main output — rendered as unescaped preformatted text.
// title, description, practice_area are secondary info above the content.
// Back button restores the results list from state (no API call).
// Force Regenerate calls POST /api/v1/templates/regenerate via onRegenerate.

import React, { useState } from "react";
import type { TemplateDetail } from "../../hooks/useTemplateSearch";

interface TemplateViewerProps {
  template: TemplateDetail;
  query: string;
  onBack: () => void;
  onNewSearch: () => void;
  onRegenerate: (templateId: string) => void;
}

// ── Copy button ───────────────────────────────────────────────────────────────
const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="font-sans text-xs border border-[#E8D5A3] px-4 py-2
        hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors
        duration-150 flex items-center gap-1.5 text-[#5C5C5C]"
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166
             1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75
             0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11
             1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0
             01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057
             1.907-2.185a48.208 48.208 0 011.927-.184" />
      </svg>
      {copied ? "Copied!" : "Copy"}
    </button>
  );
};

// ── Force Regenerate button ───────────────────────────────────────────────────
// Copper/amber color (#B87333) distinguishes it from gold action buttons.
// Slightly muted to signal "advanced / destructive-ish" without being alarming.
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

// ── Metadata item ─────────────────────────────────────────────────────────────
const MetaItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-col gap-0.5">
    <span className="font-sans text-[9px] uppercase tracking-widest text-[#A8A8A8]">{label}</span>
    <span className="text-sm text-[#1C1C1C] font-medium" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      {value}
    </span>
  </div>
);

// ── Component ─────────────────────────────────────────────────────────────────
const TemplateViewer: React.FC<TemplateViewerProps> = ({
  template,
  onBack,
  onNewSearch,
  onRegenerate,
}) => {
  const unescapedContent = (() => {
    try {
      if (template.content_raw.includes("\\n") || template.content_raw.includes("\\t")) {
        return JSON.parse(`"${template.content_raw.replace(/"/g, '\\"')}"`) as string;
      }
      return template.content_raw;
    } catch {
      return template.content_raw;
    }
  })();

  return (
    <div className="w-full max-w-3xl mx-auto">

      {/* ── Navigation + actions bar ── */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onBack}
          className="font-sans text-xs text-[#5C5C5C] hover:text-[#C9A84C]
            transition-colors duration-150 flex items-center gap-1.5
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to results
        </button>

        <div className="flex items-center gap-2">
          <CopyButton text={unescapedContent} />
          <button
            type="button"
            onClick={onNewSearch}
            className="font-sans text-xs bg-[#C9A84C] text-white px-4 py-2
              hover:bg-[#A8872E] transition-colors duration-150"
          >
            New search
          </button>
          <RegenerateButton onClick={() => onRegenerate(String(template.id))} />
        </div>
      </div>

      {/* ── Secondary info ── */}
      <div className="bg-[#F5F0E8] border border-[#E8D5A3] px-6 py-5 mb-2">
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-sans text-[9px] uppercase tracking-widest text-[#C9A84C] mb-1">Template</p>
            <h2 className="text-2xl md:text-3xl text-[#1C1C1C] font-light leading-snug"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              {template.title}
            </h2>
          </div>
          <div className="flex flex-wrap gap-6 pt-1 border-t border-[#E8D5A3]">
            {template.description && template.description !== template.title && (
              <MetaItem label="Description" value={template.description} />
            )}
            {template.practice_area && (
              <MetaItem label="Practice Area" value={template.practice_area} />
            )}
            <MetaItem label="Template ID" value={String(template.id)} />
          </div>
        </div>
      </div>

      {/* ── Legal disclaimer ── */}
      <div className="bg-[#FBF5E6] border border-[#E8D5A3] border-t-0 px-5 py-3 mb-6">
        <p className="font-sans text-xs text-[#A8872E] leading-relaxed">
          <strong>Note:</strong> This template is provided as a starting reference only
          and does not constitute legal advice. Review all documents with a qualified
          lawyer before use.
        </p>
      </div>

      <div className="w-16 h-0.5 bg-[#C9A84C] mb-6" />

      {/* ── Main output: content_raw ── */}
      <div className="bg-white border border-[#E8D5A3] p-8 overflow-x-auto">
        <pre
          className="font-mono text-sm text-[#1C1C1C] leading-relaxed whitespace-pre-wrap break-words"
          aria-label={`Template content for ${template.title}`}
        >
          {unescapedContent}
        </pre>
      </div>

    </div>
  );
};

export default TemplateViewer;
