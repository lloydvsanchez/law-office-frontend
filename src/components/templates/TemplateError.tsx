// src/components/templates/TemplateError.tsx
// Error state — shown when search or generation fails.
// Shows retry button when retriable, new search otherwise.

import React from "react";

interface TemplateErrorProps {
  message: string;
  retriable: boolean;
  onRetry?: () => void;
  onNewSearch: () => void;
}

const TemplateError: React.FC<TemplateErrorProps> = ({
  message,
  retriable,
  onRetry,
  onNewSearch,
}) => (
  <div className="w-full max-w-md mx-auto flex flex-col items-center text-center py-12">

    {/* Error icon */}
    <div className="w-14 h-14 border border-[#E8D5A3] flex items-center justify-center mb-6">
      <svg
        className="w-6 h-6 text-[#C9A84C]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73
            0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898
            0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
    </div>

    <h2
      className="text-2xl text-[#1C1C1C] font-light mb-3"
      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
    >
      Something went wrong
    </h2>

    <p className="font-sans text-sm text-[#5C5C5C] leading-relaxed mb-8 max-w-sm">
      {message}
    </p>

    <div className="flex gap-3 flex-wrap justify-center">
      {retriable && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="font-sans text-sm font-medium uppercase tracking-wide
            px-6 py-2.5 bg-[#C9A84C] text-white hover:bg-[#A8872E]
            transition-colors duration-200"
        >
          Try again
        </button>
      )}
      <button
        type="button"
        onClick={onNewSearch}
        className="font-sans text-sm font-medium uppercase tracking-wide
          px-6 py-2.5 border border-[#C9A84C] text-[#C9A84C]
          hover:bg-[#C9A84C] hover:text-white transition-colors duration-200"
      >
        New search
      </button>
    </div>

  </div>
);

export default TemplateError;
