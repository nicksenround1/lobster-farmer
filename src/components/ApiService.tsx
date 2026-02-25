"use client";

import { useLocale } from "@/context/LocaleContext";

export default function ApiService() {
  const { locale } = useLocale();

  return (
    <section id="api" className="py-24 px-4 relative overflow-hidden">
      {/* Glow orb */}
      <div className="glow-orb glow-orb-cyan w-[400px] h-[400px] top-0 right-1/4 opacity-15" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="glass-card rounded-3xl p-10 md:p-14 relative overflow-hidden">
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />

          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Left */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">⚡</span>
                <span className="glass-pill px-3 py-1 rounded-full text-xs font-medium text-cyan-400 border border-cyan-500/30 bg-cyan-500/10">
                  API Service
                </span>
              </div>

              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 text-glow-white">
                {locale === "zh"
                  ? "AI 模型 API 中转"
                  : "AI Model API Relay"}
              </h2>

              <p className="text-white/50 mb-4 leading-relaxed">
                {locale === "zh"
                  ? "400+ 模型按量计费，支持 Claude / GPT-4 / Gemini / Grok / DeepSeek 等。无需翻墙，一个 Key 搞定所有模型。"
                  : "400+ models, pay-per-use. Claude, GPT-4, Gemini, Grok, DeepSeek and more. One API key for all models."}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {["Claude", "GPT-4", "Gemini", "Grok", "DeepSeek", "400+"].map(
                  (model) => (
                    <span
                      key={model}
                      className="glass-pill px-3 py-1.5 rounded-full text-xs text-white/60"
                    >
                      {model}
                    </span>
                  )
                )}
              </div>

              <div className="space-y-2 text-sm text-white/40">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  {locale === "zh" ? "OpenAI 兼容格式" : "OpenAI-compatible format"}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  {locale === "zh" ? "按量计费，无月费" : "Pay-per-use, no subscription"}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  {locale === "zh"
                    ? "支持 OpenClaw / Cursor / 任何 OpenAI SDK"
                    : "Works with OpenClaw / Cursor / any OpenAI SDK"}
                </div>
              </div>
            </div>

            {/* Right - CTA */}
            <div className="flex flex-col items-center gap-4 shrink-0">
              <a
                href="https://ai.lobsterfarmer.com"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-button px-8 py-3.5 rounded-full text-sm font-medium inline-flex items-center gap-2"
              >
                {locale === "zh" ? "获取 API Key →" : "Get API Key →"}
              </a>
              <span className="text-white/30 text-xs">
                ai.lobsterfarmer.com
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
