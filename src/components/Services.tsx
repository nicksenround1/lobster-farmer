"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { products } from "@/data/products";

const featuredSlugs = ["starter-pack", "alpha-hunter-pro", "entrepreneur-pro", "ultimate-bundle"];

export default function Services() {
  const { locale, t } = useLocale();

  const featured = featuredSlugs
    .map((slug) => products.find((p) => p.slug === slug)!)
    .filter(Boolean);

  return (
    <section id="services" className="py-24 px-4 relative overflow-hidden">
      {/* Glow orbs */}
      <div className="glow-orb glow-orb-purple w-[500px] h-[500px] -top-40 left-1/4 opacity-25" />
      <div className="glow-orb glow-orb-red w-[300px] h-[300px] bottom-0 right-10 opacity-20" />

      {/* Background text */}
      <div className="bg-text top-12 right-8 text-right">Services</div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4 text-glow-white">
            {t.services.title}
          </h2>
          <p className="text-white/40 max-w-lg mx-auto text-lg">
            {t.services.subtitle}
          </p>
        </div>

        {/* Service Cards — data-driven from products.ts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featured.map((product, i) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className={`glass-card rounded-3xl p-8 group animate-fade-in block`}
              style={{ animationDelay: `${(i + 1) * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="text-4xl">{product.icon}</div>
                <div className="flex items-center gap-2">
                  {product.slug === "starter-pack" && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E74C3C]/20 text-[#E74C3C] border border-[#E74C3C]/30 animate-pulse">
                      🔥 {t.services.first100}
                    </span>
                  )}
                  <span className="glass-pill px-3 py-1 rounded-full text-xs font-medium text-white/60">
                    {product.tag[locale]}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#E74C3C] transition-colors">
                {product.name[locale]}
              </h3>
              <p className="text-white/50 mb-8 leading-relaxed">
                {product.desc[locale]}
              </p>
              <div className="flex items-center gap-3">
                <span className="cta-button px-6 py-2.5 rounded-full text-sm font-medium inline-block">
                  {t.services.buyNow} ${product.price} →
                </span>
                <span className="text-sm text-white/30 line-through">
                  ${product.originalPrice}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* View all products link */}
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
