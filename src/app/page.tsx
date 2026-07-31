"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, ContactShadows, Html } from "@react-three/drei";
import * as THREE from "three";
import { 
  ArrowRight, Box, Sparkles, Layers, Users, Camera, FileText, Share2, 
  Check, Play, Shield, Zap, Eye, ChevronRight, Star, Globe, Download,
  Maximize2, Move, RotateCcw, Ruler, Grid, MousePointer, Paintbrush,
  Sun, Moon, Settings, Trash2, Lock, Plus, Sliders, RefreshCw, Wand2, SlidersHorizontal,
  Compass, Video
} from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroVideoModal from "@/components/HeroVideoModal";
import Interactive3DPreview from "@/components/Interactive3DPreview";

// Real 3D WebGL Studio Scene for Hero Showcase
function HeroInteractive3DScene({ materialType, lightingMood, activeHotspot, setActiveHotspot }: { 
  materialType: string; 
  lightingMood: string; 
  activeHotspot: string | null;
  setActiveHotspot: (name: string | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  const materialProps = React.useMemo(() => {
    switch (materialType) {
      case "marble":
        return { color: "#FFFFFF", roughness: 0.05, metalness: 0.1 };
      case "obsidian":
        return { color: "#27272A", roughness: 0.2, metalness: 0.85 };
      case "gold":
        return { color: "#F59E0B", roughness: 0.25, metalness: 0.9 };
      case "emerald":
        return { color: "#059669", roughness: 0.2, metalness: 0.3 };
      default: // wood
        return { color: "#9A3412", roughness: 0.5, metalness: 0.05 };
    }
  }, [materialType]);

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Polished Floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[5.2, 0.1, 5.2]} />
        <meshStandardMaterial color="#E5E7EB" roughness={0.12} metalness={0.15} />
      </mesh>

      {/* Rug */}
      <mesh position={[0, 0.01, 0.3]} receiveShadow>
        <boxGeometry args={[3.2, 0.02, 2.6]} />
        <meshStandardMaterial color="#4B5563" roughness={0.85} />
      </mesh>

      {/* Back Wall & Walnut Slats */}
      <mesh position={[0, 1.75, -2.45]} receiveShadow castShadow>
        <boxGeometry args={[5.2, 3.5, 0.1]} />
        <meshStandardMaterial color="#D1D5DB" roughness={0.5} />
      </mesh>

      {[-1.8, -1.5, -1.2, -0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9, 1.2, 1.5, 1.8].map((xPos, i) => (
        <mesh key={i} position={[xPos, 1.75, -2.38]} castShadow receiveShadow>
          <boxGeometry args={[0.15, 3.5, 0.04]} />
          <meshStandardMaterial color="#B45309" roughness={0.35} />
        </mesh>
      ))}

      {/* Fixed Glossy Black OLED TV Screen Panel */}
      <group position={[0, 2.3, -2.32]}>
        <mesh castShadow>
          <boxGeometry args={[2.0, 1.15, 0.04]} />
          <meshStandardMaterial color="#020617" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0, 0.023]}>
          <planeGeometry args={[1.92, 1.07]} />
          <meshStandardMaterial color="#09090B" roughness={0.03} metalness={0.95} />
        </mesh>
        <mesh position={[0, -0.5, 0.025]}>
          <planeGeometry args={[0.08, 0.015]} />
          <meshBasicMaterial color="#38BDF8" />
        </mesh>
      </group>

      {/* Royal Blue Sofa with Material Selection Pillows */}
      <group position={[0, 0.45, -0.6]} onClick={(e) => { e.stopPropagation(); setActiveHotspot("sofa"); }}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.8, 0.35, 1.3]} />
          <meshStandardMaterial color="#1E3A8A" roughness={0.6} />
        </mesh>
        {[-0.9, 0, 0.9].map((cx, i) => (
          <mesh key={i} position={[cx, 0.22, 0.05]} castShadow receiveShadow>
            <boxGeometry args={[0.86, 0.2, 1.15]} />
            <meshStandardMaterial color="#2563EB" roughness={0.55} />
          </mesh>
        ))}
        <mesh position={[0, 0.55, -0.5]} castShadow receiveShadow>
          <boxGeometry args={[2.8, 0.6, 0.3]} />
          <meshStandardMaterial color="#1E3A8A" roughness={0.6} />
        </mesh>
        <mesh position={[-1.3, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.25, 0.45, 1.3]} />
          <meshStandardMaterial color="#1E3A8A" roughness={0.6} />
        </mesh>
        <mesh position={[1.3, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.25, 0.45, 1.3]} />
          <meshStandardMaterial color="#1E3A8A" roughness={0.6} />
        </mesh>

        {/* Accent Pillows (Material Applies Here!) */}
        <mesh position={[-0.8, 0.45, -0.3]} rotation={[0, 0.2, 0.1]} castShadow>
          <boxGeometry args={[0.45, 0.4, 0.18]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh position={[0.8, 0.45, -0.3]} rotation={[0, -0.2, -0.1]} castShadow>
          <boxGeometry args={[0.45, 0.4, 0.18]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>

        {/* Gold Legs */}
        {[-1.3, 1.3].map((lx, i) =>
          [-0.5, 0.5].map((lz, j) => (
            <mesh key={`${i}-${j}`} position={[lx, -0.2, lz]} castShadow>
              <cylinderGeometry args={[0.035, 0.025, 0.25, 16]} />
              <meshStandardMaterial color="#F59E0B" metalness={0.95} roughness={0.1} />
            </mesh>
          ))
        )}

        <Html position={[0, 0.95, 0]} center>
          <button 
            onClick={() => setActiveHotspot(activeHotspot === "sofa" ? null : "sofa")}
            className="px-3.5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold border border-white/40 shadow-2xl backdrop-blur-md flex items-center gap-1.5 transition-transform hover:scale-110 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>Divan: Royal Blue Velvet</span>
          </button>
        </Html>
      </group>

      {/* Coffee Table (Material Applies Here!) */}
      <group position={[0, 0.2, 0.9]} onClick={(e) => { e.stopPropagation(); setActiveHotspot("table"); }}>
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.85, 0.85, 0.06, 32]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh position={[0, 0.07, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.5, 0.14, 32]} />
          <meshStandardMaterial color="#D97706" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0.2, 0.3, 0.1]} castShadow>
          <cylinderGeometry args={[0.08, 0.12, 0.25, 16]} />
          <meshStandardMaterial color="#38BDF8" roughness={0.1} />
        </mesh>

        <Html position={[0, 0.45, 0]} center>
          <button 
            onClick={() => setActiveHotspot(activeHotspot === "table" ? null : "table")}
            className="px-3.5 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold border border-white/40 shadow-2xl backdrop-blur-md flex items-center gap-1.5 transition-transform hover:scale-110 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Masa: Seçilmiş Material</span>
          </button>
        </Html>
      </group>

      {/* Floor Lamp */}
      <group position={[1.8, 1.2, -1.8]}>
        <mesh position={[0, -1.15, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.05, 32]} />
          <meshStandardMaterial color="#1E293B" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 2.3, 16]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.1, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.4, 0.45, 32]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} emissive="#FEF08A" emissiveIntensity={0.6} />
        </mesh>
        <pointLight position={[0, 1, 0]} intensity={4.5} color="#FEF08A" distance={5} />
      </group>

      {/* Plant */}
      <group position={[-1.8, 0.6, -1.6]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.2, 0.5, 32]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.2} />
        </mesh>
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <mesh position={[0, 0.25, 0]} castShadow>
            <dodecahedronGeometry args={[0.35, 1]} />
            <meshStandardMaterial color="#10B981" roughness={0.3} />
          </mesh>
        </Float>
      </group>

      <ContactShadows position={[0, 0.02, 0]} opacity={0.6} scale={6} blur={2.0} far={4} />
    </group>
  );
}

