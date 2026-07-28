import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
const nextAuthUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, { apiVersion: "2025-01-27" as any }) : null;

export async function POST() {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe provayderi hələ quraşdırılmayıb." },
      { status: 500 }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Giriş etməlisiniz." }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "İstifadəçi tapılmadı." }, { status: 404 });
    }

    if (!user.stripeCustomerId) {
      return NextResponse.json({ 
        error: "Ödəniş profiliniz tapılmadı. Zəhmət olmasa əvvəlcə abunə olun.",
        code: "NO_CUSTOMER" 
      }, { status: 400 });
    }

    // Portal Session yaradırıq
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${nextAuthUrl}/settings`,
    });

    return NextResponse.json({ success: true, url: portalSession.url });
  } catch (error: any) {
    console.error("Stripe Portal Xətası:", error);
    return NextResponse.json({ error: `Portal xətası: ${error.message}` }, { status: 500 });
  }
}
