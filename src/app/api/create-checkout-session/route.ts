import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { priceId, email, tier } = await req.json();

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json(
        { error: "Stripe not configured", tier, activated: true },
        { status: 200 }
      );
    }

    const session = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "payment_method_types[0]": "card",
        mode: "subscription",
        "line_items[0][price]": priceId,
        "line_items[0][quantity]": "1",
        customer_email: email,
        success_url: `${req.nextUrl.origin}/pricing?success=true&tier=${tier}`,
        cancel_url: `${req.nextUrl.origin}/pricing?canceled=true`,
        "metadata[tier]": tier,
        "metadata[email]": email,
      }),
    });

    const data = await session.json();
    if (data.url) {
      return NextResponse.json({ url: data.url });
    }

    return NextResponse.json({ error: data.error?.message || "Failed to create session" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
