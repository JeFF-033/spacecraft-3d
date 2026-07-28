"use client";

import React from "react";
import Link from "next/link";
import { Box, ArrowRight, Sparkles, Users, Layers, Camera, FileText, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-neutral-900 font-sans selection:bg-[#E5DCC5] selection:text-black">
      <Navbar />

      {/* Main Content */}
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
            Sonsuz İmkanlar
          </h1>
          <p className="text-neutral-500 text-lg leading-relaxed max-w-2xl mx-auto">
            Hər bir detal peşəkar 3D interyer dizayn işinizi sürətləndirmək və asanlaşdırmaq üçün hazırlanmışdır.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {/* Card 1 - AI Dizayner */}
          <div className="p-8 rounded-3xl bg-white border border-[#E5DCC5] hover:-translate-y-1 hover:shadow-xl hover:border-amber-200/80 transition-all duration-300">
            <div className="w-12 h-12 bg-[#FAFAF8] rounded-2xl flex items-center justify-center border border-[#E5DCC5] mb-6 shadow-sm">
              <Sparkles className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Dizayner</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              Otağınızın ölçülərini daxil edin və Süni İntellekt (Gemini) bir saniyədə ideal mebel yerləşimi ilə tam dizayn təklif etsin.
            </p>
          </div>
          
          {/* Card 2 - Canlı Kollaborasiya */}
          <div className="p-8 rounded-3xl bg-white border border-[#E5DCC5] hover:-translate-y-1 hover:shadow-xl hover:border-indigo-200/80 transition-all duration-300">
            <div className="w-12 h-12 bg-[#FAFAF8] rounded-2xl flex items-center justify-center border border-[#E5DCC5] mb-6 shadow-sm">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Canlı Kollaborasiya</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              Eynilə Figma və Google Docs kimi, müştərilərinizlə eyni vaxtda otağa daxil olub canlı dəyişikliklər və müzakirələr edin.
            </p>
          </div>

          {/* Card 3 - CSG Memarlıq */}
          <div className="p-8 rounded-3xl bg-white border border-[#E5DCC5] hover:-translate-y-1 hover:shadow-xl hover:border-emerald-200/80 transition-all duration-300">
            <div className="w-12 h-12 bg-[#FAFAF8] rounded-2xl flex items-center justify-center border border-[#E5DCC5] mb-6 shadow-sm">
              <Layers className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">CSG Memarlıq</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              Qalınlığı olan real 3D divarlar yaradın. Qapı və pəncərə əlavə edərkən divarlarda avtomatik deşiklər açılsın.
            </p>
          </div>

          {/* Card 4 - Sürətli Render */}
          <div className="p-8 rounded-3xl bg-white border border-[#E5DCC5] hover:-translate-y-1 hover:shadow-xl hover:border-rose-200/80 transition-all duration-300">
            <div className="w-12 h-12 bg-[#FAFAF8] rounded-2xl flex items-center justify-center border border-[#E5DCC5] mb-6 shadow-sm">
              <Camera className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Sürətli Render</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              Ağır kompüterlərə ehtiyac yoxdur. Bir kliklə buludda real işıqlandırma, kölgələr və 360° panoramik görüntülər yaradın.
            </p>
          </div>

          {/* Card 5 - Ağıllı Smeta */}
          <div className="p-8 rounded-3xl bg-white border border-[#E5DCC5] hover:-translate-y-1 hover:shadow-xl hover:border-blue-200/80 transition-all duration-300">
            <div className="w-12 h-12 bg-[#FAFAF8] rounded-2xl flex items-center justify-center border border-[#E5DCC5] mb-6 shadow-sm">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Ağıllı Smeta</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              İstifadə etdiyiniz bütün mebel və materialların qiymətini, sayını və ölçülərini avtomatik hesablayan PDF hesabatları çıxarın.
            </p>
          </div>

          {/* Card 6 - Dərhal Paylaşım */}
          <div className="p-8 rounded-3xl bg-white border border-[#E5DCC5] hover:-translate-y-1 hover:shadow-xl hover:border-violet-200/80 transition-all duration-300">
            <div className="w-12 h-12 bg-[#FAFAF8] rounded-2xl flex items-center justify-center border border-[#E5DCC5] mb-6 shadow-sm">
              <Share2 className="w-6 h-6 text-violet-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Dərhal Paylaşım</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              Layihələrinizi dərhal buluda yükləyin və sadəcə bir keçid (link) göndərməklə müştərinizə istənilən cihazda açdırın.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="w-full max-w-6xl mt-24">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white p-12 md:p-16 text-center border border-white/10 shadow-2xl">
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
              Bu Özəllikləri İndi Sınaqdan Keçirin
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto mb-10 text-base md:text-lg leading-relaxed">
              Quraşdırma yoxdur. AI asistentimiz və güclü 3D modullaşdırma alətlərimizlə bu gün dizayna başlayın.
            </p>
            <div className="flex justify-center">
              <Link 
                href="/editor" 
                className="bg-white hover:bg-neutral-100 text-neutral-900 px-8 py-4 rounded-full text-base font-bold transition-all flex items-center gap-2 shadow-xl hover:-translate-y-0.5 hover:shadow-white/10"
              >
                Dizayna Başla <ArrowRight className="w-5 h-5 text-neutral-900" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-12 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-neutral-800 rounded-lg flex items-center justify-center">
              <Box className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">SpaceCraft 3D</span>
          </div>
          <p className="text-sm">© 2026 SpaceCraft 3D. Bütün hüquqlar qorunur.</p>
        </div>
      </footer>
    </div>
  );
}
