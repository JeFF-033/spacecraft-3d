"use client";

import React from "react";
import { useStore } from "@/store/useStore";
import { Undo, Redo, Map, Magnet, Plus, Ruler, User } from "lucide-react";
import RoomDimensionsModal from "./RoomDimensionsModal";

export default function TopToolbar() {
  const [isRoomDimensionsOpen, setIsRoomDimensionsOpen] = React.useState(false);
  const { 
    is2DView, setIs2DView, 
    isWalkthrough, setIsWalkthrough,
    isGridSnapEnabled, setIsGridSnapEnabled,
    isMeasuring, setIsMeasuring, measurements, clearMeasurements,
    undo, redo, pastLayers, futureLayers, saveHistory,
    isDrawingWall, setIsDrawingWall,
    appMode, isPresentationMode,
    rulerColor, setRulerColor,
    gridColor, setGridColor
  } = useStore();

  const addDoor = () => {
    saveHistory();
    const state = useStore.getState();
    const id = Date.now().toString();
    useStore.setState({
      furnitureLayers: [
        ...state.furnitureLayers,
        {
          id,
          name: "Qapı (Daxili)",
          modelUrl: "https://vazgxjzeqnvfxxnllnky.supabase.co/storage/v1/object/public/models/door.glb",
          type: "door",
          position: { x: 0, y: 1.0, z: -state.roomSize.length / 2 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1.1, y: 2.1, z: 0.2 },
          color: "#8b5a2b",
          price: 150,
          floor: state.currentFloor
        },
      ],
      selectedId: id,
    });
  };

  const addWindow = () => {
    saveHistory();
    const state = useStore.getState();
    const id = Date.now().toString();
    useStore.setState({
      furnitureLayers: [
        ...state.furnitureLayers,
        {
          id,
          name: "Pəncərə",
          modelUrl: "https://vazgxjzeqnvfxxnllnky.supabase.co/storage/v1/object/public/models/window.glb",
          type: "window",
          position: { x: 0, y: 1.5, z: -state.roomSize.length / 2 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1.2, y: 1.2, z: 0.2 },
          color: "#87ceeb",
          price: 120,
          floor: state.currentFloor
        },
      ],
      selectedId: id,
    });
  };

  if (isPresentationMode || appMode !== '3d-room') return null;

  return (
    <div className="absolute top-14 md:top-6 left-1/2 -translate-x-1/2 z-30 max-w-[95vw] md:max-w-none overflow-x-auto scrollbar-none flex items-center gap-1 sm:gap-1.5 bg-black/70 backdrop-blur-2xl border border-white/10 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] whitespace-nowrap">
      
      {/* Undo / Redo */}
      <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
        <button onClick={undo} disabled={pastLayers.length === 0} className="p-1.5 sm:p-2 rounded-xl hover:bg-white/10 disabled:opacity-20 transition-all text-neutral-400 hover:text-white" title="Geri Qaytar (Undo)">
          <Undo className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <button onClick={redo} disabled={futureLayers.length === 0} className="p-1.5 sm:p-2 rounded-xl hover:bg-white/10 disabled:opacity-20 transition-all text-neutral-400 hover:text-white" title="İrəli Qaytar (Redo)">
          <Redo className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>

      <div className="w-px h-5 sm:h-6 bg-white/10 mx-0.5 sm:mx-1 shrink-0"></div>

      {/* Naviqasiya: 2D / Gəz */}
      <div className="flex p-0.5 sm:p-1 bg-black/30 rounded-xl border border-white/5 shrink-0">
        <button 
          onClick={() => setIs2DView(!is2DView)} 
          className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all ${is2DView ? 'bg-white/10 text-white shadow-sm' : 'text-neutral-400 hover:text-white'}`}
        >
          <Map className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {is2DView ? '3D' : '2D'}
        </button>
        <button 
          onClick={() => setIsWalkthrough(!isWalkthrough)} 
          className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all ${isWalkthrough ? 'bg-white/10 text-white shadow-sm' : 'text-neutral-400 hover:text-white'}`}
        >
          <User className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Gəz
        </button>
      </div>

      <div className="w-px h-5 sm:h-6 bg-white/10 mx-0.5 sm:mx-1 shrink-0"></div>

      {/* Alətlər: Divar, Qrif, Ölçü */}
      <div className="flex p-0.5 sm:p-1 bg-black/30 rounded-xl border border-white/5 shrink-0">
        <button 
          onClick={() => setIsDrawingWall(!isDrawingWall)} 
          className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all ${isDrawingWall ? 'bg-white/10 text-white shadow-sm' : 'text-neutral-400 hover:text-white'}`}
          title="Daxili Divar Çək"
        >
          <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Divar
        </button>
        
        <div className="relative flex items-center">
          <button 
            onClick={() => setIsGridSnapEnabled(!isGridSnapEnabled)} 
            className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all ${isGridSnapEnabled ? 'bg-white/10 text-white shadow-sm pr-6 sm:pr-8' : 'text-neutral-400 hover:text-white'}`}
            title="Maqnit (Grid Snapping)"
          >
            <Magnet className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Qrif
          </button>

          {isGridSnapEnabled && (
            <div className="absolute right-1 sm:right-2 flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded overflow-hidden shadow-lg border-2 border-white/20 hover:border-white/50 transition-all">
              <input 
                type="color" 
                value={gridColor} 
                onChange={(e) => setGridColor(e.target.value)}
                className="w-8 h-8 -m-2 cursor-pointer"
                title="Qrifin (Torun) rəngi"
              />
            </div>
          )}
        </div>

        <div className="relative flex items-center">
          <button 
            onClick={() => setIsMeasuring(!isMeasuring)} 
            className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all ${isMeasuring ? 'bg-white/10 text-white shadow-sm pr-6 sm:pr-8' : 'text-neutral-400 hover:text-white'}`}
            title="Ruletka ilə ölçü götür"
          >
            <Ruler className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Ölçü
          </button>
          
          {isMeasuring && (
            <div className="absolute right-1 sm:right-2 flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded overflow-hidden shadow-lg border-2 border-white/20 hover:border-white/50 transition-all">
              <input 
                type="color" 
                value={rulerColor} 
                onChange={(e) => setRulerColor(e.target.value)}
                className="w-8 h-8 -m-2 cursor-pointer"
                title="Ölçü xəttinin rəngi"
              />
            </div>
          )}
          {measurements.length > 0 && !isMeasuring && (
            <button 
              onClick={clearMeasurements} 
              className="absolute -top-2 -right-2 bg-red-500 text-white w-4 h-4 rounded-full text-[8px] flex items-center justify-center hover:bg-red-600 transition-colors shadow-md border border-white/20" 
              title="Bütün ölçüləri sil"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="w-px h-5 sm:h-6 bg-white/10 mx-0.5 sm:mx-1 shrink-0"></div>

      {/* Elementlər: Qapı, Pəncərə, Otaq Ölçüləri */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        <button 
          onClick={() => setIsRoomDimensionsOpen(true)} 
          className="flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-[11px] font-extrabold transition-all bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-md cursor-pointer active:scale-95"
          title="Otaq Ölçülərini Və Rənglərini Redaktə Et"
        >
          📐 Otaq Ölçüləri
        </button>


        <button 
          onClick={addDoor} 
          className="flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-2 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all text-neutral-400 hover:text-white hover:bg-white/10"
          title="Divara Qapı Əlavə Et"
        >
          🚪 Qapı
        </button>
        <button 
          onClick={addWindow} 
          className="flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-2 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all text-neutral-400 hover:text-white hover:bg-white/10"
          title="Divara Pəncərə Əlavə Et"
        >
          🪟 Pəncərə
        </button>
      </div>

      <RoomDimensionsModal 
        isOpen={isRoomDimensionsOpen} 
        onClose={() => setIsRoomDimensionsOpen(false)} 
      />
    </div>
  );
}
