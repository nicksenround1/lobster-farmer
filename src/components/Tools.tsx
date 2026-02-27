"use client";

import { useLocale } from "@/context/LocaleContext";

const tools = [
  { name: "OpenClaw", desc: "AI Agent Platform", emoji: "🦞" },
  { name: "Bankr", desc: "Crypto Operations", emoji: "💰" },
  { name: "Claude", desc: "Anthropic AI", emoji: "🧠" },
  { name: "GPT-4", desc: "OpenAI", emoji: "⚡" },
  { name: "Seedance", desc: "Video Generation", emoji: "🎬" },
  { name: "6551 OpenTwitter", desc: "KOL Intelligence", emoji: "🐦" },
  { name: "Telegram", desc: "Bot Interface", emoji: "💬" },
  { name: "Next.js", desc: "Web Framework", emoji: "▲" },
];

export default function Tools() {
  const { t } = useLocale();

  return (
    <section id="tools" className="py-24 px-4 relative overflow-hidden">
      {/* Glow orb */}
      <div className="glow-orb glow-orb-cyan w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15" />

      {/* Background text */}
      <div className="bg-text bottom-4 left-8">Tools</div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-14 animate-fade-in">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3 text-glow-white">
            {t.tools.title}
          </h2>
          <p className="text-white/40 text-lg">
            {t.tools.subtitle}
          </p>
        </div>

        {/* Pill badges in flex wrap */}
        <div className="flex flex-wrap justify-center gap-4 animate-fade-in animate-delay-200">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="glass-pill rounded-full px-6 py-3 flex items-center gap-3 cursor-default"
            >
              <span className="text-xl">{tool.emoji}</span>
              <div>
                <p className="text-sm font-semibold text-white">{tool.name}</p>
                <p className="text-xs text-white/40">{tool.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
