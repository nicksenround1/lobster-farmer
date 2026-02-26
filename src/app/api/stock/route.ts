import { NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

// Cache for 60 seconds to avoid hammering Stripe
let cache: { count: number; ts: number } | null = null;
const CACHE_TTL = 60_000;

export async function GET() {
  const now = Date.now();

  if (cache && now - cache.ts < CACHE_TTL) {
    return NextResponse.json({
      sold: cache.count,
      total: 100,
      remaining: Math.max(0, 100 - cache.count),
      soldOut: cache.count >= 100,
    });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ sold: 0, total: 100, remaining: 100, soldOut: false });
  }

  try {
    let count = 0;
    let hasMore = true;
    let startingAfter: string | undefined;

    while (hasMore) {
      const params: Stripe.Checkout.SessionListParams = {
        limit: 100,
        status: "complete",
      };
      if (startingAfter) params.starting_after = startingAfter;

      const batch = await stripe.checkout.sessions.list(params);
      // Count starter packs (amount <= $1.50 = 150 cents)
      count += batch.data.filter((s) => (s.amount_total || 0) <= 150).length;
      hasMore = batch.has_more;
      if (batch.data.length > 0) {
        startingAfter = batch.data[batch.data.length - 1].id;
      }
    }

    cache = { count, ts: now };

    return NextResponse.json({
      sold: count,
      total: 100,
      remaining: Math.max(0, 100 - count),
      soldOut: count >= 100,
    });
  } catch (err) {
    console.error("Stock check error:", err);
    return NextResponse.json({ sold: 0, total: 100, remaining: 100, soldOut: false });
  }
}
