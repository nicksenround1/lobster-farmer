import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return NextResponse.json({ error: "STRIPE_SECRET_KEY not set", hasKey: false });
  }

  try {
    const stripe = new Stripe(key);
    const sessions = await stripe.checkout.sessions.list({
      limit: 5,
      status: "complete",
    });

    return NextResponse.json({
      hasKey: true,
      keyPrefix: key.substring(0, 8) + "...",
      sessionCount: sessions.data.length,
      sessions: sessions.data.map((s) => ({
        id: s.id.substring(0, 25),
        email: s.customer_details?.email || "null",
        amount: s.amount_total,
        status: s.status,
      })),
    });
  } catch (err) {
    return NextResponse.json({ error: String(err).substring(0, 300), hasKey: true });
  }
}
