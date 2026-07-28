"use client";

import React from "react";
import Link from "next/link";
import { Box, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function GalleryPage() {
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
            Dizayn Qalereyası
          </h1>
          <p className="text-neutral-500 text-lg leading-relaxed max-w-2xl mx-auto">
            Süni intellekt və zəngin 3D mebel kataloqumuz ilə dizayn edilmiş real otaq üslublarından ilham alın.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {/* Gallery Item 1 */}
          <div className="group rounded-3xl overflow-hidden bg-white border border-[#E5DCC5] hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className="aspect-[4/3] overflow-hidden relative border-b border-[#E5DCC5]/60 bg-neutral-100">
              <img 
                src="/images/gallery_japandi.png" 
                alt="Japandi Living Room" 
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold mb-2 text-neutral-900">Japandi Qonaq Otağı</h4>
                <p className="text-neutral-500 text-xs leading-relaxed">
                  Təbii ağac elementləri, isti neytral tonlar və Yapon-Skandinav estetikasının mükəmməl harmoniyası.
                </p>
              </div>
            </div>
          </div>

          {/* Gallery Item 2 */}
          <div className="group rounded-3xl overflow-hidden bg-white border border-[#E5DCC5] hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className="aspect-[4/3] overflow-hidden relative border-b border-[#E5DCC5]/60 bg-neutral-100">
              <img 
                src="/images/gallery_bedroom.png" 
                alt="Modern Bedroom" 
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold mb-2 text-neutral-900">Modern Yataq Otağı</h4>
                <p className="text-neutral-500 text-xs leading-relaxed">
                  Slate Gray və tünd göy tonlarının sintezi, gizli işıqlandırma və müasir dizaynlı mebellər ilə yataq zonası.
                </p>
              </div>
            </div>
          </div>

          {/* Gallery Item 3 */}
          <div className="group rounded-3xl overflow-hidden bg-white border border-[#E5DCC5] hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className="aspect-[4/3] overflow-hidden relative border-b border-[#E5DCC5]/60 bg-neutral-100">
              <img 
                src="/images/gallery_kitchen.png" 
                alt="Minimalist Kitchen" 
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold mb-2 text-neutral-900">Minimalist Mətbəx</h4>
                <p className="text-neutral-500 text-xs leading-relaxed">
                  Mərmər dəzgah, ağ və açıq rəngli palıd dolablar ilə parlaq işıqlı və təmiz minimalist mətbəx dizaynı.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="w-full max-w-6xl mt-24">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white p-12 md:p-16 text-center border border-white/10 shadow-2xl">
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
              Kataloqa Öz Dizaynınla Qoşul
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto mb-10 text-base md:text-lg leading-relaxed">
              İndi dizayna başlayın, yaratdığınız layihəni ictimai qalereyada paylaşaraq digər dizaynerlərə ilham verin.
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
