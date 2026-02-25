"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useLocale } from "@/context/LocaleContext";
import { getProductBySlug } from "@/data/products";

function SuccessContent() {
  const { locale } = useLocale();
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product") || "starter-pack";
  const product = getProductBySlug(productSlug);

  const downloadLinks: Record<string, string> = {
    "starter-pack": "/downloads/starter-pack-v1.0.zip",
    "lobster-persona": "/downloads/lobster-persona-v1.0.zip",
    "lobster-bundle": "/downloads/lobster-bundle-v1.0.zip",
  };

  const downloadUrl = downloadLinks[productSlug];

  const installCommands: Record<string, string> = {
    "starter-pack": "curl -fsSL https://lobsterfarmer.com/install/starter-pack.sh | bash",
    "lobster-persona": "curl -fsSL https://lobsterfarmer.com/install/lobster-persona.sh | bash",
    "lobster-bundle": "curl -fsSL https://lobsterfarmer.com/install/lobster-bundle.sh | bash",
  };

  const installCmd = installCommands[productSlug] || "";

  return (
    <main className="min-h-screen bg-black relative pt-28 pb-20 px-4">
      {/* Glow orbs */}
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
              ? `你已成功购买 ${product?.name.zh || "产品"}。欢迎加入养虾户大家庭 🦞`
              : `You've successfully purchased ${product?.name.en || "the product"}. Welcome to the Lobster Farmer family 🦞`}
          </p>
        </div>

        {/* Step 1: Download */}
        <div className="glass-card rounded-3xl p-8 mb-6 animate-fade-in animate-delay-100">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-[#E74C3C] flex items-center justify-center text-white font-bold text-sm">1</span>
            <h2 className="text-xl font-bold text-white">
              {locale === "zh" ? "下载产品文件" : "Download Your Files"}
            </h2>
          </div>
          {downloadUrl ? (
            <a
              href={downloadUrl}
              download
              className="cta-button px-8 py-3 rounded-full text-sm font-medium inline-flex items-center gap-2"
            >
              📦 {locale === "zh" ? "下载 ZIP 文件" : "Download ZIP"} ({product?.name[locale]})
            </a>
          ) : (
            <p className="text-white/50">
              {locale === "zh"
                ? "产品文件将在 24 小时内发送到你的邮箱。"
                : "Product files will be sent to your email within 24 hours."}
            </p>
          )}
          <p className="text-white/30 text-sm mt-3">
            {locale === "zh"
              ? "💡 产品也会发送到你的付款邮箱，请检查收件箱（包括垃圾邮件）"
              : "💡 Files will also be sent to your payment email. Check your inbox (and spam)."}
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
              ? "解压下载的文件到你的 OpenClaw workspace，或者使用一键安装命令："
              : "Extract the downloaded files to your OpenClaw workspace, or use the one-click install:"}
          </p>
          <div className="bg-black/50 rounded-xl p-4 border border-white/10 flex items-center justify-between gap-3">
            <code className="text-green-400 text-sm break-all flex-1">{installCmd}</code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(installCmd);
              }}
              className="glass-pill px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white shrink-0"
            >
              {locale === "zh" ? "复制" : "Copy"}
            </button>
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
          <p className="text-white/50 mb-2">
            {locale === "zh"
              ? "编辑以下文件让 Agent 适配你的需求："
              : "Edit these files to customize your Agent:"}
          </p>
          <ul className="space-y-2 text-white/60 text-sm">
            <li className="flex items-center gap-2"><span className="text-[#E74C3C]">→</span> <code className="text-white/80">USER.md</code> — {locale === "zh" ? "填入你的信息" : "Add your info"}</li>
            <li className="flex items-center gap-2"><span className="text-[#E74C3C]">→</span> <code className="text-white/80">SOUL.md</code> — {locale === "zh" ? "调整 Agent 性格" : "Tweak Agent personality"}</li>
            <li className="flex items-center gap-2"><span className="text-[#E74C3C]">→</span> <code className="text-white/80">HEARTBEAT.md</code> — {locale === "zh" ? "设置自动检查项" : "Set up auto-checks"}</li>
          </ul>
        </div>

        {/* Step 4: Community */}
        <div className="glass-card rounded-3xl p-8 mb-10 animate-fade-in animate-delay-400">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-[#E74C3C] flex items-center justify-center text-white font-bold text-sm">4</span>
            <h2 className="text-xl font-bold text-white">
              {locale === "zh" ? "加入社群" : "Join the Community"}
            </h2>
          </div>
          <p className="text-white/50 mb-4">
            {locale === "zh"
              ? "遇到问题？加入 TG 群，免费技术支持 + 第一时间获取更新。"
              : "Need help? Join our TG group for free tech support + first access to updates."}
          </p>
          <a
            href="https://t.me/+2p-LBUUrJ1BjMjNl"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-pill px-6 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-2 text-white/80 hover:text-white"
          >
            🦞 {locale === "zh" ? "加入 Telegram 群" : "Join Telegram Group"} →
          </a>
        </div>

        {/* Bottom links */}
        <div className="text-center animate-fade-in animate-delay-500 space-y-3">
          <Link
            href="/products"
            className="text-white/40 hover:text-white/70 text-sm block"
          >
            {locale === "zh" ? "← 继续浏览产品" : "← Continue Browsing"}
          </Link>
          <Link
            href="/"
            className="text-white/40 hover:text-white/70 text-sm block"
          >
            {locale === "zh" ? "回到首页" : "Back to Home"}
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/40">Loading...</div>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
