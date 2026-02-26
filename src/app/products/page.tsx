"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { products } from "@/data/products";
import StockCounter from "@/components/StockCounter";

export default function ProductsPage() {
  const { locale, t } = useLocale();

  return (
    <main className="min-h-screen bg-black relative pt-28 pb-20 px-4">
      {/* Glow orbs */}
      <div className="glow-orb glow-orb-purple w-[500px] h-[500px] -top-40 left-1/4 opacity-25" />
      <div className="glow-orb glow-orb-red w-[300px] h-[300px] bottom-20 right-10 opacity-20" />
      <div className="glow-orb glow-orb-blue w-[400px] h-[400px] top-1/2 -left-20 opacity-15" />

      {/* Background text */}
      <div className="bg-text top-24 right-8 text-right">Products</div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm mb-6"
          >
            <span>🦞</span>
            <span>养虾户</span>
          </Link>
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 text-glow-white">
            {t.products.title}
          </h1>
          <p className="text-white/40 max-w-lg mx-auto text-lg">
            {t.products.subtitle}
          </p>
        </div>

        {/* Product cards — 3 products, no filter needed */}
        <div className="flex flex-col gap-8">
          {products.map((product, i) => {
            const savings = product.originalPrice - product.price;
            const isStarter = product.category === "starter";
            const isBundle = product.category === "bundle";

            return (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="glass-card rounded-3xl p-8 lg:p-10 group animate-fade-in block relative overflow-hidden"
                style={{ animationDelay: `${(i + 1) * 150}ms` }}
              >
                {/* Starter Pack special highlight */}
                {isStarter && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E74C3C] via-[#ff6b4a] to-[#E74C3C]" />
                )}
                {/* Bundle highlight */}
                {isBundle && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9b59b6] via-[#8e44ad] to-[#9b59b6]" />
                )}

                {/* Stock counter for starter pack */}
                {isStarter && (
                  <div className="mb-6">
                    <StockCounter />
                  </div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Left: Icon */}
                  <div className="text-5xl lg:text-6xl shrink-0">
                    {product.icon}
                  </div>

                  {/* Middle: Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <h3 className="text-xl lg:text-2xl font-bold text-white group-hover:text-[#E74C3C] transition-colors">
                        {product.name[locale]}
                      </h3>
                      <span className="glass-pill px-3 py-1 rounded-full text-xs font-medium text-white/60">
                        {product.tag[locale]}
                      </span>
                      {isStarter && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E74C3C]/20 text-[#E74C3C] border border-[#E74C3C]/30 animate-pulse">
                          🔥 $1
                        </span>
                      )}
                      {isBundle && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                          {t.products.save} ${savings}
                        </span>
                      )}
                    </div>

                    <p className="text-white/50 mb-5 leading-relaxed text-sm lg:text-base max-w-2xl">
                      {product.desc[locale]}
                    </p>

                    {/* Quick feature highlights */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.features[locale].slice(0, 4).map((feat, fi) => (
                        <span
                          key={fi}
                          className="text-xs text-white/40 bg-white/5 px-3 py-1.5 rounded-full"
                        >
                          {feat.replace(/🎁\s*/, "").split("—")[0].split("(")[0].trim()}
                        </span>
                      ))}
                      {product.features[locale].length > 4 && (
                        <span className="text-xs text-white/30 px-3 py-1.5">
                          +{product.features[locale].length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Price + CTA */}
                  <div className="flex lg:flex-col items-center lg:items-end gap-4 shrink-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl lg:text-4xl font-bold text-[#E74C3C] stat-glow">
                        ${product.price}
                      </span>
                      <span className="text-sm text-white/30 line-through">
                        ${product.originalPrice}
                      </span>
                    </div>
                    <span className="glass-pill px-6 py-2.5 rounded-full text-sm font-medium text-white/70 group-hover:text-white group-hover:border-white/30 transition-all whitespace-nowrap">
                      {t.products.viewDetails} →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
