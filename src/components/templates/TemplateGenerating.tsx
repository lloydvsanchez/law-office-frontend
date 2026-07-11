// src/components/templates/TemplateGenerating.tsx
// Shown while polling the generation status endpoint.
// Used by both the initial search polling and the Force Regenerate polling.
// The `label` prop overrides the heading for the regenerating state.

import React from "react";

interface TemplateGeneratingProps {
  query?: string;
  attempt: number;
  /** Override the heading. Defaults to "Generating your template". */
  label?: string;
}

const STATUS_MESSAGES = [
  "Reviewing applicable legal frameworks…",
  "Identifying the right document structure…",
  "Drafting template content…",
  "Applying Philippine legal standards…",
  "Finalising the document…",
];

const TemplateGenerating: React.FC<TemplateGeneratingProps> = ({
  query,
  attempt,
  label = "Generating your template",
}) => {
  const messageIndex = Math.min(Math.floor(attempt / 3), STATUS_MESSAGES.length - 1);
  const message = STATUS_MESSAGES[messageIndex];

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center py-12">

      {/* Animated gold ring */}
      <div className="relative w-16 h-16 mb-8">
        <div className="absolute inset-0 rounded-full border-2 border-[#E8D5A3]" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#C9A84C] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#C9A84C] opacity-60" />
        </div>
      </div>

      <p className="text-2xl text-[#1C1C1C] font-light mb-2"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        {label}
      </p>

      {query && (
        <p className="font-sans text-sm text-[#C9A84C] mb-6">"{query}"</p>
      )}

      <p key={message} className="font-sans text-sm text-[#5C5C5C] leading-relaxed max-w-sm transition-opacity duration-500">
        {message}
      </p>

      <p className="font-sans text-[10px] text-[#C0BAB0] mt-6 uppercase tracking-widest">
        This may take a few moments
      </p>

    </div>
  );
};

export default TemplateGenerating;
