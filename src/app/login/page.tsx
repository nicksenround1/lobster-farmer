"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

type Step = "email" | "code";

function LoginContent() {
  const { locale } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok && data.otpToken) {
        setOtpToken(data.otpToken);
        setStep("code");
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      } else {
        setErrorMsg(data.error || "Failed to send code");
      }
    } catch {
      setErrorMsg("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits filled
    const fullCode = newCode.join("");
    if (fullCode.length === 6) {
      handleVerify(fullCode);
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const newCode = pasted.split("");
      setCode(newCode);
      handleVerify(pasted);
    }
  };

  const handleVerify = async (fullCode: string) => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otpToken, code: fullCode }),
      });
      const data = await res.json();

      if (res.ok && data.sessionToken) {
        localStorage.setItem("lobster_session", data.sessionToken);
        router.push("/dashboard");
      } else {
        setErrorMsg(
          locale === "zh" ? "验证码错误或已过期" : "Invalid or expired code"
        );
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setErrorMsg("Network error");
    } finally {
      setLoading(false);
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
            {step === "email"
              ? locale === "zh"
                ? "输入邮箱，我们会发送一个验证码"
                : "Enter your email, we'll send you a code"
              : locale === "zh"
                ? `验证码已发送到 ${email}`
                : `Code sent to ${email}`}
          </p>
        </div>

        {error === "expired" && step === "email" && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-center">
            <p className="text-red-400 text-sm">
              {locale === "zh" ? "会话已过期，请重新登录" : "Session expired. Please sign in again."}
            </p>
          </div>
        )}

        <div className="glass-card rounded-3xl p-8 animate-fade-in animate-delay-100">
          {step === "email" ? (
            <form onSubmit={handleSendCode}>
              <label className="block text-white/60 text-sm mb-2">
                {locale === "zh" ? "邮箱地址" : "Email"}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoFocus
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#E74C3C]/50 mb-4"
              />

              {errorMsg && <p className="text-red-400 text-sm mb-4">{errorMsg}</p>}

              <button
                type="submit"
                disabled={loading}
                className="cta-button w-full px-8 py-3.5 rounded-full text-sm font-medium disabled:opacity-50"
              >
                {loading
                  ? locale === "zh" ? "发送中..." : "Sending..."
                  : locale === "zh" ? "发送验证码 →" : "Send Code →"}
              </button>

              <p className="text-white/20 text-xs text-center mt-4">
                {locale === "zh"
                  ? "无需密码。使用购买时的邮箱即可。"
                  : "No password needed. Use the email you purchased with."}
              </p>
            </form>
          ) : (
            <div>
              <label className="block text-white/60 text-sm mb-4 text-center">
                {locale === "zh" ? "输入 6 位验证码" : "Enter 6-digit code"}
              </label>

              {/* OTP input boxes */}
              <div className="flex justify-center gap-2 mb-6" onPaste={handleCodePaste}>
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeInput(i, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(i, e)}
                    className="w-12 h-14 bg-black/50 border border-white/10 rounded-xl text-center text-white text-xl font-bold focus:outline-none focus:border-[#E74C3C]/50"
                  />
                ))}
              </div>

              {errorMsg && <p className="text-red-400 text-sm mb-4 text-center">{errorMsg}</p>}

              {loading && (
                <p className="text-white/40 text-sm text-center mb-4 animate-pulse">
                  {locale === "zh" ? "验证中..." : "Verifying..."}
                </p>
              )}

              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => { setStep("email"); setCode(["","","","","",""]); setErrorMsg(""); }}
                  className="text-white/40 hover:text-white/70 text-sm"
                >
                  {locale === "zh" ? "← 换个邮箱" : "← Change email"}
                </button>
                <button
                  onClick={handleSendCode}
                  disabled={loading}
                  className="text-[#E74C3C] hover:text-[#E74C3C]/80 text-sm disabled:opacity-50"
                >
                  {locale === "zh" ? "重新发送" : "Resend code"}
                </button>
              </div>
            </div>
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
