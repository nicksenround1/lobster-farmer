"use client";

import { useLocale } from "@/context/LocaleContext";

const tools = [
  { name: "OpenClaw", desc: "AI Agent Platform", emoji: "🦞", color: "red" },
  { name: "Bankr", desc: "Crypto Operations", emoji: "💰", color: "green" },
  { name: "Claude", desc: "Anthropic AI", emoji: "🧠", color: "purple" },
  { name: "GPT-4", desc: "OpenAI", emoji: "⚡", color: "blue" },
  { name: "Seedance", desc: "Video Generation", emoji: "🎬", color: "pink" },
  { name: "ReadX", desc: "Content Pipeline", emoji: "📰", color: "amber" },
  { name: "Telegram", desc: "Bot Interface", emoji: "💬", color: "sky" },
  { name: "Next.js", desc: "Web Framework", emoji: "▲", color: "neutral" },
];

const colorClasses: Record<string, string> = {
  red: "bg-red-500/10 dark:bg-red-500/20 border-red-500/20",
  green: "bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/20",
  purple: "bg-purple-500/10 dark:bg-purple-500/20 border-purple-500/20",
  blue: "bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/20",
  pink: "bg-pink-500/10 dark:bg-pink-500/20 border-pink-500/20",
  amber: "bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/20",
  sky: "bg-sky-500/10 dark:bg-sky-500/20 border-sky-500/20",
  neutral: "bg-neutral-500/10 dark:bg-neutral-500/20 border-neutral-500/20",
};

export default function Tools() {
  const { t } = useLocale();

  return (
    <section id="tools" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
            {t.tools.title}
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400">
            {t.tools.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className={`rounded-2xl border p-5 ${colorClasses[tool.color]} hover:scale-105 transition-transform duration-200 cursor-default`}
            >
              <div className="text-3xl mb-3">{tool.emoji}</div>
              <h3 className="font-semibold text-neutral-900 dark:text-white text-sm">
                {tool.name}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {tool.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
