"use client";

import { useLocale } from "@/context/LocaleContext";

export default function Hero() {
  const { t } = useLocale();

  return (
    <section className="min-h-screen flex items-center justify-center pt-16 px-4">
      <div className="max-w-7xl w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Main Hero Card */}
          <div className="lg:col-span-8 bg-gradient-to-br from-red-500/10 via-orange-500/5 to-transparent dark:from-red-500/20 dark:via-orange-500/10 dark:to-transparent rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
            {/* Decorative lobster */}
            <div className="absolute -right-8 -top-8 text-[12rem] opacity-10 select-none pointer-events-none leading-none">
              🦞
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 dark:bg-red-500/20 border border-red-500/20 dark:border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                AI Agent Builder
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-neutral-900 dark:text-white mb-2">
                {t.hero.title}
              </h1>
              <p className="text-2xl lg:text-3xl font-light text-neutral-500 dark:text-neutral-400 mb-4">
                {t.hero.subtitle}
              </p>
              <p className="text-lg lg:text-xl text-neutral-700 dark:text-neutral-300 mb-2 max-w-xl">
                {t.hero.tagline}
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-500 mb-8">
                {t.hero.description}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://t.me/+2p-LBUUrJ1BjMjNl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-red-500/25"
                >
                  🦞 {t.hero.cta}
                </a>
                <a
                  href="#services"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  {t.hero.learnMore} ↓
                </a>
              </div>
            </div>
          </div>

          {/* Right side cards */}
          <div className="lg:col-span-4 flex flex-col gap-4 lg:gap-6">
            {/* Social Card */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 flex-1">
              <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-4 uppercase tracking-wider">
                Social
              </h3>
              <div className="space-y-3">
                <a
                  href="https://x.com/ckn_acee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 dark:bg-white flex items-center justify-center">
                    <svg className="w-5 h-5 text-white dark:text-black" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-red-500 transition-colors">
                      @ckn_acee
                    </p>
                    <p className="text-xs text-neutral-500">Twitter / X</p>
                  </div>
                </a>
                <a
                  href="https://t.me/+2p-LBUUrJ1BjMjNl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.492-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-blue-500 transition-colors">
                      Telegram Group
                    </p>
                    <p className="text-xs text-neutral-500">养虾户基地</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-transparent dark:from-emerald-500/20 dark:to-transparent rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Online
                </span>
              </div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">24/7</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                AI Agents Running
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
