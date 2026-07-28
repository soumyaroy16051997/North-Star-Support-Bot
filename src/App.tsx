import { useRef, useCallback } from "react";
import { ChatWindow, ChatWindowHandle } from "./components/ChatWindow";
import { ExamplesPanel } from "./components/ExamplesPanel";

function App() {
  const chatRef = useRef<ChatWindowHandle>(null);

  const handleExampleClick = useCallback((example: string) => {
    chatRef.current?.sendMessage(example);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-900 flex flex-col items-center justify-center p-3 sm:p-4">
      {/* Decorative background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      {/* Page layout */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col lg:flex-row gap-4 items-start justify-center">

        {/* ── Sidebar ─────────────────────────────────────────── */}
        <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-3 lg:mt-6 order-2 lg:order-1">

          {/* Brand card */}
          <div className="bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl">🧭</span>
              </div>
              <div>
                <h1 className="font-bold text-base leading-tight">North Star</h1>
                <p className="text-emerald-300 text-xs">Support Bot</p>
              </div>
            </div>
            <p className="text-white/60 text-xs leading-relaxed">
              Your outdoor adventure support companion. Get help with orders, returns, gear recommendations, and more.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["🏔️ Apparel", "⛺ Camping", "🥾 Hiking", "🎒 Gear"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-white/10 border border-white/10 rounded-full text-xs text-white/50"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Test order numbers reference */}
          <div className="bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-white">
            <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wide mb-2.5">
              📋 Test Order Numbers
            </p>
            <div className="space-y-2">
              {[
                { num: "#111", status: "Shipped ✈️", color: "text-blue-300" },
                { num: "#222", status: "Processing ⏳", color: "text-yellow-300" },
                { num: "#333", status: "Delivered ✅", color: "text-emerald-300" },
                { num: "#999", status: "Invalid ❌", color: "text-red-300" },
              ].map((o) => (
                <div key={o.num} className="flex items-center justify-between">
                  <span className="text-white/80 text-xs font-mono font-semibold">
                    {o.num}
                  </span>
                  <span className={`text-xs ${o.color}`}>{o.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Try these examples */}
          <div className="bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl p-4">
            <ExamplesPanel onExampleClick={handleExampleClick} />
          </div>

          {/* Bot capabilities */}
          <div className="bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-white">
            <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wide mb-2.5">
              🤖 What I Can Help With
            </p>
            <ul className="space-y-1.5">
              {[
                "📦 Order tracking",
                "🔄 Returns & exchanges",
                "🎒 Product recommendations",
                "🚚 Shipping information",
                "👤 Live agent handoff",
                "🔀 Multi-phrasing intent recognition",
              ].map((item) => (
                <li key={item} className="text-white/55 text-xs">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* ── Chat window ──────────────────────────────────────── */}
        <main className="w-full lg:flex-1 order-1 lg:order-2">
          <div className="h-[600px] sm:h-[640px] lg:h-[700px] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <ChatWindow ref={chatRef} />
          </div>
          <p className="text-center text-white/25 text-xs mt-2">
            North Star Support Bot · Simulated Customer Support · No real agents or APIs required
          </p>
        </main>
      </div>
    </div>
  );
}

export default App;
