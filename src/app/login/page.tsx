"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useLocale } from "@/context/LocaleContext";

function LoginContent() {
  const { locale } = useLocale();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("sent");
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to send");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error");
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-black relative pt-28 pb-20 px-4">
      <div className="glow-orb glow-orb-purple w-[400px] h-[400px] top-1/3 left-1/2 -translate-x-1/2 opacity-15" />

      <div className="max-w-md mx-auto relative z-10">
        <div className="text-center mb-10 animate-fade-in">
          <div className="text-5xl mb-4">🦞</div>
          <h1 className="text-3xl font-bold text-white mb-2 text-glow-white">
            {locale === "zh" ? "登录" : "Sign In"}
          </h1>
          <p className="text-white/40">
            {locale === "zh"
              ? "输入邮箱，我们会发送一个登录链接"
              : "Enter your email and we'll send you a sign-in link"}
          </p>
        </div>

        {error === "expired" && status === "idle" && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-center">
            <p className="text-red-400 text-sm">
              {locale === "zh" ? "链接已过期，请重新登录" : "Link expired. Please sign in again."}
            </p>
          </div>
        )}

        <div className="glass-card rounded-3xl p-8 animate-fade-in animate-delay-100">
          {status === "sent" ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">✉️</div>
              <h2 className="text-xl font-bold text-white mb-3">
                {locale === "zh" ? "查看邮箱" : "Check Your Email"}
              </h2>
              <p className="text-white/50 mb-2">
                {locale === "zh"
                  ? "登录链接已发送到"
                  : "A sign-in link has been sent to"}
              </p>
              <p className="text-white font-medium mb-4">{email}</p>
              <p className="text-white/30 text-sm">
                {locale === "zh"
                  ? "链接 15 分钟内有效。请检查垃圾邮件。"
                  : "Link valid for 15 minutes. Check spam if not found."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label className="block text-white/60 text-sm mb-2">
                {locale === "zh" ? "邮箱地址" : "Email"}
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
                <p className="text-red-400 text-sm mb-4">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="cta-button w-full px-8 py-3.5 rounded-full text-sm font-medium disabled:opacity-50"
              >
                {status === "loading"
                  ? locale === "zh" ? "发送中..." : "Sending..."
                  : locale === "zh" ? "发送登录链接 →" : "Send Sign-In Link →"}
              </button>

              <p className="text-white/20 text-xs text-center mt-4">
                {locale === "zh"
                  ? "无需密码。使用购买时的邮箱登录即可。"
                  : "No password needed. Use the email you purchased with."}
              </p>
            </form>
          )}
        </div>

        <div className="text-center mt-8 space-y-3">
          <Link href="/products" className="text-white/40 hover:text-white/70 text-sm block">
            {locale === "zh" ? "← 浏览产品" : "← Browse Products"}
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/40">Loading...</div>
      </main>
    }>
      <LoginContent />
    </Suspense>
  );
}
