"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Float, ContactShadows, Html } from "@react-three/drei";
import * as THREE from "three";
import { 
  ArrowRight, Box, Sparkles, Layers, Users, Camera, FileText, Share2, 
  Check, Play, Shield, Zap, Eye, ChevronRight, Star, Globe, Download,
  Maximize2, Move, RotateCcw, Ruler, Grid, MousePointer, Paintbrush,
  Sun, Moon, Settings, Trash2, Lock, Plus, Sliders, RefreshCw, Wand2, SlidersHorizontal,
  Compass, Video, Home, Utensils, Bed
} from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroVideoModal from "@/components/HeroVideoModal";
import Interactive3DPreview from "@/components/Interactive3DPreview";

// Camera Controller for Smooth Zoom Transitions between Apartment Zones
function CameraController({ activeZone }: { activeZone: string }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(6.8, 5.5, 7.2));

  useEffect(() => {
    switch (activeZone) {
      case "living":
        targetPos.current.set(2.5, 3.2, 4.5);
        break;
      case "kitchen":
        targetPos.current.set(5.5, 3.8, 1.2);
        break;
      case "bedroom":
        targetPos.current.set(5.5, 3.8, 5.5);
        break;
      default: // all
        targetPos.current.set(6.8, 5.5, 7.2);
        break;
    }
  }, [activeZone]);

  useFrame(() => {
    camera.position.lerp(targetPos.current, 0.05);
  });

  return null;
}

