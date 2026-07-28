"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Box, Sparkles, Layers, Users, Camera, FileText, Share2, Check } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";

export default function LandingPage() {
  const [animationStep, setAnimationStep] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden bg-[#FAFAF8] text-neutral-900 font-sans selection:bg-[#E5DCC5] selection:text-black">
      {/* Navigation Header */}
      <Navbar />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-20 flex flex-col items-center text-center relative">
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

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-neutral-200/80 text-neutral-700 text-xs font-semibold mb-8 shadow-sm hover:border-indigo-200/80 transition-all hover:scale-102 hover:shadow-md cursor-pointer select-none whitespace-nowrap">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>SpaceCraft 3D SaaS — İndi Canlıdır!</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-neutral-900 max-w-4xl leading-tight mb-8">
          İnteryer Dizaynını <br />
          <span className="relative inline-block my-1">
            <span className="relative z-10 italic font-serif font-light text-neutral-600 pr-1">Brauzerdə</span>
            <span className="absolute bottom-1.5 left-0 w-full h-3 bg-gradient-to-r from-amber-400/30 to-amber-500/10 -z-10 -rotate-1 rounded-sm"></span>
          </span>{' '}
          <span className="inline-block bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Yenidən Kəşf Et</span>
        </h1>
        
        <p className="text-lg md:text-xl text-neutral-500 max-w-2xl mb-12 leading-relaxed">
          Peşəkar proqramlara ehtiyac duymadan, süni intellekt dəstəkli və komanda ilə eyni anda işləyə biləcəyiniz ilk bulud əsaslı 3D memarlıq aləti.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link 
            href="/editor" 
            className="bg-neutral-900 hover:bg-neutral-800 text-[#FAFAF8] px-8 py-4 rounded-full text-base font-bold transition-all flex items-center gap-2 shadow-xl hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-indigo-500/15 shadow-neutral-900/15 whitespace-nowrap"
          >
            Ödənişsiz Sına <ArrowRight className="w-5 h-5" />
          </Link>
          <a 
            href="#features" 
            className="px-8 py-4 rounded-full text-base font-bold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all hover:-translate-y-0.5 shadow-sm hover:shadow-md whitespace-nowrap"
          >
            Daha Çox Öyrən
          </a>
        </div>
        {/* Browser Mockup Image / Editor Preview */}
        <div className="w-full mt-24 relative rounded-3xl border border-[#E5DCC5] bg-white shadow-2xl p-2 max-w-6xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5DCC5]/60 bg-[#FAFAF8] rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="ml-4 text-xs font-mono text-neutral-400">spacecraft-3d.com/editor</div>
            </div>
            {/* Active stage tracker */}
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 bg-neutral-200/50 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              {animationStep === 0 && "Addım 1: Səhnə Hazırlığı"}
              {animationStep === 1 && "Addım 2: AI Generasiya"}
              {animationStep === 2 && "Addım 3: Mebel Yerləşimi"}
              {animationStep === 3 && "Addım 4: Rəng və Materiallar"}
              {animationStep === 4 && "Addım 5: Ağıllı Silmə (Magic Erase)"}
            </div>
          </div>

          <div className="aspect-[16/9] bg-[#0c0c14] rounded-b-2xl overflow-hidden relative flex text-neutral-300">
            {/* COLLABORATIVE MULTIPLAYER CURSORS */}
            {/* Sarah Cursor (Purple) */}
            <div 
              className="absolute z-20 pointer-events-none flex items-center gap-1.5"
              style={{
                top: 
                  animationStep === 0 ? '48%' :
                  animationStep === 1 ? '38%' :
                  animationStep === 2 ? '64%' :
                  animationStep === 3 ? '78%' : '44%',
                left: 
                  animationStep === 0 ? '60%' :
                  animationStep === 1 ? '55%' :
                  animationStep === 2 ? '38%' :
                  animationStep === 3 ? '85%' : '52%',
                transition: 'top 1.2s cubic-bezier(0.25, 1, 0.5, 1), left 1.2s cubic-bezier(0.25, 1, 0.5, 1)',
                willChange: 'top, left'
              }}
            >
              <svg className="w-3 h-3 text-purple-500 fill-current drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" viewBox="0 0 24 24">
                <path d="M4 3l15 9-6.5 2 4.5 5.5-2.5 2-4.5-5.5L4 18z" />
              </svg>
              <div className="bg-purple-500 text-white font-bold text-[7px] px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap">Sarah</div>
            </div>

            {/* Alex Cursor (Green) */}
            <div 
              className="absolute z-20 pointer-events-none flex items-center gap-1.5"
              style={{
                top: 
                  animationStep === 0 ? '62%' :
                  animationStep === 1 ? '65%' :
                  animationStep === 2 ? '44%' :
                  animationStep === 3 ? '44%' : '56%',
                left: 
                  animationStep === 0 ? '30%' :
                  animationStep === 1 ? '32%' :
                  animationStep === 2 ? '48%' :
                  animationStep === 3 ? '48%' : '74%',
                transition: 'top 1.2s cubic-bezier(0.25, 1, 0.5, 1), left 1.2s cubic-bezier(0.25, 1, 0.5, 1)',
                willChange: 'top, left'
              }}
            >
              <svg className="w-3 h-3 text-emerald-500 fill-current drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" viewBox="0 0 24 24">
                <path d="M4 3l15 9-6.5 2 4.5 5.5-2.5 2-4.5-5.5L4 18z" />
              </svg>
              <div className="bg-emerald-500 text-white font-bold text-[7px] px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap">Alex</div>
            </div>

            {/* 1. MOCK SIDEBAR (Left) */}
            <div className="hidden md:flex w-1/5 bg-neutral-900 border-r border-white/5 p-4 flex-col justify-between text-neutral-400 text-[10px] select-none z-10">
              <div>
                <div className="text-white font-bold mb-4 tracking-wider uppercase text-[8px] opacity-75">SpaceCraft Kataloq</div>
                <div className="space-y-1.5">
                  <div className={`flex items-center gap-2 p-1.5 rounded transition-colors duration-300 font-semibold ${animationStep === 2 ? 'bg-indigo-500/20 text-white' : 'hover:bg-white/5 text-neutral-400'}`}>
                    <span>🛋️</span> <span className="truncate min-w-0">Modern Divan</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded hover:bg-white/5 font-semibold text-neutral-400">
                    <span>🪴</span> <span className="truncate min-w-0">Dekorativ Bitki</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded hover:bg-white/5 font-semibold text-neutral-400">
                    <span>🖥️</span> <span className="truncate min-w-0">İş Masası</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded hover:bg-white/5 font-semibold text-neutral-400">
                    <span>💡</span> <span className="truncate min-w-0">Spot İşıq</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded hover:bg-white/5 font-semibold text-neutral-400">
                    <span>🚪</span> <span className="truncate min-w-0">Qapı</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-white/5 pt-3">
                <div className="flex justify-between items-center opacity-60 text-[8px] uppercase tracking-wider font-bold mb-1">Mərtəbə Paneli</div>
                <div className="flex gap-1.5">
                  <span className="bg-white/10 text-white px-2 py-0.5 rounded font-bold">1</span>
                  <span className="px-2 py-0.5 rounded hover:bg-white/5 cursor-pointer">2</span>
                  <span className="px-2 py-0.5 rounded hover:bg-white/5 cursor-pointer">+</span>
                </div>
              </div>
            </div>

            {/* 2. MAIN CANVAS AREA (Center) */}
            <div className="flex-1 relative flex items-center justify-center p-6 overflow-hidden">
              {/* Grid Background */}
              <div className="absolute inset-0 bg-[#121218]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
              
              {/* Mock Toolbar */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 border border-white/10 rounded-full px-4 py-2 flex items-center gap-4 shadow-2xl backdrop-blur-md z-10 text-white/50 text-[10px]">
                <span className="hover:text-white transition-colors cursor-pointer" title="Geri Qaytar">↩️</span>
                <span className="hover:text-white transition-colors cursor-pointer" title="İrəli Qaytar">↪️</span>
                <span className="w-px h-3.5 bg-white/10"></span>
                <span className="text-white font-bold bg-white/15 px-2.5 py-0.5 rounded cursor-pointer text-[9px] shadow-sm">3D Səhnə</span>
                <span className="hover:text-white transition-colors cursor-pointer text-[9px]">2D Plan</span>
                <span className="w-px h-3.5 bg-white/10"></span>
                <span className="hover:text-white transition-colors cursor-pointer" title="Maqnit (Snap)">🧲</span>
                <span className="text-indigo-400 hover:text-white transition-colors cursor-pointer" title="Ruler">📏</span>
              </div>

              {/* AI Typing Overlay */}
              <div 
                className="absolute top-16 left-1/2 bg-gradient-to-r from-purple-950/90 to-indigo-950/90 border border-indigo-500/30 rounded-2xl px-4 py-2.5 flex items-center gap-2 shadow-2xl backdrop-blur-md z-10 text-white text-[10px]"
                style={{
                  transform: `translate3d(-50%, ${animationStep === 1 ? '0px' : '-8px'}, 0) scale(${animationStep === 1 ? 1 : 0.95})`,
                  opacity: animationStep === 1 ? 1 : 0,
                  pointerEvents: animationStep === 1 ? 'auto' : 'none',
                  transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease-out',
                  willChange: 'transform, opacity'
                }}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                <span className="font-semibold tracking-wide">AI: "Modern qonaq otağı dizayn edilir..."</span>
              </div>

              {/* FLOATING AI ASSISTANT CHAT BOX */}
              <div className="absolute bottom-4 right-4 bg-black/75 border border-white/10 rounded-2xl p-3 w-56 h-[142px] shadow-2xl backdrop-blur-md z-10 text-[9px] flex flex-col gap-2 transition-all duration-500">
                <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span>
                    <span>Gemini AI Dizayner</span>
                  </div>
                  <span className="opacity-40 text-[7px] uppercase tracking-widest font-black">Aktiv</span>
                </div>
                <div className="space-y-2 max-h-24 overflow-y-auto">
                  <div className="flex flex-col gap-0.5 items-end">
                    <span className="bg-white/10 text-white px-2.5 py-1 rounded-xl rounded-tr-none max-w-[90%] break-words">
                      Otağı modern üslubda bəzə, divarı yaşıl et!
                    </span>
                    <span className="text-[6px] opacity-40 mr-1 mt-0.5">Sən</span>
                  </div>
                  <div 
                    className="flex flex-col gap-0.5 items-start"
                    style={{
                      transform: `translate3d(0, ${animationStep >= 1 ? '0px' : '4px'}, 0)`,
                      opacity: animationStep >= 1 ? 1 : 0,
                      transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease-out',
                      willChange: 'transform, opacity'
                    }}
                  >
                    <span className="bg-purple-950/60 border border-purple-500/20 text-purple-200 px-2.5 py-1 rounded-xl rounded-tl-none max-w-[90%] break-words leading-relaxed">
                      {animationStep === 1 && "Baş üstə, otaq tənzimlənir... ✨"}
                      {animationStep === 2 && "Mebelləri (Divan, Masa, Bitki, TV Stendi) otağa yerləşdirdim! 🛋️"}
                      {animationStep === 3 && "Materialları tənzimlədim və divarları zümrüd yaşılına boyadım! 🟢"}
                      {animationStep >= 4 && "Hazırdır! İndi isə 'Magic Erase' aləti ilə istədiyiniz mebeli təmizləyə bilərsiniz."}
                    </span>
                    <span className="text-[6px] opacity-40 ml-1 mt-0.5">AI Asistent</span>
                  </div>
                </div>
              </div>

              {/* CSS 3D Isometric View */}
              <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '800px' }}>
                <div 
                  className="relative w-72 h-72 transition-transform duration-1000 ease-in-out" 
                  style={{ 
                    transform: 'rotateX(55deg) rotateZ(-45deg)', 
                    transformStyle: 'preserve-3d',
                    willChange: 'transform'
                  }}
                >
                  {/* Floor Grid Plane with baseboards */}
                  <div 
                    className="absolute inset-0 border border-indigo-500/20 rounded-lg"
                    style={{ 
                      backgroundImage: 'radial-gradient(rgba(79, 70, 229, 0.2) 1.5px, transparent 1.5px)', 
                      backgroundSize: '20px 20px',
                      backgroundColor: '#0c0c14',
                      transform: 'translate3d(0, 0, 0)',
                      boxShadow: 'inset 0 0 24px rgba(0,0,0,0.8)'
                    }}
                  >
                    {/* White wood baseboards along the wall edges */}
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-white/20"></div>
                    <div className="absolute top-0 left-0 h-full w-[3px] bg-white/20"></div>
                  </div>

                  {/* Cozy Patterned Carpet */}
                  <div 
                    className="absolute"
                    style={{
                      width: '140px',
                      height: '110px',
                      bottom: '50px',
                      left: '70px',
                      transform: 'translate3d(0, 0, 1px)',
                      background: 'repeating-linear-gradient(45deg, #161622, #161622 8px, #201b2d 8px, #201b2d 16px)',
                      border: '1.5px solid rgba(255,255,255,0.05)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                      borderRadius: '8px',
                      transition: 'transform 1s ease-out, opacity 1s ease-out',
                      willChange: 'transform, opacity'
                    }}
                  ></div>

                  {/* Left Back Wall */}
                  <div 
                    className="absolute origin-bottom"
                    style={{ 
                      width: '288px', 
                      height: '140px', 
                      bottom: '288px', 
                      left: '0px',
                      transform: 'rotateX(-90deg)', 
                      transformStyle: 'preserve-3d',
                      backgroundColor: animationStep >= 3 ? '#12261e' : '#1b1b26', 
                      borderBottom: '2px solid rgba(255,255,255,0.08)',
                      borderLeft: '2px solid rgba(255,255,255,0.08)',
                      transition: 'background-color 1s cubic-bezier(0.25, 1, 0.5, 1), transform 1s cubic-bezier(0.25, 1, 0.5, 1)',
                      willChange: 'background-color'
                    }}
                  >
                    {/* Mock Window with Sky and cloud preview */}
                    <div className="absolute left-[130px] bottom-24 w-28 h-18 bg-gradient-to-b from-sky-400 to-sky-200 border-2 border-white/20 rounded flex items-center justify-center text-[8px] text-white/30 backdrop-blur-xs shadow-inner overflow-hidden">
                      <div className="absolute top-1 left-2 w-8 h-4 bg-white/40 rounded-full blur-xs"></div>
                      <div className="absolute top-3 right-3 w-10 h-5 bg-white/40 rounded-full blur-xs"></div>
                    </div>

                    {/* Abstract Art Frame 1 */}
                    <div 
                      className="absolute"
                      style={{
                        width: '32px',
                        height: '45px',
                        left: '40px',
                        bottom: '50px',
                        backgroundColor: '#fff',
                        border: '2px solid #1a1a24',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                        padding: '3px',
                        transform: 'translate3d(0, 0, 1px)',
                        transformStyle: 'preserve-3d',
                        transition: 'transform 1s cubic-bezier(0.25, 1, 0.5, 1)',
                        willChange: 'transform'
                      }}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-amber-500 rounded-xs"></div>
                    </div>

                    {/* Abstract Art Frame 2 */}
                    <div 
                      className="absolute"
                      style={{
                        width: '32px',
                        height: '45px',
                        left: '80px',
                        bottom: '50px',
                        backgroundColor: '#fff',
                        border: '2px solid #1a1a24',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                        padding: '3px',
                        transform: 'translate3d(0, 0, 1px)',
                        transformStyle: 'preserve-3d',
                        transition: 'transform 1s cubic-bezier(0.25, 1, 0.5, 1)',
                        willChange: 'transform'
                      }}
                    >
                      <div className="w-full h-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-sky-500 rounded-xs"></div>
                    </div>
                  </div>

                  {/* Right Back Wall */}
                  <div 
                    className="absolute origin-left"
                    style={{ 
                      width: '140px', 
                      height: '288px', 
                      left: '288px', 
                      top: '0px',
                      transform: 'rotateY(90deg)', 
                      transformStyle: 'preserve-3d',
                      backgroundColor: animationStep >= 3 ? '#12261e' : '#1b1b26', 
                      borderBottom: '2px solid rgba(255,255,255,0.08)',
                      borderRight: '2px solid rgba(255,255,255,0.08)',
                      transition: 'background-color 1s cubic-bezier(0.25, 1, 0.5, 1), transform 1s cubic-bezier(0.25, 1, 0.5, 1)',
                      willChange: 'background-color'
                    }}
                  >
                    {/* Mock Door with handle */}
                    <div className="absolute right-12 bottom-0 w-16 h-28 bg-[#8b5a2b]/25 border-2 border-white/20 rounded-t flex items-center justify-center text-[8px] text-white/30" style={{ transform: 'rotateY(-60deg)', transformOrigin: 'left' }}>
                      <div className="absolute left-2 top-1/2 w-1.5 h-1.5 rounded-full bg-yellow-600"></div>
                      Qapı
                    </div>
                  </div>

                  {/* 3D SOFA (Divan) */}
                  <div 
                    className="absolute"
                    style={{
                      width: '100px',
                      height: '50px',
                      bottom: '80px',
                      left: '90px',
                      transform: `translate3d(0, 0, ${animationStep >= 2 ? '0px' : '300px'}) scale(${animationStep >= 2 ? 1 : 0})`,
                      opacity: animationStep >= 2 ? 1 : 0,
                      transformStyle: 'preserve-3d',
                      transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out',
                      willChange: 'transform, opacity'
                    }}
                  >
                    {/* Top Cushion */}
                    <div className="absolute inset-0 bg-[#e0a96d] border border-[#c59159]" style={{ transform: 'translateZ(30px)' }}></div>
                    {/* Front Face */}
                    <div className="absolute origin-bottom" style={{ width: '100px', height: '30px', bottom: '0px', transform: 'rotateX(-90deg)', backgroundColor: '#c59159' }}></div>
                    {/* Right Face */}
                    <div className="absolute origin-left" style={{ width: '30px', height: '50px', left: '100px', transform: 'rotateY(90deg)', backgroundColor: '#a77642' }}></div>
                    
                    {/* Selected state indicator overlay */}
                    <div 
                      className="absolute -inset-1 border-2 border-indigo-400 rounded-lg animate-pulse pointer-events-none" 
                      style={{ 
                        transform: 'translate3d(0, 0, 15px)',
                        opacity: animationStep === 2 ? 1 : 0,
                        transition: 'opacity 0.5s ease-out',
                        willChange: 'opacity'
                      }}
                    ></div>
                  </div>

                  {/* 3D COFFEE TABLE (Masa) */}
                  <div 
                    className="absolute"
                    style={{
                      width: '60px',
                      height: '40px',
                      bottom: '150px',
                      left: '110px',
                      transform: `translate3d(0, 0, ${animationStep >= 2 ? '0px' : '300px'}) scale(${animationStep >= 2 ? 1 : 0})`,
                      opacity: animationStep >= 2 ? 1 : 0,
                      transformStyle: 'preserve-3d',
                      transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out',
                      transitionDelay: '150ms',
                      willChange: 'transform, opacity'
                    }}
                  >
                    {/* Glass Top */}
                    <div className="absolute inset-0 bg-white/20 border border-white/20 backdrop-blur-xs" style={{ transform: 'translateZ(18px)' }}></div>
                    {/* Metal Legs */}
                    <div className="absolute w-1.5 h-1.5 bg-neutral-600" style={{ bottom: '0px', left: '0px', transform: 'translateZ(0px) rotateX(90deg)', height: '18px' }}></div>
                    <div className="absolute w-1.5 h-1.5 bg-neutral-600" style={{ bottom: '0px', right: '0px', transform: 'translateZ(0px) rotateX(90deg)', height: '18px' }}></div>
                    <div className="absolute w-1.5 h-1.5 bg-neutral-600" style={{ top: '0px', left: '0px', transform: 'translateZ(0px) rotateX(90deg)', height: '18px' }}></div>
                    <div className="absolute w-1.5 h-1.5 bg-neutral-600" style={{ top: '0px', right: '0px', transform: 'translateZ(0px) rotateX(90deg)', height: '18px' }}></div>
                  </div>

                  {/* 3D DECORATIVE PLANT (Dibçək) */}
                  <div 
                    className="absolute"
                    style={{
                      width: '30px',
                      height: '30px',
                      bottom: '35px',
                      left: '35px',
                      transform: `translate3d(0, 0, ${animationStep >= 2 ? '0px' : '300px'}) scale(${animationStep >= 2 ? 1 : 0})`,
                      opacity: animationStep >= 2 ? 1 : 0,
                      transformStyle: 'preserve-3d',
                      transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out',
                      transitionDelay: '300ms',
                      willChange: 'transform, opacity'
                    }}
                  >
                    {/* Pot */}
                    <div className="absolute inset-0 bg-neutral-100 border border-neutral-300 rounded-full" style={{ transform: 'translateZ(25px)' }}></div>
                    <div className="absolute w-7 h-10 bg-neutral-300" style={{ bottom: '0px', left: '0px', transform: 'translateZ(0px) rotateX(90deg)', borderRadius: '50%' }}></div>
                    {/* Green Leaves */}
                    <div className="absolute w-9 h-9 bg-emerald-500 rounded-full shadow-lg" style={{ bottom: '-3px', left: '-3px', transform: 'translateZ(35px) rotateX(10deg)' }}></div>
                    <div className="absolute w-7 h-7 bg-emerald-600 rounded-full" style={{ bottom: '5px', left: '6px', transform: 'translateZ(42px) rotateY(15deg)' }}></div>
                  </div>

                  {/* 3D TV & TV STAND (TV Konsolu) */}
                  <div 
                    className="absolute"
                    style={{
                      width: '120px',
                      height: '25px',
                      bottom: '250px',
                      left: '80px',
                      transform: `translate3d(0, 0, ${animationStep >= 2 ? '0px' : '300px'}) scale(${animationStep >= 2 ? 1 : 0})`,
                      opacity: animationStep >= 2 ? 1 : 0,
                      transformStyle: 'preserve-3d',
                      transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out',
                      transitionDelay: '200ms',
                      willChange: 'transform, opacity'
                    }}
                  >
                    {/* Top Console Wood */}
                    <div className="absolute inset-0 bg-[#2d2d38] border border-white/10" style={{ transform: 'translateZ(15px)' }}></div>
                    {/* Front Console */}
                    <div className="absolute origin-bottom" style={{ width: '120px', height: '15px', bottom: '0px', transform: 'rotateX(-90deg)', backgroundColor: '#1d1d25' }}></div>
                    {/* Side Console */}
                    <div className="absolute origin-left" style={{ width: '15px', height: '25px', left: '120px', transform: 'rotateY(90deg)', backgroundColor: '#14141c' }}></div>

                    {/* TV Screen */}
                    <div 
                      className="absolute"
                      style={{
                        width: '90px',
                        height: '55px',
                        bottom: '12px',
                        left: '15px',
                        transform: 'translateZ(15px) rotateX(90deg)',
                        transformOrigin: 'bottom',
                        backgroundColor: '#070709',
                        border: '2px solid #1a1a24',
                        boxShadow: '0 -4px 12px rgba(0,0,0,0.6)',
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10"></div>
                      <div className="absolute bottom-1 left-1 bg-[#ef4444] w-1 h-1 rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  {/* 3D MODERN FLOOR LAMP (Torser) */}
                  <div 
                    className="absolute"
                    style={{
                      width: '20px',
                      height: '20px',
                      bottom: '210px',
                      left: '20px',
                      transform: `translate3d(0, 0, ${animationStep >= 2 ? '0px' : '300px'}) scale(${animationStep >= 2 ? 1 : 0})`,
                      opacity: animationStep >= 2 ? 1 : 0,
                      transformStyle: 'preserve-3d',
                      transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out',
                      transitionDelay: '350ms',
                      willChange: 'transform, opacity'
                    }}
                  >
                    {/* Lamp base */}
                    <div className="absolute inset-0 bg-[#d4af37] rounded-full" style={{ transform: 'translateZ(2px)' }}></div>
                    {/* Lamp stem */}
                    <div className="absolute w-1 h-1 bg-[#d4af37]" style={{ bottom: '9px', left: '9px', transform: 'translateZ(0px) rotateX(90deg)', height: '70px' }}></div>
                    {/* Lamp shade */}
                    <div className="absolute w-8 h-8 bg-neutral-100 border border-neutral-300 rounded-full" style={{ bottom: '-4px', left: '-4px', transform: 'translateZ(70px)' }}>
                      <div className={`absolute inset-0 rounded-full bg-yellow-300/40 blur-xs transition-opacity duration-1000 ${animationStep >= 3 ? 'opacity-100' : 'opacity-20'}`}></div>
                    </div>
                    {/* Emissive Lamp Glow on the Floor */}
                    <div 
                      className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-yellow-300/10 blur-xl pointer-events-none"
                      style={{ 
                        transform: `translate3d(0, 0, 1px) scale(${animationStep >= 3 ? 1 : 0.5})`,
                        opacity: animationStep >= 3 ? 1 : 0,
                        transition: 'transform 1s cubic-bezier(0.25, 1, 0.5, 1), opacity 1s ease-out',
                        willChange: 'transform, opacity'
                      }}
                    ></div>
                  </div>

                  {/* Red Measurement Ruler (Ruler Tool) */}
                  <div 
                    className="absolute pointer-events-none"
                    style={{ 
                      width: '90px', 
                      height: '1px', 
                      bottom: '105px', 
                      left: '0px', 
                      borderTop: '1px dashed #ef4444',
                      transform: 'translate3d(0, 0, 10px)',
                      transformStyle: 'preserve-3d',
                      opacity: animationStep >= 2 ? 1 : 0,
                      transition: 'opacity 0.5s ease-out',
                      willChange: 'opacity'
                    }}
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[7px] font-mono font-bold px-1 rounded transform rotate-45 select-none shadow">1.20 m</div>
                  </div>

                  {/* AI Magic Erase Overlay (Step 5 Showcase) */}
                  <div 
                    className="absolute bg-purple-500/10 border-2 border-dashed border-purple-500 rounded-xl animate-pulse pointer-events-none"
                    style={{
                      width: '70px',
                      height: '70px',
                      bottom: '160px',
                      left: '190px',
                      transform: 'translate3d(0, 0, 12px)',
                      transformStyle: 'preserve-3d',
                      opacity: animationStep === 4 ? 1 : 0,
                      transition: 'opacity 0.5s ease-out',
                      willChange: 'opacity'
                    }}
                  >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-[6px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap shadow-lg">✨ AI Məhv Et (Erase)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. MOCK PROPERTIES PANEL (Right) */}
            <div className="hidden lg:flex w-1/5 bg-neutral-900 border-l border-white/5 p-4 flex-col gap-4 text-neutral-400 text-[9px] select-none z-10">
              <div>
                <div className="text-white font-bold tracking-wider uppercase text-[8px] opacity-75 mb-3">Xüsusiyyətlər</div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1 gap-2"><span className="opacity-60 shrink-0">Seçilən:</span> <span className="text-white font-semibold truncate min-w-0">{animationStep >= 2 ? 'Modern Divan' : 'Seçilməyib'}</span></div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1"><span className="opacity-60">Ölçü X:</span> <span>{animationStep >= 2 ? '1.20 m' : '0.00 m'}</span></div>
                    <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: animationStep >= 2 ? '65%' : '0%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1"><span className="opacity-60">Ölçü Z:</span> <span>{animationStep >= 2 ? '-0.85 m' : '0.00 m'}</span></div>
                    <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: animationStep >= 2 ? '40%' : '0%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-white/5 pt-3">
                <div className="text-white font-bold tracking-wider uppercase text-[8px] opacity-75 mb-2.5">Material Rəngi</div>
                <div className="flex gap-2">
                  <span 
                    className="w-4 h-4 rounded-full border border-white/20 bg-white cursor-pointer"
                    style={{
                      transform: `scale(${animationStep < 3 ? 1.25 : 1})`,
                      boxShadow: animationStep < 3 ? '0 0 0 2px #6366f1' : 'none',
                      transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease-out',
                      willChange: 'transform, box-shadow'
                    }}
                  ></span>
                  <span className="w-4 h-4 rounded-full border border-white/20 bg-neutral-600 cursor-pointer hover:scale-110"></span>
                  <span className="w-4 h-4 rounded-full border border-white/20 bg-amber-800 cursor-pointer hover:scale-110"></span>
                  <span 
                    className="w-4 h-4 rounded-full border border-white/20 bg-emerald-700 cursor-pointer"
                    style={{
                      transform: `scale(${animationStep >= 3 ? 1.25 : 1})`,
                      boxShadow: animationStep >= 3 ? '0 0 0 2px #6366f1' : 'none',
                      transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease-out',
                      willChange: 'transform, box-shadow'
                    }}
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>


      {/* Features Section */}
      <section id="features" className="bg-white border-t border-[#E5DCC5] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-neutral-900 mb-4">Niyə SpaceCraft?</h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">Biz qarmaqarışıq və ağır 3D proqramlarını sadələşdirdik, müasir bulud və AI texnologiyaları ilə brauzerinizə gətirdik.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 - AI Dizayner */}
            <div className="p-8 rounded-3xl bg-[#FAFAF8] border border-[#E5DCC5] hover:-translate-y-1 hover:shadow-xl hover:border-amber-200/80 transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-[#E5DCC5] mb-6 shadow-sm">
                <Sparkles className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Dizayner</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">Otağınızın ölçülərini daxil edin və Süni İntellekt (Gemini) bir saniyədə ideal mebel yerləşimi ilə tam dizayn təklif etsin.</p>
            </div>
            
            {/* Card 2 - Canlı Kollaborasiya */}
            <div className="p-8 rounded-3xl bg-[#FAFAF8] border border-[#E5DCC5] hover:-translate-y-1 hover:shadow-xl hover:border-indigo-200/80 transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-[#E5DCC5] mb-6 shadow-sm">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Canlı Kollaborasiya</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">Eynilə Figma və Google Docs kimi, müştərilərinizlə eyni vaxtda otağa daxil olub canlı dəyişikliklər və müzakirələr edin.</p>
            </div>

            {/* Card 3 - CSG Memarlıq */}
            <div className="p-8 rounded-3xl bg-[#FAFAF8] border border-[#E5DCC5] hover:-translate-y-1 hover:shadow-xl hover:border-emerald-200/80 transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-[#E5DCC5] mb-6 shadow-sm">
                <Layers className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">CSG Memarlıq</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">Qalınlığı olan real 3D divarlar yaradın. Qapı və pəncərə əlavə edərkən divarlarda avtomatik deşiklər açılsın.</p>
            </div>

            {/* Card 4 - Sürətli Render */}
            <div className="p-8 rounded-3xl bg-[#FAFAF8] border border-[#E5DCC5] hover:-translate-y-1 hover:shadow-xl hover:border-rose-200/80 transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-[#E5DCC5] mb-6 shadow-sm">
                <Camera className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Sürətli Render</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">Ağır kompüterlərə ehtiyac yoxdur. Bir kliklə buludda real işıqlandırma, kölgələr və 360° panoramik görüntülər yaradın.</p>
            </div>

            {/* Card 5 - Ağıllı Smeta */}
            <div className="p-8 rounded-3xl bg-[#FAFAF8] border border-[#E5DCC5] hover:-translate-y-1 hover:shadow-xl hover:border-blue-200/80 transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-[#E5DCC5] mb-6 shadow-sm">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Ağıllı Smeta</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">İstifadə etdiyiniz bütün mebel və materialların qiymətini, sayını və ölçülərini avtomatik hesablayan PDF hesabatları çıxarın.</p>
            </div>

            {/* Card 6 - Dərhal Paylaşım */}
            <div className="p-8 rounded-3xl bg-[#FAFAF8] border border-[#E5DCC5] hover:-translate-y-1 hover:shadow-xl hover:border-violet-200/80 transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-[#E5DCC5] mb-6 shadow-sm">
                <Share2 className="w-6 h-6 text-violet-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Dərhal Paylaşım</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">Layihələrinizi dərhal buluda yükləyin və sadəcə bir keçid (link) göndərməklə müştərinizə istənilən cihazda açdırın.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-[#FAFAF8] border-t border-[#E5DCC5] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-neutral-900 mb-4">Üç Sadə Addımda Dizayn</h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">Mürəkkəb interyer proqramlarını öyrənməyə günlər sərf etməyin. Biz hər şeyi sadələşdirdik.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="relative flex flex-col items-start">
              <div className="text-7xl font-black bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent opacity-20 mb-4 select-none">01</div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Səhnəni Hazırlayın</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Otağınızın ölçülərini daxil edin və ya divarları sərbəst şəkildə çəkin. Divarlara asanlıqla qapı və pəncərələr əlavə edin.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-start">
              <div className="text-7xl font-black bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent opacity-20 mb-4 select-none">02</div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">AI Generasiya və Materiallar</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Süni intellekt (Gemini) bir saniyədə ideal mebel düzülüşünü təklif etsin. Mebellərin rəngini və materiallarını zövqünüzə görə seçin.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-start">
              <div className="text-7xl font-black bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent opacity-20 mb-4 select-none">03</div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Render və Canlı Gəzinti</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Bulud render texnologiyası ilə real işıqlandırmalı şəkillər çıxarın. Virtual Reallıq (VR) dəstəyi ilə dizaynınızın daxilində addımlayın.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="bg-[#FAFAF8] py-24 border-t border-[#E5DCC5]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white p-12 md:p-16 text-center border border-white/10 shadow-2xl">
            {/* Ambient Glows */}
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
              Dizayn Səyahətinizə Bu Gün Başlayın
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto mb-10 text-base md:text-lg leading-relaxed">
              Heç bir quraşdırma tələb olunmur. Saniyələr ərzində qeydiyyatdan keçin və Süni İntellekt dəstəkli 3D memarlıq və interyer dizayn dünyasına daxil olun.
            </p>
            <div className="flex justify-center">
              <Link 
                href="/editor" 
                className="bg-white hover:bg-neutral-100 text-neutral-900 px-8 py-4 rounded-full text-base font-bold transition-all flex items-center gap-2 shadow-xl hover:-translate-y-0.5 hover:shadow-white/10"
              >
                İndi Dizayna Başla <ArrowRight className="w-5 h-5 text-neutral-900" />
              </Link>
            </div>
          </div>
        </div>
      </section>

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
