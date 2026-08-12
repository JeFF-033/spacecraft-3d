"use client";

import React, { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, ContactShadows, Html } from "@react-three/drei";
import * as THREE from "three";
import { Sun, Moon, Sparkles, Layers, RefreshCw, Check, Tv } from "lucide-react";

// Bright, Ultra-Vivid Architectural Room Component
function BrightArchitecturalRoom({ materialType, lightingMood, activeHotspot, setActiveHotspot }: { 
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

  // Selected Accent Material (Applies to Coffee Table Surface & Sofa Accent Pillows ONLY)
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
      default: // wood / walnut
        return { color: "#9A3412", roughness: 0.5, metalness: 0.05 };
    }
  }, [materialType]);

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      
      {/* 1. BRIGHT MARBLE FLOOR (Light Polished Tile) */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[5.2, 0.1, 5.2]} />
        <meshStandardMaterial color="#E5E7EB" roughness={0.12} metalness={0.15} />
      </mesh>

      {/* Modern Accent Rug */}
      <mesh position={[0, 0.01, 0.3]} receiveShadow>
        <boxGeometry args={[3.2, 0.02, 2.6]} />
        <meshStandardMaterial color="#4B5563" roughness={0.85} />
      </mesh>

      {/* 2. LIGHT STUDIO BACK WALL WITH WALNUT WOOD SLATS */}
      <mesh position={[0, 1.75, -2.45]} receiveShadow castShadow>
        <boxGeometry args={[5.2, 3.5, 0.1]} />
        <meshStandardMaterial color="#D1D5DB" roughness={0.5} />
      </mesh>

      {/* Natural Walnut Slatted Wood Panels */}
      {[-1.8, -1.5, -1.2, -0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9, 1.2, 1.5, 1.8].map((xPos, i) => (
        <mesh key={i} position={[xPos, 1.75, -2.38]} castShadow receiveShadow>
          <boxGeometry args={[0.15, 3.5, 0.04]} />
          <meshStandardMaterial color="#B45309" roughness={0.35} />
        </mesh>
      ))}

      {/* FIXED REALISTIC OLED SMART TV PANEL (Does NOT change color with material buttons!) */}
      <group position={[0, 2.3, -2.32]}>
        {/* Outer Slim TV Frame */}
        <mesh castShadow>
          <boxGeometry args={[2.0, 1.15, 0.04]} />
          <meshStandardMaterial color="#020617" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Glossy Black OLED Screen Glass Display */}
        <mesh position={[0, 0, 0.023]}>
          <planeGeometry args={[1.92, 1.07]} />
          <meshStandardMaterial 
            color="#09090B" 
            roughness={0.03} 
            metalness={0.95}
          />
        </mesh>

        {/* Ambient Standby / Art line indicator */}
        <mesh position={[0, -0.5, 0.025]}>
          <planeGeometry args={[0.08, 0.015]} />
          <meshBasicMaterial color="#38BDF8" />
        </mesh>
      </group>

      {/* 3. VIVID LUXURY ROYAL BLUE SOFA */}
      <group position={[0, 0.45, -0.6]} onClick={(e) => { e.stopPropagation(); setActiveHotspot("sofa"); }}>
        {/* Base Frame */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.8, 0.35, 1.3]} />
          <meshStandardMaterial color="#1E3A8A" roughness={0.6} />
        </mesh>
        
        {/* Seat Cushions */}
        {[-0.9, 0, 0.9].map((cx, i) => (
          <mesh key={i} position={[cx, 0.22, 0.05]} castShadow receiveShadow>
            <boxGeometry args={[0.86, 0.2, 1.15]} />
            <meshStandardMaterial color="#2563EB" roughness={0.55} />
          </mesh>
        ))}

        {/* Backrest */}
        <mesh position={[0, 0.55, -0.5]} castShadow receiveShadow>
          <boxGeometry args={[2.8, 0.6, 0.3]} />
          <meshStandardMaterial color="#1E3A8A" roughness={0.6} />
        </mesh>

        {/* Armrests */}
        <mesh position={[-1.3, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.25, 0.45, 1.3]} />
          <meshStandardMaterial color="#1E3A8A" roughness={0.6} />
        </mesh>
        <mesh position={[1.3, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.25, 0.45, 1.3]} />
          <meshStandardMaterial color="#1E3A8A" roughness={0.6} />
        </mesh>

        {/* Accent Pillows (Material Selection Applies Here!) */}
        <mesh position={[-0.8, 0.45, -0.3]} rotation={[0, 0.2, 0.1]} castShadow>
          <boxGeometry args={[0.45, 0.4, 0.18]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh position={[0.8, 0.45, -0.3]} rotation={[0, -0.2, -0.1]} castShadow>
          <boxGeometry args={[0.45, 0.4, 0.18]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>

        {/* Polished Gold Legs */}
        {[-1.3, 1.3].map((lx, i) =>
          [-0.5, 0.5].map((lz, j) => (
            <mesh key={`${i}-${j}`} position={[lx, -0.2, lz]} castShadow>
              <cylinderGeometry args={[0.035, 0.025, 0.25, 16]} />
              <meshStandardMaterial color="#F59E0B" metalness={0.95} roughness={0.1} />
            </mesh>
          ))
        )}

        {/* Hotspot Badge Pin */}
        <Html position={[0, 0.95, 0]} center>
          <button 
            onClick={() => setActiveHotspot(activeHotspot === "sofa" ? null : "sofa")}
            className="px-3 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold border border-white/30 shadow-2xl backdrop-blur-md flex items-center gap-1.5 transition-transform hover:scale-110 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>Divan: Royal Blue Velvet</span>
          </button>
        </Html>
      </group>

      {/* 4. CRISP MARBLE COFFEE TABLE (Material Selection Applies to Surface!) */}
      <group position={[0, 0.2, 0.9]} onClick={(e) => { e.stopPropagation(); setActiveHotspot("table"); }}>
        {/* Table Surface with Selected Material */}
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.85, 0.85, 0.06, 32]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>

        {/* Table Brass Pedestal Base */}
        <mesh position={[0, 0.07, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.5, 0.14, 32]} />
          <meshStandardMaterial color="#D97706" metalness={0.9} roughness={0.15} />
        </mesh>

        {/* Decorative Vase */}
        <mesh position={[0.2, 0.3, 0.1]} castShadow>
          <cylinderGeometry args={[0.08, 0.12, 0.25, 16]} />
          <meshStandardMaterial color="#38BDF8" roughness={0.1} />
        </mesh>

        {/* Hotspot Badge Pin */}
        <Html position={[0, 0.45, 0]} center>
          <button 
            onClick={() => setActiveHotspot(activeHotspot === "table" ? null : "table")}
            className="px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold border border-white/30 shadow-2xl backdrop-blur-md flex items-center gap-1.5 transition-transform hover:scale-110 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Masa: Seçilmiş Material</span>
          </button>
        </Html>
      </group>

      {/* 5. BRIGHT AMBIENT FLOOR LAMP */}
      <group position={[1.8, 1.2, -1.8]}>
        {/* Base */}
        <mesh position={[0, -1.15, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.05, 32]} />
          <meshStandardMaterial color="#1E293B" metalness={0.9} />
        </mesh>
        {/* Gold Pole */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 2.3, 16]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* White Lamp Shade */}
        <mesh position={[0, 1.1, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.4, 0.45, 32]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} emissive="#FEF08A" emissiveIntensity={0.6} />
        </mesh>
        {/* Warm Point Light Glow */}
        <pointLight position={[0, 1, 0]} intensity={4.5} color="#FEF08A" distance={5} />
      </group>

      {/* 6. VIVID EMERALD POTTED PLANT */}
      <group position={[-1.8, 0.6, -1.6]}>
        {/* White Ceramic Pot */}
        <mesh position={[0, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.2, 0.5, 32]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.2} />
        </mesh>
        {/* Bright Foliage */}
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <mesh position={[0, 0.25, 0]} castShadow>
            <dodecahedronGeometry args={[0.35, 1]} />
            <meshStandardMaterial color="#10B981" roughness={0.3} />
          </mesh>
          <mesh position={[0.15, 0.45, 0.1]} castShadow>
            <dodecahedronGeometry args={[0.25, 1]} />
            <meshStandardMaterial color="#34D399" roughness={0.3} />
          </mesh>
        </Float>
      </group>

      {/* Realistic Soft Contact Shadows on Floor */}
      <ContactShadows position={[0, 0.02, 0]} opacity={0.6} scale={6} blur={2.0} far={4} />
    </group>
  );
}