// 140 m² Multi-Room Penthouse Architectural 3D Scene
function HeroPenthouse3DScene({ activeZone, setActiveZone }: { 
  activeZone: string; 
  setActiveZone: (zone: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {/* 1. LARGE APARTMENT FLOOR (140 m² Slab) */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[6.8, 0.1, 5.8]} />
        <meshStandardMaterial color="#E5E7EB" roughness={0.12} metalness={0.15} />
      </mesh>

      {/* Exterior & Partition Walls */}
      {/* Back Wall */}
      <mesh position={[0, 1.5, -2.85]} receiveShadow castShadow>
        <boxGeometry args={[6.8, 3.0, 0.1]} />
        <meshStandardMaterial color="#D1D5DB" roughness={0.5} />
      </mesh>
      {/* Left Wall */}
      <mesh position={[-3.35, 1.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.1, 3.0, 5.8]} />
        <meshStandardMaterial color="#D1D5DB" roughness={0.5} />
      </mesh>
      {/* Middle Divider Wall (Separating Living Room & Bedroom) */}
      <mesh position={[0.2, 1.2, 1.4]} receiveShadow castShadow>
        <boxGeometry args={[0.1, 2.4, 3.0]} />
        <meshStandardMaterial color="#9CA3AF" roughness={0.4} />
      </mesh>

      {/* ZONE 1: LIVING ROOM MODULE (Left Side) */}
      <group position={[-1.6, 0, -0.2]}>
        {/* Living Room Rug */}
        <mesh position={[0, 0.01, 0.2]} receiveShadow>
          <boxGeometry args={[2.8, 0.02, 2.2]} />
          <meshStandardMaterial color="#4B5563" roughness={0.85} />
        </mesh>
        {/* Sofa */}
        <mesh position={[0, 0.35, -0.6]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.4, 1.1]} />
          <meshStandardMaterial color="#1E3A8A" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.75, -1.05]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.5, 0.25]} />
          <meshStandardMaterial color="#2563EB" roughness={0.55} />
        </mesh>
        {/* Coffee Table */}
        <mesh position={[0, 0.2, 0.5]} castShadow receiveShadow>
          <cylinderGeometry args={[0.7, 0.7, 0.06, 32]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.05} metalness={0.1} />
        </mesh>
        {/* Slatted TV Wall Panel */}
        {[-0.8, -0.4, 0, 0.4, 0.8].map((xPos, i) => (
          <mesh key={i} position={[xPos, 1.6, -2.78]} castShadow>
            <boxGeometry args={[0.12, 2.6, 0.04]} />
            <meshStandardMaterial color="#B45309" roughness={0.35} />
          </mesh>
        ))}

        {/* Zone Hotspot */}
        <Html position={[0, 1.1, 0]} center>
          <button 
            onClick={(e) => { e.stopPropagation(); setActiveZone("living"); }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-1.5 border transition-all cursor-pointer ${activeZone === "living" ? "bg-indigo-600 text-white border-white scale-110" : "bg-neutral-900/90 text-neutral-200 border-white/30 hover:bg-neutral-800"}`}
          >
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
            <span>🛋️ Qonaq Otağı (45 m²)</span>
          </button>
        </Html>
      </group>

      {/* ZONE 2: KITCHEN & ISLAND MODULE (Top Right) */}
      <group position={[1.8, 0, -1.4]}>
        {/* Kitchen Island */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.9, 1.0]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Waterfall Marble Countertop */}
        <mesh position={[0, 0.92, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.3, 0.05, 1.05]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.05} />
        </mesh>
        {/* Bar Stools */}
        {[-0.6, 0, 0.6].map((sx, i) => (
          <mesh key={i} position={[sx, 0.35, 0.8]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.7, 16]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.9} />
          </mesh>
        ))}

        {/* Zone Hotspot */}
        <Html position={[0, 1.2, 0]} center>
          <button 
            onClick={(e) => { e.stopPropagation(); setActiveZone("kitchen"); }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-1.5 border transition-all cursor-pointer ${activeZone === "kitchen" ? "bg-amber-600 text-white border-white scale-110" : "bg-neutral-900/90 text-neutral-200 border-white/30 hover:bg-neutral-800"}`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>🍳 Mətbəx & Ada (28 m²)</span>
          </button>
        </Html>
      </group>

      {/* ZONE 3: MASTER BEDROOM MODULE (Bottom Right) */}
      <group position={[1.8, 0, 1.3]}>
        {/* King Bed Base */}
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.9, 0.4, 2.0]} />
          <meshStandardMaterial color="#374151" roughness={0.7} />
        </mesh>
        {/* Mattress & Pillows */}
        <mesh position={[0, 0.5, 0.1]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.25, 1.7]} />
          <meshStandardMaterial color="#F9FAFB" roughness={0.3} />
        </mesh>
        {/* Velvet Headboard */}
        <mesh position={[0, 0.85, -0.8]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 0.8, 0.2]} />
          <meshStandardMaterial color="#059669" roughness={0.3} />
        </mesh>

        {/* Zone Hotspot */}
        <Html position={[0, 1.1, 0]} center>
          <button 
            onClick={(e) => { e.stopPropagation(); setActiveZone("bedroom"); }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-1.5 border transition-all cursor-pointer ${activeZone === "bedroom" ? "bg-emerald-600 text-white border-white scale-110" : "bg-neutral-900/90 text-neutral-200 border-white/30 hover:bg-neutral-800"}`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>🛏️ Yataq Otağı (32 m²)</span>
          </button>
        </Html>
      </group>

      <ContactShadows position={[0, 0.02, 0]} opacity={0.6} scale={8} blur={2.0} far={5} />
    </group>
  );
}

export default function LandingPage() {
  const [animationStep, setAnimationStep] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeZone, setActiveZone] = useState<string>("all");

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

          {/* TOTALLY UNIQUE HERO SHOWCASE: 140 m² MULTI-ROOM PENTHOUSE ARCHITECTURAL CANVAS */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="w-full mt-20 relative rounded-3xl border border-white/20 bg-neutral-900/90 shadow-2xl p-4 sm:p-6 max-w-6xl backdrop-blur-2xl overflow-hidden"
          >
            {/* Header Control Toolbar */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1 text-left">
                  <Sparkles className="w-4 h-4" /> SpaceCraft AI Architecture Engine
                </div>
                <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight text-left">
                  140 m² Multi-Room Penthouse Layihəsi
                </h3>
              </div>

              {/* Apartment Zone Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 bg-neutral-950/80 p-1.5 rounded-2xl border border-white/10 shadow-inner">
                <button
                  onClick={() => setActiveZone("all")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeZone === "all"
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Home className="w-3.5 h-3.5" /> Bütün Mənzil (140 m²)
                </button>
                <button
                  onClick={() => setActiveZone("living")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeZone === "living"
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Box className="w-3.5 h-3.5" /> Qonaq Otağı (45 m²)
                </button>
                <button
                  onClick={() => setActiveZone("kitchen")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeZone === "kitchen"
                      ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5" /> Mətbəx & Ada (28 m²)
                </button>
                <button
                  onClick={() => setActiveZone("bedroom")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeZone === "bedroom"
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Bed className="w-3.5 h-3.5" /> Yataq Otağı (32 m²)
                </button>
              </div>
            </div>

            {/* 3D Multi-Room WebGL Canvas Viewport */}
            <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-2xl bg-[#1a1c24] overflow-hidden border border-white/15 my-6 shadow-2xl">
              
              {/* ANIMATED MULTIPLAYER CURSORS */}
              <div className="absolute top-[32%] left-[24%] z-30 pointer-events-none flex items-center gap-1.5 animate-cursor-sarah">
                <svg className="w-4 h-4 text-purple-400 fill-current drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" viewBox="0 0 24 24">
                  <path d="M4 3l15 9-6.5 2 4.5 5.5-2.5 2-4.5-5.5L4 18z" />
                </svg>
                <div className="bg-purple-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow-xl border border-purple-400/40 whitespace-nowrap">
                  Sarah (Lead Architect)
                </div>
              </div>

              <div className="absolute top-[62%] right-[24%] z-30 pointer-events-none flex items-center gap-1.5 animate-cursor-alex">
                <svg className="w-4 h-4 text-emerald-400 fill-current drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" viewBox="0 0 24 24">
                  <path d="M4 3l15 9-6.5 2 4.5 5.5-2.5 2-4.5-5.5L4 18z" />
                </svg>
                <div className="bg-emerald-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow-xl border border-emerald-400/40 whitespace-nowrap">
                  Alex (3D Modeler)
                </div>
              </div>

              <Canvas shadows camera={{ position: [6.8, 5.5, 7.2], fov: 42 }}>
                <ambientLight intensity={1.9} color="#F8FAFC" />
                <directionalLight position={[8, 12, 8]} intensity={2.6} color="#FFFFFF" castShadow shadow-mapSize={[2048, 2048]} />
                <directionalLight position={[-6, 6, -6]} intensity={1.3} color="#E0E7FF" />
                <pointLight position={[0, 6, 0]} intensity={2.5} color="#FEF08A" />

                <CameraController activeZone={activeZone} />

                <HeroPenthouse3DScene 
                  activeZone={activeZone}
                  setActiveZone={setActiveZone}
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
                <span>3D Mənzili 360° Sürüşdürərək Baxın</span>
              </div>

              {/* Stats Badge */}
              <div className="absolute bottom-4 right-4 pointer-events-none bg-neutral-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-xs font-mono text-emerald-400 shadow-2xl">
                FPS: 120 (Raytracing 4K) • WebGL 2.0
              </div>
            </div>

            {/* Bottom Info Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs text-neutral-300">
              <div className="flex items-center gap-2 font-mono">
                <span className="text-indigo-400 font-bold">Mənzil Haqqında:</span>
                <span>3 Otaqlı Lüks Penthouse (14.20m × 9.80m) • Sahə: 140 m²</span>
              </div>

              <Link 
                href="/editor"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30"
              >
                <span>Mənzili Editor-da Aç</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
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
