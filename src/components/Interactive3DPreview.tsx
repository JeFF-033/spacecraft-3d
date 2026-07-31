"use client";

import React, { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, ContactShadows, Html } from "@react-three/drei";
import * as THREE from "three";
import { Sun, Moon, Sparkles, Layers, RefreshCw, Info, Check } from "lucide-react";

// Detailed Photorealistic Architectural Room Component
function DetailedArchitecturalRoom({ materialType, lightingMood, activeHotspot, setActiveHotspot }: { 
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

  // Material settings according to selection
  const materialProps = React.useMemo(() => {
    switch (materialType) {
      case "marble":
        return { color: "#F0F0F3", roughness: 0.05, metalness: 0.1 };
      case "obsidian":
        return { color: "#16161B", roughness: 0.15, metalness: 0.85 };
      case "gold":
        return { color: "#D4AF37", roughness: 0.2, metalness: 0.9 };
      case "emerald":
        return { color: "#059669", roughness: 0.25, metalness: 0.3 };
      default: // wood / walnut
        return { color: "#6B4423", roughness: 0.55, metalness: 0.05 };
    }
  }, [materialType]);

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      
      {/* 1. MAIN FLOOR (Polished Tile Floor) */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[5, 0.1, 5]} />
        <meshStandardMaterial color="#111116" roughness={0.2} metalness={0.6} />
      </mesh>

      {/* Modern Floor Rug / Carpet */}
      <mesh position={[0, 0.01, 0.3]} receiveShadow>
        <boxGeometry args={[3.2, 0.02, 2.6]} />
        <meshStandardMaterial color="#1f2029" roughness={0.9} />
      </mesh>

      {/* 2. BACK WALL WITH WOOD SLATS */}
      <mesh position={[0, 1.75, -2.45]} receiveShadow castShadow>
        <boxGeometry args={[5, 3.5, 0.1]} />
        <meshStandardMaterial color="#181820" roughness={0.6} />
      </mesh>

      {/* Slatted Wood Panels Accent */}
      {[-1.8, -1.5, -1.2, -0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9, 1.2, 1.5, 1.8].map((xPos, i) => (
        <mesh key={i} position={[xPos, 1.75, -2.38]} castShadow receiveShadow>
          <boxGeometry args={[0.15, 3.5, 0.04]} />
          <meshStandardMaterial color="#3d2a1d" roughness={0.4} />
        </mesh>
      ))}

      {/* Decorative Wall Artwork Frame */}
      <group position={[0, 2.3, -2.32]}>
        <mesh castShadow>
          <boxGeometry args={[1.8, 1.2, 0.05]} />
          <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Canvas artwork texture */}
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[1.7, 1.1]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      </group>

      {/* 3. LUXURY MODERN SOFA */}
      <group position={[0, 0.45, -0.6]} onClick={(e) => { e.stopPropagation(); setActiveHotspot("sofa"); }}>
        {/* Base Seat Frame */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.8, 0.35, 1.3]} />
          <meshStandardMaterial color="#262733" roughness={0.7} />
        </mesh>
        
        {/* Cushions (3 Seat Cushions) */}
        {[-0.9, 0, 0.9].map((cx, i) => (
          <mesh key={i} position={[cx, 0.22, 0.05]} castShadow receiveShadow>
            <boxGeometry args={[0.86, 0.2, 1.15]} />
            <meshStandardMaterial color="#313342" roughness={0.65} />
          </mesh>
        ))}

        {/* Backrest */}
        <mesh position={[0, 0.55, -0.5]} castShadow receiveShadow>
          <boxGeometry args={[2.8, 0.6, 0.3]} />
          <meshStandardMaterial color="#262733" roughness={0.7} />
        </mesh>

        {/* Armrests */}
        <mesh position={[-1.3, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.25, 0.45, 1.3]} />
          <meshStandardMaterial color="#262733" roughness={0.7} />
        </mesh>
        <mesh position={[1.3, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.25, 0.45, 1.3]} />
          <meshStandardMaterial color="#262733" roughness={0.7} />
        </mesh>

        {/* Accent Decorative Pillows */}
        <mesh position={[-0.8, 0.45, -0.3]} rotation={[0, 0.2, 0.1]} castShadow>
          <boxGeometry args={[0.45, 0.4, 0.18]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh position={[0.8, 0.45, -0.3]} rotation={[0, -0.2, -0.1]} castShadow>
          <boxGeometry args={[0.45, 0.4, 0.18]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>

        {/* Metallic Legs */}
        {[-1.3, 1.3].map((lx, i) =>
          [-0.5, 0.5].map((lz, j) => (
            <mesh key={`${i}-${j}`} position={[lx, -0.2, lz]} castShadow>
              <cylinderGeometry args={[0.03, 0.02, 0.25, 16]} />
              <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
            </mesh>
          ))
        )}

        {/* Hotspot Pin */}
        <Html position={[0, 0.9, 0]} center>
          <button 
            onClick={() => setActiveHotspot(activeHotspot === "sofa" ? null : "sofa")}
            className="px-2.5 py-1 rounded-full bg-indigo-600/90 hover:bg-indigo-500 text-white text-[10px] font-bold border border-indigo-400/50 shadow-xl backdrop-blur-md flex items-center gap-1 transition-transform hover:scale-110"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
            <span>Divan: Velvet Sofistike</span>
          </button>
        </Html>
      </group>

      {/* 4. MODERN GLASS & MARBLE COFFEE TABLE */}
      <group position={[0, 0.2, 0.9]} onClick={(e) => { e.stopPropagation(); setActiveHotspot("table"); }}>
        {/* Table Top Surface */}
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.85, 0.85, 0.06, 32]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        {/* Table Metal Base Structure */}
        <mesh position={[0, 0.07, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.5, 0.14, 32]} />
          <meshStandardMaterial color="#222" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Decorative Vase on Table */}
        <mesh position={[0.2, 0.3, 0.1]} castShadow>
          <cylinderGeometry args={[0.08, 0.12, 0.25, 16]} />
          <meshStandardMaterial color="#fff" roughness={0.1} />
        </mesh>

        {/* Hotspot Pin */}
        <Html position={[0, 0.45, 0]} center>
          <button 
            onClick={() => setActiveHotspot(activeHotspot === "table" ? null : "table")}
            className="px-2.5 py-1 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-white text-[10px] font-bold border border-white/20 shadow-xl backdrop-blur-md flex items-center gap-1 transition-transform hover:scale-110"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Masa: Modern Mərmər</span>
          </button>
        </Html>
      </group>

      {/* 5. AMBIENT FLOOR LAMP */}
      <group position={[1.8, 1.2, -1.8]}>
        {/* Base */}
        <mesh position={[0, -1.15, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.05, 32]} />
          <meshStandardMaterial color="#111" metalness={0.9} />
        </mesh>
        {/* Pole */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 2.3, 16]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Shade */}
        <mesh position={[0, 1.1, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.4, 0.45, 32]} />
          <meshStandardMaterial color="#fafafa" roughness={0.3} />
        </mesh>
        {/* Warm Point Light */}
        <pointLight position={[0, 1, 0]} intensity={3} color="#fbbf24" distance={4} />
      </group>

      {/* 6. INDOOR POTTED PLANT */}
      <group position={[-1.8, 0.6, -1.6]}>
        {/* Pot */}
        <mesh position={[0, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.2, 0.5, 32]} />
          <meshStandardMaterial color="#1f1f26" roughness={0.3} />
        </mesh>
        {/* Plant Foliage (Spheres) */}
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <mesh position={[0, 0.25, 0]} castShadow>
            <dodecahedronGeometry args={[0.35, 1]} />
            <meshStandardMaterial color="#10b981" roughness={0.4} />
          </mesh>
          <mesh position={[0.15, 0.45, 0.1]} castShadow>
            <dodecahedronGeometry args={[0.25, 1]} />
            <meshStandardMaterial color="#059669" roughness={0.4} />
          </mesh>
        </Float>
      </group>

      {/* Soft Contact Shadows on Floor */}
      <ContactShadows position={[0, 0.02, 0]} opacity={0.75} scale={6} blur={2.2} far={4} />
    </group>
  );
}

