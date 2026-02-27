"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { products } from "@/data/products";
import StockCounter from "@/components/StockCounter";

const comparisonData = {
  zh: {
    title: "不知道买哪个？一张表看清区别",
    subtitle: "Starter Pack 是模板，Persona 是真实跑了半年的完整系统",
    headers: ["", "🎣 Starter Pack ($1)", "🦞 Persona ($49)", "📦 Bundle ($59)"],
    rows: [
      ["SOUL.md 人格", "通用模板（你自己填）", "✅ 真实 Crypto 投机者人格\n（就是推里这只龙虾在用的）", "✅ 同 Persona"],
      ["AGENTS.md", "✅ 基础版", "✅ 完整版（分级加载 + 安全过滤器 + 群聊行为）", "✅ 同 Persona"],
      ["ShadowOps Manual\n（安全手册）", "❌", "✅ 防注入 / 私钥保护 / 高危确认", "✅ 同 Persona"],
      ["memoryFlush 配置", "✅ 配置片段", "✅ 已集成到完整系统", "✅ 同 Persona"],
      ["Alpha Matrix", "基础版（概念演示）", "✅ Pro 版（35+ KOL 实时监控）", "✅ 同 Persona"],
      ["Twitter Skill", "❌", "✅ 病毒式内容创作 + 自动发帖", "✅ 同 Persona"],
      ["Security Scan", "❌", "✅ 每周自动安全审计", "✅ 同 Persona"],
      ["ReadX 集成", "❌", "✅ 直接读取任意推文", "✅ 同 Persona"],
      ["DX Terminal 指南", "✅ 入门版", "✅ 完整参与指南", "✅ 同 Persona"],
      ["Cron Jobs", "✅ 8 个模板", "✅ 预配置（心跳/Alpha/安全扫描）", "✅ 同 Persona"],
      ["40 页实战指南 PDF", "❌", "❌", "✅ 从零到一完整教程"],
      ["VIP 技术支持", "❌ 普通社群", "✅ VIP 群", "✅ VIP 群"],
      ["适合谁", "刚装好 OpenClaw 的新手", "想要完整 Crypto Agent 的玩家", "零基础 + 想要全套方案"],
    ],
    footer: "💡 简单说：Starter Pack 给你模板和工具让你自己搭。Persona 是我们已经搭好、跑了半年、每天在用的完整系统——直接复制就能用。",
  },
  en: {
    title: "Not sure which one? See the difference at a glance",
    subtitle: "Starter Pack = templates. Persona = a real system that's been running for 6+ months.",
    headers: ["", "🎣 Starter ($1)", "🦞 Persona ($49)", "📦 Bundle ($59)"],
    rows: [
      ["SOUL.md Persona", "Generic template (fill in yourself)", "✅ Real Crypto speculator persona\n(the actual lobster from Twitter)", "✅ Same as Persona"],
      ["AGENTS.md", "✅ Basic", "✅ Full (tiered loading + security filters + group behavior)", "✅ Same as Persona"],
      ["ShadowOps Manual\n(Security)", "❌", "✅ Anti-injection / key protection / high-risk confirmation", "✅ Same as Persona"],
      ["memoryFlush Config", "✅ Config snippet", "✅ Integrated into complete system", "✅ Same as Persona"],
      ["Alpha Matrix", "Basic (concept demo)", "✅ Pro (35+ KOL real-time monitoring)", "✅ Same as Persona"],
      ["Twitter Skill", "❌", "✅ Viral content creation + auto-posting", "✅ Same as Persona"],
      ["Security Scan", "❌", "✅ Weekly auto security audit", "✅ Same as Persona"],
      ["ReadX Integration", "❌", "✅ Read any tweet directly", "✅ Same as Persona"],
      ["DX Terminal Guide", "✅ Intro", "✅ Full participation guide", "✅ Same as Persona"],
      ["Cron Jobs", "✅ 8 templates", "✅ Pre-configured (heartbeat/Alpha/security)", "✅ Same as Persona"],
      ["40-page Guide PDF", "❌", "❌", "✅ Zero-to-one complete tutorial"],
      ["VIP Support", "❌ Community", "✅ VIP group", "✅ VIP group"],
      ["Best for", "Just installed OpenClaw", "Want a complete Crypto Agent", "Zero-base + full solution"],
    ],
    footer: "💡 TL;DR: Starter Pack gives you templates to build your own. Persona is a complete system we've built, run for 6+ months, and use daily — just copy and go.",
  },
};

