"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { products } from "@/data/products";

export default function Services() {
  const { locale, t } = useLocale();

  return (
    <section id="services" className="py-24 px-4 relative overflow-hidden">
      {/* Glow orbs */}
      <div className="glow-orb glow-orb-purple w-[500px] h-[500px] -top-40 left-1/4 opacity-25" />
      <div className="glow-orb glow-orb-red w-[300px] h-[300px] bottom-0 right-10 opacity-20" />

      {/* Background text */}
      <div className="bg-text top-12 right-8 text-right">Products</div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4 text-glow-white">
            {t.services.title}
          </h2>
          <p className="text-white/40 max-w-lg mx-auto text-lg">
            {t.services.subtitle}
          </p>
        </div>

        {/* 3 Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product, i) => {
            const isStarter = product.category === "starter";
            const isBundle = product.category === "bundle";
            const savings = product.originalPrice - product.price;

            return (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className={`glass-card rounded-3xl p-8 group animate-fade-in block relative overflow-hidden ${
                  isStarter ? "md:ring-1 md:ring-[#E74C3C]/30" : ""
                }`}
                style={{ animationDelay: `${(i + 1) * 100}ms` }}
              >
                {/* Top accent bar for Starter */}
                {isStarter && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E74C3C] via-[#ff6b4a] to-[#E74C3C]" />
                )}

                <div className="flex items-start justify-between mb-5">
                  <div className="text-4xl">{product.icon}</div>
                  <div className="flex flex-col items-end gap-2">
                    {isStarter && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#E74C3C]/20 text-[#E74C3C] border border-[#E74C3C]/30 animate-pulse whitespace-nowrap">
                        🔥 {t.services.first100}
                      </span>
                    )}
                    {isBundle && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 whitespace-nowrap">
                        💰 {t.products.save} ${savings}
                      </span>
                    )}
                    <span className="glass-pill px-3 py-1 rounded-full text-xs font-medium text-white/60">
                      {product.tag[locale]}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#E74C3C] transition-colors">
                  {product.name[locale]}
                </h3>

                <p className="text-white/50 mb-6 leading-relaxed text-sm line-clamp-3">
                  {product.desc[locale]}
                </p>

                {/* Quick features */}
                <div className="space-y-1.5 mb-6">
                  {product.features[locale].slice(0, 3).map((feat, fi) => (
                    <div
                      key={fi}
                      className="flex items-start gap-2 text-xs text-white/40"
                    >
                      <span className="text-green-400 shrink-0">✓</span>
                      <span className="line-clamp-1">
                        {feat.replace(/🎁\s*/, "")}
                      </span>
                    </div>
                  ))}
                  {product.features[locale].length > 3 && (
                    <p className="text-xs text-white/25 pl-5">
                      +{product.features[locale].length - 3} more...
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-auto">
                  <span className="cta-button px-5 py-2.5 rounded-full text-sm font-medium inline-block">
                    {t.services.buyNow} ${product.price} →
                  </span>
                  <span className="text-sm text-white/30 line-through">
                    ${product.originalPrice}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View all link */}
        <div className="text-center mt-10 animate-fade-in animate-delay-600">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-white/50 hover:text-[#E74C3C] transition-colors text-lg font-medium"
          >
            {t.services.viewAll} →
          </Link>
        </div>
      </div>
    </section>
  );
}
