"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, Box, Sparkles, Layers, Users, Camera, FileText, Share2, 
  Check, Play, Shield, Zap, Eye, ChevronRight, Star, Globe, Download,
  Maximize2, Move, RotateCcw, Ruler, Grid, MousePointer, Paintbrush,
  Sun, Settings, Trash2, Lock, Plus, Sliders, RefreshCw, Wand2, SlidersHorizontal
} from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroVideoModal from "@/components/HeroVideoModal";
import Interactive3DPreview from "@/components/Interactive3DPreview";

export default function LandingPage() {
  const [animationStep, setAnimationStep] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  
  // AI Laser Scanner Position (0 to 100%)
  const [scanPos, setScanPos] = useState(55);
  const [isAutoScanning, setIsAutoScanning] = useState(true);
  const [activePreset, setActivePreset] = useState<"japandi" | "luxury" | "emerald" | "nordic">("luxury");

  // Smooth Auto Scanning Effect
  useEffect(() => {
    if (!isAutoScanning) return;
    let direction = 1;
    const interval = setInterval(() => {
      setScanPos((prev) => {
        if (prev >= 85) direction = -1;
        if (prev <= 15) direction = 1;
        return prev + direction * 0.4;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoScanning]);

  const stylePresets = {
    luxury: {
      name: "Royal Velvet & Mərmər Lüks",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
      prompt: "✨ AI Prompt: Royal Blue Velvet Divan, Carrara Mərmər & Slatted Walnut Wall",
      badge: "AI 4K Render Engine"
    },
    japandi: {
      name: "Japandi Təbii Estetika",
      img: "/images/gallery_japandi.png",
      prompt: "✨ AI Prompt: Japandi Minimalist Təbii Ağac, Soft Warm Ambient Lights",
      badge: "Japandi v2.4"
    },
    emerald: {
      name: "Zümrüd Yaşıl & Qızıl Loft",
      img: "/images/gallery_kitchen.png",
      prompt: "✨ AI Prompt: Emerald Velvet Sofa, Brushed Brass Metal & Dark Obsidian Tile",
      badge: "Emerald Loft 4K"
    },
    nordic: {
      name: "Nordic Yataq Konsepti",
      img: "/images/gallery_bedroom.png",
      prompt: "✨ AI Prompt: Nordic White Linen Bed, Warm Wood Accents & Panoramic Window",
      badge: "Nordic Minimal"
    }
  };

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
              className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold text-neutral-200 bg-neutral-900/90 border border-white/15 hover:bg-neutral-800 hover:border-white/30 transition-all shadow-xl backdrop-blur-md flex items-center justify-center gap-3 group hover:-translate-y-0.5 cursor-pointer"
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

          {/* INNOVATIVE & TOTALLY UNIQUE HERO EDITOR: AI ARCHITECTURAL LASER SCAN TRANSFORMATION */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="w-full mt-20 relative rounded-3xl border border-white/15 bg-neutral-950/95 shadow-2xl p-2 sm:p-3 max-w-6xl backdrop-blur-2xl overflow-hidden"
          >
            {/* 1. MAC OS STYLE BROWSER HEADER */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-neutral-900/90 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <div className="ml-4 text-xs font-mono text-neutral-400 hidden sm:inline flex items-center gap-2">
                  <Wand2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span>spacecraft-3d.com/editor/ai-scan-engine</span>
                </div>
              </div>

              {/* Laser Scan Toggle & Status Badge */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsAutoScanning(!isAutoScanning)}
                  className="px-3 py-1 rounded-full bg-neutral-950 border border-white/15 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5 hover:border-cyan-400 transition-colors cursor-pointer"
                >
                  <span className={`w-2 h-2 rounded-full ${isAutoScanning ? 'bg-cyan-400 animate-ping' : 'bg-neutral-500'}`}></span>
                  <span>{isAutoScanning ? "Laser Scan: Avto" : "Laser Scan: Əl İlə"}</span>
                </button>
              </div>
            </div>

            {/* 2. TOP AI COMMAND & PRESET BAR */}
            <div className="px-4 py-3 bg-neutral-900/80 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Dynamic Prompt Header */}
              <div className="flex items-center gap-2 font-mono text-neutral-200 text-[11px] bg-neutral-950/80 px-3.5 py-1.5 rounded-xl border border-white/10">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="truncate max-w-md">{stylePresets[activePreset].prompt}</span>
              </div>

              {/* Style Presets Switcher */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                {(["luxury", "japandi", "emerald", "nordic"] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActivePreset(key)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activePreset === key 
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 scale-105 border border-indigo-400/40" 
                        : "bg-neutral-950/60 text-neutral-400 hover:text-white border border-white/10"
                    }`}
                  >
                    {stylePresets[key].name}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. DYNAMIC BEFORE/AFTER ARCHITECTURAL LASER SCANNER VIEWPORT */}
            <div 
              className="aspect-[16/9] md:aspect-[21/9] w-full rounded-b-2xl overflow-hidden relative select-none cursor-ew-resize group"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                setScanPos(Math.min(Math.max(x, 5), 95));
              }}
            >
              {/* LAYER 1: RAW 2D ARCHITECTURAL CAD BLUEPRINT (LEFT SIDE) */}
              <div className="absolute inset-0 bg-[#070913] p-8 flex items-center justify-center">
                {/* CAD Grid Background */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                {/* High-Precision Neon CAD Floorplan Blueprint Graphics */}
                <div className="relative w-full max-w-2xl aspect-[16/9] border-2 border-cyan-500/60 bg-neutral-950/90 rounded-2xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col justify-between">
                  {/* Dimension Annotations */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-950 border border-cyan-500/50 px-3 py-0.5 rounded text-[10px] font-mono text-cyan-300">
                    Otaq Sahəsi: 8.40m × 6.20m (52.08 m²)
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono text-cyan-400 border-b border-cyan-500/30 pb-3">
                    <span className="font-bold tracking-widest flex items-center gap-2">
                      <Ruler className="w-4 h-4" /> 2D ARCHITECTURAL CAD SKETCH
                    </span>
                    <span className="text-[10px] bg-cyan-500/10 px-2.5 py-0.5 rounded text-cyan-300 border border-cyan-500/20">
                      SCALE 1:50
                    </span>
                  </div>

                  {/* Wireframe Furniture Vectors */}
                  <div className="my-auto space-y-4">
                    {/* Sofa Wireframe Vector Box */}
                    <div className="p-4 border-2 border-dashed border-cyan-400/80 rounded-xl relative flex justify-between items-center text-cyan-300 text-xs font-mono bg-cyan-950/20">
                      <span className="font-bold">[SOFA_MODULE] W:240cm D:95cm</span>
                      <span className="text-[10px] text-cyan-400">VECTOR MESH #01</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 border border-dashed border-cyan-500/60 rounded-lg text-[11px] font-mono text-cyan-400 bg-cyan-950/10">
                        [COFFEE_TABLE] R:42cm
                      </div>
                      <div className="p-3 border border-dashed border-cyan-500/60 rounded-lg text-[11px] font-mono text-cyan-400 bg-cyan-950/10">
                        [ACCENT_PLANT] H:60cm
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono text-cyan-500 pt-3 border-t border-cyan-500/20">
                    <span>RAW CAD SKETCH</span>
                    <span>AI READY • 100% PRECISION</span>
                  </div>
                </div>
              </div>

              {/* LAYER 2: 4K PHOTOREALISTIC AI RENDERED INTERIOR (RIGHT SIDE, CLIPPED) */}
              <div 
                className="absolute inset-0"
                style={{ clipPath: `polygon(${scanPos}% 0, 100% 0, 100% 100%, ${scanPos}% 100%)` }}
              >
                <img 
                  src={stylePresets[activePreset].img} 
                  alt="4K Render Preview" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
                
                {/* 4K Render Tag Badge */}
                <div className="absolute top-6 right-6 bg-neutral-900/90 border border-white/20 px-4 py-2 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs font-bold text-white">
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>{stylePresets[activePreset].badge}</span>
                </div>
              </div>

              {/* LAYER 3: GLOWING NEON LASER BEAM DIVIDER LINE */}
              <div 
                className="absolute top-0 bottom-0 z-30 pointer-events-none"
                style={{ left: `${scanPos}%` }}
              >
                {/* Vertical Laser Beam Glow Line */}
                <div className="w-1 h-full bg-gradient-to-b from-cyan-300 via-indigo-400 to-amber-300 shadow-[0_0_25px_rgba(56,189,248,1)]"></div>

                {/* Center Laser Handle Control Indicator */}
                <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-9 h-9 rounded-full bg-cyan-500 border-2 border-white shadow-[0_0_20px_rgba(6,182,212,0.9)] flex items-center justify-center text-white pointer-events-auto cursor-ew-resize hover:scale-110 transition-transform">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
              </div>

              {/* MULTIPLAYER CURSORS ON SCANNED BLUEPRINT */}
              <div 
                className="absolute z-40 pointer-events-none flex items-center gap-1.5 animate-cursor-sarah"
                style={{ top: '35%', left: '25%' }}
              >
                <svg className="w-4 h-4 text-purple-400 fill-current drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" viewBox="0 0 24 24">
                  <path d="M4 3l15 9-6.5 2 4.5 5.5-2.5 2-4.5-5.5L4 18z" />
                </svg>
                <div className="bg-purple-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow-xl border border-purple-400/40 whitespace-nowrap">
                  Sarah (CAD Lead)
                </div>
              </div>

              <div 
                className="absolute z-40 pointer-events-none flex items-center gap-1.5 animate-cursor-alex"
                style={{ top: '60%', left: '70%' }}
              >
                <svg className="w-4 h-4 text-emerald-400 fill-current drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" viewBox="0 0 24 24">
                  <path d="M4 3l15 9-6.5 2 4.5 5.5-2.5 2-4.5-5.5L4 18z" />
                </svg>
                <div className="bg-emerald-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow-xl border border-emerald-400/40 whitespace-nowrap">
                  Alex (Render Engine)
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
