import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        name: true,
        updatedAt: true,
        createdAt: true,
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Ensure the project belongs to the user
    await prisma.project.delete({
      where: { id, userId: user.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
