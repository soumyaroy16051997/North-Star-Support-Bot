import React from "react";
import { BotMessage, QuickButton } from "../chatbot/responseGenerator";

interface ChatMessageProps {
  message: BotMessage;
  onButtonClick: (value: string, label: string) => void;
}

function formatText(text: string): React.ReactNode[] {
  // Split by newlines and handle **bold** markdown
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const formatted = parts.map((part, j) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={j}>{part.slice(2, -2)}</strong>;
      }
      return <span key={j}>{part}</span>;
    });
    return (
      <React.Fragment key={i}>
        {formatted}
        {i < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getButtonClass(variant?: QuickButton["variant"]): string {
  const base =
    "inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer select-none border focus:outline-none focus:ring-2 focus:ring-offset-1 active:scale-95";
  switch (variant) {
    case "primary":
      return `${base} bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 focus:ring-emerald-300`;
    case "success":
      return `${base} bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100 hover:border-teal-300 focus:ring-teal-300`;
    case "danger":
      return `${base} bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300 focus:ring-red-300`;
    default:
      return `${base} bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300 focus:ring-gray-300`;
  }
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onButtonClick,
}) => {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end mb-3 animate-fadeIn">
        <div className="flex flex-col items-end max-w-[80%]">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl rounded-br-sm px-4 py-2.5 shadow-sm">
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {message.text}
            </p>
          </div>
          <span className="text-xs text-gray-400 mt-1 mr-1">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    );
  }

  // Bot message
  const isLiveAgent = message.isLiveAgentIndicator;

  return (
    <div className="flex items-end gap-2 mb-3 animate-fadeIn">
      {/* Bot avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm self-start mt-1">
        <span className="text-sm">{isLiveAgent ? "🟢" : "🏕️"}</span>
      </div>

      <div className="flex flex-col max-w-[80%]">
        {isLiveAgent && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">
              Live Agent Mode
            </span>
          </div>
        )}

        <div
          className={`${
            isLiveAgent
              ? "bg-green-50 border border-green-200"
              : "bg-white border border-gray-100"
          } rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm`}
        >
          <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-line">
            {formatText(message.text)}
          </p>
        </div>

        {/* Quick action buttons */}
        {message.buttons && message.buttons.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.buttons.map((btn, i) => (
              <button
                key={i}
                className={getButtonClass(btn.variant)}
                onClick={() => onButtonClick(btn.value, btn.label)}
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}

        <span className="text-xs text-gray-400 mt-1 ml-1">
          {isLiveAgent ? "Live Agent • " : "North Star Bot • "}
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
};
