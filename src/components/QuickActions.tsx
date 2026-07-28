import React from "react";

interface QuickActionsProps {
  onAction: (value: string, label: string) => void;
}

const QUICK_ACTIONS = [
  { label: "📦 Track My Order", value: "Track my order" },
  { label: "🔄 Returns & Exchanges", value: "Returns & Exchanges" },
  { label: "🎒 Find a Product", value: "Product Recommendations" },
  { label: "🚚 Shipping Info", value: "Shipping Information" },
  { label: "👤 Talk to a Live Agent", value: "Talk to a live agent" },
];

export const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  return (
    <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/80">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
        Quick Actions
      </p>
      <div className="flex flex-wrap gap-2">
        {QUICK_ACTIONS.map((action, i) => (
          <button
            key={i}
            onClick={() => onAction(action.value, action.label)}
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-gray-600 border border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all duration-150 shadow-sm cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};
