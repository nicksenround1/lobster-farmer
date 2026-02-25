"use client";

import { useLocale } from "@/context/LocaleContext";

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-white/5 py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🦞</span>
          <span className="text-sm text-white/30">
            © 2025 {t.footer.rights}
          </span>
        </div>
        <p className="text-sm text-white/20">
          {t.footer.tagline}
        </p>
      </div>
    </footer>
  );
}
