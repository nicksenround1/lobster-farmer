"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useLocale } from "@/context/LocaleContext";

const productNames: Record<string, { zh: string; en: string }> = {
  "starter-pack": { zh: "入门包", en: "Starter Pack" },
  "lobster-persona": { zh: "养虾户 Persona", en: "Lobster Farmer Persona" },
  "lobster-bundle": { zh: "养虾户 Bundle", en: "Lobster Farmer Bundle" },
};

function SuccessContent() {
  const { locale } = useLocale();
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product") || "starter-pack";
  const productName = productNames[productSlug]?.[locale] || productNames[productSlug]?.en || "Product";

  return (
    <main className="min-h-screen bg-black relative pt-28 pb-20 px-4">
      <div className="glow-orb glow-orb-red w-[500px] h-[500px] top-1/4 left-1/4 opacity-20" />
      <div className="glow-orb glow-orb-purple w-[350px] h-[350px] bottom-20 right-1/4 opacity-15" />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Success header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="text-7xl mb-6">🎉</div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 text-glow-white">
            {locale === "zh" ? "感谢购买！" : "Thank You!"}
          </h1>
          <p className="text-white/50 text-lg">
            {locale === "zh"
              ? `你已成功购买 ${productName}。欢迎加入养虾户大家庭 🦞`
              : `You've successfully purchased ${productName}. Welcome to the Lobster Farmer family 🦞`}
          </p>
        </div>

        {/* Step 1: Check email */}
        <div className="glass-card rounded-3xl p-8 mb-6 animate-fade-in animate-delay-100">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-[#E74C3C] flex items-center justify-center text-white font-bold text-sm">1</span>
            <h2 className="text-xl font-bold text-white">
              {locale === "zh" ? "查看邮箱 📧" : "Check Your Email 📧"}
            </h2>
          </div>
          <p className="text-white/50 mb-3">
            {locale === "zh"
              ? "下载链接已发送到你的付款邮箱（72 小时有效）。如果没收到，请检查垃圾邮件。"
              : "Download link has been sent to your payment email (valid 72 hours). Check spam if not found."}
          </p>
          <p className="text-white/30 text-sm">
            {locale === "zh"
              ? "💡 随时可以在 Dashboard 重新获取下载链接，不怕丢失。"
              : "💡 You can always get a fresh download link from your Dashboard."}
          </p>
        </div>

        {/* Step 2: Install */}
        <div className="glass-card rounded-3xl p-8 mb-6 animate-fade-in animate-delay-200">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-[#E74C3C] flex items-center justify-center text-white font-bold text-sm">2</span>
            <h2 className="text-xl font-bold text-white">
              {locale === "zh" ? "安装到 OpenClaw" : "Install to OpenClaw"}
            </h2>
          </div>
          <p className="text-white/50 mb-4">
            {locale === "zh"
              ? "下载后，解压到你的 OpenClaw workspace："
              : "After downloading, extract to your OpenClaw workspace:"}
          </p>
          <div className="bg-black/50 rounded-xl p-4 border border-white/10">
            <code className="text-green-400 text-sm">
              unzip {productSlug}-v1.0.zip -d ~/clawd/
            </code>
          </div>
        </div>

        {/* Step 3: Customize */}
        <div className="glass-card rounded-3xl p-8 mb-6 animate-fade-in animate-delay-300">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-[#E74C3C] flex items-center justify-center text-white font-bold text-sm">3</span>
            <h2 className="text-xl font-bold text-white">
              {locale === "zh" ? "自定义配置" : "Customize"}
            </h2>
          </div>
          <ul className="space-y-2 text-white/60 text-sm">
            <li className="flex items-center gap-2"><span className="text-[#E74C3C]">→</span> <code className="text-white/80">USER.md</code> — {locale === "zh" ? "填入你的信息" : "Add your info"}</li>
            <li className="flex items-center gap-2"><span className="text-[#E74C3C]">→</span> <code className="text-white/80">SOUL.md</code> — {locale === "zh" ? "调整 Agent 性格" : "Tweak Agent personality"}</li>
            <li className="flex items-center gap-2"><span className="text-[#E74C3C]">→</span> <code className="text-white/80">HEARTBEAT.md</code> — {locale === "zh" ? "设置自动检查项" : "Set up auto-checks"}</li>
          </ul>
        </div>

        {/* Step 4: Dashboard + Community */}
        <div className="glass-card rounded-3xl p-8 mb-10 animate-fade-in animate-delay-400">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-[#E74C3C] flex items-center justify-center text-white font-bold text-sm">4</span>
            <h2 className="text-xl font-bold text-white">
              {locale === "zh" ? "Dashboard & 社群" : "Dashboard & Community"}
            </h2>
          </div>
          <p className="text-white/50 text-sm mb-4">
            {locale === "zh"
              ? "登录 Dashboard 随时重新下载产品。加入 Telegram 社群获取免费技术支持。"
              : "Log into Dashboard to re-download anytime. Join Telegram for free tech support."}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/login"
              className="cta-button px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-2"
            >
              📦 {locale === "zh" ? "登录 Dashboard" : "Go to Dashboard"}
            </Link>
            <a
              href="https://t.me/+2p-LBUUrJ1BjMjNl"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-pill px-5 py-2.5 rounded-full text-sm font-medium text-white/80 hover:text-white inline-flex items-center gap-2"
            >
              🦞 {locale === "zh" ? "加入 Telegram" : "Join Telegram"}
            </a>
          </div>
        </div>

        <div className="text-center animate-fade-in animate-delay-500 space-y-3">
          <Link href="/products" className="text-white/40 hover:text-white/70 text-sm block">
            {locale === "zh" ? "← 继续浏览产品" : "← Continue Browsing"}
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white/40">Loading...</div>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
