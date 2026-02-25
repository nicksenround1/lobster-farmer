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
  const token = searchParams.get("token");
  const product = getProductBySlug(productSlug);

  // Only show download if token is present (came from Stripe redirect)
  const hasValidToken = !!token;
  const downloadUrl = hasValidToken
    ? `/api/download?product=${productSlug}&token=${token}`
    : null;

  return (
    <main className="min-h-screen bg-black relative pt-28 pb-20 px-4">
      {/* Glow orbs */}
      <div className="glow-orb glow-orb-red w-[500px] h-[500px] top-1/4 left-1/4 opacity-20" />
      <div className="glow-orb glow-orb-purple w-[350px] h-[350px] bottom-20 right-1/4 opacity-15" />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Success header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="text-7xl mb-6">{hasValidToken ? "🎉" : "🔒"}</div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 text-glow-white">
            {hasValidToken
              ? locale === "zh" ? "感谢购买！" : "Thank You!"
              : locale === "zh" ? "需要验证" : "Verification Required"}
          </h1>
          <p className="text-white/50 text-lg">
            {hasValidToken
              ? locale === "zh"
                ? `你已成功购买 ${product?.name.zh || "产品"}。欢迎加入养虾户大家庭 🦞`
                : `You've successfully purchased ${product?.name.en || "the product"}. Welcome to the Lobster Farmer family 🦞`
              : locale === "zh"
                ? "请通过邮件中的链接访问下载页面，或联系 support@lobsterfarmer.com"
                : "Please use the download link from your email, or contact support@lobsterfarmer.com"}
          </p>
        </div>

        {hasValidToken ? (
          <>
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
              ) : null}
              <p className="text-white/30 text-sm mt-3">
                {locale === "zh"
                  ? "💡 下载链接 72 小时内有效。过期请联系 support@lobsterfarmer.com"
                  : "💡 Download link valid for 72 hours. Contact support@lobsterfarmer.com if expired."}
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
                  ? "解压下载的文件到你的 OpenClaw workspace："
                  : "Extract the downloaded files to your OpenClaw workspace:"}
              </p>
              <div className="bg-black/50 rounded-xl p-4 border border-white/10">
                <code className="text-green-400 text-sm">
                  unzip {product?.name.en?.toLowerCase().replace(/ /g, "-")}-v1.0.zip -d ~/clawd/
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

            {/* Step 4: Community */}
            <div className="glass-card rounded-3xl p-8 mb-10 animate-fade-in animate-delay-400">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-[#E74C3C] flex items-center justify-center text-white font-bold text-sm">4</span>
                <h2 className="text-xl font-bold text-white">
                  {locale === "zh" ? "加入社群" : "Join the Community"}
                </h2>
              </div>
              <a
                href="https://t.me/+2p-LBUUrJ1BjMjNl"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-pill px-6 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-2 text-white/80 hover:text-white"
              >
                🦞 {locale === "zh" ? "加入 Telegram 群" : "Join Telegram Group"} →
              </a>
            </div>
          </>
        ) : (
          /* No token - show restricted view */
          <div className="glass-card rounded-3xl p-8 mb-10 animate-fade-in text-center">
            <p className="text-white/50 mb-6">
              {locale === "zh"
                ? "如果你已经购买，请检查你的付款邮箱获取下载链接。"
                : "If you've already purchased, check your payment email for the download link."}
            </p>
            <a
              href="mailto:support@lobsterfarmer.com"
              className="cta-button px-8 py-3 rounded-full text-sm font-medium inline-flex items-center gap-2"
            >
              {locale === "zh" ? "联系客服" : "Contact Support"}
            </a>
          </div>
        )}

        {/* Bottom links */}
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
    <Suspense fallback={
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/40">Loading...</div>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
