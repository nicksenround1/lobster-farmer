"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

interface Purchase {
  product: string;
  slug: string;
  date: string;
  amount: string;
  downloadUrl: string;
  installCmd: string;
}

type Tab = "purchases" | "settings";

function DashboardContent() {
  const { locale } = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("purchases");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) {
        router.push("/login");
        return;
      }
      const meData = await meRes.json();
      setEmail(meData.email);

      const dashRes = await fetch("/api/dashboard");
      if (dashRes.ok) {
        const dashData = await dashRes.json();
        setPurchases(dashData.purchases || []);
      }
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const copyCmd = (idx: number, cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const productIcons: Record<string, string> = {
    "starter-pack": "📦",
    "lobster-persona": "🦞",
    "lobster-bundle": "🎁",
  };

  const productVersions: Record<string, string> = {
    "starter-pack": "v1.0",
    "lobster-persona": "v1.0",
    "lobster-bundle": "v1.0",
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/40 text-sm">Loading...</div>
      </main>
    );
  }

  const initials = email ? email.substring(0, 2).toUpperCase() : "??";

  return (
    <main className="min-h-screen bg-black relative pt-28 pb-20 px-4">
      <div className="glow-orb glow-orb-purple w-[400px] h-[400px] top-20 right-1/4 opacity-10" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="glass-card rounded-3xl p-8 mb-8 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E74C3C] to-[#C0392B] flex items-center justify-center text-white font-bold text-sm">
                {initials}
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider">
                  {locale === "zh" ? "账户面板" : "Account Dashboard"}
                </p>
                <h1 className="text-xl font-bold text-white">
                  {locale === "zh" ? `欢迎回来` : `Welcome back`}
                </h1>
                <p className="text-white/40 text-sm">{email}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href="/products"
                className="glass-pill px-5 py-2 rounded-full text-sm text-white/60 hover:text-white"
              >
                {locale === "zh" ? "浏览产品" : "Browse Products"}
              </Link>
              <button
                onClick={handleLogout}
                className="glass-pill px-5 py-2 rounded-full text-sm text-white/60 hover:text-white"
              >
                {locale === "zh" ? "退出" : "Sign Out"}
              </button>
            </div>
          </div>
        </div>

        {/* Body with sidebar */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-48 shrink-0">
            <div className="flex md:flex-col gap-2">
              {(
                [
                  { key: "purchases" as Tab, label: locale === "zh" ? "我的购买" : "My Purchases", icon: "📦" },
                  { key: "settings" as Tab, label: locale === "zh" ? "设置" : "Settings", icon: "⚙️" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left w-full ${
                    activeTab === tab.key
                      ? "bg-[#E74C3C]/20 text-[#E74C3C] border border-[#E74C3C]/30"
                      : "text-white/40 hover:text-white/70 hover:bg-white/5"
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {activeTab === "purchases" && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    {locale === "zh" ? "我的购买" : "My Purchases"}
                  </h2>
                  <p className="text-white/40 text-sm">
                    {locale === "zh"
                      ? "查看已购买的产品，随时重新下载"
                      : "Access your purchased products and re-download any time"}
                  </p>
                </div>

                {/* Install hint */}
                <div className="glass-card rounded-xl p-4 border-l-2 border-cyan-500/50">
                  <p className="text-white/50 text-sm">
                    {locale === "zh"
                      ? "💡 你可以直接下载文件，或复制安装命令让 OpenClaw 自动安装。"
                      : "💡 Download files directly, or copy the install command for your OpenClaw assistant."}
                  </p>
                </div>

                {purchases.length === 0 ? (
                  <div className="glass-card rounded-2xl p-12 text-center">
                    <div className="text-4xl mb-4">🛒</div>
                    <p className="text-white/40 mb-4">
                      {locale === "zh" ? "还没有购买记录" : "No purchases yet"}
                    </p>
                    <Link
                      href="/products"
                      className="cta-button px-6 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-2"
                    >
                      {locale === "zh" ? "去逛逛 →" : "Browse Products →"}
                    </Link>
                  </div>
                ) : (
                  purchases.map((p, i) => (
                    <div
                      key={i}
                      className="glass-card rounded-2xl p-6 animate-fade-in"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="flex items-start gap-4">
                          <div className="text-3xl mt-0.5">
                            {productIcons[p.slug] || "📦"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-white font-bold">{p.product}</h3>
                              <span className="text-xs text-white/20 bg-white/5 px-2 py-0.5 rounded">
                                {productVersions[p.slug] || "v1.0"}
                              </span>
                            </div>
                            <p className="text-white/30 text-sm">
                              {locale === "zh" ? "购买于" : "Purchased"}{" "}
                              {new Date(p.date).toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US", {
                                year: "numeric", month: "short", day: "numeric",
                              })}{" "}
                              · ${p.amount} · Stripe
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={p.downloadUrl}
                            download
                            className="cta-button px-5 py-2 rounded-full text-sm font-medium"
                          >
                            {locale === "zh" ? "下载" : "Download"}
                          </a>
                        </div>
                      </div>

                      {/* Install command */}
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-white/30 text-xs mb-2">
                          {locale === "zh"
                            ? "告诉你的 OpenClaw 助手安装："
                            : "Tell your OpenClaw assistant to install:"}
                        </p>
                        <div className="flex items-center gap-2 bg-black/50 rounded-xl px-4 py-3 border border-white/5">
                          <code className="text-green-400 text-sm flex-1 overflow-x-auto">
                            {p.installCmd}
                          </code>
                          <button
                            onClick={() => copyCmd(i, p.installCmd)}
                            className="shrink-0 text-white/30 hover:text-white text-sm px-3 py-1 rounded-lg hover:bg-white/5 transition"
                          >
                            {copiedIdx === i
                              ? locale === "zh" ? "✓ 已复制" : "✓ Copied"
                              : locale === "zh" ? "复制" : "Copy"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    {locale === "zh" ? "设置" : "Settings"}
                  </h2>
                  <p className="text-white/40 text-sm">
                    {locale === "zh" ? "管理你的账户" : "Manage your account"}
                  </p>
                </div>

                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-white font-medium mb-3">
                    {locale === "zh" ? "邮箱" : "Email"}
                  </h3>
                  <p className="text-white/50">{email}</p>
                </div>

                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-white font-medium mb-3">
                    {locale === "zh" ? "需要帮助？" : "Need Help?"}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://t.me/+2p-LBUUrJ1BjMjNl"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-pill px-4 py-2 rounded-full text-sm text-white/60 hover:text-white"
                    >
                      🦞 Telegram
                    </a>
                    <a
                      href="mailto:support@lobsterfarmer.com"
                      className="glass-pill px-4 py-2 rounded-full text-sm text-white/60 hover:text-white"
                    >
                      ✉️ support@lobsterfarmer.com
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
