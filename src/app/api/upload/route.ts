import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Fayl tapılmadı." }, { status: 400 });
    }

    const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    let fileUrl = "";

    if (blobToken) {
      console.log("Vercel Blob-a yüklənir...");
      const blob = await put(uniqueName, file, { access: "public", token: blobToken });
      fileUrl = blob.url;
    } else {
      try {
        console.log("Lokal qovluğa yüklənir...");
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        
        try {
          await fs.access(uploadDir);
        } catch {
          await fs.mkdir(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, uniqueName);
        await fs.writeFile(filePath, buffer);
        fileUrl = `/uploads/${uniqueName}`;
      } catch (fsErr) {
        console.warn("Lokal fayl sisteminə yazmaq mümkün olmadı (Vercel Serverless Read-Only). Data URL yaradılır...", fsErr);
        const bytes = await file.arrayBuffer();
        const base64 = Buffer.from(bytes).toString("base64");
        const mimeType = file.type || "image/jpeg";
        fileUrl = `data:${mimeType};base64,${base64}`;
      }
    }

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error: any) {
    console.error("Yükləmə xətası:", error);
    return NextResponse.json({ error: `Fayl yüklənərkən xəta baş verdi: ${error.message}` }, { status: 500 });
  }
}
