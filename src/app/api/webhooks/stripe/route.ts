import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret || !sig) {
      return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
    }

    const event = JSON.parse(body);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const email = session.metadata?.email;
        const tier = session.metadata?.tier;
        console.log(`Subscription activated: ${email} -> ${tier}`);
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        console.log(`Subscription updated: ${subscription.id} status=${subscription.status}`);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        console.log(`Subscription canceled: ${subscription.id}`);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object;
        console.log(`Payment failed for invoice: ${invoice.id}`);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 400 });
  }
}
