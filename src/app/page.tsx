"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, Box, Sparkles, Layers, Users, Camera, FileText, Share2, 
  Check, Play, Shield, Zap, Eye, ChevronRight, Star, Globe, Download,
  Maximize2, Move, RotateCcw, Ruler, Grid, MousePointer, Paintbrush,
  Sun, Settings, Trash2, Lock, Plus, Sliders, RefreshCw
} from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroVideoModal from "@/components/HeroVideoModal";
import Interactive3DPreview from "@/components/Interactive3DPreview";

export default function LandingPage() {
  const [animationStep, setAnimationStep] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<"select" | "wall" | "furniture" | "material" | "ai">("select");
  const [activeViewMode, setActiveViewMode] = useState<"2d" | "3d" | "vr">("3d");

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

          {/* ULTRA-CLEAN, CONTINUOUSLY ANIMATED PREMIUM EDITOR SHOWCASE MOCKUP FRAME */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="w-full mt-20 relative rounded-3xl border border-white/15 bg-neutral-950/95 shadow-2xl p-2 sm:p-3 max-w-6xl backdrop-blur-2xl overflow-hidden"
          >
            {/* 1. TOP MAC OS STYLE BROWSER HEADER */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-neutral-900/90 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <div className="ml-4 text-xs font-mono text-neutral-400 hidden sm:inline flex items-center gap-2">
                  <Box className="w-3.5 h-3.5 text-indigo-400" />
                  <span>spacecraft-3d.com/editor/room-104</span>
                </div>
              </div>

              {/* Active Step Indicator Pill */}
              <div className="flex items-center gap-2 text-[11px] font-bold text-neutral-200 bg-neutral-950 px-3.5 py-1 rounded-full border border-white/15 whitespace-nowrap shrink-0 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                {animationStep === 0 && "Addım 1: Səhnə Planı & Ölçülər"}
                {animationStep === 1 && "Addım 2: Gemini AI Generasiyası"}
                {animationStep === 2 && "Addım 3: Mebel Layout Seçimi"}
                {animationStep === 3 && "Addım 4: Rəng Və Material Shading"}
                {animationStep === 4 && "Addım 5: Magic Erase (Silmə)"}
              </div>
            </div>

            {/* 2. ARCHITECTURAL TOP TOOLBAR DOCK */}
            <div className="px-4 py-2.5 bg-neutral-900/80 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Tool Selection Group */}
              <div className="flex items-center gap-1.5 bg-neutral-950/80 p-1 rounded-xl border border-white/10">
                <button 
                  onClick={() => setActiveTool("select")}
                  className={`p-2 rounded-lg transition-all flex items-center gap-1.5 font-bold cursor-pointer ${activeTool === "select" ? "bg-indigo-600 text-white shadow" : "text-neutral-400 hover:text-white"}`}
                >
                  <MousePointer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Seç</span>
                </button>
                <button 
                  onClick={() => setActiveTool("wall")}
                  className={`p-2 rounded-lg transition-all flex items-center gap-1.5 font-bold cursor-pointer ${activeTool === "wall" ? "bg-indigo-600 text-white shadow" : "text-neutral-400 hover:text-white"}`}
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Divar</span>
                </button>
                <button 
                  onClick={() => setActiveTool("furniture")}
                  className={`p-2 rounded-lg transition-all flex items-center gap-1.5 font-bold cursor-pointer ${activeTool === "furniture" ? "bg-indigo-600 text-white shadow" : "text-neutral-400 hover:text-white"}`}
                >
                  <Box className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Mebel</span>
                </button>
                <button 
                  onClick={() => setActiveTool("material")}
                  className={`p-2 rounded-lg transition-all flex items-center gap-1.5 font-bold cursor-pointer ${activeTool === "material" ? "bg-indigo-600 text-white shadow" : "text-neutral-400 hover:text-white"}`}
                >
                  <Paintbrush className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Material</span>
                </button>
                <button 
                  onClick={() => setActiveTool("ai")}
                  className={`p-2 rounded-lg transition-all flex items-center gap-1.5 font-bold cursor-pointer ${activeTool === "ai" ? "bg-purple-600 text-white shadow" : "text-neutral-400 hover:text-white"}`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">AI Assist</span>
                </button>
              </div>

              {/* View Mode Switcher */}
              <div className="flex items-center gap-1 bg-neutral-950/80 p-1 rounded-xl border border-white/10">
                <button 
                  onClick={() => setActiveViewMode("2d")}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${activeViewMode === "2d" ? "bg-indigo-600 text-white shadow" : "text-neutral-400 hover:text-white"}`}
                >
                  2D Plan
                </button>
                <button 
                  onClick={() => setActiveViewMode("3d")}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${activeViewMode === "3d" ? "bg-indigo-600 text-white shadow" : "text-neutral-400 hover:text-white"}`}
                >
                  3D Səhnə
                </button>
                <button 
                  onClick={() => setActiveViewMode("vr")}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${activeViewMode === "vr" ? "bg-indigo-600 text-white shadow" : "text-neutral-400 hover:text-white"}`}
                >
                  VR Gəzinti
                </button>
              </div>

              {/* Action Snap / Grid Toggles */}
              <div className="hidden lg:flex items-center gap-3 text-neutral-400 text-[11px] font-mono">
                <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  <Grid className="w-3 h-3" /> Grid: Snap 10cm
                </span>
                <span className="flex items-center gap-1 text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                  <Ruler className="w-3 h-3" /> Auto Dimensions
                </span>
              </div>
            </div>

            {/* 3. MAIN CLEAN EDITOR WORKSPACE */}
            <div className="aspect-[16/9] bg-[#08090e] rounded-b-2xl overflow-hidden relative flex text-neutral-300 border border-white/5">
              
              {/* CONTINUOUS 60FPS SMOOTH MULTIPLAYER CURSORS (No freezing/lagging!) */}
              {/* Sarah Cursor (Purple) */}
              <div className="absolute top-[40%] left-[25%] z-30 pointer-events-none flex items-center gap-1.5 animate-cursor-sarah">
                <svg className="w-4 h-4 text-purple-400 fill-current drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" viewBox="0 0 24 24">
                  <path d="M4 3l15 9-6.5 2 4.5 5.5-2.5 2-4.5-5.5L4 18z" />
                </svg>
                <div className="bg-purple-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow-xl border border-purple-400/40 whitespace-nowrap flex items-center gap-1">
                  <span>Sarah</span>
                  <span className="text-[7px] opacity-80 font-mono">X:2.4m</span>
                </div>
              </div>

              {/* Alex Cursor (Green) */}
              <div className="absolute top-[60%] right-[30%] z-30 pointer-events-none flex items-center gap-1.5 animate-cursor-alex">
                <svg className="w-4 h-4 text-emerald-400 fill-current drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" viewBox="0 0 24 24">
                  <path d="M4 3l15 9-6.5 2 4.5 5.5-2.5 2-4.5-5.5L4 18z" />
                </svg>
                <div className="bg-emerald-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow-xl border border-emerald-400/40 whitespace-nowrap flex items-center gap-1">
                  <span>Alex (Architect)</span>
                  <span className="text-[7px] opacity-80 font-mono">Y:1.8m</span>
                </div>
              </div>

              {/* LEFT SIDEBAR PANEL (Clean Catalogue & Layers) */}
              <div className="hidden md:flex w-1/5 bg-neutral-950/90 border-r border-white/10 p-3.5 flex-col justify-between text-neutral-400 text-[10px] select-none z-20">
                <div>
                  <div className="text-white font-bold mb-3 tracking-wider uppercase text-[9px] flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" /> SpaceCraft Kataloq
                    </span>
                    <span className="text-indigo-400 font-mono text-[8px]">10k+</span>
                  </div>

                  {/* Clean Furniture Items List */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-white font-semibold">
                      <span className="flex items-center gap-2">
                        <span>🛋️</span> <span className="truncate">Royal Blue Divan</span>
                      </span>
                      <span className="text-[8px] font-mono text-indigo-300">240cm</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 font-semibold text-neutral-400">
                      <span className="flex items-center gap-2">
                        <span>🪵</span> <span className="truncate">Carrara Mərmər Masa</span>
                      </span>
                      <span className="text-[8px] font-mono opacity-50">85cm</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 font-semibold text-neutral-400">
                      <span className="flex items-center gap-2">
                        <span>🪴</span> <span className="truncate">Dekorativ Bitki</span>
                      </span>
                      <span className="text-[8px] font-mono opacity-50">60cm</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 font-semibold text-neutral-400">
                      <span className="flex items-center gap-2">
                        <span>💡</span> <span className="truncate">Warm Floor Lamp</span>
                      </span>
                      <span className="text-[8px] font-mono opacity-50">180cm</span>
                    </div>
                  </div>

                  {/* Active Room Layer Tree */}
                  <div className="border-t border-white/10 pt-3">
                    <div className="text-neutral-400 font-bold uppercase tracking-wider text-[8px] mb-2 flex items-center justify-between">
                      <span>Səhnə Layları (Layers)</span>
                      <span className="text-emerald-400 font-mono">Active</span>
                    </div>
                    <div className="space-y-1 text-[9px]">
                      <div className="p-1.5 rounded bg-white/5 text-white flex items-center justify-between">
                        <span>🏠 Qonaq Otağı (18.5 m²)</span>
                        <Lock className="w-3 h-3 text-neutral-500" />
                      </div>
                      <div className="p-1.5 rounded bg-indigo-500/10 text-indigo-300 flex items-center justify-between border border-indigo-500/20">
                        <span>🛋️ Lüks Royal Blue Divan</span>
                        <Eye className="w-3 h-3 text-indigo-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-between items-center text-[9px] font-mono">
                  <span className="text-neutral-400">WebGL 2.0 GPU</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
              </div>

              {/* CENTER CANVAS VIEWPORT (CLEAN, SPACIOUS ARCHITECTURAL BLUEPRINT) */}
              <div className="flex-1 relative flex items-center justify-center p-6 overflow-hidden">
                {/* Architectural Grid Background */}
                <div className="absolute inset-0 bg-[#07080d]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                
                {/* Top Dimension Rulers */}
                <div className="absolute top-3 left-8 right-8 flex justify-between text-[9px] font-mono text-white/30 pointer-events-none">
                  <span>0.0m</span>
                  <span>1.5m</span>
                  <span>3.0m</span>
                  <span>4.5m</span>
                  <span>6.0m</span>
                </div>

                {/* Floating Gemini AI Prompt Chat Overlay */}
                <div 
                  className="absolute top-6 left-1/2 bg-gradient-to-r from-purple-950/90 to-indigo-950/90 border border-indigo-500/40 rounded-2xl px-5 py-2.5 flex items-center gap-3 shadow-2xl backdrop-blur-md z-20 text-white text-[11px]"
                  style={{
                    transform: `translate3d(-50%, ${animationStep === 1 ? '0px' : '-10px'}, 0) scale(${animationStep === 1 ? 1 : 0.95})`,
                    opacity: animationStep === 1 ? 1 : 0,
                    transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease-out',
                  }}
                >
                  <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                  <span className="font-semibold">Gemini AI: "Lüks modern otaq konsepti animasiya olunur..."</span>
                </div>

                {/* CLEAN, SPACIOUS ROOM BOUNDARY */}
                <div className="relative w-[360px] h-[300px] flex items-center justify-center z-10">
                  
                  {/* Clean Room Box */}
                  <div className="w-full h-full rounded-2xl border-2 border-indigo-500/50 bg-neutral-950/90 p-5 shadow-2xl relative flex flex-col justify-between backdrop-blur-xl">
                    
                    {/* Room Header Info */}
                    <div className="flex justify-between items-center text-xs font-bold text-neutral-200 border-b border-white/10 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Box className="w-4 h-4 text-indigo-400" />
                        <span>Qonaq Otağı Planı</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-0.5 rounded-full border border-emerald-500/20">
                        18.5 m² • 60 FPS
                      </span>
                    </div>

                    {/* Single Sleek Selected Object Card (Royal Blue Sofa) */}
                    <div className="my-auto p-4 rounded-2xl bg-indigo-950/60 border-2 border-indigo-500 shadow-xl relative">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white flex items-center gap-2">
                          <span>🛋️</span> Royal Blue Velvet Divan
                        </span>
                        <span className="text-[9px] font-mono text-indigo-300 bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                          240 × 95 cm
                        </span>
                      </div>
                    </div>

                    {/* Floorplan Footer Status */}
                    <div className="flex items-center justify-between text-[9px] text-neutral-400 pt-2 border-t border-white/10 font-mono">
                      <span>FPS: 120 (Smooth)</span>
                      <span>Latency: 8ms</span>
                      <span className="text-emerald-400">Cloud Sync: Active</span>
                    </div>

                  </div>
                </div>

              </div>

              {/* RIGHT SIDEBAR PANEL (Clean Object Inspector) */}
              <div className="hidden lg:flex w-1/5 bg-neutral-950/90 border-l border-white/10 p-3.5 flex-col justify-between text-neutral-300 text-[10px] select-none z-20">
                <div>
                  <div className="text-white font-bold mb-3 tracking-wider uppercase text-[9px] flex items-center gap-1.5 border-b border-white/10 pb-2">
                    <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Parametrlər Inspector
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-[8px] font-mono text-neutral-400 uppercase">Seçilmiş Obyekt</span>
                      <div className="text-xs font-bold text-white mt-0.5">🛋️ Royal Blue Velvet Divan</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[9px]">
                      <div className="bg-neutral-900 p-2 rounded-xl border border-white/5">
                        <span className="text-neutral-400">En (W)</span>
                        <div className="font-bold text-white font-mono mt-0.5">240 cm</div>
                      </div>
                      <div className="bg-neutral-900 p-2 rounded-xl border border-white/5">
                        <span className="text-neutral-400">Dərinlik (D)</span>
                        <div className="font-bold text-white font-mono mt-0.5">95 cm</div>
                      </div>
                    </div>

                    <div className="bg-neutral-900 p-2.5 rounded-xl border border-white/5 space-y-1">
                      <span className="text-[8px] font-mono text-neutral-400 uppercase">Pozisiya Koordinatları</span>
                      <div className="flex justify-between font-mono text-indigo-300 text-[9px]">
                        <span>X: 2.40m</span>
                        <span>Y: 1.80m</span>
                        <span>Z: 0.00m</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[8px] font-mono text-neutral-400 uppercase">Material Vurğusu</span>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="w-4 h-4 rounded-full bg-blue-600 border border-white/40"></span>
                        <span className="text-xs font-bold text-white">Royal Blue Velvet</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 space-y-2">
                  <button className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                    <Paintbrush className="w-3 h-3" /> Materialı Dəyiş
                  </button>
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
