"use client";

import { useLocale } from "@/context/LocaleContext";

export default function Community() {
  const { t } = useLocale();

  return (
    <section id="community" className="py-24 px-4 relative overflow-hidden">
      {/* Glow orbs */}
      <div className="glow-orb glow-orb-blue w-[500px] h-[500px] top-0 left-1/3 opacity-20" />
      <div className="glow-orb glow-orb-purple w-[300px] h-[300px] bottom-0 right-1/4 opacity-15" />

      {/* Background text */}
      <div className="bg-text top-8 left-1/2 -translate-x-1/2">Community</div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="glass-card rounded-3xl p-10 lg:p-14 text-center animate-fade-in">
          {/* Decorative lobster */}
          <div className="text-6xl mb-6 opacity-80">🦞</div>

          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-5 text-glow-white">
            {t.community.title}
          </h2>
          <p className="text-white/50 max-w-xl mx-auto mb-10 leading-relaxed text-lg">
            {t.community.desc}
          </p>

          <a
            href="https://t.me/+2p-LBUUrJ1BjMjNl"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-button inline-flex items-center gap-3 px-10 py-4 rounded-full font-medium text-lg mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.492-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
            {t.community.join}
          </a>

          <p className="text-sm text-white/30">
            {t.community.members}
          </p>
        </div>
      </div>
    </section>
  );
}
