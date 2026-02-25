"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { products, getProductBySlug } from "@/data/products";
import { useParams } from "next/navigation";

export default function ProductDetailPage() {
  const { locale, t } = useLocale();
  const params = useParams();
  const slug = params.slug as string;
  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 text-lg mb-4">Product not found</p>
          <Link href="/products" className="cta-button px-6 py-3 rounded-full text-sm font-medium inline-block">
            {t.products.backToProducts}
          </Link>
        </div>
      </main>
    );
  }

  const savings = product.originalPrice - product.price;
  const related = products.filter(
    (p) => p.category === product.category && p.slug !== product.slug
  );

  return (
    <main className="min-h-screen bg-black relative pt-28 pb-20 px-4">
      {/* Glow orbs */}
      <div className="glow-orb glow-orb-red w-[400px] h-[400px] -top-20 right-1/4 opacity-20" />
      <div className="glow-orb glow-orb-purple w-[350px] h-[350px] bottom-40 left-10 opacity-15" />

      {/* Background text */}
      <div className="bg-text top-24 right-8 text-right">{product.icon}</div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back link */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm mb-10 animate-fade-in"
        >
          {t.products.backToProducts}
        </Link>

        {/* Hero section */}
        <div className="glass-card rounded-3xl p-8 lg:p-12 mb-8 animate-fade-in animate-delay-100">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Icon + tag */}
            <div className="flex flex-col items-center lg:items-start gap-4 shrink-0">
              <div className="text-7xl lg:text-8xl">{product.icon}</div>
              <span className="glass-pill px-4 py-1.5 rounded-full text-sm font-medium text-[#E74C3C]">
                {product.tag[locale]}
              </span>
            </div>

            {/* Right: Name + price + desc */}
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 text-glow-white">
                {product.name[locale]}
              </h1>

              <div className="flex items-baseline gap-3 mb-6">
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

              <p className="text-white/60 leading-relaxed text-lg">
                {product.longDesc[locale]}
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="glass-card rounded-3xl p-8 lg:p-12 mb-8 animate-fade-in animate-delay-200">
          <h2 className="text-2xl font-bold text-white mb-6">
            {t.products.features}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {product.features[locale].map((feature, i) => (
              <div
                key={i}
                className="flex items-start gap-3 text-white/70"
              >
                <span className="text-green-400 shrink-0 mt-0.5">✅</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Includes */}
        <div className="glass-card rounded-3xl p-8 lg:p-12 mb-8 animate-fade-in animate-delay-300">
          <h2 className="text-2xl font-bold text-white mb-6">
            {t.products.includes}
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

        {/* CTA */}
        <div className="text-center mb-16 animate-fade-in animate-delay-400">
          {product.stripeLink !== undefined && product.stripeLink !== "" ? (
            <a
              href={product.stripeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button px-10 py-4 rounded-full text-lg font-bold inline-block"
            >
              {t.products.buyNow} ${product.price} →
            </a>
          ) : (
            <a
              href="https://t.me/+2p-LBUUrJ1BjMjNl"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button px-10 py-4 rounded-full text-lg font-bold inline-block"
            >
              {t.products.buyNow} ${product.price} →
            </a>
          )}
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="animate-fade-in animate-delay-500">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              {t.products.relatedProducts}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((rp) => (
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
                      <p className="text-white/40 text-sm mt-1">
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
    </main>
  );
}
