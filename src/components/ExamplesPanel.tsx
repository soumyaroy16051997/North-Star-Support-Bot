import React, { useState } from "react";
import { QUICK_EXAMPLES } from "../data/supportInfo";

interface ExamplesPanelProps {
  onExampleClick: (example: string) => void;
}

export const ExamplesPanel: React.FC<ExamplesPanelProps> = ({
  onExampleClick,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border border-emerald-100 rounded-xl bg-emerald-50/60 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-emerald-50 transition-colors duration-150 cursor-pointer focus:outline-none"
      >
        <div className="flex items-center gap-2">
          <span className="text-emerald-600">✨</span>
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
            Try These Examples
          </span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`w-4 h-4 text-emerald-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <path
            fillRule="evenodd"
            d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="px-4 pb-3 pt-1 flex flex-wrap gap-2">
          {QUICK_EXAMPLES.map((example, i) => (
            <button
              key={i}
              onClick={() => onExampleClick(example)}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-all duration-150 shadow-sm cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              &ldquo;{example}&rdquo;
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
