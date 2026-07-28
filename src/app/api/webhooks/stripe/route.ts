import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, { apiVersion: "2025-01-27" as any }) : null;

export async function POST(req: NextRequest) {
  if (!stripe || !webhookSecret) {
    console.warn("Stripe webhook açarları (.env) konfiqurasiya edilməyib. Webhook çağırıla bilmədi.");
    return NextResponse.json(
      { error: "Stripe or Webhook secret is not configured in .env" },
      { status: 500 }
    );
  }

  const payload = await req.text();
  const sig = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err: any) {
    console.error("Stripe Webhook imza təsdiqlənməsi uğursuz oldu:", err.message);
    return NextResponse.json({ error: `Webhook Signature Verification Error: ${err.message}` }, { status: 400 });
  }

  try {
    // 1. Checkout Session tamamlananda abunəliyə uyğun statusu yeniləyirik
    if (event.type === "checkout.session.completed") {
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      const stripeCustomerId = checkoutSession.customer as string;
      const plan = checkoutSession.metadata?.plan || "PRO"; // Default olaraq PRO

      console.log(`Webhook: Checkout session completed for customer: ${stripeCustomerId}, plan: ${plan}`);

      // Müştəri ID-si ilə istifadəçini tapıb statusu yeniləyirik
      await prisma.user.update({
        where: { stripeCustomerId },
        data: { 
          subscriptionStatus: plan,
          stripeSubscriptionId: checkoutSession.subscription as string
        },
      });
    }

    // 2. Abunəlik ləğv ediləndə və ya vaxtı bitəndə statusu yenidən "STARTER"-ə salırıq
    if (event.type === "customer.subscription.deleted" || event.type === "customer.subscription.paused") {
      const subscription = event.data.object as Stripe.Subscription;
      const stripeCustomerId = subscription.customer as string;

      console.log(`Webhook: Subscription deleted/paused for customer: ${stripeCustomerId}`);

      await prisma.user.update({
        where: { stripeCustomerId },
        data: { subscriptionStatus: "STARTER" },
      });
    }

    // 3. Mövcud abunəliyin planı dəyişəndə (Update olanda)
    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;
      const stripeCustomerId = subscription.customer as string;

      console.log(`Webhook: Subscription updated for customer: ${stripeCustomerId}`);
      
      // Əgər abunəlik aktivdirsə və ödəniş uğurludursa
      if (subscription.status === "active") {
        // Bu hissədə priceId-yə görə PRO/ENTERPRISE təyin edilə bilər
        // Lakin sadəlik üçün webhook event-dən asılı olaraq statusu aktiv saxlayırıq
        await prisma.user.update({
          where: { stripeCustomerId },
          data: { subscriptionStatus: subscription.cancel_at_period_end ? "STARTER" : undefined },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Stripe Webhook Məlumat Emalı Xətası:", error);
    return NextResponse.json({ error: `Webhook handler failed: ${error.message}` }, { status: 500 });
  }
}
