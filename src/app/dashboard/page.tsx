"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";

interface Purchase {
  id: string;
  product: string;
  slug: string;
  date: string;
  amount: string;
  currency: string;
  downloadUrl: string;
  installCmd: string;
}

interface DashboardData {
  email: string;
  purchases: Purchase[];
}

type Tab = "purchases" | "settings";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("lobster_session");
}

function setToken(token: string) {
  localStorage.setItem("lobster_session", token);
}

function clearToken() {
  localStorage.removeItem("lobster_session");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

function DashboardContent() {
  const { locale } = useLocale();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("purchases");
  const [copied, setCopied] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    // Check URL hash for token (from old magic link redirect - keep for compat)
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.slice(1);
      const params = new URLSearchParams(hash);
      const hashToken = params.get("token");
      if (hashToken) {
        setToken(hashToken);
        window.history.replaceState(null, "", window.location.pathname);
      }
    }

    const token = getToken();
    if (!token) {
      setLoading(false);
      return; // Don't redirect, just show "please login"
    }

    try {
      const res = await fetch("/api/auth/purchases", {
        headers: authHeaders(),
      });
      if (res.status === 401) {
        clearToken();
        setLoading(false);
        return; // Show "please login", don't redirect
      }
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        // Non-401 error (e.g. 500) - show data as empty, don't redirect
        console.error("Purchases API error:", res.status);
        // Still show dashboard with empty purchases
        const meRes = await fetch("/api/auth/me", { headers: authHeaders() });
        if (meRes.ok) {
          const me = await meRes.json();
          setData({ email: me.email, purchases: [] });
        }
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = () => {
    clearToken();
    fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">🦞</div>
          <p className="text-white/40 animate-pulse text-lg">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <p className="text-white/50 mb-4">{locale === "zh" ? "请先登录" : "Please sign in first"}</p>
          <a href="/login" className="cta-button px-6 py-2.5 rounded-full text-sm font-medium">
            {locale === "zh" ? "去登录 →" : "Sign In →"}
          </a>
        </div>
      </main>
    );
  }

  const initials = data.email.substring(0, 2).toUpperCase();

  const tabs: { key: Tab; label: string }[] = [
    { key: "purchases", label: locale === "zh" ? "我的购买" : "My Purchases" },
    { key: "settings", label: locale === "zh" ? "设置" : "Settings" },
  ];

  return (
    <main className="min-h-screen bg-black relative pt-28 pb-20 px-4">
      <div className="glow-orb glow-orb-red w-[500px] h-[500px] top-20 right-1/4 opacity-10" />
      <div className="glow-orb glow-orb-purple w-[350px] h-[350px] bottom-20 left-1/4 opacity-10" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E74C3C] to-[#8b5cf6] flex items-center justify-center text-white font-bold text-sm">
              {initials}
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider">
                {locale === "zh" ? "账户面板" : "Account Dashboard"}
              </p>
              <h1 className="text-xl font-bold text-white">
                {locale === "zh" ? "欢迎回来" : "Welcome back"}
              </h1>
              <p className="text-white/40 text-sm">{data.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="glass-pill px-4 py-2 rounded-full text-sm text-white/60 hover:text-white"
            >
              {locale === "zh" ? "浏览产品" : "Browse Products"}
            </Link>
            <button
              onClick={handleLogout}
              className="glass-pill px-4 py-2 rounded-full text-sm text-white/60 hover:text-white"
            >
              {locale === "zh" ? "退出" : "Sign Out"}
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col md:flex-row gap-6 animate-fade-in animate-delay-100">
          {/* Sidebar tabs */}
          <div className="md:w-48 flex md:flex-col gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-all ${
                  activeTab === tab.key
                    ? "bg-[#E74C3C]/20 text-[#E74C3C] border border-[#E74C3C]/30"
                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1">
            {activeTab === "purchases" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {locale === "zh" ? "我的购买" : "My Purchases"}
                  </h2>
                  <p className="text-white/40 text-sm">
                    {locale === "zh"
                      ? "查看已购买的产品，随时重新下载"
                      : "Access your purchased products and re-download any time"}
                  </p>
                </div>

                <div className="glass-card rounded-xl p-4 mb-6 border-l-2 border-cyan-500/50">
                  <p className="text-white/50 text-sm">
                    {locale === "zh"
                      ? "💡 你可以直接下载文件到 OpenClaw workspace，或使用下方的安装命令。"
                      : "💡 Download files to your OpenClaw workspace, or use the install command below."}
                  </p>
                </div>

                {data.purchases.length === 0 ? (
                  <div className="glass-card rounded-2xl p-10 text-center">
                    <div className="text-4xl mb-4">📦</div>
                    <p className="text-white/50 mb-4">
                      {locale === "zh" ? "还没有购买记录" : "No purchases yet"}
                    </p>
                    <Link
                      href="/products"
                      className="cta-button px-6 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-2"
                    >
                      {locale === "zh" ? "浏览产品 →" : "Browse Products →"}
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.purchases.map((purchase) => (
                      <div key={purchase.id} className="glass-card rounded-2xl p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-white">{purchase.product}</h3>
                            <p className="text-white/40 text-sm">
                              {locale === "zh" ? "购买于" : "Purchased"}{" "}
                              {new Date(purchase.date).toLocaleDateString(
                                locale === "zh" ? "zh-CN" : "en-US",
                                { year: "numeric", month: "long", day: "numeric" }
                              )}{" "}
                              · ${purchase.amount} {purchase.currency}
                            </p>
                          </div>
                          <a
                            href={purchase.downloadUrl}
                            download
                            className="cta-button px-5 py-2 rounded-full text-sm font-medium inline-flex items-center gap-1.5"
                          >
                            📦 Download
                          </a>
                        </div>

                        <div className="bg-black/50 rounded-xl p-3 border border-white/10 flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-white/30 text-xs mb-1">
                              {locale === "zh" ? "一键安装到 OpenClaw（复制给你的龙虾🦞）：" : "One-click install (paste to your agent 🦞):"}
                            </p>
                            <code className="text-green-400 text-xs block truncate">
                              {purchase.installCmd}
                            </code>
                          </div>
                          <button
                            onClick={() => handleCopy(purchase.installCmd, purchase.id)}
                            className="glass-pill px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white shrink-0"
                          >
                            {copied === purchase.id ? "✓ Copied" : "Copy"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {locale === "zh" ? "设置" : "Settings"}
                  </h2>
                </div>
                <div className="glass-card rounded-2xl p-6 space-y-4">
                  <div>
                    <label className="text-white/40 text-sm">{locale === "zh" ? "邮箱" : "Email"}</label>
                    <p className="text-white">{data.email}</p>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <label className="text-white/40 text-sm">{locale === "zh" ? "需要帮助？" : "Need help?"}</label>
                    <p className="text-white/60 text-sm mt-1">
                      {locale === "zh" ? "联系 support@lobsterfarmer.com 或加入" : "Contact support@lobsterfarmer.com or join"}{" "}
                      <a href="https://t.me/+2p-LBUUrJ1BjMjNl" target="_blank" rel="noopener noreferrer" className="text-[#E74C3C] hover:underline">Telegram</a>
                    </p>
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
