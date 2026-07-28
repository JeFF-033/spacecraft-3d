import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import crypto from "crypto";

function hashPassword(password: string) {
  const salt = "spacecraft_salt_129847128";
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await req.json();

    if (!newPassword || newPassword.length < 4) {
      return NextResponse.json({ error: "Yeni şifrə ən az 4 simvoldan ibarət olmalıdır." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "İstifadəçi tapılmadı." }, { status: 404 });
    }

    const newHashedPassword = hashPassword(newPassword);

    // Əgər istifadəçinin hələ şifrəsi yoxdursa (məsələn, Google ilə qeydiyyatdan keçibsə), şifrə təyin etməsinə icra verilir
    if (user.password) {
      const currentHashed = hashPassword(currentPassword || "");
      if (user.password !== currentHashed) {
        return NextResponse.json({ error: "Cari şifrə yanlışdır." }, { status: 400 });
      }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { password: newHashedPassword }
    });

    return NextResponse.json({ success: true, message: "Şifrə uğurla dəyişdirildi." });
  } catch (error: any) {
    console.error("Password update error:", error);
    return NextResponse.json({ error: "Verilənlər bazası xətası baş verdi." }, { status: 500 });
  }
}
