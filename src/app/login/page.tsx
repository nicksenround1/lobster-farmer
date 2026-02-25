"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useLocale } from "@/context/LocaleContext";

function LoginContent() {
  const { locale } = useLocale();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  const errorMessages: Record<string, string> = {
    expired: locale === "zh" ? "链接已过期，请重新登录" : "Link expired. Please sign in again.",
    missing_token: locale === "zh" ? "无效的链接" : "Invalid link.",
  };

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
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-black relative flex items-center justify-center px-4">
      <div className="glow-orb glow-orb-red w-[400px] h-[400px] top-1/3 left-1/3 opacity-15" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🦞</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {locale === "zh" ? "登录" : "Sign In"}
          </h1>
          <p className="text-white/40 text-sm">
            {locale === "zh"
              ? "输入你的邮箱，我们会发送一封登录链接"
              : "Enter your email and we'll send you a magic link"}
          </p>
        </div>

        {errorParam && errorMessages[errorParam] && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {errorMessages[errorParam]}
          </div>
        )}

        <div className="glass-card rounded-3xl p-8">
          {status === "sent" ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-4">✉️</div>
              <h2 className="text-lg font-bold text-white mb-2">
                {locale === "zh" ? "查看你的邮箱" : "Check Your Email"}
              </h2>
              <p className="text-white/50 text-sm mb-1">
                {locale === "zh"
                  ? "登录链接已发送到"
                  : "A sign-in link has been sent to"}
              </p>
              <p className="text-white font-medium mb-4">{email}</p>
              <p className="text-white/30 text-xs">
                {locale === "zh"
                  ? "链接 15 分钟内有效。请检查垃圾邮件。"
                  : "Link expires in 15 minutes. Check spam if needed."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label className="block text-white/50 text-sm mb-2">
                {locale === "zh" ? "邮箱地址" : "Email"}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#E74C3C]/50 mb-5"
              />

              {status === "error" && (
                <p className="text-red-400 text-sm mb-4 text-center">
                  {locale === "zh" ? "发送失败，请重试" : "Failed to send. Try again."}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="cta-button w-full px-8 py-3.5 rounded-full text-sm font-medium disabled:opacity-50"
              >
                {status === "loading"
                  ? locale === "zh" ? "发送中..." : "Sending..."
                  : locale === "zh" ? "发送登录链接 →" : "Send Magic Link →"}
              </button>
            </form>
          )}
        </div>

        <div className="text-center mt-6 space-y-2">
          <Link href="/products" className="text-white/30 hover:text-white/60 text-sm block">
            {locale === "zh" ? "← 浏览产品" : "← Browse Products"}
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-black" />}>
      <LoginContent />
    </Suspense>
  );
}
