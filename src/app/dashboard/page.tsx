"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

type Status = "idle" | "loading" | "success" | "error" | "not-found";

function DashboardContent() {
  const { locale } = useLocale();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setCount(data.count || 0);
      } else if (res.status === 404) {
        setStatus("not-found");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setMessage("Network error");
    }
  };

  return (
    <main className="min-h-screen bg-black relative pt-28 pb-20 px-4">
      <div className="glow-orb glow-orb-purple w-[500px] h-[500px] top-1/4 left-1/4 opacity-20" />

      <div className="max-w-lg mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="text-5xl mb-4">🦞</div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 text-glow-white">
            {locale === "zh" ? "我的购买" : "My Purchases"}
          </h1>
          <p className="text-white/40 text-lg">
            {locale === "zh"
              ? "输入购买时使用的邮箱，下载链接将发送到你的邮箱"
              : "Enter your purchase email to receive download links"}
          </p>
        </div>

        {/* Email form */}
        <div className="glass-card rounded-3xl p-8 animate-fade-in animate-delay-100">
          {status === "success" ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">✉️</div>
              <h2 className="text-xl font-bold text-white mb-3">
                {locale === "zh" ? "已发送！" : "Sent!"}
              </h2>
              <p className="text-white/50 mb-2">
                {locale === "zh"
                  ? `${count} 个产品的下载链接已发送到`
                  : `Download links for ${count} product(s) sent to`}
              </p>
              <p className="text-white font-medium mb-6">{email}</p>
              <p className="text-white/30 text-sm mb-6">
                {locale === "zh"
                  ? "请检查收件箱（包括垃圾邮件），链接 72 小时内有效"
                  : "Check your inbox (and spam). Links valid for 72 hours."}
              </p>
              <button
                onClick={() => { setStatus("idle"); setEmail(""); }}
                className="glass-pill px-6 py-2.5 rounded-full text-sm text-white/60 hover:text-white"
              >
                {locale === "zh" ? "重新查询" : "Try another email"}
              </button>
            </div>
          ) : status === "not-found" ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">🤔</div>
              <h2 className="text-xl font-bold text-white mb-3">
                {locale === "zh" ? "未找到购买记录" : "No Purchases Found"}
              </h2>
              <p className="text-white/50 mb-6">
                {locale === "zh"
                  ? "该邮箱没有购买记录。请确认是否使用了其他邮箱付款。"
                  : "No purchases found for this email. Please check if you used a different email."}
              </p>
              <div className="flex flex-col gap-3 items-center">
                <button
                  onClick={() => { setStatus("idle"); setEmail(""); }}
                  className="glass-pill px-6 py-2.5 rounded-full text-sm text-white/60 hover:text-white"
                >
                  {locale === "zh" ? "换个邮箱试试" : "Try another email"}
                </button>
                <a
                  href="mailto:support@lobsterfarmer.com"
                  className="text-[#E74C3C] text-sm hover:underline"
                >
                  {locale === "zh" ? "联系客服" : "Contact Support"}
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label className="block text-white/60 text-sm mb-2">
                {locale === "zh" ? "购买时使用的邮箱" : "Purchase Email"}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#E74C3C]/50 mb-4"
              />

              {status === "error" && (
                <p className="text-red-400 text-sm mb-4">{message}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="cta-button w-full px-8 py-3.5 rounded-full text-sm font-medium disabled:opacity-50"
              >
                {status === "loading"
                  ? locale === "zh" ? "查询中..." : "Looking up..."
                  : locale === "zh" ? "发送下载链接到邮箱 →" : "Send Download Links →"}
              </button>

              <p className="text-white/20 text-xs text-center mt-4">
                {locale === "zh"
                  ? "我们会通过邮件发送带有下载链接的购买记录，不需要注册账号"
                  : "We'll email you download links for all your purchases. No account needed."}
              </p>
            </form>
          )}
        </div>

        {/* Bottom links */}
        <div className="text-center mt-8 animate-fade-in animate-delay-200 space-y-3">
          <Link href="/products" className="text-white/40 hover:text-white/70 text-sm block">
            {locale === "zh" ? "← 浏览产品" : "← Browse Products"}
          </Link>
          <Link href="/" className="text-white/40 hover:text-white/70 text-sm block">
            {locale === "zh" ? "回到首页" : "Back to Home"}
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
