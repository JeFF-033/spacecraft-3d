"use client";

import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import { Trash2, Copy, Move, RotateCw, Maximize, SlidersHorizontal, Camera, Upload, X } from "lucide-react";
import { useMultiplayer } from "@/hooks/useMultiplayer";
export default function PropertiesPanel() {
  const { selectedId, furnitureLayers, updateFurniture, duplicateFurniture, deleteFurniture, transformMode, setTransformMode, isPropertiesPanelOpen, setIsPropertiesPanelOpen } = useStore();
  const selectedItem = furnitureLayers.find((f) => f.id === selectedId);
  const { pushUpdate } = useMultiplayer();

  const handleCameraImageUpload = (itemId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/') && !/\.(jpg|jpeg|png|webp|heic|bmp)$/i.test(file.name)) {
        alert("Xahiş edirik yalnız JPG və ya PNG formatında şəkil yükləyin.");
        return;
      }

      try {
        let fileUrl = "";
        try {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/upload", { method: "POST", body: formData });
          const data = await res.json();
          if (res.ok && data.success && data.url) {
            fileUrl = data.url;
          } else {
            fileUrl = URL.createObjectURL(file);
          }
        } catch (uploadErr) {
          fileUrl = URL.createObjectURL(file);
        }

        updateFurniture(itemId, { panoramaUrl: fileUrl });
        setTimeout(() => pushUpdate(), 100);
      } catch (error) {
        console.error(error);
      }
    };
    input.click();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isPropertiesPanelOpen && (
        <div 
          onClick={() => setIsPropertiesPanelOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}
      <div className={`fixed lg:relative top-0 right-0 h-full z-50 lg:z-20 transition-all duration-300 ease-in-out flex-shrink-0 ${isPropertiesPanelOpen ? 'w-[300px] sm:w-[320px]' : 'w-0'}`}>
        <div className={`absolute top-0 right-0 w-[300px] sm:w-[320px] h-full bg-[#0a0a0a]/95 backdrop-blur-3xl border-l border-white/5 p-4 sm:p-6 text-neutral-100 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.5)] transition-transform duration-300 ${isPropertiesPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5 lg:hidden">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Xüsusiyyətlər Paneli</span>
            <button onClick={() => setIsPropertiesPanelOpen(false)} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-neutral-300 hover:text-white transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>
          {!selectedItem ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-white/5 to-white/0 rounded-3xl flex items-center justify-center mb-6 border border-white/10 shadow-inner">
                <span className="text-4xl drop-shadow-lg">🪄</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-2 tracking-tight">Heç Nə Seçilməyib</h3>
              <p className="text-neutral-500 text-xs leading-relaxed">Xüsusiyyətləri görmək və alətlərdən istifadə etmək üçün səhnədən bir obyekt seçin</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8 border-b border-white/5 pb-4 sm:pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-transparent rounded-xl flex items-center justify-center border border-white/10">
                    <SlidersHorizontal className="w-5 h-5 text-neutral-300" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black tracking-tight text-white">Xüsusiyyətlər</h2>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-0.5">Model Redaktoru</p>
                  </div>
                </div>
                <button onClick={() => setIsPropertiesPanelOpen(false)} className="hidden lg:flex p-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-neutral-300 hover:text-white transition-all border border-white/10">
                  <X className="w-4 h-4" />
                </button>
              </div>
            
            <div className="space-y-8 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
              
              {/* Transform Modları */}
              <div>
                <h3 className="text-[10px] text-neutral-500 mb-3 font-bold uppercase tracking-widest">Transformasiya Modu</h3>
                <div className="flex bg-black/30 rounded-xl border border-white/5 p-1">
                  <button 
                    onClick={() => setTransformMode("translate")}
                    className={`flex-1 py-2 flex justify-center items-center rounded-lg transition-all ${transformMode === 'translate' ? 'bg-white/10 text-white shadow-sm' : 'text-neutral-500 hover:text-white'}`}
                    title="Sürüşdür"
                  ><Move className="w-4 h-4" /></button>
                  <button 
                    onClick={() => setTransformMode("rotate")}
                    className={`flex-1 py-2 flex justify-center items-center rounded-lg transition-all ${transformMode === 'rotate' ? 'bg-white/10 text-white shadow-sm' : 'text-neutral-500 hover:text-white'}`}
                    title="Fırlat"
                  ><RotateCw className="w-4 h-4" /></button>
                  <button 
                    onClick={() => setTransformMode("scale")}
                    className={`flex-1 py-2 flex justify-center items-center rounded-lg transition-all ${transformMode === 'scale' ? 'bg-white/10 text-white shadow-sm' : 'text-neutral-500 hover:text-white'}`}
                    title="Ölçü"
                  ><Maximize className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Koordinatlar */}
              <div>
                <h3 className="text-[10px] text-neutral-500 mb-3 font-bold uppercase tracking-widest">Məkan Məlumatı</h3>
                <div className="grid grid-cols-3 gap-3">
                  {['x', 'y', 'z'].map((axis) => (
                    <div key={axis} className="bg-white/[0.02] rounded-xl p-3 border border-white/5 flex flex-col items-center justify-center hover:bg-white/[0.04] transition-colors">
                      <span className="text-[10px] font-black text-neutral-500 uppercase mb-1">{axis}</span>
                      <span className="text-sm font-mono font-medium text-white">
                        {selectedItem.position[axis as keyof typeof selectedItem.position]?.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Görünüş */}
              <div>
                <h3 className="text-[10px] text-neutral-500 mb-3 font-bold uppercase tracking-widest">Vizual Ayarlar</h3>
                <div className="flex items-center gap-4 bg-white/[0.02] rounded-xl p-4 border border-white/5 hover:bg-white/[0.04] transition-colors">
                  <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden shadow-inner flex-shrink-0">
                    <input 
                      type="color" 
                      value={selectedItem.color}
                      onChange={(e) => updateFurniture(selectedItem.id, { color: e.target.value })}
                      onBlur={() => pushUpdate()}
                      className="w-16 h-16 -ml-3 -mt-3 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white mb-0.5">Rəng Tinti</div>
                    <div className="font-mono text-[10px] text-neutral-400 uppercase">{selectedItem.color}</div>
                  </div>
                </div>
              </div>

              {/* 360 Kamera Ayarları */}
              {(selectedItem.type === "camera" || selectedItem.name.includes("360 Kamera") || selectedItem.panoramaUrl !== undefined) && (
                <div className="bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/10 space-y-4">
                  <h3 className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <Camera className="w-4 h-4 animate-pulse" /> 📸 Kamera Tənzimləmələri
                  </h3>
                  
                  {/* Kamera Adı */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 block font-semibold">Kamera / Otaq Adı</span>
                    <input 
                      type="text" 
                      value={selectedItem.name}
                      onChange={(e) => updateFurniture(selectedItem.id, { name: e.target.value })}
                      onBlur={() => pushUpdate()}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
                      placeholder="Məsələn: Qonaq Otağı"
                    />
                  </div>

                  {/* Şəkil Kalibrasiyası (Fırlat) */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-neutral-400 font-semibold">Fırlat (Kalibrasiya)</span>
                      <span className="text-[10px] font-mono text-indigo-400 font-bold font-semibold">
                        {Math.round(((selectedItem.rotationOffset || 0) * 180) / Math.PI)}°
                      </span>
                    </div>
                    <input 
                      type="range"
                      min="-180"
                      max="180"
                      step="1"
                      value={Math.round(((selectedItem.rotationOffset || 0) * 180) / Math.PI)}
                      onChange={(e) => {
                        const deg = parseInt(e.target.value);
                        const rad = (deg * Math.PI) / 180;
                        updateFurniture(selectedItem.id, { rotationOffset: rad });
                      }}
                      onMouseUp={() => pushUpdate()}
                      onTouchEnd={() => pushUpdate()}
                      className="w-full accent-indigo-500 bg-white/10 h-1 rounded-lg appearance-none cursor-pointer animate-pulse"
                    />
                  </div>

                  {/* 360° Foto Yükləmə */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-neutral-400 block font-semibold">360° Panorama Şəkli</span>
                    
                    {selectedItem.panoramaUrl ? (
                      <div className="space-y-2">
                        <div className="relative group rounded-lg overflow-hidden border border-white/10 aspect-[2/1] bg-black/30">
                          <img 
                            src={selectedItem.panoramaUrl} 
                            alt={selectedItem.name} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              onClick={() => handleCameraImageUpload(selectedItem.id)}
                              className="bg-indigo-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-400 transition-all uppercase tracking-wider"
                            >
                              Şəkli Dəyiş
                            </button>
                          </div>
                        </div>
                        <div className="text-[9px] text-neutral-500 text-center">360° şəkil yüklənib. Dəyişmək üçün üzərinə klikləyin.</div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCameraImageUpload(selectedItem.id)}
                        className="w-full py-4 border border-dashed border-white/20 rounded-lg text-neutral-400 hover:text-white hover:border-indigo-500 hover:bg-indigo-500/5 transition-all text-xs font-bold flex flex-col items-center justify-center gap-1.5"
                      >
                        <Upload className="w-4 h-4 text-indigo-400" />
                        <span>📷 360° Şəkil Yüklə</span>
                        <span className="text-[9px] text-neutral-500 font-normal">Yalnız 2:1 Panorama JPG/PNG</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Qapı Ölçü Və Modern Model Ayarları */}
              {(selectedItem.type === "door" || selectedItem.name.includes("Qapı")) && (
                <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10 space-y-4">
                  <h3 className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    🚪 Modern Qapı Parametrləri
                  </h3>

                  {/* En (Width - X) */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-neutral-400">
                      <span>En (X)</span>
                      <span className="font-mono text-emerald-400">{(selectedItem.scale?.x || 1.1).toFixed(2)}m</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.7" 
                      max="3.0" 
                      step="0.05" 
                      value={selectedItem.scale?.x || 1.1} 
                      onChange={(e) => updateFurniture(selectedItem.id, { scale: { ...selectedItem.scale, x: parseFloat(e.target.value) } })}
                      onMouseUp={() => pushUpdate()}
                      onTouchEnd={() => pushUpdate()}
                      className="w-full accent-emerald-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Hündürlük (Height - Y) */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-neutral-400">
                      <span>Hündürlük (Y)</span>
                      <span className="font-mono text-emerald-400">{(selectedItem.scale?.y || 2.1).toFixed(2)}m</span>
                    </div>
                    <input 
                      type="range" 
                      min="1.8" 
                      max="3.5" 
                      step="0.05" 
                      value={selectedItem.scale?.y || 2.1} 
                      onChange={(e) => updateFurniture(selectedItem.id, { scale: { ...selectedItem.scale, y: parseFloat(e.target.value) } })}
                      onMouseUp={() => pushUpdate()}
                      onTouchEnd={() => pushUpdate()}
                      className="w-full accent-emerald-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Qalınlıq (Thickness - Z) */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-neutral-400">
                      <span>Qalınlıq (Z)</span>
                      <span className="font-mono text-emerald-400">{(selectedItem.scale?.z || 0.2).toFixed(2)}m</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.1" 
                      max="0.5" 
                      step="0.02" 
                      value={selectedItem.scale?.z || 0.2} 
                      onChange={(e) => updateFurniture(selectedItem.id, { scale: { ...selectedItem.scale, z: parseFloat(e.target.value) } })}
                      onMouseUp={() => pushUpdate()}
                      onTouchEnd={() => pushUpdate()}
                      className="w-full accent-emerald-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Modern Qapı Modelləri Kataloqu */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <span className="text-[10px] text-neutral-400 block font-semibold">Modern Qapı Stili</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: "modern-white", label: "⚪ Modern Ağ", color: "#f8f9fa" },
                        { id: "modern-double-glass", label: "🔲 İki Taylı Şüşə", color: "#1a1a1a" },
                        { id: "wood-frosted-glass", label: "🪵 Taxta & Şüşə", color: "#8b5a2b" },
                        { id: "anthracite-flush", label: "⬛ Antrasit Gizli", color: "#282a36" },
                        { id: "french-grid", label: "🪟 Fransız Torlu", color: "#111111" },
                        { id: "classic-wood", label: "🪵 Klassik Taxta", color: "#8b5a2b" },
                      ].map((style) => (
                        <button
                          key={style.id}
                          onClick={() => {
                            updateFurniture(selectedItem.id, { doorStyle: style.id, color: style.color });
                            pushUpdate();
                          }}
                          className={`py-2 px-2 rounded-lg border text-[10px] font-bold transition-all text-left flex items-center justify-between ${
                            (selectedItem.doorStyle || "classic-wood") === style.id
                              ? "bg-emerald-600/30 text-white border-emerald-500 shadow-md"
                              : "bg-black/30 text-neutral-400 border-white/10 hover:text-white hover:border-white/20"
                          }`}
                        >
                          <span>{style.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Ağıllı İşıqlandırma Ayarları */}
              {selectedItem.lightIntensity !== undefined && (
                <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/10 space-y-4">
                  <h3 className="text-[10px] text-amber-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    💡 İşıq Ayarları
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-neutral-400">İşıq Rəngi</span>
                    <input 
                      type="color" 
                      value={selectedItem.lightColor || "#ffffff"}
                      onChange={(e) => updateFurniture(selectedItem.id, { lightColor: e.target.value })}
                      onBlur={() => pushUpdate()}
                      className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-neutral-400">
                      <span>Parlaqlıq</span>
                      <span className="font-mono text-amber-400">{selectedItem.lightIntensity}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.1" 
                      max="10" 
                      step="0.1" 
                      value={selectedItem.lightIntensity}
                      onChange={(e) => updateFurniture(selectedItem.id, { lightIntensity: parseFloat(e.target.value) })}
                      onMouseUp={() => pushUpdate()}
                      className="w-full accent-amber-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-neutral-400">
                      <span>Məsafə (Aralıq)</span>
                      <span className="font-mono text-amber-400">{selectedItem.lightDistance || 10}m</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="30" 
                      step="1" 
                      value={selectedItem.lightDistance || 10}
                      onChange={(e) => updateFurniture(selectedItem.id, { lightDistance: parseInt(e.target.value) })}
                      onMouseUp={() => pushUpdate()}
                      className="w-full accent-amber-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {selectedItem.name.includes("Spot") && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-neutral-400">
                        <span>İşıq Bucağı</span>
                        <span className="font-mono text-amber-400">{Math.round(((selectedItem.lightAngle || Math.PI / 4) * 180) / Math.PI)}°</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.1" 
                        max="1.5" 
                        step="0.05" 
                        value={selectedItem.lightAngle || Math.PI / 4}
                        onChange={(e) => updateFurniture(selectedItem.id, { lightAngle: parseFloat(e.target.value) })}
                        onMouseUp={() => pushUpdate()}
                        className="w-full accent-amber-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              )}
              {/* Otaq Qutusu Ayarları */}
              {selectedItem.type === "room" && (
                <div className="bg-purple-500/5 p-4 rounded-xl border border-purple-500/10 space-y-4">
                  <h3 className="text-[10px] text-purple-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    📦 Otaq Qutusu Ayarları
                  </h3>
                  
                  {/* Otaq Adı */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 block font-semibold">Otaq Adı</span>
                    <input 
                      type="text" 
                      value={selectedItem.name}
                      onChange={(e) => updateFurniture(selectedItem.id, { name: e.target.value })}
                      onBlur={() => pushUpdate()}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
                      placeholder="Məsələn: Yataq Otağı"
                    />
                  </div>

                  {/* En (Width - X) */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-neutral-400">
                      <span>En (X)</span>
                      <span className="font-mono text-purple-400">{selectedItem.scale.x}m</span>
                    </div>
                    <input 
                      type="range" 
                      min="4" 
                      max="25" 
                      step="0.5" 
                      value={selectedItem.scale.x} 
                      onChange={(e) => updateFurniture(selectedItem.id, { scale: { ...selectedItem.scale, x: parseFloat(e.target.value) } })}
                      onMouseUp={() => pushUpdate()}
                      className="w-full accent-purple-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Uzunluq (Length - Z) */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-neutral-400">
                      <span>Uzunluq (Z)</span>
                      <span className="font-mono text-purple-400">{selectedItem.scale.z}m</span>
                    </div>
                    <input 
                      type="range" 
                      min="4" 
                      max="25" 
                      step="0.5" 
                      value={selectedItem.scale.z} 
                      onChange={(e) => updateFurniture(selectedItem.id, { scale: { ...selectedItem.scale, z: parseFloat(e.target.value) } })}
                      onMouseUp={() => pushUpdate()}
                      className="w-full accent-purple-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Hündürlük (Height - Y) */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-neutral-400">
                      <span>Hündürlük (Y)</span>
                      <span className="font-mono text-purple-400">{selectedItem.scale.y}m</span>
                    </div>
                    <input 
                      type="range" 
                      min="2" 
                      max="6" 
                      step="0.1" 
                      value={selectedItem.scale.y} 
                      onChange={(e) => updateFurniture(selectedItem.id, { scale: { ...selectedItem.scale, y: parseFloat(e.target.value) } })}
                      onMouseUp={() => pushUpdate()}
                      className="w-full accent-purple-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Divar Rəngi & Döşəmə Rəngi */}
                  <div className="grid grid-cols-2 gap-2 bg-black/20 p-2 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-neutral-400 font-medium">Divar Rəngi</span>
                      <input 
                        type="color" 
                        value={selectedItem.color || "#ffffff"} 
                        onChange={(e) => updateFurniture(selectedItem.id, { color: e.target.value })} 
                        onBlur={() => pushUpdate()}
                        className="w-5 h-5 rounded cursor-pointer bg-transparent border-0 p-0" 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-neutral-400 font-medium">Döşəmə Rəngi</span>
                      <input 
                        type="color" 
                        value={selectedItem.floorColor || "#8b5a2b"} 
                        onChange={(e) => updateFurniture(selectedItem.id, { floorColor: e.target.value })} 
                        onBlur={() => pushUpdate()}
                        className="w-5 h-5 rounded cursor-pointer bg-transparent border-0 p-0" 
                      />
                    </div>
                  </div>

                  {/* Döşəmə Teksturası */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 block font-semibold">Döşəmə Teksturası</span>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { label: "🪵 Parket", url: "/textures/wood.png" },
                        { label: "🔲 Kafel", url: "/textures/tile.jpg" },
                        { label: "🪨 Mərmər", url: "/textures/marble.jpg" },
                      ].map((t) => (
                        <button
                          key={t.label}
                          onClick={() => { updateFurniture(selectedItem.id, { floorTexture: t.url }); pushUpdate(); }}
                          className={`py-1.5 px-2 rounded-lg border text-[10px] font-bold transition-all ${
                            selectedItem.floorTexture === t.url
                              ? "bg-purple-600 text-white border-purple-500"
                              : "bg-black/30 text-neutral-400 border-white/10 hover:text-white"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Divar Teksturası */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 block font-semibold">Divar Teksturası</span>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { label: "🧱 Kərpic", url: "/textures/brick.png" },
                        { label: "🏛️ Beton", url: "/textures/concrete.png" },
                        { label: "🎨 Hamar", url: "/textures/plaster.jpg" },
                      ].map((t) => (
                        <button
                          key={t.label}
                          onClick={() => { updateFurniture(selectedItem.id, { wallTexture: t.url }); pushUpdate(); }}
                          className={`py-1.5 px-2 rounded-lg border text-[10px] font-bold transition-all ${
                            selectedItem.wallTexture === t.url
                              ? "bg-purple-600 text-white border-purple-500"
                              : "bg-black/30 text-neutral-400 border-white/10 hover:text-white"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bu otağa Keçid Qapısı Əlavə Et */}
                  <button
                    onClick={() => {
                      const id = Date.now().toString();
                      useStore.setState((st) => ({
                        furnitureLayers: [
                          ...st.furnitureLayers,
                          {
                            id,
                            name: "Keçid Qapısı",
                            modelUrl: "",
                            type: "door",
                            position: { x: selectedItem.position.x, y: 1.0, z: selectedItem.position.z },
                            rotation: { x: 0, y: 0, z: 0 },
                            scale: { x: 1.1, y: 2.1, z: 0.2 },
                            color: "#8b5a2b",
                            floor: selectedItem.floor ?? 0
                          }
                        ],
                        selectedId: id
                      }));
                      pushUpdate();
                    }}
                    className="w-full py-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 hover:text-white rounded-lg text-xs font-bold transition-all border border-indigo-500/30 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    🚪 Bu Otağa Qapı Əlavə Et
                  </button>
                </div>
              )}
            </div>

            {/* Aksiyalar */}
            <div className="pt-6 flex gap-3 mt-4">
              <button 
                onClick={() => { duplicateFurniture(selectedItem.id); pushUpdate(); }}
                className="flex-1 py-3 bg-white/[0.03] text-neutral-300 hover:text-white hover:bg-white/[0.08] rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-white/5"
              >
                <Copy className="w-4 h-4" />
                Klonla
              </button>
              <button 
                onClick={() => { deleteFurniture(selectedItem.id); pushUpdate(); }}
                className="flex-1 py-3 bg-white/[0.03] text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-white/5"
              >
                <Trash2 className="w-4 h-4" />
                Sil
              </button>
            </div>
          </>
        )}
      </div>

      {/* Toggle Button */}
      <button 
        onClick={() => setIsPropertiesPanelOpen(!isPropertiesPanelOpen)}
        className="absolute top-1/2 -translate-y-1/2 w-6 h-14 bg-[#1a1a24] border border-white/10 border-r-0 rounded-l-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 z-50 shadow-xl transition-all cursor-pointer"
        style={{ left: '-24px' }}
        title={isPropertiesPanelOpen ? "Paneli Gizlət" : "Paneli Göstər"}
      >
        <div className={`transition-transform duration-300 ${isPropertiesPanelOpen ? '' : 'rotate-180'}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </div>
      </button>
    </div>
    </>
  );
}
