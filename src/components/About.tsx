"use client";

import { useLocale } from "@/context/LocaleContext";

export default function About() {
  const { t } = useLocale();

  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* About Text */}
          <div className="lg:col-span-7 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8 lg:p-10">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">
              {t.about.title}
            </h2>
            <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
              <p className="text-red-500 dark:text-red-400 font-medium">
                {t.about.p3}
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 lg:gap-6">
            <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center text-2xl">
                🦞
              </div>
              <div>
                <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                  {t.about.highlight1}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {t.about.highlight1Label}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-2xl">
                🤖
              </div>
              <div>
                <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                  {t.about.highlight2}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {t.about.highlight2Label}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-2xl">
                📡
              </div>
              <div>
                <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                  {t.about.highlight3}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {t.about.highlight3Label}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
