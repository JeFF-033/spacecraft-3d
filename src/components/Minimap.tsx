"use client";

import React from "react";
import { useStore } from "@/store/useStore";
import { Play, Pause } from "lucide-react";

export default function Minimap() {
  const { appMode, furnitureLayers, currentFloor, hotspots, currentTourNodeId, setCurrentTourNodeId, isAutoTourPlaying, setIsAutoTourPlaying, isPropertiesPanelOpen } = useStore();

  // Dinamik kameraları tapırıq
  const dynamicTourNodes = React.useMemo(() => {
    return furnitureLayers
      .filter(f => (f.type === "camera" || f.name.includes("360 Kamera")) && (f.floor ?? 0) === currentFloor)
      .map((c, idx) => ({
        id: c.id,
        name: c.name || `Kamera ${idx + 1}`,
        panoramaUrl: c.panoramaUrl || "",
        position: { x: c.position.x, y: c.position.y, z: c.position.z }
      }));
  }, [furnitureLayers, currentFloor]);

  if (appMode !== '360-photo' || dynamicTourNodes.length === 0) return null;

  // Xəritənin sərhədlərini (Bounding Box) hesablayırıq
  let minX = Infinity, minZ = Infinity, maxX = -Infinity, maxZ = -Infinity;
  dynamicTourNodes.forEach(n => {
    const x = n.position?.x || 0;
    const z = n.position?.z || 0;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;
  });

  const padding = 2;
  minX -= padding;
  maxX += padding;
  minZ -= padding;
  maxZ += padding;

  const width = Math.max(maxX - minX, 10);
  const height = Math.max(maxZ - minZ, 10);

  return (
    <div className={`absolute bottom-28 sm:bottom-6 w-36 h-36 sm:w-48 sm:h-48 bg-[#0a0a0a]/80 border border-white/10 rounded-2xl backdrop-blur-xl p-2 sm:p-4 shadow-2xl z-30 flex items-center justify-center pointer-events-auto transition-all duration-300 right-3 sm:right-10 ${isPropertiesPanelOpen ? 'lg:right-[350px]' : 'lg:right-10'}`}>
      <div className="absolute -top-3 left-4 bg-indigo-500 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-lg tracking-widest uppercase">
        Xəritə
      </div>
      <button 
        onClick={() => setIsAutoTourPlaying(!isAutoTourPlaying)}
        className={`absolute -top-3 right-4 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-lg tracking-widest uppercase flex items-center gap-1 transition-colors ${isAutoTourPlaying ? 'bg-rose-500 hover:bg-rose-400' : 'bg-emerald-500 hover:bg-emerald-400'}`}
        title="Avtomatik Bələdçili Tur"
      >
        {isAutoTourPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        {isAutoTourPlaying ? "DURDUR" : "AVTO TUR"}
      </button>
      <svg width="100%" height="100%" viewBox={`${minX} ${minZ} ${width} ${height}`} className="overflow-visible" style={{ transform: "rotateX(180deg)" }}>
        {/* Əlaqə xətləri (Hotspots) */}
        {hotspots.map(h => {
          const s = dynamicTourNodes.find(n => n.id === h.sourceNodeId);
          const t = dynamicTourNodes.find(n => n.id === h.targetNodeId);
          if (!s || !t) return null;
          return (
            <line 
              key={h.id}
              x1={s.position?.x || 0}
              y1={s.position?.z || 0}
              x2={t.position?.x || 0}
              y2={t.position?.z || 0}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={0.3}
            />
          );
        })}
        {/* Məkan nöqtələri (Nodes) */}
        {dynamicTourNodes.map(n => {
          const isActive = n.id === currentTourNodeId;
          return (
            <g 
              key={n.id} 
              className="cursor-pointer"
              onClick={() => setCurrentTourNodeId(n.id)}
            >
              <circle 
                cx={n.position?.x || 0}
                cy={n.position?.z || 0}
                r={isActive ? 1.0 : 0.6}
                fill={isActive ? "#3b82f6" : "#e5e7eb"}
                className="transition-all duration-300"
              />
              {isActive && (
                <circle 
                  cx={n.position?.x || 0}
                  cy={n.position?.z || 0}
                  r={1.5}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth={0.3}
                  className="animate-ping opacity-75"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
