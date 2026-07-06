// src/components/templates/TemplateDisplay.tsx
// Renders the completed generated template.
//
// NOTE: The generation status response currently shows template: null.
// The shape of the template object is not yet confirmed.
// This component handles three cases:
//   1. template has a `content` string field (plain text / markdown)
//   2. template has a `sections` array (structured document)
//   3. template is an unknown shape — renders a raw JSON fallback
//
// TODO: update this component once the actual template schema is confirmed.
// Replace the renderContent() logic with the real structure.

import React, { useState } from "react";
import ReactMarkdown from 'react-markdown';
import type { GeneratedTemplate } from "../../hooks/useTemplateSearch";

interface TemplateDisplayProps {
  template: GeneratedTemplate;
  query: string;
  onNewSearch: () => void;
}

// ── Content renderer (handles unknown template shape) ─────────────────────────
const renderContent = (template: GeneratedTemplate): React.ReactNode => {
  // Case 1: template has a string `content` field
  if (typeof template.content_raw === "string") {
    return (
      <div className="font-sans text-sm text-[#1C1C1C] leading-relaxed whitespace-pre-wrap">
        <ReactMarkdown>
          {template.content_raw}
        </ReactMarkdown>
      </div>
    );
  }

  // Case 2: unknown shape — raw JSON fallback for development
  return (
    <div>
      <p className="font-sans text-xs text-[#A8872E] mb-3 uppercase tracking-widest">
        ⚠ Template schema not yet mapped — showing raw response
      </p>
      <pre className="font-mono text-xs text-[#1C1C1C] bg-[#F5F0E8] p-4 overflow-x-auto
        border border-[#E8D5A3] leading-relaxed">
        {JSON.stringify(template, null, 2)}
      </pre>
    </div>
  );
};

// ── Section ───────────────────────────────────────────────────────────────────
const TemplateDisplay: React.FC<TemplateDisplayProps> = ({
  template,
  query,
  onNewSearch,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text =
      typeof template.content_raw === "string"
        ? template.content_raw
        : JSON.stringify(template, null, 2);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const title =
    typeof template.title === "string" ? template.title : `Template for "${query}"`;

  return (
    <div className="w-full max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="font-sans text-xs uppercase tracking-widest text-[#C9A84C] mb-1">
            Generated template
          </p>
          <h2
            className="text-2xl md:text-3xl text-[#1C1C1C] font-light leading-snug"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {title}
          </h2>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {/* Copy button */}
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
                  1.907-2.185a48.208 48.208 0 011.927-.184"
              />
            </svg>
            {copied ? "Copied!" : "Copy"}
          </button>
          {/* New search */}
          <button
            type="button"
            onClick={onNewSearch}
            className="font-sans text-xs bg-[#C9A84C] text-white px-4 py-2
              hover:bg-[#A8872E] transition-colors duration-150"
          >
            New search
          </button>
        </div>
      </div>

      {/* Gold rule */}
      <div className="w-16 h-0.5 bg-[#C9A84C] mb-6" />

      {/* Legal disclaimer */}
      <div className="bg-[#FBF5E6] border border-[#E8D5A3] px-5 py-4 mb-6">
        <p className="font-sans text-xs text-[#A8872E] leading-relaxed">
          <strong>Note:</strong> This template is generated as a starting reference
          and does not constitute legal advice. All documents should be reviewed
          by a qualified lawyer before use.
        </p>
      </div>

      {/* Template content */}
      <div className="bg-white border border-[#E8D5A3] p-8">
        {renderContent(template)}
      </div>

    </div>
  );
};

export default TemplateDisplay;
