import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { pusherServer, isPusherConfigured } from "@/lib/pusher";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json();
  const { projectId, name, data, wallColor, floorColor } = body;

  try {
    if (projectId) {
      const proj = await prisma.project.update({
        where: { id: projectId },
        data: { data: JSON.stringify(data), wallColor, floorColor }
      });

      // Canlı Multiplayer: Digər qoşulmuş istifadəçilərə layihənin yeniləndiyini bildiririk
      if (isPusherConfigured && pusherServer) {
        pusherServer.trigger(`project-${projectId}`, "project-updated", {
          furnitureLayers: data,
          wallColor,
          floorColor,
          senderEmail: session.user.email
        }).catch((err) => console.error("Pusher trigger xətası:", err));
      }

      return NextResponse.json(proj);
    } else {
      const proj = await prisma.project.create({
        data: { name: name || "Mənim Otağım", data: JSON.stringify(data), wallColor, floorColor, userId: user.id }
      });
      return NextResponse.json(proj);
    }
  } catch (error) {
    return NextResponse.json({ error: "Baza xətası" }, { status: 500 });
  }
}
