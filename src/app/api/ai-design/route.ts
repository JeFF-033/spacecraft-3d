import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, roomSize } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key tapılmadı." }, { status: 500 });
    }

    const systemInstruction = `
Sən peşəkar bir 3D İnteryer Dizaynerisən.
İstifadəçinin istəyinə uyğun olaraq otağın daxilində mebelləri mükəmməl şəkildə düzməlisən.

Otağın ölçüləri (metrlə): En (width) = ${roomSize.width}, Uzunluq (length) = ${roomSize.length}, Hündürlük (height) = ${roomSize.height}.
Mərkəz nöqtə: (0,0,0). X oxu -width/2 ilə +width/2, Z oxu -length/2 ilə +length/2 arasındadır.

QAYDALAR:
1. Döşəmədə duran bütün mebellərin Y(Hündürlük) koordinatı 0 olmalıdır. Heç bir mebel havada uçmamalıdır!
2. Çılçıq/Lüstr asılan mebeldir, onun Y koordinatı ${roomSize.height - 1.0} olmalıdır.
3. Mebellərin ölçüləri (scale) haqqında vacib qayda:
   Hər mebelin standart ölçüləri (scale=[1,1,1] olduqda) var. JSON-da göndərdiyin 'scale' sahəsi birbaşa mebelin miqyasını çoxaldan vuruqdur (multiplier), yəni standart ölçüyə vurulur.
   Mebelin standart ölçüsünü saxlamaq üçün 'scale'-i mütləq {"x": 1, "y": 1, "z": 1} olaraq ver.
   Əgər enini/hündürlüyünü kiçiltmək və ya böyütmək istəyirsənsə, standart ölçüyə görə vuruqlar yaz (məsələn, 20% böyütmək üçün 1.2).
   Heç vaxt bura mebelin metrlə olan mütləq ölçüsünü yazma! (Məsələn, 2-metrlik masa üçün scale-i 2 yazsan, o 4 metr olacaq!).

Kataloqdakı mebellərin standart ölçüləri (scale=[1,1,1] olduqda):
- "İş Masası" (Desk): En (width) = 2.0m, Hündürlük (height) = 0.76m, Dərinlik (depth) = 1.0m
- "Rəhbər Kreslosu" (Executive Chair): En = 0.6m, Hündürlük = 1.0m, Dərinlik = 0.6m
- "Divan" (Sofa): En = 2.1m, Hündürlük = 0.7m, Dərinlik = 0.8m
- "İki Nəfərlik Yataq" (Double Bed): En = 1.75m, Hündürlük = 1.1m, Dərinlik = 2.1m (Qeyd: Yatağın özünə sol və sağ tərəflərdə 2 ədəd balaca komodin/tumboçka daxildir, əlavə komodin yerləşdirməyə ehtiyac yoxdur, üst-üstə düşərlər).
- "Qarderob" (Wardrobe): En = 1.2m, Hündürlük = 2.0m, Dərinlik = 0.6m
- "Televizor" (TV): En = 1.6m, Hündürlük = 0.9m, Dərinlik = 0.3m (Stand-ı ilə birlikdə)
- "Dekorativ Bitki" (Decorative Plant): En = 0.5m, Hündürlük = 0.85m, Dərinlik = 0.5m
- "Spot İşıq" (Spotlight): En = 0.16m, Hündürlük = 0.35m, Dərinlik = 0.16m (Tavanda yerləşir, Y = ${roomSize.height - 0.35})
- "Lüstr (Çılçıq)" (Chandelier): En = 0.8m, Hündürlük = 1.0m, Dərinlik = 0.8m (Tavanda yerləşir, Y = ${roomSize.height - 1.0})
- "LED Lent" (LED Strip): En = 1.5m, Hündürlük = 0.02m, Dərinlik = 0.02m

4. Düzülüş və Mövqe Qaydaları:
   - Ofis/İş otağı (Office):
     * Mütləq "İş Masası" və "Rəhbər Kreslosu" yerləşdir.
     * Kreslo masanın arxasında olmalı və otağın içinə (mərkəzinə) tərəf baxmalıdır. Məsələn, masa Z = -1, rotation Y = 0 olduqda, kreslo Z = -1.8, rotation Y = 0 olmalıdır.
     * Müştərilər və ya qonaqlar üçün "Divan" yerləşdirə bilərsən (məsələn, yan divara söykənmiş şəkildə).
     * Otağın küncünə "Dekorativ Bitki" yerləşdir.
     * Sənədlər üçün "Qarderob" yerləşdir.
   - Yataq otağı (Bedroom):
     * Mütləq "İki Nəfərlik Yataq" yerləşdir. Başlığını arxa divara söykə.
     * "Qarderob"u yan divarlardan birinə söykə.
     * Yatağın qarşı tərəfinə divara və ya masaya "Televizor" yerləşdirə bilərsən.
   - Qonaq otağı / Salon (Living Room):
     * Mütləq "Divan" və onun qarşısında "Televizor" yerləşdir.
     * "Dekorativ Bitki" və "Lüstr (Çılçıq)" yerləşdir.

5. Mebellərin koordinatları təyin edilərkən onların bir-birinin içinə girməməsinə (overlap olmamasına) diqqət yetir. Hər bir mebelin enini və dərinliyini nəzərə alaraq aralarında məsafə saxla.
6. Məna və düzülüş cəhətdən zəngin otaq yarat (ən azı 4-6 mebel yerləşdir).

Sən mənə YALNIZ VƏ YALNIZ aşağıdakı struktura uyğun keçərli bir JSON formatı qaytarmalısan (heç bir əlavə söz yazmadan, markdown backticks olmadan):
{
  "wallTexture": "/textures/wallpaper.png",
  "floorTexture": "/textures/wood.png",
  "furniture": [
    {
      "id": "ai-item-1",
      "name": "İş Masası",
      "position": { "x": 0, "y": 0, "z": -1 },
      "rotation": { "x": 0, "y": 0, "z": 0 },
      "scale": { "x": 1, "y": 1, "z": 1 },
      "color": "#3d2314"
    }
  ]
}
Kataloqda olan əşyaların dəqiq adları yalnız bunlardan ibarətdir: İş Masası, Rəhbər Kreslosu, Divan, İki Nəfərlik Yataq, Qarderob, Televizor, Dekorativ Bitki, Spot İşıq, Lüstr (Çılçıq), LED Lent.

Mövcud teksturalar:
Divar üçün seçə biləcəklərin: /textures/wallpaper.png, /textures/concrete.png, /textures/brick.png
Döşəmə üçün seçə biləcəklərin: /textures/wood.png, /textures/tile.png, /textures/marble.png
`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
    
    let resultText = "";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: systemInstruction + "\n\nİstifadəçinin istəyi: " + prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }
      
      const data = await response.json();
      resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!resultText) throw new Error("API-dən cavab gəlmədi");
    } catch (apiError) {
      console.warn("Gemini API Xətası (Fallback istifadə olunur):", apiError);
      
      // Riyazi olaraq otaq ölçülərinə tam uyğunlaşdırılmış (snapped) mebel düzülüşü
      const halfW = roomSize.width / 2;
      const halfL = roomSize.length / 2;
      const promptLower = prompt.toLowerCase();

      const isBedroom = promptLower.includes("yataq") || promptLower.includes("bedroom") || promptLower.includes("sleeping");
      const isOffice = promptLower.includes("ofis") || promptLower.includes("iş") || promptLower.includes("office") || promptLower.includes("work");
      
      let furniture: any[] = [];
      let wallTex = "/textures/concrete.png";

      if (isBedroom) {
        wallTex = "/textures/wallpaper.png";
        furniture = [
          {
            id: "ai-1",
            name: "İki Nəfərlik Yataq",
            position: { x: 0, y: 0, z: -halfL + 1.05 }, // Arxa divara tam bitişik (yataq dərinliyi 2.1m)
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            color: "#f3f4f6",
            price: 600
          },
          {
            id: "ai-2",
            name: "Qarderob",
            position: { x: -halfW + 0.3, y: 0, z: 0 }, // Sol divara tam söykənmiş (şkaf qalınlığı 0.6m)
            rotation: { x: 0, y: Math.PI / 2, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            color: "#4b5563",
            price: 500
          },
          {
            id: "ai-3",
            name: "İş Masası",
            position: { x: halfW - 0.5, y: 0, z: halfL - 1.0 }, // Sağ-ön künc divarına söykənmiş
            rotation: { x: 0, y: -Math.PI / 2, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            color: "#1e293b",
            price: 150
          },
          {
            id: "ai-4",
            name: "Rəhbər Kreslosu",
            position: { x: halfW - 1.2, y: 0, z: halfL - 1.0 }, // Masanın önündəki stul
            rotation: { x: 0, y: Math.PI / 2, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            color: "#0f172a",
            price: 90
          },
          {
            id: "ai-5",
            name: "Dekorativ Bitki",
            position: { x: -halfW + 0.4, y: 0, z: -halfL + 0.4 }, // Arxa-sol künc
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            color: "#ffffff",
            price: 25
          },
          {
            id: "ai-6",
            name: "Lüstr (Çılçıq)",
            position: { x: 0, y: roomSize.height - 1.0, z: 0 }, // Tavanın tam mərkəzi
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            color: "#ffffff",
            price: 120
          }
        ];
      } else if (isOffice) {
        wallTex = "/textures/concrete.png";
        furniture = [
          {
            id: "ai-1",
            name: "İş Masası",
            position: { x: 0, y: 0, z: -1.0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            color: "#3d2314",
            price: 150
          },
          {
            id: "ai-2",
            name: "Rəhbər Kreslosu",
            position: { x: 0, y: 0, z: -1.8 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            color: "#111111",
            price: 90
          },
          {
            id: "ai-3",
            name: "Divan",
            position: { x: -halfW + 0.5, y: 0, z: halfL - 1.2 }, // Sol divara söykənmiş
            rotation: { x: 0, y: Math.PI / 2, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            color: "#1e3a8a",
            price: 450
          },
          {
            id: "ai-4",
            name: "Qarderob",
            position: { x: halfW - 0.3, y: 0, z: 0 }, // Sağ divara söykənmiş
            rotation: { x: 0, y: -Math.PI / 2, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            color: "#4b5563",
            price: 500
          },
          {
            id: "ai-5",
            name: "Dekorativ Bitki",
            position: { x: -halfW + 0.4, y: 0, z: -halfL + 0.4 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            color: "#ffffff",
            price: 25
          },
          {
            id: "ai-6",
            name: "Lüstr (Çılçıq)",
            position: { x: 0, y: roomSize.height - 1.0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            color: "#ffffff",
            price: 120
          }
        ];
      } else {
        wallTex = "/textures/concrete.png";
        furniture = [
          {
            id: "ai-1",
            name: "Divan",
            position: { x: 0, y: 0, z: halfL - 0.5 }, // Ön divara bitişik
            rotation: { x: 0, y: Math.PI, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            color: "#1e3a8a",
            price: 450
          },
          {
            id: "ai-2",
            name: "Televizor",
            position: { x: 0, y: 0, z: -halfL + 0.3 }, // Arxa divara bitişik
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            color: "#111111",
            price: 800
          },
          {
            id: "ai-3",
            name: "İş Masası",
            position: { x: halfW - 0.5, y: 0, z: -halfL + 1.0 }, // Sağ divara söykənmiş
            rotation: { x: 0, y: -Math.PI / 2, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            color: "#4b3621",
            price: 150
          },
          {
            id: "ai-4",
            name: "Dekorativ Bitki",
            position: { x: -halfW + 0.4, y: 0, z: halfL - 0.4 }, // Sol-ön künc
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            color: "#ffffff",
            price: 25
          },
          {
            id: "ai-5",
            name: "Lüstr (Çılçıq)",
            position: { x: 0, y: roomSize.height - 1.0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            color: "#ffffff",
            price: 120
          }
        ];
      }

      resultText = JSON.stringify({
        wallTexture: wallTex,
        floorTexture: "/textures/wood.png",
        furniture: furniture
      });
    }
    
    if (!resultText) {
      throw new Error("Cavab boşdur");
    }

    // Robust JSON extraction
    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("API-dən gələn cavabda JSON formatı tapılmadı.");
    }

    const aiResult = JSON.parse(jsonMatch[0]);
    const furnitureList = aiResult.furniture || [];
    
    const DEFAULT_PRICES: Record<string, number> = {
      "İş Masası": 150,
      "Rəhbər Kreslosu": 90,
      "Divan": 450,
      "İki Nəfərlik Yataq": 600,
      "Qarderob": 500,
      "Televizor": 800,
      "Dekorativ Bitki": 25,
      "Spot İşıq": 35,
      "Lüstr (Çılçıq)": 120,
      "LED Lent": 20,
    };

    // Geri dönən datada id-ləri unikallaşdıraq və qiymət fallback-i əlavə edək
    const uniqueFurniture = furnitureList.map((f: any, idx: number) => ({
      ...f,
      id: `ai-${Date.now()}-${idx}`,
      price: f.price || DEFAULT_PRICES[f.name] || 100
    }));

    return NextResponse.json({ 
      success: true, 
      data: uniqueFurniture,
      wallTexture: aiResult.wallTexture || "/textures/concrete.png",
      floorTexture: aiResult.floorTexture || "/textures/wood.png"
    });
  } catch (error: any) {
    console.error("AI Route Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
