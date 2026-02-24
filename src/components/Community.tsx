"use client";

import { useLocale } from "@/context/LocaleContext";

export default function Community() {
  const { t } = useLocale();

  return (
    <section id="community" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-red-500/10 dark:from-blue-500/20 dark:via-purple-500/10 dark:to-red-500/20 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8 lg:p-12 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 select-none pointer-events-none">
            <span className="text-[20rem] leading-none">🦞</span>
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              {t.community.title}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto mb-8 leading-relaxed">
              {t.community.desc}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <a
                href="https://t.me/+2p-LBUUrJ1BjMjNl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-medium transition-colors shadow-lg shadow-blue-500/25 text-lg"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.492-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                {t.community.join}
              </a>
            </div>

            <p className="text-sm text-neutral-500 dark:text-neutral-500">
              {t.community.members}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