export default function LandingPage() {
  const [animationStep, setAnimationStep] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [materialType, setMaterialType] = useState<string>("marble");
  const [lightingMood, setLightingMood] = useState<string>("day");
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const materials = [
    { id: "marble", label: "İtalyan Mərmər", color: "bg-white border border-neutral-300" },
    { id: "obsidian", label: "Qara Obsidian", color: "bg-neutral-800 border border-white/20" },
    { id: "gold", label: "Qızıl Metallik", color: "bg-amber-400" },
    { id: "emerald", label: "Zümrüd Velvet", color: "bg-emerald-500" },
    { id: "wood", label: "Ceviz Ağacı", color: "bg-amber-800" },
  ];

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

          {/* FLAGSHIP ULTRA-WIDE 3D FLOATING GLASS STUDIO SHOWCASE CANVAS */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="w-full mt-20 relative rounded-3xl border border-white/20 bg-neutral-900/90 shadow-2xl p-4 sm:p-6 max-w-6xl backdrop-blur-2xl overflow-hidden"
          >
            {/* Header Toolbar Controls */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1 text-left">
                  <Sparkles className="w-4 h-4" /> SpaceCraft 3D Real-Time Render Engine
                </div>
                <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight text-left">
                  İnteraktiv 3D Otaq & Material Studio
                </h3>
              </div>

              {/* Lighting Mood Controls */}
              <div className="flex items-center gap-2 bg-neutral-950/80 p-1.5 rounded-2xl border border-white/10 shadow-inner">
                <button
                  onClick={() => setLightingMood("day")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    lightingMood === "day"
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-300" /> Parlaq Gündüz
                </button>
                <button
                  onClick={() => setLightingMood("sunset")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    lightingMood === "sunset"
                      ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" /> Günbatımı
                </button>
                <button
                  onClick={() => setLightingMood("night")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    lightingMood === "night"
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-indigo-300" /> Gecə Cyber
                </button>
              </div>
            </div>

            {/* 3D WebGL Canvas Viewport */}
            <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-2xl bg-[#1e2029] overflow-hidden border border-white/15 my-6 shadow-2xl">
              
              {/* ANIMATED MULTIPLAYER CURSORS */}
              <div className="absolute top-[35%] left-[22%] z-30 pointer-events-none flex items-center gap-1.5 animate-cursor-sarah">
                <svg className="w-4 h-4 text-purple-400 fill-current drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" viewBox="0 0 24 24">
                  <path d="M4 3l15 9-6.5 2 4.5 5.5-2.5 2-4.5-5.5L4 18z" />
                </svg>
                <div className="bg-purple-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow-xl border border-purple-400/40 whitespace-nowrap">
                  Sarah (Interior Lead)
                </div>
              </div>

              <div className="absolute top-[58%] right-[26%] z-30 pointer-events-none flex items-center gap-1.5 animate-cursor-alex">
                <svg className="w-4 h-4 text-emerald-400 fill-current drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" viewBox="0 0 24 24">
                  <path d="M4 3l15 9-6.5 2 4.5 5.5-2.5 2-4.5-5.5L4 18z" />
                </svg>
                <div className="bg-emerald-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow-xl border border-emerald-400/40 whitespace-nowrap">
                  Alex (Architect)
                </div>
              </div>

              <Canvas shadows camera={{ position: [5, 4.2, 5.8], fov: 42 }}>
                {lightingMood === "day" && (
                  <>
                    <ambientLight intensity={1.9} color="#F8FAFC" />
                    <directionalLight position={[7, 10, 7]} intensity={2.6} color="#FFFFFF" castShadow shadow-mapSize={[2048, 2048]} />
                    <directionalLight position={[-5, 6, -5]} intensity={1.3} color="#E0E7FF" />
                    <pointLight position={[0, 6, -4]} intensity={2.0} color="#FEF08A" />
                  </>
                )}
                {lightingMood === "sunset" && (
                  <>
                    <ambientLight intensity={1.4} color="#FDBA74" />
                    <directionalLight position={[8, 5, 4]} intensity={3.5} color="#F97316" castShadow shadow-mapSize={[2048, 2048]} />
                    <pointLight position={[-4, 5, -3]} intensity={2.0} color="#C084FC" />
                  </>
                )}
                {lightingMood === "night" && (
                  <>
                    <ambientLight intensity={0.9} color="#93C5FD" />
                    <directionalLight position={[5, 7, 5]} intensity={1.5} color="#6366F1" />
                    <pointLight position={[0, 4, 0]} intensity={4.0} color="#818CF8" />
                    <pointLight position={[-2, 3, 2]} intensity={3.0} color="#F472B6" />
                    <pointLight position={[2, 2, -2]} intensity={3.0} color="#34D399" />
                  </>
                )}

                <HeroInteractive3DScene 
                  materialType={materialType} 
                  lightingMood={lightingMood}
                  activeHotspot={activeHotspot}
                  setActiveHotspot={setActiveHotspot}
                />

                <OrbitControls 
                  enableZoom={false} 
                  minPolarAngle={Math.PI / 4} 
                  maxPolarAngle={Math.PI / 2.15}
                  rotateSpeed={0.8}
                />
              </Canvas>

              {/* Drag Guidance Badge */}
              <div className="absolute bottom-4 left-4 pointer-events-none bg-neutral-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-xs font-semibold text-white flex items-center gap-2.5 shadow-2xl">
                <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
                <span>Sıçranı sürüşdürərək 360° aydın baxın</span>
              </div>

              {/* Active Hotspot Info Overlay */}
              {activeHotspot && (
                <div className="absolute top-4 right-4 bg-neutral-900/95 border border-indigo-500/50 p-4 rounded-2xl shadow-2xl backdrop-blur-md max-w-xs text-xs text-white animate-fadeIn">
                  <div className="flex items-center justify-between font-bold text-indigo-300 mb-1">
                    <span>{activeHotspot === "sofa" ? "Royal Blue Velvet Divan" : "Mərmər / Seçilmiş Masa"}</span>
                    <span className="text-[10px] bg-indigo-500/20 px-2 py-0.5 rounded text-indigo-200">SpaceCraft 3D Object</span>
                  </div>
                  <p className="text-neutral-300 text-[11px] leading-relaxed">
                    {activeHotspot === "sofa" 
                      ? "Dəbdəbəli royal blue velvet parça örtüyü, yüksək sıxlıqlı qubka və parıldayan qızıl ayaq vurğuları ilə xüsusi hazırlanmış modern divan modulu."
                      : "Seçilmiş lüks material örtüyü və mat cilalanmış brass metal baza ayaqları ilə interyerə dinamika verən kofe masası."}
                  </p>
                </div>
              )}
            </div>

            {/* Material Selector Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/10 relative z-10">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
                <Layers className="w-4 h-4 text-indigo-400" /> Masa Və Yastıq Materialını Seçin:
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {materials.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMaterialType(m.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 border cursor-pointer ${
                      materialType === m.id
                        ? "bg-white text-neutral-900 border-white shadow-2xl scale-105"
                        : "bg-neutral-800/90 text-neutral-300 border-white/15 hover:border-white/40"
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${m.color}`}></span>
                    <span>{m.label}</span>
                    {materialType === m.id && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                ))}
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
