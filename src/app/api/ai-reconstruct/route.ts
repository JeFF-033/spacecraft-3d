import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ success: false, error: "Gemini API key tapılmadı." }, { status: 500 });
    }

    if (!imageUrl) {
      return NextResponse.json({ success: false, error: "Şəkil URL-i tapılmadı." }, { status: 400 });
    }

    let base64Image = "";
    let mimeType = "image/jpeg";

    // Orijinal URL-i dekod edirik (məsələn, boşluqların %20 kimi qalmaması üçün)
    const decodedUrl = decodeURIComponent(imageUrl);

    // Əgər lokal yükləmə qovluğudursa (/uploads/), faylı birbaşa diskdən oxuyuruq
    if (decodedUrl.includes("/uploads/")) {
      const relativePath = decodedUrl.substring(decodedUrl.indexOf("/uploads/"));
      const filePath = path.join(process.cwd(), "public", relativePath);
      const buffer = await fs.readFile(filePath);
      base64Image = buffer.toString("base64");
      if (relativePath.endsWith(".png")) {
        mimeType = "image/png";
      }
    } else if (decodedUrl.startsWith("http://") || decodedUrl.startsWith("https://")) {
      // Bulud yaddaşı (Vercel Blob)
      const res = await fetch(decodedUrl);
      if (!res.ok) throw new Error("Şəkli yükləmək mümkün olmadı.");
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      base64Image = buffer.toString("base64");
      
      const contentType = res.headers.get("content-type");
      if (contentType) {
        mimeType = contentType;
      }
    } else if (decodedUrl.startsWith("data:")) {
      const match = decodedUrl.match(/^data:(image\/\w+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        base64Image = match[2];
      } else {
        throw new Error("Yanlış data URL formatı.");
      }
    } else {
      throw new Error("Şəkil URL formatı dəstəklənmir.");
    }

    const systemInstruction = `
Sən peşəkar 3D İnteryer Dizayneri və Rekonstruksiya mütəxəssisisən.
Sənə 360 dərəcəlik panorama (equirectangular) şəkil təqdim olunur.
Sənin vəzifən bu şəkli analiz edərək otağın 3D formasını (roomSize) və otaqda görünən mebellərin 3D düzülüşünü təxmin etməkdir.

QAYDALAR VƏ TƏXMINLƏR:
1. Otağın ölçüləri (metrlə): En (width), Uzunluq (length) və Hündürlük (height). Bunları metrlə təxmin et (məs. 4.5, 5.2, 2.8).
2. Otağın mərkəz nöqtəsi (0, 0, 0) olaraq qəbul edilir. Kamera (çəkiliş aparılan nöqtə) mərkəzdədir. 
3. Şəkildə aşkar olunan mebellər kataloqda yalnız bu adlardan biri olmalıdır:
   - "İş Masası" (Desk): En = 2.0m, Hündürlük = 0.76m, Dərinlik = 1.0m
   - "Rəhbər Kreslosu" (Executive Chair): En = 0.6m, Hündürlük = 1.0m, Dərinlik = 0.6m
   - "Divan" (Sofa): En = 2.1m, Hündürlük = 0.7m, Dərinlik = 0.8m
   - "İki Nəfərlik Yataq" (Double Bed): En = 1.75m, Hündürlük = 1.1m, Dərinlik = 2.1m
   - "Qarderob" (Wardrobe): En = 1.2m, Hündürlük = 2.0m, Dərinlik = 0.6m
   - "Televizor" (TV): En = 1.6m, Hündürlük = 0.9m, Dərinlik = 0.3m
   - "Dekorativ Bitki" (Decorative Plant): En = 0.5m, Hündürlük = 0.85m, Dərinlik = 0.5m
   - "Spot İşıq" (Spotlight): Tavanda (Y = height - 0.35)
   - "Lüstr (Çılçıq)" (Chandelier): Tavanda (Y = height - 1.0)
   - "LED Lent" (LED Strip)
4. Hər bir aşkar edilən mebel üçün 3D mövqeyi (position x, y, z), fırlanması (rotation y) və ölçü vuruğunu (scale x, y, z - default 1) təyin et.
   - Y koordinatı: Döşəmədə dayanan mebellər üçün Y = 0 olmalıdır. Heç bir mebel havada uçmamalıdır!
   - Tavandakılar (Lüstr və Spot İşıq) üçün Y hündürlüyü təxmin etdiyin otaq hündürlüyünə uyğun olmalıdır.
   - X koordinatı otağın eninin yarısı (-width/2) ilə (width/2) arasında olmalıdır.
   - Z koordinatı otağın uzunluğunun yarısı (-length/2) ilə (length/2) arasında olmalıdır.
5. Divar və döşəmə teksturalarını otaqdakı şəklə uyğun seçin:
   - Divar: /textures/wallpaper.png, /textures/concrete.png, /textures/brick.png
   - Döşəmə: /textures/wood.png, /textures/tile.png, /textures/marble.png

Sən mənə YALNIZ VƏ YALNIZ aşağıdakı struktura uyğun keçərli bir JSON formatı qaytarmalısan (heç bir əlavə söz yazmadan, markdown backticks olmadan):
{
  "roomSize": {
    "width": 5.0,
    "length": 4.5,
    "height": 2.8
  },
  "wallTexture": "/textures/wallpaper.png",
  "floorTexture": "/textures/wood.png",
  "furniture": [
    {
      "name": "İş Masası",
      "position": { "x": 1.2, "y": 0, "z": -1.5 },
      "rotation": { "x": 0, "y": 90, "z": 0 },
      "scale": { "x": 1.0, "y": 1.0, "z": 1.0 },
      "color": "#4a3c31"
    }
  ]
}
`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: systemInstruction },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Image
                }
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          maxOutputTokens: 8192,
          responseSchema: {
            type: "OBJECT",
            properties: {
              roomSize: {
                type: "OBJECT",
                properties: {
                  width: { "type": "NUMBER" },
                  length: { "type": "NUMBER" },
                  height: { "type": "NUMBER" }
                },
                required: ["width", "length", "height"]
              },
              wallTexture: { "type": "STRING" },
              floorTexture: { "type": "STRING" },
              furniture: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    name: { "type": "STRING" },
                    position: {
                      type: "OBJECT",
                      properties: {
                        x: { "type": "NUMBER" },
                        y: { "type": "NUMBER" },
                        z: { "type": "NUMBER" }
                      },
                      required: ["x", "y", "z"]
                    },
                    rotation: {
                      type: "OBJECT",
                      properties: {
                        x: { "type": "NUMBER" },
                        y: { "type": "NUMBER" },
                        z: { "type": "NUMBER" }
                      },
                      required: ["x", "y", "z"]
                    },
                    scale: {
                      type: "OBJECT",
                      properties: {
                        x: { "type": "NUMBER" },
                        y: { "type": "NUMBER" },
                        z: { "type": "NUMBER" }
                      },
                      required: ["x", "y", "z"]
                    },
                    color: { "type": "STRING" }
                  },
                  required: ["name", "position", "rotation", "scale"]
                }
              }
            },
            required: ["roomSize", "wallTexture", "floorTexture", "furniture"]
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!resultText) throw new Error("Gemini API-dən cavab gəlmədi");

    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON formatı tapılmadı.");

    let aiResult;
    try {
      aiResult = JSON.parse(jsonMatch[0]);
    } catch (parseError: any) {
      console.error("JSON parsing error. Raw string:", resultText);
      throw new Error(`Süni Zəkanın hazırladığı JSON oxunarkən xəta: ${parseError.message}`);
    }

    // Format furniture list
    const furnitureList = (aiResult.furniture || []).map((f: any, idx: number) => ({
      id: `ai-reconstruct-${Date.now()}-${idx}`,
      name: f.name,
      modelUrl: "",
      position: { x: f.position?.x || 0, y: f.position?.y || 0, z: f.position?.z || 0 },
      rotation: { x: 0, y: (f.rotation?.y || 0) * (Math.PI / 180), z: 0 }, // convert deg to rad
      scale: { x: f.scale?.x || 1, y: f.scale?.y || 1, z: f.scale?.z || 1 },
      color: f.color || "#ffffff",
      floor: 0,
      price: f.name.includes("Masa") ? 150 : f.name.includes("Kreslo") ? 90 : f.name.includes("Divan") ? 450 : f.name.includes("Yataq") ? 600 : 50
    }));

    return NextResponse.json({
      success: true,
      roomSize: aiResult.roomSize || { width: 5.0, length: 4.5, height: 2.8 },
      wallTexture: aiResult.wallTexture || "/textures/concrete.png",
      floorTexture: aiResult.floorTexture || "/textures/wood.png",
      furniture: furnitureList
    });

  } catch (error: any) {
    console.error("AI Reconstruction Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
