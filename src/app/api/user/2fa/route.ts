import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { enabled, method, phone } = await req.json();

    if (!method || !["EMAIL", "SMS", "AUTHENTICATOR"].includes(method)) {
      return NextResponse.json({ error: "Keçərsiz doğrulama metodu." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "İstifadəçi tapılmadı." }, { status: 404 });
    }

    // Seçilmiş metod üzrə fərdi sahəni yeniləyirik
    const updateData: any = {};
    if (method === "EMAIL") {
      updateData.twoFactorEmailEnabled = !!enabled;
    } else if (method === "SMS") {
      updateData.twoFactorSmsEnabled = !!enabled;
      if (phone !== undefined) {
        updateData.twoFactorPhone = phone;
      }
    } else if (method === "AUTHENTICATOR") {
      updateData.twoFactorAuthenticatorEnabled = !!enabled;
    }

    // Bazanı yeniləyirik
    let updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData
    });

    // Ümumi 2FA statusunu yenidən hesablayırıq (Əgər hər hansı biri aktivdirsə, ümumi status da aktivdir)
    const isAny2faEnabled = 
      updatedUser.twoFactorEmailEnabled || 
      updatedUser.twoFactorSmsEnabled || 
      updatedUser.twoFactorAuthenticatorEnabled;

    updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorEnabled: isAny2faEnabled }
    });

    return NextResponse.json({ 
      success: true, 
      enabled: updatedUser.twoFactorEnabled,
      emailEnabled: updatedUser.twoFactorEmailEnabled,
      smsEnabled: updatedUser.twoFactorSmsEnabled,
      authenticatorEnabled: updatedUser.twoFactorAuthenticatorEnabled,
      phone: updatedUser.twoFactorPhone,
      message: enabled ? `${method} 2FA aktivləşdirildi.` : `${method} 2FA deaktiv edildi.` 
    });
  } catch (error: any) {
    console.error("2FA toggle error:", error);
    return NextResponse.json({ error: "Verilənlər bazası xətası baş verdi." }, { status: 500 });
  }
}
