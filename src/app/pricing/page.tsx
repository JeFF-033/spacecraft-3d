"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Box, ArrowRight, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (plan: "PRO" | "ENTERPRISE") => {
    setLoadingPlan(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();

      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Ödəniş sessiyası yaradıla bilmədi.");
      }
    } catch (err) {
      console.error(err);
      alert("Xəta baş verdi. Zəhmət olmasa bir az sonra yenidən cəhd edin.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-neutral-900 font-sans selection:bg-[#E5DCC5] selection:text-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center relative">
        {/* Ambient Glows */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-400/8 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-amber-400/6 rounded-full blur-[120px] pointer-events-none -z-10"></div>

        {/* Masked Grid Pattern Background */}
        <div 
          className="absolute inset-0 -z-20 opacity-30 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            maskImage: 'linear-gradient(to bottom, black 50%, transparent 95%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 95%)'
          }}
        ></div>

        <div className="text-center max-w-3xl mb-20">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-neutral-900 mb-6">
            Ehtiyacınıza Uyğun <br className="hidden md:block"/> 
            <span className="relative inline-block my-1">
              <span className="relative z-10 italic font-serif font-light text-neutral-600 pr-1">Düzgün Paket</span>
              <span className="absolute bottom-1.5 left-0 w-full h-3 bg-gradient-to-r from-amber-400/30 to-amber-500/10 -z-10 -rotate-1 rounded-sm"></span>
            </span>{' '}
            <span className="inline-block bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Seçin</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-500 max-w-2xl leading-relaxed">
            Freelance dizaynerlərdən tutmuş böyük memarlıq bürolarına qədər hər kəs üçün ən optimal qiymətləndirmə.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl items-stretch">
          {/* Starter Plan */}
          <div className="bg-white border border-neutral-200 rounded-3xl p-8 flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all duration-300 shadow-sm relative">
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">Starter</h3>
            <p className="text-neutral-500 mb-6 text-sm leading-relaxed">Sadəcə məhsulu sınaqdan keçirmək istəyənlər üçün.</p>
            <div className="mb-8">
              <span className="text-5xl font-black text-neutral-900">$0</span>
              <span className="text-neutral-500 font-medium">/ aylıq</span>
            </div>
            
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex gap-3 text-neutral-700 font-medium text-sm">
                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                Maksimum 1 Layihə (Otaq)
              </li>
              <li className="flex gap-3 text-neutral-700 font-medium text-sm">
                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                Əsas 3D Mebellər (10 ədəd)
              </li>
              <li className="flex gap-3 text-neutral-700 font-medium text-sm">
                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                Şəkil kimi (Render) yükləmə
              </li>
            </ul>
            
            <Link href="/editor" className="block w-full text-center py-3.5 rounded-xl font-bold border border-neutral-300 text-neutral-700 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-300 text-sm shadow-sm hover:shadow-md">
              Pulsuz Başla
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-white border-2 border-indigo-500 rounded-3xl p-8 flex flex-col hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/15 transition-all duration-300 shadow-xl shadow-indigo-500/10 relative scale-105 z-10">
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-1.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase shadow-md whitespace-nowrap"
              style={{ backgroundColor: '#4f46e5', color: '#ffffff' }}
            >
              Ən Çox Seçilən
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">Pro</h3>
            <p className="text-neutral-500 mb-6 text-sm leading-relaxed">Peşəkar fərdlər və freelance dizaynerlər üçün ideal.</p>
            <div className="mb-8">
              <span className="text-5xl font-black text-neutral-900">$19</span>
              <span className="text-neutral-500 font-medium">/ aylıq</span>
            </div>
            
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex gap-3 text-neutral-700 font-medium text-sm">
                <Check className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" style={{ color: '#4f46e5' }} />
                Limitsiz Layihə Yaradılması
              </li>
              <li className="flex gap-3 text-neutral-700 font-medium text-sm">
                <Check className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" style={{ color: '#4f46e5' }} />
                Bütün Mebellər və Kataloq
              </li>
              <li className="flex gap-3 text-neutral-700 font-medium text-sm">
                <Check className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" style={{ color: '#4f46e5' }} />
                Ağıllı Smeta Çıxarışı (PDF)
              </li>
              <li className="flex gap-3 text-neutral-700 font-medium text-sm">
                <Check className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" style={{ color: '#4f46e5' }} />
                Süni İntellekt (Gemini) Dizayner
              </li>
            </ul>
            
            <button 
              onClick={() => handleCheckout("PRO")}
              disabled={loadingPlan !== null}
              className="w-full text-center py-3.5 rounded-xl font-bold hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-lg hover:shadow-xl"
              style={{ width: '100%', background: 'linear-gradient(to right, #4f46e5, #7c3aed)', color: '#ffffff' }}
            >
              {loadingPlan === "PRO" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" /> Yüklənir...
                </>
              ) : (
                "Pro Paketə Keçid"
              )}
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white border border-neutral-200 rounded-3xl p-8 flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all duration-300 shadow-sm relative">
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">Enterprise</h3>
            <p className="text-neutral-500 mb-6 text-sm leading-relaxed">Memarlıq büroları və böyük komandalar üçün tam idarəetmə.</p>
            <div className="mb-8">
              <span className="text-5xl font-black text-neutral-900">$49</span>
              <span className="text-neutral-500 font-medium">/ aylıq</span>
            </div>
            
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex gap-3 text-neutral-700 font-medium text-sm">
                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                Pro Paketdəki Bütün Özəlliklər
              </li>
              <li className="flex gap-3 text-neutral-700 font-medium text-sm">
                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                Canlı Kollaborasiya (Multiplayer)
              </li>
              <li className="flex gap-3 text-neutral-700 font-medium text-sm">
                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                3D Model Yükləmə (Export GLB)
              </li>
              <li className="flex gap-3 text-neutral-700 font-medium text-sm">
                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                7/24 Prioritet Dəstək
              </li>
            </ul>
            
            <button 
              onClick={() => handleCheckout("ENTERPRISE")}
              disabled={loadingPlan !== null}
              className="w-full text-center py-3.5 rounded-xl font-bold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-sm hover:shadow-md"
              style={{ width: '100%' }}
            >
              {loadingPlan === "ENTERPRISE" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Yüklənir...
                </>
              ) : (
                "Bizimlə Əlaqə"
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
