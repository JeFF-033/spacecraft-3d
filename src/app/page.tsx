"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, Box, Sparkles, Layers, Users, Camera, FileText, Share2, 
  Check, Play, Shield, Zap, Eye, ChevronRight, Star, Globe, Download,
  Maximize2, Move, RotateCcw, Ruler, Grid
} from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroVideoModal from "@/components/HeroVideoModal";
import Interactive3DPreview from "@/components/Interactive3DPreview";

export default function LandingPage() {
  const [animationStep, setAnimationStep] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#09090B] text-neutral-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* Navbar Header */}
      <Navbar />

      {/* Hero Video Showcase Modal */}
      <HeroVideoModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
      />

      {/* HERO SECTION WITH LUXURY VIDEO & AMBIENT GLOW BACKDROP */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Looping Ambient Architectural Video Overlay */}
        <div className="absolute inset-0 -z-20 overflow-hidden opacity-25">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105 filter blur-[2px] transition-opacity duration-1000"
            src="https://cdn.coverr.co/videos/coverr-modern-interior-architecture-design-6756/1080p.mp4"
            poster="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
          />
          {/* Darkness Vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#09090B]/90 via-[#09090B]/80 to-[#09090B]"></div>
        </div>

        {/* Ambient Pulsing Radial Lights */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none -z-10 animate-ambient-glow"></div>
        <div className="absolute top-40 right-1/4 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none -z-10 animate-ambient-glow" style={{ animationDelay: '3s' }}></div>

        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center relative z-10">
          
          {/* Status Pill Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-neutral-900/90 border border-white/10 text-neutral-300 text-xs font-semibold mb-8 shadow-2xl backdrop-blur-md hover:border-indigo-500/50 transition-all cursor-pointer group"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="group-hover:text-white transition-colors">SpaceCraft 3D v2.5 SaaS — İndi Canlıdır!</span>
            <ChevronRight className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
          </motion.div>

          {/* Main Hero Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight text-white max-w-5xl leading-[1.08] mb-8 uppercase"
          >
            İnteryer Dizaynını <br />
            <span className="relative inline-block my-1 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-indigo-300">
              Brauzerdə
            </span>{" "}
            <span className="inline-block bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Yenidən Kəşf Et
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-xl text-neutral-400 max-w-3xl mb-12 leading-relaxed font-light"
          >
            Peşəkar proqramlara ehtiyac duymadan, süni intellekt dəstəkli və komanda ilə eyni anda işləyə biləcəyiniz ilk bulud əsaslı <span className="text-white font-medium">3D memarlıq və dizayn platforması</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-5"
          >
            <Link 
              href="/editor" 
              className="relative group overflow-hidden rounded-full p-[1.5px] w-full sm:w-auto font-bold text-base shadow-2xl shadow-indigo-600/30"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 rounded-full animate-gradient-x"></span>
              <span className="relative px-9 py-4 rounded-full bg-indigo-600 text-white flex items-center justify-center gap-3 group-hover:bg-indigo-500 transition-all font-extrabold whitespace-nowrap">
                <span>Ödənişsiz Sına</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <button 
              onClick={() => setIsVideoModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold text-neutral-200 bg-neutral-900/90 border border-white/15 hover:bg-neutral-800 hover:border-white/30 transition-all shadow-xl backdrop-blur-md flex items-center justify-center gap-3 group hover:-translate-y-0.5"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
              <span>🎬 Nümayiş Videosu</span>
            </button>
          </motion.div>

          {/* Stat Ticker Badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 pt-8 border-t border-white/10 text-neutral-400 w-full max-w-4xl"
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-black text-white">4K UHD</span>
              <span className="text-xs text-neutral-400 font-mono mt-1">Real-Time Raytracing</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-black text-indigo-400">10x Daha Sürətli</span>
              <span className="text-xs text-neutral-400 font-mono mt-1">AI Generasiya Motoru</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-black text-emerald-400">100% Bulud</span>
              <span className="text-xs text-neutral-400 font-mono mt-1">Quraşdırma Tələb Olunmur</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-black text-amber-400">Multi-Player</span>
              <span className="text-xs text-neutral-400 font-mono mt-1">Canlı Komanda İş birliyi</span>
            </div>
          </motion.div>

          {/* HEAVILY UPGRADED INTERACTIVE BROWSER EDITOR MOCKUP FRAME */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="w-full mt-20 relative rounded-3xl border border-white/15 bg-neutral-900/90 shadow-2xl p-2 sm:p-3 max-w-6xl backdrop-blur-xl"
          >
            {/* Top Browser Header Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-neutral-950/80 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <div className="ml-4 text-xs font-mono text-neutral-400 hidden sm:inline">spacecraft-3d.com/editor</div>
              </div>

              {/* Active stage tracker */}
              <div className="flex items-center gap-2 text-[11px] font-bold text-neutral-200 bg-neutral-900 px-3.5 py-1 rounded-full border border-white/15 whitespace-nowrap shrink-0 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                {animationStep === 0 && "Addım 1: Səhnə Hazırlığı"}
                {animationStep === 1 && "Addım 2: AI Generasiya"}
                {animationStep === 2 && "Addım 3: Mebel Yerləşimi"}
                {animationStep === 3 && "Addım 4: Rəng və Materiallar"}
                {animationStep === 4 && "Addım 5: Magic Erase (Ağıllı Silmə)"}
              </div>
            </div>

            {/* Interactive Mock Canvas Viewport */}
            <div className="aspect-[16/9] bg-[#090a10] rounded-b-2xl overflow-hidden relative flex text-neutral-300 border border-white/5">
              
              {/* COLLABORATIVE MULTIPLAYER CURSORS */}
              {/* Sarah Cursor (Purple) */}
              <div 
                className="absolute z-30 pointer-events-none flex items-center gap-1.5"
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
                <svg className="w-4 h-4 text-purple-400 fill-current drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]" viewBox="0 0 24 24">
                  <path d="M4 3l15 9-6.5 2 4.5 5.5-2.5 2-4.5-5.5L4 18z" />
                </svg>
                <div className="bg-purple-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow-lg border border-purple-400/40 whitespace-nowrap flex items-center gap-1">
                  <span>Sarah</span>
                  <span className="text-[7px] opacity-75 font-mono">X:2.4m</span>
                </div>
              </div>

              {/* Alex Cursor (Green) */}
              <div 
                className="absolute z-30 pointer-events-none flex items-center gap-1.5"
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
                <svg className="w-4 h-4 text-emerald-400 fill-current drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]" viewBox="0 0 24 24">
                  <path d="M4 3l15 9-6.5 2 4.5 5.5-2.5 2-4.5-5.5L4 18z" />
                </svg>
                <div className="bg-emerald-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow-lg border border-emerald-400/40 whitespace-nowrap flex items-center gap-1">
                  <span>Alex (Architect)</span>
                  <span className="text-[7px] opacity-75 font-mono">Y:1.8m</span>
                </div>
              </div>

              {/* Mock Sidebar Left */}
              <div className="hidden md:flex w-1/5 bg-neutral-950/90 border-r border-white/10 p-4 flex-col justify-between text-neutral-400 text-[10px] select-none z-20">
                <div>
                  <div className="text-white font-bold mb-4 tracking-wider uppercase text-[9px] opacity-80 flex items-center justify-between">
                    <span>SpaceCraft Kataloq</span>
                    <span className="text-indigo-400 text-[8px] font-mono">10,000+</span>
                  </div>
                  <div className="space-y-2">
                    <div className={`flex items-center gap-2 p-2 rounded-xl transition-all font-semibold ${animationStep === 2 ? 'bg-indigo-600/30 text-white border border-indigo-500/40 shadow-lg' : 'hover:bg-white/5 text-neutral-400'}`}>
                      <span>🛋️</span> <span className="truncate">Modern Divan</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/5 font-semibold text-neutral-400">
                      <span>🪴</span> <span className="truncate">Dekorativ Bitki</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/5 font-semibold text-neutral-400">
                      <span>🖥️</span> <span className="truncate">İş Masası</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/5 font-semibold text-neutral-400">
                      <span>💡</span> <span className="truncate">Spot İşıq</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-between items-center text-[9px]">
                  <span className="font-mono text-neutral-400">3D Memarlıq v2.5</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
              </div>

              {/* Main Canvas Center Grid */}
              <div className="flex-1 relative flex items-center justify-center p-6 overflow-hidden">
                {/* Architectural Grid & Ruler Lines */}
                <div className="absolute inset-0 bg-[#090a10]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                
                {/* Measurement Rulers */}
                <div className="absolute top-2 left-6 right-6 flex justify-between text-[8px] font-mono text-white/30 pointer-events-none">
                  <span>0.0m</span>
                  <span>1.5m</span>
                  <span>3.0m</span>
                  <span>4.5m</span>
                </div>

                {/* Floating Gemini AI Overlay */}
                <div 
                  className="absolute top-6 left-1/2 bg-gradient-to-r from-purple-950/90 to-indigo-950/90 border border-indigo-500/40 rounded-2xl px-5 py-2.5 flex items-center gap-3 shadow-2xl backdrop-blur-md z-20 text-white text-[11px]"
                  style={{
                    transform: `translate3d(-50%, ${animationStep === 1 ? '0px' : '-10px'}, 0) scale(${animationStep === 1 ? 1 : 0.95})`,
                    opacity: animationStep === 1 ? 1 : 0,
                    transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease-out',
                  }}
                >
                  <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                  <span className="font-semibold">Gemini AI: "Lüks modern otaq konsepti generasiya olunur..."</span>
                </div>

                {/* 3D Room Interactive Card Graphics */}
                <div className="relative w-80 h-80 flex items-center justify-center z-10">
                  <div className="w-72 h-72 rounded-3xl bg-neutral-950/90 border border-white/15 p-5 shadow-2xl flex flex-col justify-between relative overflow-hidden backdrop-blur-xl">
                    <div className="absolute -top-10 -right-10 w-36 h-36 bg-indigo-600/20 rounded-full blur-2xl pointer-events-none"></div>
                    
                    <div className="flex justify-between items-center text-xs font-bold text-neutral-200">
                      <div className="flex items-center gap-2">
                        <Box className="w-4 h-4 text-indigo-400" />
                        <span>Otaq #104</span>
                      </div>
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">Active 3D</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 my-4">
                      <div className={`p-3 rounded-2xl border transition-all ${animationStep >= 2 ? 'bg-indigo-950/50 border-indigo-500/40 shadow-lg' : 'bg-neutral-900/50 border-white/5'}`}>
                        <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Divan Seçimi</div>
                        <div className="text-xs font-bold text-white mt-1">Velvet Sofistike</div>
                      </div>
                      <div className={`p-3 rounded-2xl border transition-all ${animationStep >= 3 ? 'bg-amber-950/50 border-amber-500/40 shadow-lg' : 'bg-neutral-900/50 border-white/5'}`}>
                        <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">İşıqlandırma</div>
                        <div className="text-xs font-bold text-white mt-1">Warm Ambient</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[9px] text-neutral-400 pt-3 border-t border-white/10 font-mono">
                      <span>FPS: 120</span>
                      <span>Latency: 12ms</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* FEATURED SHOWCASE BANNER — MERIDIAN STYLE CINEMATIC SECTION */}
      <section className="py-24 border-y border-white/10 bg-neutral-950 relative overflow-hidden" id="showcase">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-indigo-400 uppercase tracking-widest mb-3">
                <Sparkles className="w-4 h-4" /> Cinematic Nümayiş
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
                3D Memarlığın <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-amber-300">Yeni Standartı</span>
              </h2>
            </div>

            <p className="text-neutral-400 max-w-md text-sm leading-relaxed">
              SpaceCraft 3D ilə hər bir detal real vaxtda işıqlandırılır, istənilən bucaqdan 4K keyfiyyətində cinematic görüntülər əldə edilir.
            </p>
          </div>

          {/* Interactive Live 3D Room Showcase Component */}
          <Interactive3DPreview />

        </div>
      </section>

      {/* FEATURES GRID SECTION */}
      <section className="py-32 relative" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-6">
              Niyə SpaceCraft 3D?
            </h2>
            <p className="text-base sm:text-lg text-neutral-400">
              Gələcəyin memarlıq və interyer dizayn alətlərini bir brauzer pəncərəsində birləşdirdik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="p-8 rounded-3xl bg-neutral-900/60 border border-white/10 hover:border-indigo-500/50 transition-all shadow-2xl relative overflow-hidden group"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Dəstəkli Dizayn</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Mətn əmrləri ilə otağınızın üslubunu, rənglərini və mebel quruluşunu saniyələr içində avtomatik dəyişdirin.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="p-8 rounded-3xl bg-neutral-900/60 border border-white/10 hover:border-purple-500/50 transition-all shadow-2xl relative overflow-hidden group"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Canlı Komanda İş Birliyi</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Müştəriniz və ya komandanızla eyni 3D səhnədə eyni anda kursor hərəkətlərini görərək işləyin.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="p-8 rounded-3xl bg-neutral-900/60 border border-white/10 hover:border-amber-500/50 transition-all shadow-2xl relative overflow-hidden group"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Ultra HD Render</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Yüksək güclü bulud serverləri vasitəsilə 4K keyfiyyətində fotorealistik görüntülər hazırlayın.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW SECTION */}
      <section className="py-24 bg-neutral-950 border-t border-white/10" id="gallery">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-16 gap-4">
            <div>
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">Qalereya Showcase</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
                Hazırlanmış Lüks Dizaynlar
              </h2>
            </div>
            <Link 
              href="/gallery" 
              className="inline-flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <span>Bütün Qalereyaya Bax</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative rounded-3xl overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl aspect-[4/3]">
              <img 
                src="/images/gallery_bedroom.png" 
                alt="Bedroom Design"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                <span className="text-xs font-mono text-indigo-300">Modern Yataq Otağı</span>
                <h4 className="text-lg font-bold text-white">Minimalist Vibe</h4>
              </div>
            </div>

            <div className="group relative rounded-3xl overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl aspect-[4/3]">
              <img 
                src="/images/gallery_japandi.png" 
                alt="Japandi Style"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                <span className="text-xs font-mono text-amber-300">Japandi Estetika</span>
                <h4 className="text-lg font-bold text-white">Təbii Ağac & İşıq</h4>
              </div>
            </div>

            <div className="group relative rounded-3xl overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl aspect-[4/3]">
              <img 
                src="/images/gallery_kitchen.png" 
                alt="Luxury Kitchen"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                <span className="text-xs font-mono text-emerald-300">Lüks Mətbəx</span>
                <h4 className="text-lg font-bold text-white">Mərmər & Ada Konsepti</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 border-t border-white/10 bg-neutral-950 text-neutral-400 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Box className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-white">SpaceCraft 3D Platform</span>
          </div>

          <p className="text-neutral-500">
            © 2026 SpaceCraft 3D Inc. Bütün hüquqlar qorunur.
          </p>
        </div>
      </footer>
    </div>
  );
}
