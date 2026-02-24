"use client";

import { useLocale } from "@/context/LocaleContext";

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🦞</span>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            © 2025 {t.footer.rights}
          </span>
        </div>
        <p className="text-sm text-neutral-400 dark:text-neutral-600">
          {t.footer.tagline}
        </p>
      </div>
    </footer>
  );
}
