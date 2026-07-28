"use client";

import React from "react";
import { createPortal } from "react-dom";
import { useStore } from "@/store/useStore";
import { MousePointer2, MapPin, Tag, Plus, Camera, Play, Pause, Box, LayoutTemplate, Menu, SlidersHorizontal, Sparkles } from "lucide-react";
import { export360Panorama } from "@/lib/cubemapToEquirectangular";
import { useMultiplayer } from "@/hooks/useMultiplayer";
import { calculateAttachedRoomPosition, getAllRoomBounds } from "@/lib/roomSystem";

const compressImage = (file: File, maxWidth = 8192, maxHeight = 4096, quality = 0.95): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Canvas compression failed"));
              }
            },
            "image/jpeg",
            quality
          );
        } else {
          reject(new Error("Canvas context not available"));
        }
      };
    };
    reader.onerror = (error) => reject(error);
  });
};

export default function TourToolbar() {
  const { 
    appMode, 
    tourBuilderMode, 
    setTourBuilderMode, 
    currentTourNodeId, 
    setCurrentTourNodeId,
    furnitureLayers,
    currentFloor,
    updateFurniture,
    view3DIn360,
    setView3DIn360,
    isAutoTourPlaying,
    setIsAutoTourPlaying,
    isDollhouseMode,
    setIsDollhouseMode,
    isSidebarOpen,
    setIsSidebarOpen,
    isPropertiesPanelOpen,
    setIsPropertiesPanelOpen
  } = useStore();

  const [isRendering, setIsRendering] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<string | null>(null);
  const { pushUpdate } = useMultiplayer();

  if (appMode !== "360-photo") return null;

  // Dinamik kameraları tapırıq
  const dynamicTourNodes = furnitureLayers
    .filter(f => (f.type === "camera" || f.name.includes("360 Kamera")) && (f.floor ?? 0) === currentFloor)
    .map((c, idx) => ({
      id: c.id,
      name: c.name || `Kamera ${idx + 1}`,
      panoramaUrl: c.panoramaUrl || "",
      position: { x: c.position.x, y: c.position.y + 0.75, z: c.position.z }
    }));

  const currentNodeId = currentTourNodeId || (dynamicTourNodes[0]?.id || "default-camera");

  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = React.useState(false);
  const [newRoomName, setNewRoomName] = React.useState("Yataq Otağı");
  const [attachDirection, setAttachDirection] = React.useState<"right" | "left" | "front" | "back">("right");
  const [selectedParentRoomId, setSelectedParentRoomId] = React.useState<string>("main-room");

  const executeAddRoom = async (files?: FileList | null) => {
    const state = useStore.getState();
    const currentRooms = furnitureLayers.filter(f => f.type === "room" || f.id === "main-room");

    const { newRoomX, newRoomZ, smallWidth, smallLength, boundaryX, boundaryZ } = calculateAttachedRoomPosition(
      state.furnitureLayers,
      state.roomSize,
      6,
      state.roomSize.length,
      currentFloor,
      attachDirection,
      selectedParentRoomId
    );
    const smallHeight = state.roomSize.height || 3;

    if (files && files.length > 0) {
      setIsUploading(true);
      setIsAddRoomModalOpen(false);

      try {
        let lastId = currentNodeId;

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          setUploadProgress(`⚡ Şəkil ${i + 1}/${files.length} optimal ölçüdə sıxlaşdırılır və yüklənir...`);

          let compressedBlob: Blob = file;
          try {
            compressedBlob = await compressImage(file, 4096, 2048, 0.85);
          } catch (cErr) {
            console.warn("Sıxlaşdırma xətası, orijinal istifadə olunur:", cErr);
          }

          let uploadedUrl = "";
          try {
            const formData = new FormData();
            formData.append("file", new File([compressedBlob], file.name, { type: "image/jpeg" }));
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (res.ok && data.success && data.url) {
              uploadedUrl = data.url;
            } else {
              uploadedUrl = URL.createObjectURL(compressedBlob);
            }
          } catch (uploadErr) {
            console.warn("Server upload fallback, local Blob URL istifadə olunur:", uploadErr);
            uploadedUrl = URL.createObjectURL(compressedBlob);
          }

          if (uploadedUrl) {
            const roomLabel = files.length === 1 ? newRoomName : `${newRoomName} ${i + 1}`;
            const roomId = `room-${Date.now()}-${i}`;
            const id = `camera-${Date.now()}-${i}`;
            const prevCameraId = lastId;

            const doorId = `door-${Date.now()}-${i}`;
            const doorRotationY = (attachDirection === "left" || attachDirection === "right") ? Math.PI / 2 : 0;
            const doorX = attachDirection === "right" || attachDirection === "left" ? boundaryX : (newRoomX + (i * 7));
            const doorZ = attachDirection === "front" || attachDirection === "back" ? boundaryZ : newRoomZ;

            useStore.setState((st) => ({
              furnitureLayers: [
                ...st.furnitureLayers,
                {
                  id: roomId,
                  name: `${roomLabel} Otaq Kubu`,
                  modelUrl: "",
                  type: "room",
                  position: { x: newRoomX + (i * 7), y: 0, z: newRoomZ },
                  rotation: { x: 0, y: 0, z: 0 },
                  scale: { x: smallWidth, y: smallHeight, z: smallLength },
                  color: st.wallColor,
                  floorColor: st.floorColor,
                  wallTexture: st.wallTexture,
                  floorTexture: st.floorTexture,
                  floor: currentFloor
                },
                {
                  id: doorId,
                  name: `${roomLabel} Qapısı`,
                  modelUrl: "",
                  type: "door",
                  position: { x: doorX, y: 0, z: doorZ },
                  rotation: { x: 0, y: doorRotationY, z: 0 },
                  scale: { x: 1.1, y: 2.1, z: 0.2 },
                  color: "#8b5a2b",
                  floor: currentFloor,
                  nodeId: roomId
                },
                {
                  id,
                  name: roomLabel,
                  modelUrl: "",
                  type: "camera",
                  position: { 
                    x: newRoomX + (i * 7),
                    y: 0.75, 
                    z: newRoomZ 
                  },
                  rotation: { x: 0, y: 0, z: 0 },
                  scale: { x: 1, y: 1, z: 1 },
                  color: "#ffffff",
                  floor: currentFloor,
                  panoramaUrl: uploadedUrl,
                  nodeId: roomId
                }
              ]
            }));

            if (prevCameraId) {
              state.addHotspot({
                id: `hotspot-${Date.now()}-${i}-1`,
                sourceNodeId: prevCameraId,
                targetNodeId: id,
                position: { x: boundaryX, y: 0.1, z: boundaryZ }
              });
              state.addHotspot({
                id: `hotspot-${Date.now()}-${i}-2`,
                sourceNodeId: id,
                targetNodeId: prevCameraId,
                position: { x: boundaryX, y: 0.1, z: boundaryZ }
              });
            }

            lastId = id;
            setCurrentTourNodeId(id);
          }
        }
        setTimeout(() => pushUpdate(), 200);
      } catch (error: any) {
        console.error(error);
        alert(`Şəkillər yüklənərkən xəta baş verdi: ${error.message}`);
      } finally {
        setIsUploading(false);
        setUploadProgress(null);
      }
    } else {
      // 3D Otaq Kubu yalnız şəkil olmadan yaradılır
      const roomId = `room-${Date.now()}`;
      const camId = `camera-${Date.now()}`;
      const doorId = `door-${Date.now()}`;
      const roomLabel = newRoomName || "Yeni Otaq";

      const doorRotationY = (attachDirection === "left" || attachDirection === "right") ? Math.PI / 2 : 0;
      const doorX = attachDirection === "right" || attachDirection === "left" ? boundaryX : newRoomX;
      const doorZ = attachDirection === "front" || attachDirection === "back" ? boundaryZ : newRoomZ;

      useStore.setState((st) => ({
        furnitureLayers: [
          ...st.furnitureLayers,
          {
            id: roomId,
            name: `${roomLabel} Otaq Kubu`,
            modelUrl: "",
            type: "room",
            position: { x: newRoomX, y: 0, z: newRoomZ },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: smallWidth, y: smallHeight, z: smallLength },
            color: st.wallColor,
            floorColor: st.floorColor,
            wallTexture: st.wallTexture,
            floorTexture: st.floorTexture,
            floor: currentFloor
          },
          {
            id: doorId,
            name: `${roomLabel} Qapısı`,
            modelUrl: "",
            type: "door",
            position: { x: doorX, y: 0, z: doorZ },
            rotation: { x: 0, y: doorRotationY, z: 0 },
            scale: { x: 1.1, y: 2.1, z: 0.2 },
            color: "#8b5a2b",
            floor: currentFloor,
            nodeId: roomId
          },
          {
            id: camId,
            name: roomLabel,
            modelUrl: "",
            type: "camera",
            position: { x: newRoomX, y: 0.75, z: newRoomZ },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            color: "#ffffff",
            floor: currentFloor,
            panoramaUrl: "",
            nodeId: roomId
          }
        ]
      }));

      setIsAddRoomModalOpen(false);
      setCurrentTourNodeId(camId);
      setTimeout(() => pushUpdate(), 200);
    }
  };

  const handlePickFilesForRoom = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/jpeg, image/png, image/webp, image/heic";
    input.onchange = (e: any) => {
      executeAddRoom(e.target.files);
    };
    input.click();
  };

  const handleRender360 = async () => {
    const renderer = (window as any).__THREE_RENDERER__;
    const scene = (window as any).__THREE_SCENE__;

    if (!renderer || !scene) {
      alert("3D Səhnə hələ hazır deyil. Bir neçə saniyə gözləyin.");
      return;
    }

    setIsRendering(true);
    try {
      // Aktiv kameranın mövqeyini tapırıq
      const activeCam = furnitureLayers.find(f => f.id === currentNodeId && (f.type === "camera" || f.name.includes("360 Kamera")));
      const posX = activeCam ? activeCam.position.x : 0;
      const posY = activeCam ? (activeCam.position.y + 0.75) : 1.5;
      const posZ = activeCam ? activeCam.position.z : 0;

      // GPU üzərində 360 Equirectangular (4K keyfiyyətdə) şəkli render edirik
      const dataUrl = await export360Panorama(renderer, scene, { x: posX, y: posY, z: posZ }, 4096);

      // Store-da müvafiq kameranın panoramaUrl dəyərini yeniləyirik
      if (activeCam) {
        updateFurniture(activeCam.id, { panoramaUrl: dataUrl });
      }

      // Şəkli dərhal kompüterə yükləyirik
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${activeCam ? activeCam.name.replace(/\s+/g, "_") : "360_otaq"}_render.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
      alert("360 panorama render edilərkən xəta baş verdi.");
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col gap-2.5 items-center max-w-[95vw]">
      
      {/* Dynamic Notifications */}
      {isUploading && (
        <div className="bg-neutral-900/90 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-white/10 backdrop-blur-md animate-fade-in">
          <div className="w-4 h-4 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
          <span>{uploadProgress || "Yüklənir..."}</span>
        </div>
      )}

      {tourBuilderMode === "add-hotspot" && (
        <div className="bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap shadow-xl animate-bounce border border-emerald-400/30">
          📍 Yerə klikləyərək Keçid (Hotspot) yerləşdirin!
        </div>
      )}
      
      {tourBuilderMode === "add-tag" && (
        <div className="bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap shadow-xl animate-bounce border border-indigo-400/30">
          🏷️ İstədiyiniz əşyaya klikləyərək Məlumat (Tag) yerləşdirin!
        </div>
      )}

      {dynamicTourNodes.length > 0 && !dynamicTourNodes.find(n => n.id === currentNodeId)?.panoramaUrl && (
        <div className="bg-amber-500/90 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg backdrop-blur-md border border-amber-400/20 max-w-md text-center animate-pulse">
          ⚠️ Bu kamera üçün hələ 360° şəkil yoxdur. Aşağıdakı <strong>"360° Render"</strong> düyməsinə və ya sol paneldən <strong>"360° Foto Yüklə"</strong> düyməsinə klikləyin.
        </div>
      )}

      {/* Main Unified Control Dock */}
      <div className="bg-black/75 backdrop-blur-2xl border border-white/15 rounded-full p-1.5 sm:p-2 flex items-center gap-1 sm:gap-2 shadow-[0_12px_40px_rgba(0,0,0,0.6)] overflow-x-auto max-w-full scrollbar-none">
        
        {/* Avto Tur Play & Dollhouse Controls */}
        <div className="flex items-center gap-1 shrink-0 pl-1">
          <button
            onClick={() => setIsAutoTourPlaying(!isAutoTourPlaying)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isAutoTourPlaying ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : "bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white"}`}
            title={isAutoTourPlaying ? "Avto Turu Dayandır" : "Avto Tur Başlat (Play)"}
          >
            {isAutoTourPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <button
            onClick={() => setIsDollhouseMode(!isDollhouseMode)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isDollhouseMode ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" : "bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white"}`}
            title="Dollhouse (Kukla Evi 3D)"
          >
            <Box className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-5 bg-white/15 shrink-0"></div>

        {/* Görünüş Modu Toggle */}
        <div className="flex bg-black/40 rounded-full p-1 border border-white/5 shrink-0">
          <button
            onClick={() => setView3DIn360(true)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${view3DIn360 ? "bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shadow-sm" : "text-neutral-400 hover:text-white"}`}
            title="Otaq dizaynını real-time 3D olaraq 360° gəz"
          >
            <div className={`w-1.5 h-1.5 rounded-full ${view3DIn360 ? "bg-emerald-400 animate-pulse" : "bg-neutral-600"}`}></div>
            Real 3D
          </button>
          <button
            onClick={() => setView3DIn360(false)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${!view3DIn360 ? "bg-indigo-500/25 text-indigo-300 border border-indigo-500/40 shadow-sm" : "text-neutral-400 hover:text-white"}`}
            title="Render olunmuş 360° şəkli (foto) gör"
          >
            <div className={`w-1.5 h-1.5 rounded-full ${!view3DIn360 ? "bg-indigo-400 animate-pulse" : "bg-neutral-600"}`}></div>
            Foto
          </button>
        </div>

        <div className="w-px h-5 bg-white/15 shrink-0"></div>

        {/* İnteraktiv Alətlər */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setTourBuilderMode("idle")}
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold transition-all ${tourBuilderMode === "idle" ? "bg-white text-neutral-900 shadow-md" : "text-neutral-400 hover:text-white hover:bg-white/10"}`}
            title="Gəzinti / İzləmə rejimi"
          >
            <MousePointer2 className="w-3.5 h-3.5" />
            İzləmə
          </button>
          
          <button
            onClick={() => setTourBuilderMode("add-hotspot")}
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold transition-all ${tourBuilderMode === "add-hotspot" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : "text-neutral-400 hover:text-white hover:bg-white/10"}`}
            title="Döşəməyə klikləyərək digər otağa keçid qapısı qoyun"
          >
            <MapPin className="w-3.5 h-3.5" />
            Keçid
          </button>
          
          <button
            onClick={() => setTourBuilderMode("add-tag")}
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold transition-all ${tourBuilderMode === "add-tag" ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30" : "text-neutral-400 hover:text-white hover:bg-white/10"}`}
            title="Əşyanın üzərinə klikləyərək məlumat etiketi qoyun"
          >
            <Tag className="w-3.5 h-3.5" />
            Tag
          </button>
        </div>

        <div className="w-px h-5 bg-white/15 shrink-0"></div>

        {/* Əməliyyatlar: Otaq Yüklə & Render */}
        <div className="flex items-center gap-1.5 shrink-0 pr-1">
          <button
            onClick={() => setIsAddRoomModalOpen(true)}
            className="px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-extrabold bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 text-white hover:from-indigo-500/35 hover:via-purple-500/35 hover:to-pink-500/35 transition-all border border-indigo-400/40 shadow-[0_0_15px_rgba(99,102,241,0.25)] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] cursor-pointer hover:scale-105 active:scale-95"
            title="Yeni Otaq (360 və ya 3D) əlavə et"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-300" />
            Otaq Yüklə
          </button>

          <button
            onClick={handleRender360}
            disabled={isRendering}
            className="px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-purple-500/30 transition-all cursor-pointer disabled:opacity-50"
            title="Bu kamera nöqtəsindən otaq dizaynının 360° renderingini çıxar və yüklə"
          >
            {isRendering ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Camera className="w-3.5 h-3.5" />
            )}
            {isRendering ? "RENDER..." : "360° Render"}
          </button>
        </div>

        {/* Optional Dock Toggle for Sidebars */}
        <div className="w-px h-5 bg-white/15 shrink-0"></div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isSidebarOpen ? "bg-white/20 text-white" : "text-neutral-400 hover:text-white hover:bg-white/10"}`}
            title={isSidebarOpen ? "Kataloq menyusunu gizlət" : "Kataloq menyusunu aç"}
          >
            <Menu className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPropertiesPanelOpen(!isPropertiesPanelOpen)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isPropertiesPanelOpen ? "bg-white/20 text-white" : "text-neutral-400 hover:text-white hover:bg-white/10"}`}
            title={isPropertiesPanelOpen ? "Xüsusiyyətlər panelini gizlət" : "Xüsusiyyətlər panelini aç"}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Interactive Add Room & Direction Modal (Rendered via Portal to avoid CSS transform traps) */}
      {isAddRoomModalOpen && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300 select-none">
          <div className="bg-[#0b0e18]/95 border border-indigo-500/30 rounded-[28px] sm:rounded-[32px] p-5 sm:p-7 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-[0_0_80px_rgba(79,70,229,0.25)] space-y-4 sm:space-y-6 relative text-white backdrop-blur-3xl animate-in zoom-in-95 duration-300">
            
            {/* Ambient Background Glow Orbs */}
            <div className="absolute -top-24 -right-24 w-56 h-56 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
            
            {/* Glowing Accent Top Line */}
            <div className="absolute top-0 left-12 right-12 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_12px_#6366f1]" />

            {/* Close Button */}
            <button
              onClick={() => setIsAddRoomModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white w-9 h-9 rounded-full bg-white/[0.05] hover:bg-white/[0.15] border border-white/10 flex items-center justify-center transition-all duration-200 hover:rotate-90 hover:scale-105 cursor-pointer shadow-lg z-20"
              title="Bağla"
            >
              ✕
            </button>

            {/* Rich Header */}
            <div className="flex items-center gap-4 border-b border-white/10 pb-5 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-pink-500/10 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-[0_0_25px_rgba(99,102,241,0.3)] shrink-0">
                <Box className="w-6 h-6 text-indigo-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-xl bg-gradient-to-r from-white via-indigo-100 to-indigo-200 bg-clip-text text-transparent tracking-tight">
                    Yeni Otaq Əlavə Et
                  </h3>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm">
                    AI & 360°
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Məkan adını, ana otaqla birləşmə istiqamətini və 360° panoramanı təyin edin
                </p>
              </div>
            </div>

            {/* Step 1: Otaq Adı Input & Quick Preset Badges */}
            <div className="space-y-2.5 relative z-10">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> 1. Otaq Adı və ya Növü:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="məs: Yataq Otağı, Qonaq Otağı..."
                  className="w-full bg-black/50 border border-white/15 focus:border-indigo-500 rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-semibold shadow-inner"
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { name: "Mətbəx", icon: "🍳" },
                  { name: "Yataq Otağı", icon: "🛏️" },
                  { name: "Qonaq Otağı", icon: "🛋️" },
                  { name: "Dəhliz", icon: "🚪" },
                  { name: "Balkon", icon: "🌿" },
                  { name: "Uşaq Otağı", icon: "🧸" },
                  { name: "Ofis", icon: "💼" },
                  { name: "Hamam", icon: "🚿" },
                ].map((tag) => (
                  <button
                    key={tag.name}
                    onClick={() => setNewRoomName(tag.name)}
                    className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                      newRoomName === tag.name
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.4)] scale-105"
                        : "bg-white/[0.04] hover:bg-white/[0.1] text-neutral-300 hover:text-white border-white/10 hover:border-white/20"
                    }`}
                  >
                    <span>{tag.icon}</span>
                    <span>{tag.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Bitişmə İstiqaməti (Direction Selector) */}
            <div className="space-y-2.5 relative z-10">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 2. Bitişmə İstiqaməti (Ana otağa nəzərən):
                </span>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  3D Koordinat Xəritəsi
                </span>
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { key: "right", label: "➡️ Sağ Tərəf", desc: "Şərq (X+) istiqamətində" },
                  { key: "left", label: "⬅️ Sol Tərəf", desc: "Qərb (X-) istiqamətində" },
                  { key: "front", label: "⬆️ İrəli (Ön)", desc: "Şimal (Z-) istiqamətində" },
                  { key: "back", label: "⬇️ Geri (Arxa)", desc: "Cənub (Z+) istiqamətində" },
                ].map((d) => (
                  <button
                    key={d.key}
                    onClick={() => setAttachDirection(d.key as any)}
                    className={`p-3 rounded-2xl border transition-all duration-200 flex flex-col items-start gap-1 cursor-pointer group relative overflow-hidden active:scale-98 ${
                      attachDirection === d.key
                        ? "bg-gradient-to-br from-emerald-600/30 via-teal-600/20 to-emerald-950/40 text-white border-emerald-500/80 shadow-[0_0_25px_rgba(16,185,129,0.25)]"
                        : "bg-black/40 hover:bg-white/[0.06] text-neutral-300 hover:text-white border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full font-extrabold text-sm">
                      <span>{d.label}</span>
                      {attachDirection === d.key && (
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center text-xs font-black shadow-md">✓</span>
                      )}
                    </div>
                    <span className={`text-[10px] ${attachDirection === d.key ? "text-emerald-300" : "text-neutral-500 group-hover:text-neutral-400"}`}>
                      {d.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Ana Otaq Dropdown */}
            <div className="space-y-2.5 relative z-10">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> 3. Birləşəcəyi Ana Otaq:
              </label>
              <div className="relative">
                <select
                  value={selectedParentRoomId}
                  onChange={(e) => setSelectedParentRoomId(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 focus:border-purple-500 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 font-bold appearance-none cursor-pointer shadow-inner pr-10 transition-all"
                >
                  {getAllRoomBounds(furnitureLayers, useStore.getState().roomSize, currentFloor).map((r) => (
                    <option key={r.id} value={r.id} className="bg-neutral-900 text-white py-2 font-medium">
                      🏠 {r.name} ({r.centerX.toFixed(1)}, {r.centerZ.toFixed(1)})
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 font-mono">
                  ▼
                </div>
              </div>
            </div>

            {/* Step 4: Action Buttons (WOW Factor) */}
            <div className="pt-3 flex flex-col gap-3 relative z-10">
              <button
                onClick={handlePickFilesForRoom}
                className="w-full py-4 px-6 rounded-2xl font-extrabold text-sm bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white shadow-[0_10px_30px_rgba(99,102,241,0.35)] hover:shadow-[0_15px_40px_rgba(99,102,241,0.55)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer group uppercase tracking-wider border border-white/20"
              >
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera className="w-4 h-4 text-white animate-pulse" />
                </div>
                <span>📸 360° Şəkil Yüklə və Otağı Yarat</span>
              </button>
              
              <button
                onClick={() => executeAddRoom(null)}
                className="w-full py-3 px-5 rounded-2xl font-bold text-xs bg-white/[0.04] hover:bg-white/[0.1] text-neutral-300 hover:text-white transition-all duration-200 border border-white/10 hover:border-white/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>📦 Yalnız 3D Otaq Kubu Yarat (Şəkilsiz sürətli rejim)</span>
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
