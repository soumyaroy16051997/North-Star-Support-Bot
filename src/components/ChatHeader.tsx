import React from "react";

interface ChatHeaderProps {
  isLiveAgent: boolean;
  onReset: () => void;
  onMainMenu: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  isLiveAgent,
  onReset,
  onMainMenu,
}) => {
  return (
    <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-4 py-3 flex items-center justify-between shadow-md">
      {/* Left: Brand */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-sm">
          <span className="text-xl">🧭</span>
        </div>
        <div>
          <h1 className="text-white font-bold text-sm leading-tight">
            North Star Support Bot
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                isLiveAgent ? "bg-yellow-300 animate-pulse" : "bg-green-300 animate-pulse"
              }`}
            />
            <span className="text-white/80 text-xs">
              {isLiveAgent ? "🟢 Live Agent Mode" : "Online"}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onMainMenu}
          title="Main Menu"
          className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-white/30 cursor-pointer"
          aria-label="Go to main menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M2.25 6a.75.75 0 01.75-.75h18a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zm0 6a.75.75 0 01.75-.75h18a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zm0 6a.75.75 0 01.75-.75h18a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          onClick={onReset}
          title="Reset conversation"
          className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-white/30 cursor-pointer"
          aria-label="Reset conversation"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
