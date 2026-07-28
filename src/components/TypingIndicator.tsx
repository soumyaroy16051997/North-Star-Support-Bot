import React from "react";

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-end gap-2 mb-3">
      {/* Bot avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
        <span className="text-sm">🏕️</span>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <div
            className="w-2 h-2 rounded-full bg-emerald-400"
            style={{ animation: "bounce 1.2s infinite 0s" }}
          />
          <div
            className="w-2 h-2 rounded-full bg-emerald-400"
            style={{ animation: "bounce 1.2s infinite 0.2s" }}
          />
          <div
            className="w-2 h-2 rounded-full bg-emerald-400"
            style={{ animation: "bounce 1.2s infinite 0.4s" }}
          />
        </div>
      </div>
    </div>
  );
};
