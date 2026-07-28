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
    const body = await req.json().catch(() => ({}));
    const { isSetup, method, phone } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "İstifadəçi tapılmadı." }, { status: 404 });
    }

    // Əgər setup deyilsə və profildə 2FA aktiv deyilsə, göndərməyi bloklayırıq
    if (!isSetup && !user.twoFactorEnabled) {
      return NextResponse.json({ error: "İki faktorlu autentifikasiya aktiv deyil." }, { status: 400 });
    }

    const activeMethod = isSetup ? method : user.twoFactorMethod;
    const activePhone = isSetup ? phone : user.twoFactorPhone;

    // Google Authenticator yerli olaraq kod generasiya edir, kod göndərməyə ehtiyac yoxdur
    if (activeMethod === "AUTHENTICATOR") {
      return NextResponse.json({ 
        success: true, 
        method: "AUTHENTICATOR", 
        message: "Google Authenticator kodunu daxil edin." 
      });
    }

    // Email və ya SMS üçün 6 rəqəmli təsadüfi kod yaradırıq
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 dəqiqə limit

    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorCode: verificationCode,
        twoFactorExpires: expires
      }
    });

    if (activeMethod === "EMAIL") {
      console.log(`\n========================================\n[2FA SETUP/LOGIN EMAIL CODE] Göndərildi: ${user.email}\nKOD: ${verificationCode}\n========================================\n`);
      
      // SMTP/Nodemailer ilə real göndəriş cəhdi
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        try {
          const nodemailer = require("nodemailer");
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: process.env.SMTP_PORT === "465",
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });

          await transporter.sendMail({
            from: `"SpaceCraft 3D" <${process.env.SMTP_USER}>`,
            to: user.email!,
            subject: "SpaceCraft 3D - İki Faktorlu Autentifikasiya Kodu",
            html: `
              <div style="font-family: sans-serif; padding: 20px; background-color: #fafaf8; color: #171717; max-width: 600px; border: 1px solid #e5dcc5; border-radius: 12px;">
                <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">Təhlükəsizlik Doğrulanması</h2>
                <p>SpaceCraft 3D hesabınızda iki faktorlu autentifikasiyanı tənzimləmək üçün təhlükəsizlik kodunuz:</p>
                <div style="font-size: 32px; font-weight: black; letter-spacing: 4px; padding: 12px; background-color: #f3efe6; text-align: center; border-radius: 8px; margin: 20px 0; font-family: monospace;">
                  ${verificationCode}
                </div>
                <p style="font-size: 12px; color: #737373;">Bu kod növbəti 5 dəqiqə ərzində keçərlidir. Əgər bu sorğunu siz etməmisinizsə, zəhmət olmasa bu məktubu nəzərə almayın.</p>
              </div>
            `
          });
        } catch (mailError) {
          console.error("Nodemailer email send error:", mailError);
        }
      }
      
      return NextResponse.json({ 
        success: true, 
        method: "EMAIL", 
        message: "Aktivləşdirmə kodu e-poçt ünvanınıza göndərildi. 📧" 
      });
    }

    if (activeMethod === "SMS") {
      const phoneVal = activePhone || "Qeyd edilməyib";
      console.log(`\n========================================\n[2FA SETUP/LOGIN SMS CODE] Göndərildi: ${phoneVal}\nKOD: ${verificationCode}\n========================================\n`);

      // SMS API inteqrasiya nümunəsi
      if (process.env.SMS_API_URL && process.env.SMS_TOKEN) {
        try {
          await fetch(process.env.SMS_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.SMS_TOKEN}` },
            body: JSON.stringify({
              to: phoneVal,
              message: `SpaceCraft 3D 2FA doğrulama kodunuz: ${verificationCode}`
            })
          });
        } catch (smsError) {
          console.error("SMS API send error:", smsError);
        }
      }

      return NextResponse.json({ 
        success: true, 
        method: "SMS", 
        message: `Aktivləşdirmə kodu nömrənizə (${phoneVal.substring(0, 6)}***) göndərildi. 📱` 
      });
    }

    return NextResponse.json({ error: "Geçərsiz 2FA metodu." }, { status: 400 });
  } catch (error: any) {
    console.error("2FA Send error:", error);
    return NextResponse.json({ error: "Xəta baş verdi." }, { status: 500 });
  }
}
