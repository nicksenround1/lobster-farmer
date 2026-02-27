"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { products, getProductBySlug } from "@/data/products";
import StockCounter from "@/components/StockCounter";
import { useParams } from "next/navigation";
import { appendRefToLink } from "@/lib/referral";

export default function ProductDetailPage() {
  const { locale, t } = useLocale();
  const params = useParams();
  const slug = params.slug as string;
  const product = getProductBySlug(slug);
  const [buyLink, setBuyLink] = useState("");

  useEffect(() => {
    if (product) {
      setBuyLink(appendRefToLink(product.stripeLink));
    }
  }, [product]);

  if (!product) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 text-lg mb-4">Product not found</p>
          <Link
            href="/products"
            className="cta-button px-6 py-3 rounded-full text-sm font-medium inline-block"
          >
            {t.products.backToProducts}
          </Link>
        </div>
      </main>
    );
  }

  const savings = product.originalPrice - product.price;
  const otherProducts = products.filter((p) => p.slug !== product.slug);

  return (
    <main className="min-h-screen bg-black relative pt-28 pb-32 lg:pb-20 px-4">
      {/* Glow orbs */}
      <div className="glow-orb glow-orb-red w-[400px] h-[400px] -top-20 right-1/4 opacity-20" />
      <div className="glow-orb glow-orb-purple w-[350px] h-[350px] bottom-40 left-10 opacity-15" />
      <div className="glow-orb glow-orb-blue w-[300px] h-[300px] top-1/3 -right-20 opacity-10" />

      {/* Background text */}
      <div className="bg-text top-24 right-8 text-right">{product.icon}</div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Back link */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm mb-10 animate-fade-in"
        >
          {t.products.backToProducts}
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ─── Main content (left) ─── */}
          <div className="flex-1 min-w-0">
            {/* Hero section */}
            <div className="glass-card rounded-3xl p-8 lg:p-12 mb-8 animate-fade-in animate-delay-100">
              <div className="flex items-start gap-6 mb-6">
                <div className="text-6xl lg:text-7xl shrink-0">
                  {product.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="glass-pill px-3 py-1 rounded-full text-xs font-medium text-[#E74C3C]">
                      {product.tag[locale]}
                    </span>
                    {product.category === "starter" && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E74C3C]/20 text-[#E74C3C] border border-[#E74C3C]/30 animate-pulse">
                        {t.products.limited}
                      </span>
                    )}
                    {product.category === "bundle" && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                        {t.products.bestValue}
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 text-glow-white">
                    {product.name[locale]}
                  </h1>
                  <p className="text-white/50 text-lg">
                    {product.oneLiner[locale]}
                  </p>
                </div>
              </div>

              {/* Price (visible on desktop in hero, mobile uses sticky bottom) */}
              <div className="hidden lg:flex items-baseline gap-3">
                <span className="text-4xl font-bold text-[#E74C3C] stat-glow">
                  ${product.price}
                </span>
                <span className="text-lg text-white/30 line-through">
                  ${product.originalPrice}
                </span>
                <span className="glass-pill px-3 py-1 rounded-full text-xs font-medium text-green-400">
                  {t.products.save} ${savings}
                </span>
              </div>
            </div>

            {/* ─── About ─── */}
            <div className="glass-card rounded-3xl p-8 lg:p-12 mb-8 animate-fade-in animate-delay-200">
              <h2 className="text-2xl font-bold text-white mb-6">
                {t.products.aboutTitle}
              </h2>
              <div className="space-y-4">
                {product.about[locale].map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-white/60 leading-relaxed text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* ─── Core Highlights ─── */}
            <div className="glass-card rounded-3xl p-8 lg:p-12 mb-8 animate-fade-in animate-delay-300">
              <h2 className="text-2xl font-bold text-white mb-6">
                {t.products.highlightsTitle}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.highlights[locale].map((h, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]"
                  >
                    <span className="text-[#E74C3C] text-lg shrink-0 mt-0.5">
                      ◆
                    </span>
                    <div>
                      <h4 className="text-white font-semibold text-sm mb-1">
                        {h.title}
                      </h4>
                      <p className="text-white/40 text-sm">{h.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── Skills Included ─── */}
            {product.skillsIncluded.length > 0 && (
              <div className="glass-card rounded-3xl p-8 lg:p-12 mb-8 animate-fade-in animate-delay-400">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {t.products.skillsTitle}
                </h2>
                <div className="space-y-4">
                  {product.skillsIncluded.map((skill, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]"
                    >
                      <span className="text-green-400 shrink-0 mt-0.5 text-lg">
                        🎁
                      </span>
                      <div>
                        <h4 className="text-white font-semibold text-sm mb-1">
                          {skill.name}
                        </h4>
                        <p className="text-white/40 text-sm">
                          {skill.desc[locale]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── Anti-patterns / Differentiation ─── */}
            {product.antiPatterns && (
              <div className="glass-card rounded-3xl p-8 lg:p-12 mb-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {t.products.antiPatternsTitle}
                </h2>
                <div className="space-y-3">
                  {product.antiPatterns[locale].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-[#E74C3C] shrink-0 mt-1">⚡</span>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── Proven Stats ─── */}
            <div className="glass-card rounded-3xl p-8 lg:p-12 mb-8 animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-6">
                {t.products.provenTitle}
              </h2>
              <div className="space-y-3">
                {product.provenStats[locale].map((stat, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-green-400 shrink-0 mt-0.5">✓</span>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {stat}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── What's Included ─── */}
            <div className="glass-card rounded-3xl p-8 lg:p-12 mb-8 animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-6">
                {t.products.whatsIncluded}
              </h2>
              <div className="flex flex-wrap gap-3">
                {product.includes[locale].map((item, i) => (
                  <span
                    key={i}
                    className="glass-pill px-4 py-2 rounded-full text-sm text-white/70"
                  >
                    📦 {item}
                  </span>
                ))}
              </div>
            </div>

            {/* ─── Version History ─── */}
            <div className="glass-card rounded-3xl p-8 lg:p-12 mb-8 animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-6">
                {t.products.versionHistoryTitle}
              </h2>
              <div className="space-y-4">
                {product.versionHistory.map((v, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 pb-4 border-b border-white/[0.05] last:border-0 last:pb-0"
                  >
                    <div className="shrink-0">
                      <span className="glass-pill px-3 py-1 rounded-full text-xs font-mono text-[#E74C3C]">
                        v{v.version}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white/60 text-sm">{v.desc[locale]}</p>
                      <p className="text-white/30 text-xs mt-1">{v.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── Creator ─── */}
            <div className="glass-card rounded-3xl p-8 lg:p-12 mb-8 animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-6">
                {t.products.creatorTitle}
              </h2>
              <div className="flex items-start gap-4">
                <div className="text-4xl shrink-0">🦞</div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-2">
                    {product.creator.name}
                  </h4>
                  <p className="text-white/50 text-sm leading-relaxed mb-3">
                    {product.creator.desc[locale]}
                  </p>
                  {product.creator.link && (
                    <a
                      href={product.creator.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#E74C3C] text-sm hover:underline"
                    >
                      {product.creator.link} →
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* ─── Other Products ─── */}
            {otherProducts.length > 0 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  {locale === "zh" ? "其他产品" : "Other Products"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {otherProducts.map((rp) => (
                    <Link
                      key={rp.slug}
                      href={`/products/${rp.slug}`}
                      className="glass-card rounded-3xl p-6 group block"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{rp.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white group-hover:text-[#E74C3C] transition-colors">
                            {rp.name[locale]}
                          </h3>
                          <p className="text-white/40 text-sm mt-1 line-clamp-2">
                            {rp.desc[locale]}
                          </p>
                          <div className="flex items-baseline gap-2 mt-3">
                            <span className="text-lg font-bold text-[#E74C3C]">
                              ${rp.price}
                            </span>
                            <span className="text-xs text-white/30 line-through">
                              ${rp.originalPrice}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ─── Sticky sidebar (desktop) ─── */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-28">
              <div className="glass-card rounded-3xl p-6">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-4">{product.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {product.name[locale]}
                  </h3>
                  <p className="text-white/40 text-xs">
                    {product.tag[locale]}
                  </p>
                </div>

                <div className="flex items-baseline justify-center gap-2 mb-6">
                  <span className="text-4xl font-bold text-[#E74C3C] stat-glow">
                    ${product.price}
                  </span>
                  <span className="text-sm text-white/30 line-through">
                    ${product.originalPrice}
                  </span>
                </div>

                <div className="text-center mb-4">
                  <span className="glass-pill px-3 py-1 rounded-full text-xs font-medium text-green-400">
                    {t.products.save} ${savings}
                  </span>
                </div>

                {product.category === "starter" && (
                  <div className="mb-4">
                    <StockCounter />
                  </div>
                )}

                <a
                  href={buyLink || product.stripeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-button w-full px-6 py-3.5 rounded-full text-base font-bold block text-center"
                >
                  {t.products.buyFor} ${product.price} →
                </a>

                {/* Quick includes */}
                <div className="mt-6 pt-6 border-t border-white/[0.05]">
                  <p className="text-white/40 text-xs font-medium mb-3 uppercase tracking-wide">
                    {t.products.whatsIncluded}
                  </p>
                  <div className="space-y-2">
                    {product.includes[locale].slice(0, 5).map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-xs text-white/50"
                      >
                        <span className="text-green-400 shrink-0">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                    {product.includes[locale].length > 5 && (
                      <p className="text-xs text-white/30">
                        +{product.includes[locale].length - 5} more...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Mobile sticky bottom CTA ─── */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden z-50 bg-black/80 backdrop-blur-xl border-t border-white/[0.05] px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#E74C3C] stat-glow">
              ${product.price}
            </span>
            <span className="text-sm text-white/30 line-through">
              ${product.originalPrice}
            </span>
            <span className="text-xs text-green-400">
              -{t.products.save}${savings}
            </span>
          </div>
          <a
            href={buyLink || product.stripeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-button px-8 py-3 rounded-full text-sm font-bold shrink-0"
          >
            {t.products.buyNow} →
          </a>
        </div>
      </div>
    </main>
  );
}