export default function ProductsPage() {
  const { locale, t } = useLocale();
  const comp = comparisonData[locale];

  return (
    <main className="min-h-screen bg-black relative pt-28 pb-20 px-4">
      {/* Glow orbs */}
      <div className="glow-orb glow-orb-purple w-[500px] h-[500px] -top-40 left-1/4 opacity-25" />
      <div className="glow-orb glow-orb-red w-[300px] h-[300px] bottom-20 right-10 opacity-20" />
      <div className="glow-orb glow-orb-blue w-[400px] h-[400px] top-1/2 -left-20 opacity-15" />

      {/* Background text */}
      <div className="bg-text top-24 right-8 text-right">Products</div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm mb-6"
          >
            <span>🦞</span>
            <span>养虾户</span>
          </Link>
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 text-glow-white">
            {t.products.title}
          </h1>
          <p className="text-white/40 max-w-lg mx-auto text-lg">
            {t.products.subtitle}
          </p>
        </div>

        {/* Product cards — 3 products, no filter needed */}
        <div className="flex flex-col gap-8">
          {products.map((product, i) => {
            const savings = product.originalPrice - product.price;
            const isStarter = product.category === "starter";
            const isBundle = product.category === "bundle";

            return (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="glass-card rounded-3xl p-8 lg:p-10 group animate-fade-in block relative overflow-hidden"
                style={{ animationDelay: `${(i + 1) * 150}ms` }}
              >
                {/* Starter Pack special highlight */}
                {isStarter && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E74C3C] via-[#ff6b4a] to-[#E74C3C]" />
                )}
                {/* Bundle highlight */}
                {isBundle && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9b59b6] via-[#8e44ad] to-[#9b59b6]" />
                )}

                {/* Stock counter for starter pack */}
                {isStarter && (
                  <div className="mb-6">
                    <StockCounter />
                  </div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Left: Icon */}
                  <div className="text-5xl lg:text-6xl shrink-0">
                    {product.icon}
                  </div>

                  {/* Middle: Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <h3 className="text-xl lg:text-2xl font-bold text-white group-hover:text-[#E74C3C] transition-colors">
                        {product.name[locale]}
                      </h3>
                      <span className="glass-pill px-3 py-1 rounded-full text-xs font-medium text-white/60">
                        {product.tag[locale]}
                      </span>
                      {isStarter && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E74C3C]/20 text-[#E74C3C] border border-[#E74C3C]/30 animate-pulse">
                          🔥 $1
                        </span>
                      )}
                      {isBundle && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                          {t.products.save} ${savings}
                        </span>
                      )}
                    </div>

                    <p className="text-white/50 mb-5 leading-relaxed text-sm lg:text-base max-w-2xl">
                      {product.desc[locale]}
                    </p>

                    {/* Quick feature highlights */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.features[locale].slice(0, 4).map((feat, fi) => (
                        <span
                          key={fi}
                          className="text-xs text-white/40 bg-white/5 px-3 py-1.5 rounded-full"
                        >
                          {feat.replace(/🎁\s*/, "").split("—")[0].split("(")[0].trim()}
                        </span>
                      ))}
                      {product.features[locale].length > 4 && (
                        <span className="text-xs text-white/30 px-3 py-1.5">
                          +{product.features[locale].length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Price + CTA */}
                  <div className="flex lg:flex-col items-center lg:items-end gap-4 shrink-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl lg:text-4xl font-bold text-[#E74C3C] stat-glow">
                        ${product.price}
                      </span>
                      <span className="text-sm text-white/30 line-through">
                        ${product.originalPrice}
                      </span>
                    </div>
                    <span className="glass-pill px-6 py-2.5 rounded-full text-sm font-medium text-white/70 group-hover:text-white group-hover:border-white/30 transition-all whitespace-nowrap">
                      {t.products.viewDetails} →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── Comparison Table ── */}
        <div className="mt-20 animate-fade-in" style={{ animationDelay: "600ms" }}>
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
              {comp.title}
            </h2>
            <p className="text-white/40 text-sm lg:text-base max-w-xl mx-auto">
              {comp.subtitle}
            </p>
          </div>

          <div className="glass-card rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {comp.headers.map((h, i) => (
                      <th
                        key={i}
                        className={`px-4 py-4 text-left font-bold ${
                          i === 0
                            ? "text-white/50 w-[180px] min-w-[140px]"
                            : "text-white min-w-[160px]"
                        } ${i === 2 ? "bg-[#E74C3C]/5" : ""}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comp.rows.map((row, ri) => (
                    <tr
                      key={ri}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          className={`px-4 py-3 ${
                            ci === 0
                              ? "text-white/60 font-medium"
                              : "text-white/40"
                          } ${ci === 2 ? "bg-[#E74C3C]/5 text-white/60" : ""} whitespace-pre-line`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-5 border-t border-white/10 text-white/40 text-sm leading-relaxed">
              {comp.footer}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
