"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { products, Product } from "@/data/products";

type Filter = "all" | Product["category"];

export default function ProductsPage() {
  const { locale, t } = useLocale();
  const [filter, setFilter] = useState<Filter>("all");

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: t.products.filterAll },
    { key: "starter", label: t.products.filterStarter },
    { key: "core", label: t.products.filterCore },
    { key: "premium", label: t.products.filterPremium },
    { key: "bundle", label: t.products.filterBundle },
  ];

  const filtered =
    filter === "all" ? products : products.filter((p) => p.category === filter);

  return (
    <main className="min-h-screen bg-black relative pt-28 pb-20 px-4">
      {/* Glow orbs */}
      <div className="glow-orb glow-orb-purple w-[500px] h-[500px] -top-40 left-1/4 opacity-25" />
      <div className="glow-orb glow-orb-red w-[300px] h-[300px] bottom-20 right-10 opacity-20" />
      <div className="glow-orb glow-orb-blue w-[400px] h-[400px] top-1/2 -left-20 opacity-15" />

      {/* Background text */}
      <div className="bg-text top-24 right-8 text-right">Products</div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
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

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 animate-fade-in animate-delay-100">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f.key
                  ? "cta-button"
                  : "glass-pill text-white/60 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((product, i) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className={`glass-card rounded-3xl p-8 group animate-fade-in block`}
              style={{ animationDelay: `${(i + 1) * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="text-4xl">{product.icon}</div>
                <span className="glass-pill px-3 py-1 rounded-full text-xs font-medium text-white/60">
                  {product.tag[locale]}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#E74C3C] transition-colors">
                {product.name[locale]}
              </h3>

              <p className="text-white/50 mb-6 leading-relaxed text-sm">
                {product.desc[locale]}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#E74C3C] stat-glow">
                    ${product.price}
                  </span>
                  <span className="text-sm text-white/30 line-through">
                    ${product.originalPrice}
                  </span>
                </div>
                <span className="glass-pill px-4 py-2 rounded-full text-sm font-medium text-white/70 group-hover:text-white group-hover:border-white/30 transition-all">
                  {t.products.viewDetails} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
