"use client";

import { useLocale } from "@/context/LocaleContext";

export default function Hero() {
  const { t } = useLocale();

  return (
    <section className="min-h-screen flex items-center justify-center pt-20 px-4 relative overflow-hidden">
      {/* Glow orbs */}
      <div className="glow-orb glow-orb-red w-[500px] h-[500px] -top-20 -right-20 opacity-40" />
      <div className="glow-orb glow-orb-purple w-[400px] h-[400px] top-1/3 -left-40 opacity-30" />
      <div className="glow-orb glow-orb-blue w-[300px] h-[300px] bottom-20 right-1/4 opacity-20" />

      {/* Giant background text */}
      <div className="bg-text top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
        养虾户
      </div>

      <div className="max-w-4xl w-full mx-auto text-center relative z-10">
        {/* Badge */}
        <div className="animate-fade-in inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pill text-xs font-medium text-white/80 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#E74C3C] animate-pulse" />
          AI Agent Builder
        </div>

        {/* Title */}
        <h1 className="animate-fade-in animate-delay-100 text-6xl sm:text-7xl lg:text-8xl font-bold text-white mb-3 text-glow">
          {t.hero.title}
        </h1>

        <p className="animate-fade-in animate-delay-200 text-2xl sm:text-3xl font-light text-white/40 mb-6">
          {t.hero.subtitle}
        </p>

        <p className="animate-fade-in animate-delay-300 text-lg sm:text-xl text-white/70 mb-3 max-w-xl mx-auto">
          {t.hero.tagline}
        </p>

        <p className="animate-fade-in animate-delay-300 text-sm text-white/40 mb-10">
          {t.hero.description}
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-in animate-delay-400 flex flex-wrap justify-center gap-4 mb-12">
          <a
            href="https://t.me/+2p-LBUUrJ1BjMjNl"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-button inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-medium text-sm"
          >
            🦞 {t.hero.cta}
          </a>
          <a
            href="#services"
            className="glass-pill inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-medium text-sm text-white/80 hover:text-white"
          >
            {t.hero.learnMore} ↓
          </a>
        </div>

        {/* Social pills */}
        <div className="animate-fade-in animate-delay-500 flex justify-center gap-3">
          <a
            href="https://x.com/ckn_acee"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-pill inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm text-white/60 hover:text-white"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            @ckn_acee
          </a>
          <a
            href="https://t.me/+2p-LBUUrJ1BjMjNl"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-pill inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm text-white/60 hover:text-white"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.492-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
            Telegram
          </a>
        </div>
      </div>
    </section>
  );
}
