"use client";

import React from "react";
import { useStore } from "@/store/useStore";
import { Play, Pause, Box, LayoutTemplate } from "lucide-react";

export default function MatterportControls() {
  const { 
    appMode, 
    setAppMode, 
    is2DView, 
    setIs2DView, 
    isAutoTourPlaying, 
    setIsAutoTourPlaying,
    isDollhouseMode,
    setIsDollhouseMode,
    isDefurnishedMode,
    setIsDefurnishedMode,
    tourNodes,
    currentTourNodeId
  } = useStore();

  const currentNode = tourNodes.find(n => n.id === currentTourNodeId);
  const hasDefurnished = !!currentNode?.defurnishedUrl;

  if (appMode === "360-photo") return null;

  return (
    <div className="absolute bottom-16 sm:bottom-6 left-3 sm:left-6 z-30 flex flex-wrap sm:flex-nowrap gap-1.5 sm:gap-2 max-w-[calc(100vw-24px)]">
      <button
        onClick={() => {
          setAppMode("360-photo");
          setIs2DView(false);
          setIsAutoTourPlaying(true);
        }}
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all backdrop-blur-md border shadow-2xl ${
          isAutoTourPlaying 
            ? "bg-emerald-500 text-white border-emerald-400" 
            : "bg-black/60 hover:bg-black/80 text-white border-white/10"
        }`}
        title="360° Foto Rejiminə Keç"
      >
        <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />
      </button>

      <button
        onClick={() => {
          setAppMode("360-photo");
          setIs2DView(false);
          setIsDollhouseMode(true);
        }}
        className={`px-3 sm:px-5 h-10 sm:h-12 rounded-full flex items-center gap-1.5 sm:gap-2 font-bold text-xs sm:text-sm transition-all backdrop-blur-md border shadow-2xl ${
          isDollhouseMode
            ? "bg-white text-black border-white"
            : "bg-black/60 hover:bg-black/80 text-white border-white/10"
        }`}
        title="Kukla Evi (3D Dollhouse)"
      >
        <Box className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        Dollhouse
      </button>

      <button
        onClick={() => {
          setAppMode("3d-room");
          setIs2DView(true);
        }}
        className={`px-3 sm:px-5 h-10 sm:h-12 rounded-full flex items-center gap-1.5 sm:gap-2 font-bold text-xs sm:text-sm transition-all backdrop-blur-md border shadow-2xl ${
          is2DView
            ? "bg-white text-black border-white"
            : "bg-black/60 hover:bg-black/80 text-white border-white/10"
        }`}
        title="Mərtəbə Planı (2D Floorplan)"
      >
        <LayoutTemplate className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        Floorplan
      </button>
    </div>
  );
}
