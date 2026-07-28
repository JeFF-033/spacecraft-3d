import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
const proPriceId = process.env.STRIPE_PRO_PRICE_ID || "price_dummy_pro";
const enterprisePriceId = process.env.STRIPE_ENTERPRISE_PRICE_ID || "price_dummy_enterprise";
const nextAuthUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, { apiVersion: "2025-01-27" as any }) : null;

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe provayderi hələ quraşdırılmayıb. .env daxilində STRIPE_SECRET_KEY təyin edin." },
      { status: 500 }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Giriş etməlisiniz." }, { status: 401 });
  }

  try {
    const { plan } = await req.json(); // "PRO" və ya "ENTERPRISE"
    if (plan !== "PRO" && plan !== "ENTERPRISE") {
      return NextResponse.json({ error: "Yanlış paket seçimi." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "İstifadəçi tapılmadı." }, { status: 404 });
    }

    // Paketə görə qiymət ID-si təyin edilir
    const priceId = plan === "PRO" ? proPriceId : enterprisePriceId;

    // Əgər istifadəçinin artıq stripeCustomerId-si yoxdursa, yeni müştəri yaradaq
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        name: user.name || undefined,
        metadata: { userId: user.id },
      });
      stripeCustomerId = customer.id;
      
      // Müştəri ID-sini bazaya yazaq
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      });
    }

    // Checkout Session yaradırıq
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${nextAuthUrl}/dashboard?payment=success`,
      cancel_url: `${nextAuthUrl}/pricing?payment=cancel`,
      metadata: {
        userId: user.id,
        plan,
      },
    });

    return NextResponse.json({ success: true, url: checkoutSession.url });
  } catch (error: any) {
    console.error("Stripe Checkout Xətası:", error);
    return NextResponse.json({ error: `Checkout xətası: ${error.message}` }, { status: 500 });
  }
}
