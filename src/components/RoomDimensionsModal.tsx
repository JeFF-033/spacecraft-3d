"use client";

import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import { useMultiplayer } from "@/hooks/useMultiplayer";
import { getAllRoomBounds } from "@/lib/roomSystem";
import { X, Ruler, Sparkles, Sliders } from "lucide-react";

interface RoomDimensionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RoomDimensionsModal({ isOpen, onClose }: RoomDimensionsModalProps) {
  const { 
    roomSize, 
    setRoomSize, 
    furnitureLayers, 
    updateFurniture, 
    selectedId, 
    setSelectedId, 
    currentFloor, 
    wallColor, 
    setRoomColors, 
    floorColor 
  } = useStore();
  const { pushUpdate } = useMultiplayer();

  const allRooms = getAllRoomBounds(furnitureLayers, roomSize, currentFloor);
  const [activeRoomId, setActiveRoomId] = useState<string>(selectedId || "main-room");

  const currentRoom = allRooms.find((r) => r.id === activeRoomId) || allRooms[0];
  const isMain = currentRoom.id === "main-room";

  if (!isOpen) return null;

  const handleWidthChange = (val: number) => {
    if (isMain) {
      setRoomSize({ ...roomSize, width: val });
    } else {
      const roomItem = furnitureLayers.find((f) => f.id === currentRoom.id);
      if (roomItem) {
        updateFurniture(roomItem.id, { scale: { ...roomItem.scale, x: val } });
      }
    }
    pushUpdate();
  };

  const handleLengthChange = (val: number) => {
    if (isMain) {
      setRoomSize({ ...roomSize, length: val });
    } else {
      const roomItem = furnitureLayers.find((f) => f.id === currentRoom.id);
      if (roomItem) {
        updateFurniture(roomItem.id, { scale: { ...roomItem.scale, z: val } });
      }
    }
    pushUpdate();
  };

  const handleHeightChange = (val: number) => {
    if (isMain) {
      setRoomSize({ ...roomSize, height: val });
    } else {
      const roomItem = furnitureLayers.find((f) => f.id === currentRoom.id);
      if (roomItem) {
        updateFurniture(roomItem.id, { scale: { ...roomItem.scale, y: val } });
      }
    }
    pushUpdate();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-[#0e0e15] border border-white/15 rounded-3xl w-full max-w-lg shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Ruler className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight flex items-center gap-2">
                Otaq Ölçüləri Və Tənzimləmələri
              </h2>
              <p className="text-[11px] text-neutral-400 font-medium">En, Uzunluq, Hündürlük və Rəng parametrləri</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh] scrollbar-thin scrollbar-thumb-white/10">
          {/* Room Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> Redaktə Olunacaq Otağı Seçin:
            </label>
            <div className="relative">
              <select
                value={currentRoom.id}
                onChange={(e) => {
                  setActiveRoomId(e.target.value);
                  if (e.target.value !== "main-room") {
                    setSelectedId(e.target.value);
                  }
                }}
                className="w-full bg-black/60 border border-white/15 focus:border-indigo-500 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold appearance-none cursor-pointer shadow-inner pr-10 transition-all"
              >
                {allRooms.map((r) => (
                  <option key={r.id} value={r.id} className="bg-neutral-900 text-white py-2 font-medium">
                    🏠 {r.name} ({r.width.toFixed(1)}m × {r.length.toFixed(1)}m)
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 font-mono text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Sliders Container */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4">
            {/* En (Width - X) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-neutral-300 flex items-center gap-1.5">↔️ En (X-ölçüsü)</span>
                <span className="font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-lg border border-indigo-500/20 text-xs">
                  {currentRoom.width.toFixed(1)} metr
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="30"
                step="0.5"
                value={currentRoom.width}
                onChange={(e) => handleWidthChange(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Uzunluq (Length - Z) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-neutral-300 flex items-center gap-1.5">↕️ Uzunluq (Z-ölçüsü)</span>
                <span className="font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-lg border border-indigo-500/20 text-xs">
                  {currentRoom.length.toFixed(1)} metr
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="30"
                step="0.5"
                value={currentRoom.length}
                onChange={(e) => handleLengthChange(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Hündürlük (Height - Y) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-neutral-300 flex items-center gap-1.5">⏫ Hündürlük (Y-ölçüsü)</span>
                <span className="font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-lg border border-indigo-500/20 text-xs">
                  {currentRoom.height.toFixed(1)} metr
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="6"
                step="0.1"
                value={currentRoom.height}
                onChange={(e) => handleHeightChange(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Colors Card */}
          <div className="grid grid-cols-2 gap-3 bg-white/[0.03] p-4 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-300">🧱 Divar Rəngi</span>
              <input
                type="color"
                value={wallColor || "#ffffff"}
                onChange={(e) => {
                  setRoomColors({ wallColor: e.target.value });
                  pushUpdate();
                }}
                className="w-8 h-8 rounded-xl cursor-pointer bg-transparent border border-white/20 p-0.5"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-300">🪵 Döşəmə Rəngi</span>
              <input
                type="color"
                value={floorColor || "#8c8c8c"}
                onChange={(e) => {
                  setRoomColors({ floorColor: e.target.value });
                  pushUpdate();
                }}
                className="w-8 h-8 rounded-xl cursor-pointer bg-transparent border border-white/20 p-0.5"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
          >
            Tamam (Bağla)
          </button>
        </div>
      </div>
    </div>
  );
}
