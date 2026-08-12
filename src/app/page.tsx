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
  Compass, Video, Home, Utensils, Bed, Waves
} from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroVideoModal from "@/components/HeroVideoModal";
import Interactive3DPreview from "@/components/Interactive3DPreview";

// Camera Controller for Smooth Zoom Transitions between Penthouse Zones
function CameraController({ activeZone }: { activeZone: string }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(7.2, 5.8, 7.6));

  useEffect(() => {
    switch (activeZone) {
      case "living":
        targetPos.current.set(2.2, 3.2, 4.2);
        break;
      case "kitchen":
        targetPos.current.set(5.8, 3.8, 1.0);
        break;
      case "bedroom":
        targetPos.current.set(5.8, 3.8, 5.8);
        break;
      case "pool":
        targetPos.current.set(2.2, 3.5, 6.2);
        break;
      default: // all
        targetPos.current.set(7.2, 5.8, 7.6);
        break;
    }
  }, [activeZone]);

  useFrame(() => {
    camera.position.lerp(targetPos.current, 0.05);
  });

  return null;
}

// REAL 3D WEBGL PENTHOUSE SCENE WITH REALISTIC PBR MATERIALS & LIGHTING
function HeroPenthouse3DScene({ activeZone, setActiveZone, materialStyle, lightingMood }: { 
  activeZone: string; 
  setActiveZone: (zone: string) => void;
  materialStyle: string;
  lightingMood: string;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.04;
    }
  });

  // Dynamic Theme Palette
  const themeColors = React.useMemo(() => {
    switch (materialStyle) {
      case "japandi":
        return { sofa: "#B45309", cushions: "#FDE68A", headboard: "#9A3412", table: "#F59E0B", rug: "#D97706" };
      case "emerald":
        return { sofa: "#047857", cushions: "#34D399", headboard: "#065F46", table: "#27272A", rug: "#064E3B" };
      case "obsidian":
        return { sofa: "#18181B", cushions: "#52525B", headboard: "#27272A", table: "#09090B", rug: "#27272A" };
      default: // royal
        return { sofa: "#1E3A8A", cushions: "#3B82F6", headboard: "#059669", table: "#FFFFFF", rug: "#374151" };
    }
  }, [materialStyle]);

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {/* 1. LARGE APARTMENT FLOOR (140 m² Marble Slab) */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[7.2, 0.1, 6.2]} />
        <meshStandardMaterial color="#E5E7EB" roughness={0.12} metalness={0.15} />
      </mesh>

      {/* LOW CUTAWAY WALLS (Height: 0.45m — DOLLHOUSE VIEW MODE FOR UNCLUTTERED VISIBILITY) */}
      <mesh position={[0, 0.22, -3.05]} receiveShadow castShadow>
        <boxGeometry args={[7.2, 0.45, 0.1]} />
        <meshStandardMaterial color="#9CA3AF" roughness={0.4} />
      </mesh>
      <mesh position={[-3.55, 0.22, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.1, 0.45, 6.2]} />
        <meshStandardMaterial color="#9CA3AF" roughness={0.4} />
      </mesh>
      <mesh position={[3.55, 0.22, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.1, 0.45, 6.2]} />
        <meshStandardMaterial color="#9CA3AF" roughness={0.4} />
      </mesh>
      <mesh position={[0.2, 0.22, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.1, 0.45, 6.0]} />
        <meshStandardMaterial color="#6B7280" roughness={0.3} />
      </mesh>

      {/* ZONE 1: DETAILED LIVING ROOM MODULE (Top Left) */}
      <group position={[-1.7, 0, -1.3]}>
        <mesh position={[0, 0.01, 0]} receiveShadow>
          <boxGeometry args={[2.8, 0.02, 2.2]} />
          <meshStandardMaterial color={themeColors.rug} roughness={0.85} />
        </mesh>
        
        {/* L-Shaped Sectional Sofa */}
        <group position={[0, 0, -0.4]}>
          <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.4, 0.25, 0.9]} />
            <meshStandardMaterial color={themeColors.sofa} roughness={0.6} />
          </mesh>
          <mesh position={[-0.85, 0.25, 0.7]} castShadow receiveShadow>
            <boxGeometry args={[0.7, 0.25, 0.8]} />
            <meshStandardMaterial color={themeColors.sofa} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.55, -0.38]} castShadow receiveShadow>
            <boxGeometry args={[2.4, 0.4, 0.2]} />
            <meshStandardMaterial color={themeColors.cushions} roughness={0.55} />
          </mesh>
          {[-0.6, 0.2, 0.7].map((px, i) => (
            <mesh key={i} position={[px, 0.45, -0.2]} rotation={[0, 0.2 * i, 0.1]} castShadow>
              <boxGeometry args={[0.35, 0.3, 0.15]} />
              <meshStandardMaterial color="#F59E0B" roughness={0.4} />
            </mesh>
          ))}
          {[-1.1, 1.1].map((lx, i) =>
            [-0.35, 0.35].map((lz, j) => (
              <mesh key={`${i}-${j}`} position={[lx, 0.07, lz]} castShadow>
                <cylinderGeometry args={[0.025, 0.015, 0.14, 16]} />
                <meshStandardMaterial color="#F59E0B" metalness={0.95} roughness={0.1} />
              </mesh>
            ))
          )}
        </group>

        {/* Coffee Table */}
        <group position={[0.2, 0.18, 0.6]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.6, 0.6, 0.06, 32]} />
            <meshStandardMaterial color={themeColors.table} roughness={0.05} metalness={0.1} />
          </mesh>
          <mesh position={[0, -0.07, 0]} castShadow>
            <cylinderGeometry args={[0.25, 0.4, 0.12, 32]} />
            <meshStandardMaterial color="#1E293B" metalness={0.8} />
          </mesh>
          <mesh position={[0.15, 0.18, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.06, 0.2, 16]} />
            <meshStandardMaterial color="#38BDF8" opacity={0.7} transparent roughness={0.1} />
          </mesh>
        </group>

        {/* TV Wall Console */}
        <group position={[0, 0.4, -1.65]}>
          {[-0.8, -0.4, 0, 0.4, 0.8].map((xPos, i) => (
            <mesh key={i} position={[xPos, 0.4, 0]} castShadow>
              <boxGeometry args={[0.12, 1.2, 0.04]} />
              <meshStandardMaterial color="#B45309" roughness={0.35} />
            </mesh>
          ))}
          <mesh position={[0, 0.15, 0.1]} castShadow>
            <boxGeometry args={[1.8, 0.2, 0.35]} />
            <meshStandardMaterial color="#1E293B" roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.6, 0.03]} castShadow>
            <boxGeometry args={[1.4, 0.75, 0.03]} />
            <meshStandardMaterial color="#09090B" metalness={0.95} roughness={0.05} />
          </mesh>
        </group>

        {/* SLEEK MICRO GLASS PIN */}
        <Html position={[0, 0.6, 0]} center>
          <button 
            onClick={(e) => { e.stopPropagation(); setActiveZone("living"); }}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold shadow-xl backdrop-blur-md flex items-center gap-1.5 border transition-all cursor-pointer whitespace-nowrap ${
              activeZone === "living" 
                ? "bg-white text-zinc-950 border-white scale-105 shadow-white/20" 
                : "bg-zinc-900/80 text-zinc-300 border-white/20 hover:bg-zinc-800 hover:text-white hover:border-white/40"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
            <span>🛋️ Qonaq Otağı • 45 m²</span>
          </button>
        </Html>
      </group>

      {/* ZONE 2: DETAILED KITCHEN & ISLAND MODULE (Top Right) */}
      <group position={[1.8, 0, -1.4]}>
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.8, 0.95]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.82, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.3, 0.05, 1.0]} />
          <meshStandardMaterial color={themeColors.table} roughness={0.05} />
        </mesh>
        {[-0.65, 0, 0.65].map((sx, i) => (
          <group key={i} position={[sx, 0.35, 0.75]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.18, 0.18, 0.05, 16]} />
              <meshStandardMaterial color="#F59E0B" metalness={0.9} />
            </mesh>
            <mesh position={[0, 0.15, -0.15]} castShadow>
              <boxGeometry args={[0.32, 0.25, 0.04]} />
              <meshStandardMaterial color="#D97706" />
            </mesh>
            <mesh position={[0, -0.18, 0]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.4, 16]} />
              <meshStandardMaterial color="#1E293B" metalness={0.9} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 0.6, -1.25]} castShadow>
          <boxGeometry args={[2.4, 1.2, 0.4]} />
          <meshStandardMaterial color="#374151" roughness={0.3} />
        </mesh>

        {/* SLEEK MICRO GLASS PIN */}
        <Html position={[0, 0.7, 0]} center>
          <button 
            onClick={(e) => { e.stopPropagation(); setActiveZone("kitchen"); }}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold shadow-xl backdrop-blur-md flex items-center gap-1.5 border transition-all cursor-pointer whitespace-nowrap ${
              activeZone === "kitchen" 
                ? "bg-amber-600/90 text-white border-white scale-105 shadow-amber-600/50" 
                : "bg-neutral-900/80 text-neutral-300 border-white/20 hover:bg-neutral-800 hover:text-white hover:border-white/40"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span>🍳 Mətbəx & Ada • 28 m²</span>
          </button>
        </Html>
      </group>

      {/* ZONE 3: DETAILED MASTER BEDROOM MODULE (Bottom Right) */}
      <group position={[1.8, 0, 1.4]}>
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.95, 0.2, 2.05]} />
          <meshStandardMaterial color="#B45309" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.32, 0.05]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.22, 1.8]} />
          <meshStandardMaterial color="#F9FAFB" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.38, 0.35]} castShadow receiveShadow>
          <boxGeometry args={[1.82, 0.14, 1.2]} />
          <meshStandardMaterial color="#E0E7FF" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.65, -0.85]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 0.8, 0.18]} />
          <meshStandardMaterial color={themeColors.headboard} roughness={0.3} />
        </mesh>
        {[-1.2, 1.2].map((nx, i) => (
          <group key={i} position={[nx, 0.2, -0.7]}>
            <mesh castShadow>
              <boxGeometry args={[0.4, 0.35, 0.4]} />
              <meshStandardMaterial color="#1E293B" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.3, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.12, 0.25, 16]} />
              <meshStandardMaterial color="#FDE68A" emissive="#FEF08A" emissiveIntensity={0.5} />
            </mesh>
          </group>
        ))}

        {/* SLEEK MICRO GLASS PIN */}
        <Html position={[0, 0.6, 0]} center>
          <button 
            onClick={(e) => { e.stopPropagation(); setActiveZone("bedroom"); }}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold shadow-xl backdrop-blur-md flex items-center gap-1.5 border transition-all cursor-pointer whitespace-nowrap ${
              activeZone === "bedroom" 
                ? "bg-emerald-600/90 text-white border-white scale-105 shadow-emerald-600/50" 
                : "bg-neutral-900/80 text-neutral-300 border-white/20 hover:bg-neutral-800 hover:text-white hover:border-white/40"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>🛏️ Yataq Otağı • 32 m²</span>
          </button>
        </Html>
      </group>

      {/* ZONE 4: OUTDOOR POOL & TERRACE DECK (Bottom Left) */}
      <group position={[-1.7, 0, 1.4]}>
        <mesh position={[0, 0.01, 0]} receiveShadow>
          <boxGeometry args={[2.8, 0.02, 2.2]} />
          <meshStandardMaterial color="#B45309" roughness={0.4} />
        </mesh>
        <mesh position={[-0.3, -0.06, 0]} receiveShadow>
          <boxGeometry args={[1.8, 0.15, 1.6]} />
          <meshStandardMaterial color="#06B6D4" roughness={0.05} metalness={0.8} opacity={0.75} transparent />
        </mesh>
        {[-0.3, 0.4].map((lx, i) => (
          <group key={i} position={[lx, 0.12, 0.7]}>
            <mesh castShadow>
              <boxGeometry args={[0.45, 0.12, 1.1]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.12, -0.35]} rotation={[0.3, 0, 0]} castShadow>
              <boxGeometry args={[0.45, 0.1, 0.4]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.2} />
            </mesh>
          </group>
        ))}

        {/* SLEEK MICRO GLASS PIN */}
        <Html position={[0, 0.5, 0]} center>
          <button 
            onClick={(e) => { e.stopPropagation(); setActiveZone("pool"); }}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold shadow-xl backdrop-blur-md flex items-center gap-1.5 border transition-all cursor-pointer whitespace-nowrap ${
              activeZone === "pool" 
                ? "bg-cyan-600/90 text-white border-white scale-105 shadow-cyan-600/50" 
                : "bg-neutral-900/80 text-neutral-300 border-white/20 hover:bg-neutral-800 hover:text-white hover:border-white/40"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>🏊 Teras & Hovuz • 35 m²</span>
          </button>
        </Html>
      </group>

      <ContactShadows position={[0, 0.02, 0]} opacity={0.6} scale={8} blur={2.0} far={5} />
    </group>
  );
}

