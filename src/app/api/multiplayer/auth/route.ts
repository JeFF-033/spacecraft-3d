import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { pusherServer, isPusherConfigured } from "@/lib/pusher";

export async function POST(req: NextRequest) {
  if (!isPusherConfigured) {
    return NextResponse.json(
      { error: "Pusher hələ konfiqurasiya edilməyib. Zəhmət olmasa .env faylını yoxlayın." },
      { status: 500 }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Giriş etməlisiniz." }, { status: 401 });
  }

  try {
    // Pusher custom formatda `socket_id=XXX&channel_name=XXX` olaraq request body göndərir
    const contentType = req.headers.get("content-type");
    let socketId: string | null = null;
    let channelName: string | null = null;

    if (contentType?.includes("application/x-www-form-urlencoded")) {
      const text = await req.text();
      const params = new URLSearchParams(text);
      socketId = params.get("socket_id");
      channelName = params.get("channel_name");
    } else {
      const body = await req.json();
      socketId = body.socket_id;
      channelName = body.channel_name;
    }

    if (!socketId || !channelName) {
      return NextResponse.json(
        { error: "Məlumatlar tam deyil (socket_id və ya channel_name tapılmadı)." },
        { status: 400 }
      );
    }

    // İstifadəçi məlumatlarını auth response-a əlavə edirik (Presence kanalı dəstəyi üçün)
    const presenceData = {
      user_id: session.user.email,
      user_info: {
        name: session.user.name || "Anonim İstifadəçi",
        image: session.user.image || "",
      },
    };

    const authResponse = pusherServer!.authorizeChannel(socketId, channelName, presenceData);
    return NextResponse.json(authResponse);
  } catch (error: any) {
    console.error("Pusher Auth Xətası:", error);
    return NextResponse.json({ error: `Avtorizasiya zamanı xəta: ${error.message}` }, { status: 500 });
  }
}
