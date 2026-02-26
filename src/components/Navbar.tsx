"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/context/LocaleContext";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { locale, setLocale, t } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("lobster_session");
      if (token) setIsLoggedIn(true);
    }
  }, []);

  const navItems = [
    { label: t.nav.about, href: "/#about" },
    { label: t.nav.services, href: "/#services" },
    { label: t.nav.products, href: "/products", isPage: true },
    { label: t.nav.tools, href: "/#tools" },
    { label: t.nav.community, href: "/#community" },
    { label: t.nav.contact, href: "/#contact" },
  ];

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
      <div className="glass-nav rounded-full px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 text-lg font-bold shrink-0">
          <Image src="/logo.png" alt="养虾户" width={32} height={32} className="rounded-md" />
          <span className="text-white hidden sm:inline">养虾户</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) =>
            (item as { isPage?: boolean }).isPage ? (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 text-sm text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/5"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 text-sm text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/5"
              >
                {item.label}
              </a>
            )
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Dashboard / Login button */}
          <Link
            href={isLoggedIn ? "/dashboard" : "/login"}
            className="cta-button px-4 py-1.5 rounded-full text-xs font-medium hidden sm:inline-flex items-center gap-1.5"
          >
            {isLoggedIn
              ? locale === "zh" ? "📦 Dashboard" : "📦 Dashboard"
              : locale === "zh" ? "登录" : "Sign In"}
          </Link>

          {/* Locale Toggle */}
          <button
            onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
            className="glass-pill px-3 py-1.5 text-xs font-medium rounded-full text-white/70 hover:text-white"
          >
            {locale === "zh" ? "EN" : "中文"}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-full text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="glass-nav rounded-2xl mt-2 px-4 py-3 space-y-1">
          {navItems.map((item) =>
            (item as { isPage?: boolean }).isPage ? (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 text-sm text-white/60 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 text-sm text-white/60 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
              >
                {item.label}
              </a>
            )
          )}
          <Link
            href={isLoggedIn ? "/dashboard" : "/login"}
            onClick={() => setMobileOpen(false)}
            className="block px-4 py-2.5 text-sm text-[#E74C3C] font-medium rounded-xl hover:bg-white/5 transition-colors"
          >
            {isLoggedIn
              ? locale === "zh" ? "📦 Dashboard" : "📦 Dashboard"
              : locale === "zh" ? "🔑 登录" : "🔑 Sign In"}
          </Link>
        </div>
      )}
    </nav>
  );
}