export default function LandingPage() {
  const { data: session } = useSession();
  const [animationStep, setAnimationStep] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeZone, setActiveZone] = useState<string>("all");
  const [materialStyle, setMaterialStyle] = useState<string>("royal");
  const [lightingMood, setLightingMood] = useState<string>("day");

  const styleThemes = [
    { id: "royal", label: "Royal Velvet & Mərmər", color: "bg-blue-600" },
    { id: "japandi", label: "Japandi Təbii Ağac", color: "bg-amber-600" },
    { id: "emerald", label: "Zümrüd Yaşıl Loft", color: "bg-emerald-600" },
    { id: "obsidian", label: "Qara Obsidian Minimal", color: "bg-neutral-800" },
  ];

  const zoneDetails = {
    all: { title: "Bütün Penthouse Layihəsi (Dollhouse View)", area: "140 m²", desc: "Alçaq kəsik divarlar vasitəsilə 4 zonanın (Qonaq otağı, Mətbəx, Yataq otağı Və Hovuz) içi maneesiz aydın görünür." },
    living: { title: "Lüks Qonaq Otağı Zonası", area: "45 m²", desc: "Sectional L-divan dəsti, Carrara Mərmər Kofe Masası, Glass Vaza Və OLED TV Paneli." },
    kitchen: { title: "Mətbəx Və Ada Zonası", area: "28 m²", desc: "Waterfall Mərmər island masası, metal bar stulları Və divar şkafları." },
    bedroom: { title: "Master Yataq Otağı Zonası", area: "32 m²", desc: "King platform çarpayı, yumşaq yorğan qatı, lüks baş tərəf paneli Və komodlar." },
    pool: { title: "Outdoor Teras Və Hovuz Deki", area: "35 m²", desc: "Teak ağac döşəməsi, kristal şəffaf infinity hovuz suyu Və dual şezlonqlar." }
  };

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
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[150px] pointer-events-none -z-10 animate-ambient-glow"></div>
        <div className="absolute top-40 right-1/4 w-[450px] h-[450px] bg-zinc-400/5 rounded-full blur-[150px] pointer-events-none -z-10 animate-ambient-glow" style={{ animationDelay: '3s' }}></div>

        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center relative z-10">
          
          {/* Status Pill Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-900/90 border border-white/10 text-zinc-300 text-xs font-semibold mb-8 shadow-2xl backdrop-blur-md hover:border-white/40 transition-all cursor-pointer group"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-zinc-200"></span>
            </span>
            <span className="group-hover:text-white transition-colors">SpaceCraft 3D v2.5 SaaS — İndi Canlıdır!</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-1 transition-transform" />
          </motion.div>

          {/* Main Hero Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight text-white max-w-5xl leading-[1.08] mb-8 uppercase"
          >
            İnteryer Dizaynını <br />
            <span className="relative inline-block my-1 text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-300 to-zinc-400">
              Brauzerdə
            </span>{" "}
            <span className="inline-block bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600 bg-clip-text text-transparent">
              Yenidən Kəşf Et
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-xl text-zinc-400 max-w-3xl mb-12 leading-relaxed font-light"
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
              href={session ? "/editor" : "/auth/signin"} 
              className="relative group overflow-hidden rounded-full p-[1.5px] w-full sm:w-auto font-bold text-base shadow-2xl shadow-white/10"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white via-zinc-400 to-zinc-600 rounded-full animate-gradient-x"></span>
              <span className="relative px-9 py-4 rounded-full bg-white text-zinc-950 flex items-center justify-center gap-3 group-hover:bg-zinc-200 transition-all font-extrabold whitespace-nowrap">
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
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 pt-8 border-t border-white/10 text-zinc-400 w-full max-w-4xl"
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-black text-white">4K UHD</span>
              <span className="text-xs text-zinc-400 font-mono mt-1">Real-Time Raytracing</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-black text-white">10x Sürətli</span>
              <span className="text-xs text-zinc-400 font-mono mt-1">AI Generasiya Motoru</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-black text-white">100% Bulud</span>
              <span className="text-xs text-zinc-400 font-mono mt-1">Quraşdırma Tələb Olunmur</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-black text-white">Multi-Player</span>
              <span className="text-xs text-zinc-400 font-mono mt-1">Canlı Komanda İş birliyi</span>
            </div>
          </motion.div>


          {/* FLAGSHIP ENHANCED 140 m² MULTI-ROOM PENTHOUSE ARCHITECTURAL CANVAS */}
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
                      ? "bg-white text-zinc-950 shadow-lg shadow-white/10"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Home className="w-3.5 h-3.5" /> Bütün Mənzil (140 m²)
                </button>

                <button
                  onClick={() => setActiveZone("living")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeZone === "living"
                      ? "bg-white text-zinc-950 shadow-lg shadow-white/10"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Box className="w-3.5 h-3.5" /> Qonaq Otağı (45 m²)
                </button>
                <button
                  onClick={() => setActiveZone("kitchen")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeZone === "kitchen"
                      ? "bg-white text-zinc-950 shadow-lg shadow-white/10"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5" /> Mətbəx & Ada (28 m²)
                </button>
                <button
                  onClick={() => setActiveZone("bedroom")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeZone === "bedroom"
                      ? "bg-white text-zinc-950 shadow-lg shadow-white/10"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Bed className="w-3.5 h-3.5" /> Yataq Otağı (32 m²)
                </button>
                <button
                  onClick={() => setActiveZone("pool")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeZone === "pool"
                      ? "bg-white text-zinc-950 shadow-lg shadow-white/10"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Waves className="w-3.5 h-3.5" /> Teras & Hovuz (35 m²)
                </button>

              </div>
            </div>

            {/* REAL 3D WEBGL CANVAS VIEWPORT */}
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

              {/* Active Zone Inspector Floating Glass Overlay */}
              <div className="absolute top-4 right-4 z-30 bg-neutral-900/95 border border-indigo-500/40 p-4 rounded-2xl shadow-2xl backdrop-blur-md max-w-xs text-xs text-white text-left animate-fadeIn">
                <div className="flex items-center justify-between font-bold text-indigo-300 mb-1">
                  <span>{zoneDetails[activeZone as keyof typeof zoneDetails].title}</span>
                  <span className="text-[10px] bg-indigo-500/20 px-2 py-0.5 rounded text-indigo-200 font-mono">
                    {zoneDetails[activeZone as keyof typeof zoneDetails].area}
                  </span>
                </div>
                <p className="text-neutral-300 text-[11px] leading-relaxed">
                  {zoneDetails[activeZone as keyof typeof zoneDetails].desc}
                </p>
              </div>

              <Canvas shadows camera={{ position: [7.2, 5.8, 7.6], fov: 42 }}>
                {lightingMood === "day" && (
                  <>
                    <ambientLight intensity={1.9} color="#F8FAFC" />
                    <directionalLight position={[8, 12, 8]} intensity={2.6} color="#FFFFFF" castShadow shadow-mapSize={[2048, 2048]} />
                    <directionalLight position={[-6, 6, -6]} intensity={1.3} color="#E0E7FF" />
                    <pointLight position={[0, 6, 0]} intensity={2.5} color="#FEF08A" />
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
                  </>
                )}

                <CameraController activeZone={activeZone} />

                <HeroPenthouse3DScene 
                  activeZone={activeZone}
                  setActiveZone={setActiveZone}
                  materialStyle={materialStyle}
                  lightingMood={lightingMood}
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
                Real 3D WebGL Engine • 120 FPS
              </div>
            </div>

            {/* Style Theme Switcher Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/10 relative z-10">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
                <Layers className="w-4 h-4 text-indigo-400" /> Bütün Mənzil İnteryer Stilini Seçin:
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {styleThemes.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setMaterialStyle(st.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 border cursor-pointer ${
                      materialStyle === st.id
                        ? "bg-white text-neutral-900 border-white shadow-2xl scale-105"
                        : "bg-neutral-800/90 text-neutral-300 border-white/15 hover:border-white/40"
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${st.color}`}></span>
                    <span>{st.label}</span>
                    {materialStyle === st.id && <Check className="w-3.5 h-3.5 text-indigo-600" />}
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
              <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest mb-3">
                <Sparkles className="w-4 h-4 text-white" /> Cinematic Nümayiş
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
                3D Memarlığın <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">Yeni Standartı</span>
              </h2>
            </div>

            <p className="text-zinc-400 max-w-md text-sm leading-relaxed">
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
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-6 uppercase">
              Niyə SpaceCraft 3D?
            </h2>
            <p className="text-base sm:text-lg text-zinc-400">
              Gələcəyin memarlıq və interyer dizayn alətlərini bir brauzer pəncərəsində birləşdirdik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="p-8 rounded-3xl bg-zinc-900/60 border border-white/10 hover:border-white/30 transition-all shadow-2xl relative overflow-hidden group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Dəstəkli Dizayn</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-light">
                Mətn əmrləri ilə otağınızın üslubunu, rənglərini və mebel quruluşunu saniyələr içində avtomatik dəyişdirin.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="p-8 rounded-3xl bg-zinc-900/60 border border-white/10 hover:border-white/30 transition-all shadow-2xl relative overflow-hidden group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Canlı Komanda İş Birliyi</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-light">
                Müştəriniz və ya komandanızla eyni 3D səhnədə eyni anda kursor hərəkətlərini görərək işləyin.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="p-8 rounded-3xl bg-zinc-900/60 border border-white/10 hover:border-white/30 transition-all shadow-2xl relative overflow-hidden group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
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