export default function Interactive3DPreview() {
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

  return (
    <div className="w-full max-w-6xl mx-auto rounded-3xl border border-white/15 bg-zinc-900/90 backdrop-blur-xl shadow-2xl p-6 relative overflow-hidden">
      {/* Ambient Background Lights */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4 text-white" /> Canlı 3D Render Təcrübəsi
          </div>
          <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            İnteraktiv 3D Otaq Önizləməsi
          </h3>
        </div>

        {/* Lighting Mood Controls */}
        <div className="flex items-center gap-2 bg-zinc-950/80 p-1.5 rounded-2xl border border-white/10 shadow-inner">
          <button
            onClick={() => setLightingMood("day")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              lightingMood === "day"
                ? "bg-white text-zinc-950 shadow-lg shadow-white/10"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Sun className="w-3.5 h-3.5" /> Parlaq Gündüz
          </button>
          <button
            onClick={() => setLightingMood("sunset")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              lightingMood === "sunset"
                ? "bg-white text-zinc-950 shadow-lg shadow-white/10"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Günbatımı
          </button>
          <button
            onClick={() => setLightingMood("night")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              lightingMood === "night"
                ? "bg-white text-zinc-950 shadow-lg shadow-white/10"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Moon className="w-3.5 h-3.5" /> Gecə Rejimi
          </button>
        </div>
      </div>


      {/* 3D Canvas Viewport - Brightened Studio Backdrop */}
      <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-2xl bg-[#1e2029] overflow-hidden border border-white/15 my-6 shadow-2xl">
        
        <Canvas shadows camera={{ position: [5, 4.2, 5.8], fov: 42 }}>
          {/* HIGH-INTENSITY STUDIO LIGHTING PRESETS */}
          {lightingMood === "day" && (
            <>
              {/* Strong High Ambient Light */}
              <ambientLight intensity={1.9} color="#F8FAFC" />
              {/* Primary Key Light */}
              <directionalLight position={[7, 10, 7]} intensity={2.6} color="#FFFFFF" castShadow shadow-mapSize={[2048, 2048]} />
              {/* Soft Fill Light */}
              <directionalLight position={[-5, 6, -5]} intensity={1.3} color="#E0E7FF" />
              {/* Warm Rim Backlight */}
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

          <BrightArchitecturalRoom 
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
    </div>
  );
}
