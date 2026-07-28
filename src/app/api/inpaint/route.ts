import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // 1. API Key yoxlanışı
    const SOFABRAIN_KEY = process.env.SOFABRAIN_API_KEY;
    if (!SOFABRAIN_KEY) {
      return NextResponse.json({ 
        success: false, 
        error: 'SofaBrain API Key tapılmadı. Zəhmət olmasa .env.local faylına SOFABRAIN_API_KEY əlavə edin.' 
      }, { status: 500 });
    }

    console.log("SofaBrain API-yə sorğu göndərilir...");

    // 2. SofaBrain API-yə "Declutter" (Mebeli Sil) sorğusu
    // Qeyd: Əgər SofaBrain base64 dəstəkləmirsə, şəkli URL olaraq göndərmək lazım gələ bilər.
    // Əksər API-lər `image_base64` parametrini dəstəkləyir.
    const response = await fetch('https://api.sofabrain.com/api/v1/job', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SOFABRAIN_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_base64: image, // Şəkil base64 formatında
        redesign_type: "declutter" // Mebelləri təmizləmək üçün xüsusi əmr
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("SofaBrain API xətası:", errText);
      return NextResponse.json({ 
        success: false, 
        error: `SofaBrain API Xətası: ${response.statusText}` 
      }, { status: 500 });
    }

    const data = await response.json();

    // 3. Nəticənin alınması (SofaBrain asinxron işləyə bilər, əgər belədirsə polling lazımdır)
    // Şəklin hazırki URL-i və ya base64 formatı
    const finalImageUrl = data.result_url || data.output_url || data.image_url;

    if (!finalImageUrl) {
      return NextResponse.json({ 
        success: false, 
        error: 'SofaBrain-dən cavab gəldi, amma şəkil tapılmadı.' 
      }, { status: 500 });
    }

    console.log("UĞURLU: SofaBrain şəkli təmizlədi.");
    return NextResponse.json({ success: true, url: finalImageUrl });
    
  } catch (error: any) {
    console.error("SofaBrain API Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'AI processing failed' 
    }, { status: 500 });
  }
}
