"use client";

import { useLocale } from "@/context/LocaleContext";

export default function Contact() {
  const { t } = useLocale();

  const contacts = [
    {
      href: "https://x.com/ckn_acee",
      label: t.contact.twitter,
      sub: "@ckn_acee",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      href: "https://t.me/+2p-LBUUrJ1BjMjNl",
      label: t.contact.telegram,
      sub: "养虾户基地",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.492-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
    },
    {
      href: "mailto:support@lobsterfarmer.com",
      label: t.contact.email,
      sub: "support@lobsterfarmer.com",
      icon: <span className="text-lg">📧</span>,
    },
  ];

  return (
    <section id="contact" className="py-24 px-4 relative overflow-hidden">
      {/* Glow orb */}
      <div className="glow-orb glow-orb-red w-[350px] h-[350px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15" />

      {/* Background text */}
      <div className="bg-text top-8 right-8">Contact</div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-14 animate-fade-in">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3 text-glow-white">
            {t.contact.title}
          </h2>
          <p className="text-white/40 text-lg">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 max-w-3xl mx-auto">
          {contacts.map((c, i) => {
            const Card = c.href ? "a" : "div";
            const linkProps = c.href
              ? { href: c.href, target: "_blank" as const, rel: "noopener noreferrer" }
              : {};
            return (
              <Card
                key={i}
                {...linkProps}
                className={`glass-card rounded-2xl p-6 text-center group animate-fade-in animate-delay-${(i + 1) * 100}`}
              >
                <div className="w-12 h-12 rounded-xl glass-pill mx-auto mb-4 flex items-center justify-center text-white/70 group-hover:text-white transition-colors">
                  {c.icon}
                </div>
                <p className="font-medium text-white group-hover:text-[#E74C3C] transition-colors">
                  {c.label}
                </p>
                <p className="text-sm text-white/30 mt-1">{c.sub}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
