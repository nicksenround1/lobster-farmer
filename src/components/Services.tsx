"use client";

import { useLocale } from "@/context/LocaleContext";

const services = [
  {
    key: "openclaw" as const,
    icon: "⚙️",
    color: "red",
    span: "lg:col-span-7",
  },
  {
    key: "persona" as const,
    icon: "🎭",
    color: "purple",
    span: "lg:col-span-5",
  },
  {
    key: "api" as const,
    icon: "🔑",
    color: "blue",
    span: "lg:col-span-5",
  },
  {
    key: "alpha" as const,
    icon: "📊",
    color: "amber",
    span: "lg:col-span-7",
  },
];

const colorMap: Record<string, { bg: string; border: string; tag: string }> = {
  red: {
    bg: "bg-red-500/5 dark:bg-red-500/10",
    border: "border-red-500/20 dark:border-red-500/30",
    tag: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  purple: {
    bg: "bg-purple-500/5 dark:bg-purple-500/10",
    border: "border-purple-500/20 dark:border-purple-500/30",
    tag: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  blue: {
    bg: "bg-blue-500/5 dark:bg-blue-500/10",
    border: "border-blue-500/20 dark:border-blue-500/30",
    tag: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  amber: {
    bg: "bg-amber-500/5 dark:bg-amber-500/10",
    border: "border-amber-500/20 dark:border-amber-500/30",
    tag: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
};

export default function Services() {
  const { t } = useLocale();

  return (
    <section id="services" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
            {t.services.title}
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto">
            {t.services.subtitle}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {services.map((service) => {
            const colors = colorMap[service.color];
            const content = t.services[service.key];
            return (
              <div
                key={service.key}
                className={`${service.span} ${colors.bg} rounded-3xl border ${colors.border} p-8 group hover:scale-[1.01] transition-transform duration-300`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="text-4xl">{service.icon}</div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${colors.tag}`}
                  >
                    {content.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                  {content.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                  {content.desc}
                </p>
                <button className="px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                  {t.services.comingSoon} →
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
