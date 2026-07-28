import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { generateTOTPSecret } from "@/lib/totp";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "İstifadəçi tapılmadı." }, { status: 404 });
    }

    // Google Authenticator üçün gizli açar yaradırıq (əgər artıq yoxdursa)
    let secret = user.twoFactorSecret;
    if (!secret) {
      secret = generateTOTPSecret();
      await prisma.user.update({
        where: { id: user.id },
        data: { twoFactorSecret: secret }
      });
    }

    const otpauthUrl = `otpauth://totp/SpaceCraft3D:${encodeURIComponent(user.email!)}?secret=${secret}&issuer=SpaceCraft3D`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUrl)}`;

    return NextResponse.json({ 
      success: true, 
      secret, 
      qrCodeUrl 
    });
  } catch (error: any) {
    console.error("2FA Setup error:", error);
    return NextResponse.json({ error: "Xəta baş verdi." }, { status: 500 });
  }
}
