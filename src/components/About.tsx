"use client";

import { useLocale } from "@/context/LocaleContext";

export default function About() {
  const { t } = useLocale();

  const stats = [
    { value: t.about.highlight1, label: t.about.highlight1Label, emoji: "🦞" },
    { value: t.about.highlight2, label: t.about.highlight2Label, emoji: "🤖" },
    { value: t.about.highlight3, label: t.about.highlight3Label, emoji: "📡" },
  ];

  return (
    <section id="about" className="py-24 px-4 relative overflow-hidden">
      {/* Glow orb */}
      <div className="glow-orb glow-orb-blue w-[400px] h-[400px] top-0 right-0 opacity-20" />

      {/* Background text */}
      <div className="bg-text top-8 left-8">About</div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Main glass card */}
        <div className="glass-card rounded-3xl p-8 lg:p-12 mb-8 animate-fade-in">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8 text-glow-white">
            {t.about.title}
          </h2>
          <div className="space-y-5 text-white/60 leading-relaxed text-lg">
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
            <p className="text-[#E74C3C] font-medium">
              {t.about.p3}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`glass-card rounded-2xl p-6 text-center animate-fade-in animate-delay-${(i + 1) * 100}`}
            >
              <div className="text-3xl mb-3">{stat.emoji}</div>
              <p className="text-4xl font-bold text-white stat-glow mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-white/40">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
