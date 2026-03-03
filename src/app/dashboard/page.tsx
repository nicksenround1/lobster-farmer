"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { COMMISSION_RATE_DISPLAY } from "@/lib/config";

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

interface ReferralStats {
  totalReferrals: number;
  totalCommission: number;
  settledCommission: number;
  pendingCommission: number;
}

interface CommissionItem {
  product: string;
  amount: number;
  commission: number;
  currency: string;
  date: string;
  settled: boolean;
}

interface ReferralInfo {
  registered: boolean;
  code?: string;
  wallet?: string;
  referralUrl?: string;
  stats?: ReferralStats;
  commissions?: CommissionItem[];
}

type Tab = "purchases" | "referral" | "settings";

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

  // Referral state
  const [refInfo, setRefInfo] = useState<ReferralInfo | null>(null);
  const [refLoading, setRefLoading] = useState(false);
  const [walletInput, setWalletInput] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");

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
      return;
    }

    try {
      const res = await fetch("/api/auth/purchases", {
        headers: authHeaders(),
      });
      if (res.status === 401) {
        clearToken();
        setLoading(false);
        return;
      }
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        console.error("Purchases API error:", res.status);
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

  const fetchReferralInfo = useCallback(async () => {
    setRefLoading(true);
    try {
      const res = await fetch("/api/referral/info", {
        headers: authHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        setRefInfo(json);
      }
    } catch (err) {
      console.error("Referral info error:", err);
    } finally {
      setRefLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (activeTab === "referral" && data) {
      fetchReferralInfo();
    }
  }, [activeTab, data, fetchReferralInfo]);

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

  const handleRegister = async () => {
    if (!walletInput.trim()) {
      setRegisterError(
        locale === "zh" ? "请输入钱包地址" : "Please enter wallet address"
      );
      return;
    }
    setRegisterLoading(true);
    setRegisterError("");
    try {
      const res = await fetch("/api/referral/register", {
        method: "POST",
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wallet: walletInput.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        setRegisterError(
          json.error ||
            (locale === "zh" ? "注册失败" : "Registration failed")
        );
        return;
      }
      // Refresh referral info
      await fetchReferralInfo();
    } catch (err) {
      console.error("Register error:", err);
      setRegisterError(locale === "zh" ? "网络错误" : "Network error");
    } finally {
      setRegisterLoading(false);
    }
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

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "purchases", label: locale === "zh" ? "我的购买" : "My Purchases", icon: "📦" },
    { key: "referral", label: locale === "zh" ? "推荐中心" : "Referral Center", icon: "🤝" },
    { key: "settings", label: locale === "zh" ? "设置" : "Settings", icon: "⚙️" },
  ];

  const tweetTemplates = [
    {
      zh: `🦞 我在用养虾户的 AI Agent 配置，Crypto 监控 + 自动化全搞定！\n\n$1 入门包，30 分钟就能让你的 AI Agent 跑起来 🚀\n\n${refInfo?.referralUrl || "https://lobsterfarmer.com"}`,
      en: `🦞 I'm using Lobster Farmer's AI Agent config — Crypto monitoring + automation, all covered!\n\nStarter Pack for just $1, up and running in 30 min 🚀\n\n${refInfo?.referralUrl || "https://lobsterfarmer.com"}`,
    },
    {
      zh: `养虾户 Persona 让我的 AI Agent 变成了 24/7 Crypto 情报员 🦞\n\n每天追踪 35+ KOL，Whale Alert 实时推送，安全防护内建\n\n感兴趣？用我的链接：${refInfo?.referralUrl || "https://lobsterfarmer.com"}`,
      en: `Lobster Farmer Persona turned my AI Agent into a 24/7 Crypto intel officer 🦞\n\nTracking 35+ KOLs daily, real-time Whale Alerts, security built-in\n\nInterested? Use my link: ${refInfo?.referralUrl || "https://lobsterfarmer.com"}`,
    },
    {
      zh: `如果你在用 OpenClaw，你需要养虾户的配置包 🦞\n\n从入门到全自动化，我靠这套方案省了无数时间\n\n${refInfo?.referralUrl || "https://lobsterfarmer.com"}`,
      en: `If you're using OpenClaw, you need Lobster Farmer's config packs 🦞\n\nFrom starter to full automation — this saved me countless hours\n\n${refInfo?.referralUrl || "https://lobsterfarmer.com"}`,
    },
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
                className={`px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-all flex items-center gap-2 ${
                  activeTab === tab.key
                    ? "bg-[#E74C3C]/20 text-[#E74C3C] border border-[#E74C3C]/30"
                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1">
            {/* ─── Purchases Tab ─── */}
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

            {/* ─── Referral Tab ─── */}
            {activeTab === "referral" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {locale === "zh" ? "🤝 推荐中心" : "🤝 Referral Center"}
                  </h2>
                  <p className="text-white/40 text-sm">
                    {locale === "zh"
                      ? `推荐朋友购买，赚取 ${COMMISSION_RATE_DISPLAY} 佣金`
                      : `Refer friends, earn ${COMMISSION_RATE_DISPLAY} commission`}
                  </p>
                </div>

                {refLoading ? (
                  <div className="glass-card rounded-2xl p-10 text-center">
                    <div className="text-4xl mb-4 animate-bounce">🦞</div>
                    <p className="text-white/40 animate-pulse">
                      {locale === "zh" ? "加载中..." : "Loading..."}
                    </p>
                  </div>
                ) : refInfo?.registered ? (
                  /* ─── Registered State ─── */
                  <div className="space-y-6">
                    {/* Referral Link */}
                    <div className="glass-card rounded-2xl p-6">
                      <h3 className="text-lg font-bold text-white mb-3">
                        {locale === "zh" ? "你的推荐链接" : "Your Referral Link"}
                      </h3>
                      <div className="bg-black/50 rounded-xl p-4 border border-white/10 flex items-center justify-between gap-3">
                        <code className="text-[#E74C3C] text-sm flex-1 min-w-0 truncate">
                          {refInfo.referralUrl}
                        </code>
                        <button
                          onClick={() =>
                            handleCopy(refInfo.referralUrl || "", "ref-link")
                          }
                          className="cta-button px-4 py-2 rounded-full text-xs font-medium shrink-0"
                        >
                          {copied === "ref-link"
                            ? "✓ Copied"
                            : locale === "zh"
                            ? "复制"
                            : "Copy"}
                        </button>
                      </div>
                      <p className="text-white/30 text-xs mt-2">
                        {locale === "zh"
                          ? `推荐码: ${refInfo.code}`
                          : `Referral code: ${refInfo.code}`}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="glass-card rounded-2xl p-4 text-center">
                        <p className="text-2xl font-bold text-white stat-glow">
                          {refInfo.stats?.totalReferrals || 0}
                        </p>
                        <p className="text-white/40 text-xs mt-1">
                          {locale === "zh" ? "总推荐数" : "Total Referrals"}
                        </p>
                      </div>
                      <div className="glass-card rounded-2xl p-4 text-center">
                        <p className="text-2xl font-bold text-[#E74C3C] stat-glow">
                          ${refInfo.stats?.totalCommission?.toFixed(2) || "0.00"}
                        </p>
                        <p className="text-white/40 text-xs mt-1">
                          {locale === "zh" ? "总佣金" : "Total Commission"}
                        </p>
                      </div>
                      <div className="glass-card rounded-2xl p-4 text-center">
                        <p className="text-2xl font-bold text-green-400">
                          ${refInfo.stats?.settledCommission?.toFixed(2) || "0.00"}
                        </p>
                        <p className="text-white/40 text-xs mt-1">
                          {locale === "zh" ? "已结算" : "Settled"}
                        </p>
                      </div>
                      <div className="glass-card rounded-2xl p-4 text-center">
                        <p className="text-2xl font-bold text-yellow-400">
                          ${refInfo.stats?.pendingCommission?.toFixed(2) || "0.00"}
                        </p>
                        <p className="text-white/40 text-xs mt-1">
                          {locale === "zh" ? "待结算" : "Pending"}
                        </p>
                      </div>
                    </div>

                    {/* Settlement Info */}
                    <div className="glass-card rounded-xl p-4 border-l-2 border-yellow-500/50">
                      <p className="text-white/50 text-sm">
                        {locale === "zh"
                          ? "💰 结算规则：每周一 USDC 结算，最低提现 $10。佣金将发送到你注册的钱包地址。"
                          : "💰 Settlement: Weekly USDC payouts every Monday. Minimum withdrawal $10. Commission sent to your registered wallet."}
                      </p>
                      <p className="text-white/30 text-xs mt-1">
                        {locale === "zh"
                          ? `钱包: ${refInfo.wallet}`
                          : `Wallet: ${refInfo.wallet}`}
                      </p>
                    </div>

                    {/* Commission Details */}
                    {refInfo.commissions && refInfo.commissions.length > 0 && (
                      <div className="glass-card rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">
                          {locale === "zh" ? "佣金明细" : "Commission Details"}
                        </h3>
                        <div className="space-y-3">
                          {refInfo.commissions.map((c, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                            >
                              <div>
                                <p className="text-white text-sm font-medium">
                                  {c.product}
                                </p>
                                <p className="text-white/30 text-xs">
                                  {new Date(c.date).toLocaleDateString(
                                    locale === "zh" ? "zh-CN" : "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-green-400 text-sm font-bold">
                                  +${c.commission.toFixed(2)}
                                </p>
                                <p className="text-white/30 text-xs">
                                  {c.settled
                                    ? locale === "zh"
                                      ? "已结算"
                                      : "Settled"
                                    : locale === "zh"
                                    ? "待结算"
                                    : "Pending"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Promo Materials */}
                    <div className="glass-card rounded-2xl p-6">
                      <h3 className="text-lg font-bold text-white mb-4">
                        {locale === "zh" ? "📢 推广素材" : "📢 Promo Materials"}
                      </h3>
                      <p className="text-white/40 text-sm mb-4">
                        {locale === "zh"
                          ? "点击复制推文，直接发到 Twitter/X"
                          : "Click to copy tweet, paste directly to Twitter/X"}
                      </p>
                      <div className="space-y-3">
                        {tweetTemplates.map((tmpl, i) => (
                          <div
                            key={i}
                            className="bg-black/50 rounded-xl p-4 border border-white/10"
                          >
                            <p className="text-white/60 text-sm whitespace-pre-line mb-3">
                              {locale === "zh" ? tmpl.zh : tmpl.en}
                            </p>
                            <button
                              onClick={() =>
                                handleCopy(
                                  locale === "zh" ? tmpl.zh : tmpl.en,
                                  `tweet-${i}`
                                )
                              }
                              className="glass-pill px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white"
                            >
                              {copied === `tweet-${i}`
                                ? "✓ Copied"
                                : locale === "zh"
                                ? "复制推文"
                                : "Copy Tweet"}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ─── Unregistered State ─── */
                  <div className="space-y-6">
                    {/* Intro */}
                    <div className="glass-card rounded-2xl p-8 text-center">
                      <div className="text-6xl mb-4">🤝</div>
                      <h3 className="text-xl font-bold text-white mb-3">
                        {locale === "zh"
                          ? "成为养虾户推荐官"
                          : "Become a Lobster Ambassador"}
                      </h3>
                      <p className="text-white/50 text-sm leading-relaxed max-w-md mx-auto mb-6">
                        {locale === "zh"
                          ? `推荐朋友购买养虾户产品，每笔订单赚取 ${COMMISSION_RATE_DISPLAY} 佣金。每周一 USDC 自动结算到你的钱包。`
                          : `Refer friends to Lobster Farmer products and earn ${COMMISSION_RATE_DISPLAY} commission on every order. Weekly USDC payouts to your wallet.`}
                      </p>

                      <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                          <p className="text-2xl font-bold text-[#E74C3C]">{COMMISSION_RATE_DISPLAY}</p>
                          <p className="text-white/40 text-xs mt-1">
                            {locale === "zh" ? "佣金比例" : "Commission"}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                          <p className="text-2xl font-bold text-white">USDC</p>
                          <p className="text-white/40 text-xs mt-1">
                            {locale === "zh" ? "结算币种" : "Payout"}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                          <p className="text-2xl font-bold text-white">
                            {locale === "zh" ? "每周" : "Weekly"}
                          </p>
                          <p className="text-white/40 text-xs mt-1">
                            {locale === "zh" ? "结算周期" : "Frequency"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Register Form */}
                    <div className="glass-card rounded-2xl p-6">
                      <h3 className="text-lg font-bold text-white mb-4">
                        {locale === "zh" ? "注册成为推荐官" : "Register as Ambassador"}
                      </h3>
                      <p className="text-white/40 text-sm mb-4">
                        {locale === "zh"
                          ? "输入你的钱包地址（用于接收 USDC 佣金）"
                          : "Enter your wallet address (for receiving USDC commissions)"}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          value={walletInput}
                          onChange={(e) => setWalletInput(e.target.value)}
                          placeholder="0x..."
                          className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:border-[#E74C3C]/50 focus:outline-none transition-colors"
                        />
                        <button
                          onClick={handleRegister}
                          disabled={registerLoading}
                          className="cta-button px-6 py-3 rounded-full text-sm font-bold shrink-0 disabled:opacity-50"
                        >
                          {registerLoading
                            ? locale === "zh"
                              ? "注册中..."
                              : "Registering..."
                            : locale === "zh"
                            ? "注册 →"
                            : "Register →"}
                        </button>
                      </div>

                      {registerError && (
                        <p className="text-red-400 text-sm mt-3">{registerError}</p>
                      )}

                      <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                        <p className="text-white/30 text-xs">
                          {locale === "zh"
                            ? "⚠️ 需要先购买任意产品才能成为推荐官。自推自买不计入佣金。最低提现 $10。"
                            : "⚠️ You need to purchase any product first to become an ambassador. Self-referrals don't count. Minimum withdrawal $10."}
                        </p>
                      </div>
                    </div>

                    {/* How it works */}
                    <div className="glass-card rounded-2xl p-6">
                      <h3 className="text-lg font-bold text-white mb-4">
                        {locale === "zh" ? "运作方式" : "How It Works"}
                      </h3>
                      <div className="space-y-4">
                        {[
                          {
                            step: "1",
                            title: locale === "zh" ? "注册" : "Register",
                            desc:
                              locale === "zh"
                                ? "输入你的钱包地址，获得专属推荐链接"
                                : "Enter your wallet address and get your unique referral link",
                          },
                          {
                            step: "2",
                            title: locale === "zh" ? "分享" : "Share",
                            desc:
                              locale === "zh"
                                ? "把推荐链接分享给朋友，他们通过你的链接购买"
                                : "Share your referral link with friends, they purchase through your link",
                          },
                          {
                            step: "3",
                            title: locale === "zh" ? "赚钱" : "Earn",
                            desc:
                              locale === "zh"
                                ? `每笔订单自动计算 ${COMMISSION_RATE_DISPLAY} 佣金，每周一 USDC 结算`
                                : `${COMMISSION_RATE_DISPLAY} commission auto-calculated per order, weekly USDC payouts`,
                          },
                        ].map((item) => (
                          <div
                            key={item.step}
                            className="flex items-start gap-4"
                          >
                            <div className="w-8 h-8 rounded-full bg-[#E74C3C]/20 flex items-center justify-center text-[#E74C3C] font-bold text-sm shrink-0">
                              {item.step}
                            </div>
                            <div>
                              <h4 className="text-white font-semibold text-sm">
                                {item.title}
                              </h4>
                              <p className="text-white/40 text-sm">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── Settings Tab ─── */}
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
