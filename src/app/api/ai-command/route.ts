import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, roomSize, currentFurniture } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key tapılmadı. Zəhmət olmasa .env faylını yoxlayın." },
        { status: 500 }
      );
    }

    const systemInstruction = `
Sən SpaceCraft 3D üçün Ağıllı Əmr Mərkəzisən.
İstifadəçinin sərbəst dildə verdiyi dizayn əmrini (məs. "yatağı əlavə et", "divarı yaşıl et", "televizoru sil") analiz edib, bizim Zustand store-un icra edə biləcəyi əmrlər siyahısına çevirməlisən.

Otağın ölçüləri: En (width) = ${roomSize.width}, Uzunluq (length) = ${roomSize.length}, Hündürlük (height) = ${roomSize.height}.
Mərkəz nöqtə: (0,0,0). X oxu -width/2 ilə +width/2, Z oxu -length/2 ilə +length/2 arasındadır.

Hazırda otaqda olan mebellərin siyahısı: ${JSON.stringify(currentFurniture)}

QAYDALAR:
1. Əgər istifadəçi mebel əlavə etmək istəyirsə (məs. "divan qoy"), "type": "add_furniture" istifadə et.
   Mebellərin Kataloq adları yalnız bunlardan biri ola bilər: İş Masası, Rəhbər Kreslosu, Divan, İki Nəfərlik Yataq, Qarderob, Televizor, Dekorativ Bitki, Spot İşıq, Lüstr (Çılçıq), LED Lent.
   Realistik koordinatları (X, Y, Z) və scale təyin et. Divara yaxın yerləşdir.
   * scale sahəsi üçün vacib qayda: JSON-da göndərdiyin 'scale' sahəsi mebelin miqyasını çoxaldan vuruqdur (multiplier). Standart ölçünü saxlamaq üçün {"x": 1, "y": 1, "z": 1} göndər. Heç vaxt mebelin metrlə olan mütləq ölçüsünü yazma!
   
   Kataloqdakı mebellərin standart ölçüləri (scale=[1,1,1] olduqda):
   - "İş Masası" (Desk): En (width) = 2.0m, Hündürlük = 0.76m, Dərinlik = 1.0m
   - "Rəhbər Kreslosu" (Executive Chair): En = 0.6m, Hündürlük = 1.0m, Dərinlik = 0.6m
   - "Divan" (Sofa): En = 2.1m, Hündürlük = 0.7m, Dərinlik = 0.8m
   - "İki Nəfərlik Yataq" (Double Bed): En = 1.75m, Hündürlük = 1.1m, Dərinlik = 2.1m (Qeyd: Yatağın özünə sol/sağ komodinlər daxildir).
   - "Qarderob" (Wardrobe): En = 1.2m, Hündürlük = 2.0m, Dərinlik = 0.6m
   - "Televizor" (TV): En = 1.6m, Hündürlük = 0.9m, Dərinlik = 0.3m (Stand-ı ilə birlikdə)
   - "Dekorativ Bitki" (Decorative Plant): En = 0.5m, Hündürlük = 0.85m, Dərinlik = 0.5m
   - "Spot İşıq" (Spotlight): En = 0.16m, Hündürlük = 0.35m, Dərinlik = 0.16m (Tavanda, Y = ${roomSize.height - 0.35})
   - "Lüstr (Çılçıq)" (Chandelier): En = 0.8m, Hündürlük = 1.0m, Dərinlik = 0.8m (Tavanda, Y = ${roomSize.height - 1.0})
   - "LED Lent" (LED Strip): En = 1.5m, Hündürlük = 0.02m, Dərinlik = 0.02m

2. Əgər mebeli silmək istəyirsə (məs. "yatağı sil"), "type": "delete_furniture" istifadə et, payload olaraq mebelin adını ötür (məs. {"name": "Yataq"}).
3. Əgər divar/döşəmə rəngini və ya teksturasını dəyişmək istəyirsə, "type": "set_properties" istifadə et.
   - Divar rəngləri üçün HEX kodundan istifadə et (məs. {"wallColor": "#00ff00"}).
   - Mövcud divar teksturaları: /textures/wallpaper.png, /textures/concrete.png, /textures/brick.png
   - Mövcud döşəmə teksturaları: /textures/wood.png, /textures/tile.png, /textures/marble.png
   - Otaq ölçüsünü dəyişmək üçün: {"roomSize": {"width": 8, "length": 8}} kimi istifadə et.

MƏQSƏD:
İstifadəçinin istəyinə uyğun olaraq yalnız aşağıdakı struktura uyğun bir JSON formatı qaytar (markdown backticks olmadan, yalnız xalis JSON string):
{
  "actions": [
    {
      "type": "add_furniture",
      "payload": {
        "name": "Divan",
        "position": { "x": 0, "y": 0, "z": 2.5 },
        "rotation": { "x": 0, "y": 3.1415, "z": 0 },
        "scale": { "x": 1, "y": 1, "z": 1 },
        "color": "#1e3a8a"
      }
    },
    {
      "type": "set_properties",
      "payload": {
        "wallColor": "#e2e8f0"
      }
    }
  ]
}
`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: systemInstruction + "\n\nİstifadəçinin Əmri: " + prompt }]
          }
        ],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const data = await response.json();
    let resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!resultText) {
      throw new Error("Gemini-dən cavab gəlmədi.");
    }

    // Robust JSON extraction
    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("API-dən gələn cavabda JSON formatı tapılmadı.");
    }
    const parsed = JSON.parse(jsonMatch[0]);
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

    const actions = (parsed.actions || []).map((act: any) => {
      if (act.type === "add_furniture" && act.payload) {
        return {
          ...act,
          payload: {
            ...act.payload,
            price: act.payload.price || DEFAULT_PRICES[act.payload.name] || 100
          }
        };
      }
      return act;
    });

    return NextResponse.json({ success: true, actions });
  } catch (error: any) {
    console.error("AI Command parse error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
