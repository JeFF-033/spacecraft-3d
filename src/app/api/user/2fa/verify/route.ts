import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { verifyTOTPToken } from "@/lib/totp";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { code, isSetup, method, phone } = await req.json();

    if (!code || code.length < 6) {
      return NextResponse.json({ error: "Zəhmət olmasa 6 rəqəmli doğrulama kodunu daxil edin." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "İstifadəçi tapılmadı." }, { status: 404 });
    }

    // Əgər setup deyilsə və profildə ümumi 2FA aktiv deyilsə, yoxlamağı bloklayırıq
    if (!isSetup && !user.twoFactorEnabled) {
      return NextResponse.json({ error: "İki faktorlu autentifikasiya aktiv deyil." }, { status: 400 });
    }

    const activeMethod = isSetup ? method : method; // uses method passed from frontend to know which method is verifying

    if (!activeMethod || !["EMAIL", "SMS", "AUTHENTICATOR"].includes(activeMethod)) {
      return NextResponse.json({ error: "Keçərsiz doğrulama metodu." }, { status: 400 });
    }

    // Google Authenticator (AUTHENTICATOR) doğrulama
    if (activeMethod === "AUTHENTICATOR") {
      if (!user.twoFactorSecret) {
        return NextResponse.json({ error: "Google Authenticator gizli açarı tapılmadı. Öncə setup edin." }, { status: 400 });
      }

      const isValid = verifyTOTPToken(user.twoFactorSecret, code);
      if (!isValid) {
        return NextResponse.json({ error: "Google Authenticator kodu yanlışdır və ya vaxtı keçib." }, { status: 400 });
      }
    } else if (activeMethod === "EMAIL" || activeMethod === "SMS") {
      // Email və ya SMS doğrulama
      if (!user.twoFactorCode || !user.twoFactorExpires) {
        return NextResponse.json({ error: "Kod göndərilməyib və ya sıfırlanıb. Yenidən kod göndərin." }, { status: 400 });
      }

      // Vaxt bitmə yoxlanışı
      if (new Date() > user.twoFactorExpires) {
        return NextResponse.json({ error: "Doğrulama kodunun vaxtı bitib. Yenisini göndərin." }, { status: 400 });
      }

      // Kod müqayisəsi
      if (user.twoFactorCode !== code.trim()) {
        return NextResponse.json({ error: "Daxil etdiyiniz kod yanlışdır." }, { status: 400 });
      }

      // Kodu birdəfəlik istifadə edildiyi üçün silirik
      await prisma.user.update({
        where: { id: user.id },
        data: {
          twoFactorCode: null,
          twoFactorExpires: null
        }
      });
    }

    // Əgər ilk dəfə aktivləşdirilirsə (Setup), bazada müvafiq 2FA metodunu aktiv edirik
    if (isSetup) {
      const updateData: any = {};
      if (method === "EMAIL") {
        updateData.twoFactorEmailEnabled = true;
      } else if (method === "SMS") {
        updateData.twoFactorSmsEnabled = true;
        if (phone !== undefined) {
          updateData.twoFactorPhone = phone;
        }
      } else if (method === "AUTHENTICATOR") {
        updateData.twoFactorAuthenticatorEnabled = true;
      }

      let updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: updateData
      });

      // Ümumi statusu yenidən hesablayırıq
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
        message: "2FA uğurla aktivləşdirildi!" 
      });
    }

    return NextResponse.json({ success: true, message: "Giriş uğurla doğrulandı!" });
  } catch (error: any) {
    console.error("2FA Verify error:", error);
    return NextResponse.json({ error: "Xəta baş verdi." }, { status: 500 });
  }
}