export default function Interactive3DPreview() {
  const [materialType, setMaterialType] = useState<string>("marble");
  const [lightingMood, setLightingMood] = useState<string>("sunset");
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const materials = [
    { id: "marble", label: "İtalyan Mərmər", color: "bg-neutral-100" },
    { id: "obsidian", label: "Qara Obsidian", color: "bg-neutral-900 border border-white/20" },
    { id: "gold", label: "Qızıl Metallik", color: "bg-amber-400" },
    { id: "emerald", label: "Zümrüd Velvet", color: "bg-emerald-500" },
    { id: "wood", label: "Ceviz Ağacı", color: "bg-amber-800" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto rounded-3xl border border-white/15 bg-neutral-900/90 backdrop-blur-xl shadow-2xl p-6 relative overflow-hidden">
      {/* Ambient Background Lights */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-amber-500/15 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4" /> Canlı 3D Render Təcrübəsi
          </div>
          <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            İnteraktiv 3D Otaq Önizləməsi
          </h3>
        </div>

        {/* Lighting Mood Controls */}
        <div className="flex items-center gap-2 bg-neutral-950/80 p-1.5 rounded-2xl border border-white/10 shadow-inner">
          <button
            onClick={() => setLightingMood("day")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              lightingMood === "day"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Sun className="w-3.5 h-3.5" /> Gündüz
          </button>
          <button
            onClick={() => setLightingMood("sunset")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              lightingMood === "sunset"
                ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Günbatımı
          </button>
          <button
            onClick={() => setLightingMood("night")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              lightingMood === "night"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Moon className="w-3.5 h-3.5" /> Gecə Cyber
          </button>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-2xl bg-[#0a0b10] overflow-hidden border border-white/10 my-6 shadow-inner">
        
        <Canvas shadows camera={{ position: [5, 4, 6], fov: 42 }}>
          {/* Lighting Modes */}
          {lightingMood === "day" && (
            <>
              <ambientLight intensity={1.1} />
              <directionalLight position={[6, 9, 6]} intensity={1.8} castShadow shadow-mapSize={[2048, 2048]} />
              <directionalLight position={[-4, 5, -4]} intensity={0.5} color="#e0e7ff" />
            </>
          )}
          {lightingMood === "sunset" && (
            <>
              <ambientLight intensity={0.6} color="#fdba74" />
              <directionalLight position={[7, 4, 3]} intensity={2.8} color="#f97316" castShadow shadow-mapSize={[2048, 2048]} />
              <pointLight position={[-4, 4, -2]} intensity={1.2} color="#a855f7" />
            </>
          )}
          {lightingMood === "night" && (
            <>
              <ambientLight intensity={0.25} color="#818cf8" />
              <directionalLight position={[5, 7, 5]} intensity={0.6} color="#4f46e5" />
              <pointLight position={[0, 4, 0]} intensity={3.5} color="#6366f1" />
              <pointLight position={[-2, 2, 2]} intensity={2.5} color="#ec4899" />
              <pointLight position={[2, 1, -2]} intensity={2.5} color="#10b981" />
            </>
          )}

          <DetailedArchitecturalRoom 
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
        <div className="absolute bottom-4 left-4 pointer-events-none bg-neutral-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-xs font-medium text-neutral-300 flex items-center gap-2.5 shadow-xl">
          <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Sıçranı sürüşdürərək 360° interaktiv baxın</span>
        </div>

        {/* Active Hotspot Info Overlay */}
        {activeHotspot && (
          <div className="absolute top-4 right-4 bg-neutral-900/95 border border-indigo-500/40 p-4 rounded-2xl shadow-2xl backdrop-blur-md max-w-xs text-xs text-white animate-fadeIn">
            <div className="flex items-center justify-between font-bold text-indigo-400 mb-1">
              <span>{activeHotspot === "sofa" ? "Velvet Sofistike Divan" : "Modern Mərmər Masa"}</span>
              <span className="text-[10px] bg-indigo-500/20 px-2 py-0.5 rounded text-indigo-300">SpaceCraft 3D Object</span>
            </div>
            <p className="text-neutral-300 text-[11px] leading-relaxed">
              {activeHotspot === "sofa" 
                ? "Dəbdəbəli velvet parça örtüyü, yüksək sıxlıqlı qubka və qızıl ayaq vurğuları ilə xüsusi hazırlanmış modern divan modulu."
                : "Təbii İtalyan Carrara mərmər səthi və mat qara metal baza ayaqları ilə interyerə dinamika verən kofe masası."}
            </p>
          </div>
        )}
      </div>

      {/* Material Selector Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/10 relative z-10">
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
          <Layers className="w-4 h-4 text-indigo-400" /> Otaq Materialını Seçin:
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {materials.map((m) => (
            <button
              key={m.id}
              onClick={() => setMaterialType(m.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 border ${
                materialType === m.id
                  ? "bg-white text-neutral-900 border-white shadow-xl scale-105"
                  : "bg-neutral-800/80 text-neutral-300 border-white/10 hover:border-white/30"
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
