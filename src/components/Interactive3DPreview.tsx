"use client";

import React, { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, MeshWobbleMaterial, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { Sun, Moon, Sparkles, Layers, RefreshCw } from "lucide-react";

// Interactive 3D Architecture Model Component
function ArchitecturalScene({ materialType, lightingMood }: { materialType: string; lightingMood: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  // Material settings according to selection
  const materialProps = React.useMemo(() => {
    switch (materialType) {
      case "marble":
        return { color: "#F5F5F7", roughness: 0.1, metalness: 0.2 };
      case "obsidian":
        return { color: "#1E1E24", roughness: 0.2, metalness: 0.8 };
      case "gold":
        return { color: "#E5C158", roughness: 0.3, metalness: 0.9 };
      case "emerald":
        return { color: "#10B981", roughness: 0.2, metalness: 0.4 };
      default: // wood / warm
        return { color: "#8B5E3C", roughness: 0.6, metalness: 0.1 };
    }
  }, [materialType]);

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Base Floor */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <boxGeometry args={[4.2, 0.2, 4.2]} />
        <meshStandardMaterial color="#17171c" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Modern Wall Back */}
      <mesh position={[0, 1.4, -2]} receiveShadow castShadow>
        <boxGeometry args={[4.2, 3, 0.2]} />
        <meshStandardMaterial color="#22222a" roughness={0.5} />
      </mesh>

      {/* Decorative Wall Panels */}
      <mesh position={[-1.2, 1.4, -1.88]} castShadow>
        <boxGeometry args={[1.2, 2.6, 0.08]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>

      {/* Modern Architectural Sofa / Sculptural Sofa */}
      <group position={[0, 0.3, 0.2]}>
        {/* Main Seat */}
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.4, 1.2]} />
          <meshStandardMaterial color="#2a2b36" roughness={0.7} />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, 0.5, -0.45]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.5, 0.3]} />
          <meshStandardMaterial color="#2a2b36" roughness={0.7} />
        </mesh>
        {/* Accent Cushion */}
        <mesh position={[0.7, 0.4, -0.3]} castShadow>
          <boxGeometry args={[0.5, 0.4, 0.15]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      </group>

      {/* Modern Coffee Table */}
      <group position={[0, 0.1, 1.2]}>
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.7, 0.7, 0.08, 32]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        {/* Metal Base */}
        <mesh position={[0, 0.07, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.4, 0.14, 32]} />
          <meshStandardMaterial color="#444" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Floating Futuristic Art Piece */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8} position={[1.1, 1.8, -1.2]}>
        <mesh castShadow>
          <icosahedronGeometry args={[0.35, 1]} />
          <MeshWobbleMaterial factor={0.3} speed={1.5} {...materialProps} />
        </mesh>
      </Float>

      {/* Ambient Floor Shadow */}
      <ContactShadows position={[0, -0.19, 0]} opacity={0.7} scale={6} blur={2.5} far={4} />
    </group>
  );
}

export default function Interactive3DPreview() {
  const [materialType, setMaterialType] = useState<string>("marble");
  const [lightingMood, setLightingMood] = useState<string>("sunset");

  const materials = [
    { id: "marble", label: "Mərmər", color: "bg-neutral-200" },
    { id: "obsidian", label: "Obsidian", color: "bg-neutral-800" },
    { id: "gold", label: "Qızıl Vurğu", color: "bg-amber-400" },
    { id: "emerald", label: "Zümrüd", color: "bg-emerald-500" },
    { id: "wood", label: "Ceviz Ağacı", color: "bg-amber-800" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto rounded-3xl border border-white/10 bg-neutral-900/80 backdrop-blur-xl shadow-2xl p-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4" /> Canlı 3D Render Təcrübəsi
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            İnteraktiv 3D Otaq Önizləməsi
          </h3>
        </div>

        {/* Lighting Mood Buttons */}
        <div className="flex items-center gap-2 bg-neutral-950/60 p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setLightingMood("day")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              lightingMood === "day"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Sun className="w-3.5 h-3.5" /> Gündüz
          </button>
          <button
            onClick={() => setLightingMood("sunset")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              lightingMood === "sunset"
                ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Günbatımı
          </button>
          <button
            onClick={() => setLightingMood("night")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              lightingMood === "night"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Moon className="w-3.5 h-3.5" /> Gecə Cyber
          </button>
        </div>
      </div>

      {/* 3D Canvas Area */}
      <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-2xl bg-neutral-950/90 overflow-hidden border border-white/5 my-6">
        <Canvas shadows camera={{ position: [4, 3, 5], fov: 45 }}>
          {/* Dynamic Lights according to selected mood */}
          {lightingMood === "day" && (
            <>
              <ambientLight intensity={0.9} />
              <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
            </>
          )}
          {lightingMood === "sunset" && (
            <>
              <ambientLight intensity={0.5} color="#fdba74" />
              <directionalLight position={[6, 4, 3]} intensity={2.2} color="#f97316" castShadow />
              <pointLight position={[-4, 3, -2]} intensity={0.8} color="#a855f7" />
            </>
          )}
          {lightingMood === "night" && (
            <>
              <ambientLight intensity={0.2} color="#818cf8" />
              <pointLight position={[0, 4, 0]} intensity={3} color="#6366f1" />
              <pointLight position={[-2, 2, 2]} intensity={2} color="#ec4899" />
              <pointLight position={[2, 1, -2]} intensity={2} color="#10b981" />
            </>
          )}

          <ArchitecturalScene materialType={materialType} lightingMood={lightingMood} />
          <OrbitControls enableZoom={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2.2} />
        </Canvas>

        {/* Drag Instruction Badge */}
        <div className="absolute bottom-4 left-4 pointer-events-none bg-neutral-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[11px] font-medium text-neutral-300 flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Sıçranı sürüşdürərək 360° fırladın</span>
        </div>
      </div>

      {/* Material Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 relative z-10">
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400">
          <Layers className="w-4 h-4 text-indigo-400" /> Materialı Dəyişin:
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {materials.map((m) => (
            <button
              key={m.id}
              onClick={() => setMaterialType(m.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                materialType === m.id
                  ? "bg-white text-neutral-900 border-white shadow-lg shadow-white/10 scale-105"
                  : "bg-neutral-800/80 text-neutral-300 border-white/10 hover:border-white/30"
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${m.color} border border-black/20`}></span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
