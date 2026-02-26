"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/context/LocaleContext";

interface StockData {
  sold: number;
  total: number;
  remaining: number;
  soldOut: boolean;
}

export default function StockCounter() {
  const { locale } = useLocale();
  const [stock, setStock] = useState<StockData | null>(null);

  useEffect(() => {
    fetch("/api/stock")
      .then((r) => r.json())
      .then(setStock)
      .catch(() => {});
  }, []);

  if (!stock) return null;

  const pct = Math.min(100, (stock.sold / stock.total) * 100);

  if (stock.soldOut) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-center">
        <p className="text-red-400 font-bold text-sm">
          {locale === "zh" ? "🔥 限量 100 份已售罄！恢复原价 $20" : "🔥 Limited 100 copies sold out! Price restored to $20"}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#E74C3C]/5 border border-[#E74C3C]/20 rounded-xl px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/70 text-sm">
          {locale === "zh" ? "🔥 限前 100 位 · $1 特价" : "🔥 First 100 only · $1 special"}
        </span>
        <span className="text-[#E74C3C] font-bold text-sm">
          {stock.sold}/{stock.total}
        </span>
      </div>
      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#E74C3C] to-[#ff6b6b] rounded-full transition-all duration-1000"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-white/40 text-xs mt-1.5">
        {locale === "zh"
          ? `仅剩 ${stock.remaining} 份 · 售完恢复原价 $20`
          : `Only ${stock.remaining} left · Price returns to $20 after`}
      </p>
    </div>
  );
}
