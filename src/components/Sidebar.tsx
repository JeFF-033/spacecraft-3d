"use client";

import React, { useRef, useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import * as THREE from "three";
import { Download, Upload, Undo, Redo, Map, Sun, Moon, Layers, Camera, Cloud, FolderOpen, Wand2, Sparkles, User, LogOut, Magnet, Link as LinkIcon, Ruler, FileText, Plus, Trash2, Lightbulb, Play, Home } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useMultiplayer } from "@/hooks/useMultiplayer";
import Link from "next/link";

const CATALOG_ITEMS = [
  { name: "Divan", url: "", defaultScale: 1, tags: "divan sofa qonaq", category: "Salon" },
  { name: "Televizor", url: "", defaultScale: 1, tags: "tv televizor ekran", category: "Salon" },
  { name: "Dekorativ Bitki", url: "", defaultScale: 1, tags: "bitki ağac plant flower", category: "Salon" },
  
  { name: "İki Nəfərlik Yataq", url: "", defaultScale: 1, tags: "yataq bed kravat", category: "Yataq Otağı" },
  { name: "Qarderob", url: "", defaultScale: 1, tags: "qarderob şkaf wardrobe", category: "Yataq Otağı" },
  
  { name: "İş Masası", url: "", defaultScale: 1, tags: "masa stol desk office ofis", category: "Ofis" },
  { name: "Rəhbər Kreslosu", url: "", defaultScale: 1, tags: "kreslo stul chair boss office", category: "Ofis" },
  
  { name: "Spot İşıq", url: "", defaultScale: 1, tags: "isıq light spot lampa led", category: "İşıqlandırma" },
  { name: "Lüstr (Çılçıq)", url: "", defaultScale: 1, tags: "isıq light lustr lampa led", category: "İşıqlandırma" },
  { name: "LED Lent", url: "", defaultScale: 1, tags: "isıq light led lent", category: "İşıqlandırma" },
  
  { name: "360 Kamera", url: "", defaultScale: 1, tags: "kamera cam 360 photo tur pano", category: "Digər" },
  { name: "Otaq Qapısı", url: "", defaultScale: 1, tags: "qapı qapi door frame cercive", category: "Digər" },
  { name: "Pəncərə", url: "", defaultScale: 1, tags: "pəncərə pencere window glass", category: "Digər" },
  { name: "Otaq Qutusu", url: "", defaultScale: 1, tags: "otaq kub box room", category: "Digər" }
];

const TEXTURES = [
  { name: "Taxta", url: "/textures/wood.png" },
  { name: "Kərpic", url: "/textures/brick.png" },
  { name: "Beton", url: "/textures/concrete.png" },
  { name: "Mərmər", url: "/textures/marble.png" },
  { name: "Kafel", url: "/textures/tile.png" },
  { name: "Divar Kağızı", url: "/textures/wallpaper.png" },
];

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

        // Aspect ratio qorunur
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
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export default function Sidebar() {
  const { data: session } = useSession();
  const { 
    furnitureLayers, wallColor, floorColor, setRoomColors, wallTexture, floorTexture, setRoomTextures,
    ambientLightIntensity, setAmbientLightIntensity, roomSize, timeOfDay,
    is2DView, setIs2DView, isWalkthrough, setIsWalkthrough,
    isGridSnapEnabled, setIsGridSnapEnabled,
    appMode, setAppMode, panoramaImage, setPanoramaImage,
    isDrawingWall, setIsDrawingWall,
    floors, currentFloor, addFloor, removeFloor, setCurrentFloor,
    selectedCurrency, currencyRates, setCurrency, fetchRates,
    isPresentationMode, setIsPresentationMode, saveHistory,
    hideOuterShell, setHideOuterShell,
    currentTourNodeId,
    customSmetaItems, addCustomSmetaItem, deleteCustomSmetaItem, updateCustomSmetaItem,
    updateFurniture, deleteFurniture
  } = useStore();
  const { pushUpdate } = useMultiplayer();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const panoInputRef = useRef<HTMLInputElement>(null);
  const floorplanInputRef = useRef<HTMLInputElement>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [showProjects, setShowProjects] = useState(false);
  const [activeTab, setActiveTab] = useState<"wall" | "floor">("floor");
  const [activeMainTab, setActiveMainTab] = useState<"kataloq" | "material" | "ai">("kataloq");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiCommand, setAiCommand] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isCommandLoading, setIsCommandLoading] = useState(false);
  const [showSmeta, setShowSmeta] = useState(false);
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState<string>("Hamısı");
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  // Xüsusi Smeta Əşyaları üçün Form State
  const [newCustomName, setNewCustomName] = useState("");
  const [newCustomCategory, setNewCustomCategory] = useState("Xidmət");
  const [newCustomQty, setNewCustomQty] = useState(1);
  const [newCustomUnit, setNewCustomUnit] = useState("ədəd");
  const [newCustomPrice, setNewCustomPrice] = useState(100);
  const [showAddCustomItemForm, setShowAddCustomItemForm] = useState(false);

  useEffect(() => {
    fetchRates(); // Canlı məzənnələri yüklə
  }, []);

  // Load project from URL if ?id= is present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      fetch(`/api/projects/load?id=${id}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            useStore.setState({
              projectId: data.id,
              furnitureLayers: JSON.parse(data.data),
              wallColor: data.wallColor,
              floorColor: data.floorColor,
              selectedId: null,
              pastLayers: [],
              futureLayers: []
            });
          }
        })
        .catch(e => console.error("URL layihəsi yüklənmədi", e));
    }
  }, []);

  const handleAiDesign = async () => {
    if (!aiPrompt) return;
    setIsAiLoading(true);
    saveHistory();
    
    try {
      const res = await fetch("/api/ai-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          roomSize: useStore.getState().roomSize
        })
      });

      const json = await res.json();
      
      if (!res.ok || !json.success) {
        throw new Error(json.error || "AI Xətası");
      }

      // AI-dən gələn tam dizaynı tətbiq edirik (mebel + teksturalar)
      useStore.getState().applyAIDesign({
        furniture: json.data,
        wallTexture: json.wallTexture,
        floorTexture: json.floorTexture
      });
    } catch (err) {
      console.error(err);
      alert("AI Dizayn uğursuz oldu. API açarınızı yoxlayın.");
    } finally {
      setIsAiLoading(false);
      setAiPrompt("");
    }
  };

  const handleAiCommand = async () => {
    if (!aiCommand) return;
    setIsCommandLoading(true);
    saveHistory();

    try {
      const currentFurnitureSimplified = furnitureLayers.map((f) => ({
        name: f.name,
        position: f.position,
        rotation: f.rotation,
        scale: f.scale,
        color: f.color,
      }));

      const res = await fetch("/api/ai-command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiCommand,
          roomSize,
          currentFurniture: currentFurnitureSimplified,
        }),
      });

      const json = await res.json();
      
      if (!res.ok || !json.success) {
        throw new Error(json.error || "AI Əmr Xətası");
      }

      console.log("AI əmrləri icra olunur:", json.actions);
      useStore.getState().applyAICommand(json.actions);

      // Digər qoşulmuş istifadəçilərə sinxronlaşdır
      pushUpdate();

      setAiCommand("");
    } catch (err: any) {
      console.error(err);
      alert(`AI Əmri uğursuz oldu: ${err.message}`);
    } finally {
      setIsCommandLoading(false);
    }
  };

  const getSpawnPosition = (name: string) => {
    const state = useStore.getState();
    const { appMode, cameraRef, currentTourNodeId, furnitureLayers, roomSize } = state;
    
    if (appMode === '360-photo' && cameraRef) {
      const activeCam = furnitureLayers.find(f => f.id === currentTourNodeId && (f.type === "camera" || f.name.includes("360 Kamera")));
      const camX = activeCam ? activeCam.position.x : 0;
      const camZ = activeCam ? activeCam.position.z : 0;
      
      const dir = new THREE.Vector3();
      cameraRef.getWorldDirection(dir);
      
      const x = camX + dir.x * 2.5;
      const z = camZ + dir.z * 2.5;
      
      let y = 0.5;
      if (name.includes("Lüstr")) {
        y = roomSize.height - 0.3;
      } else if (name.includes("Spot")) {
        y = roomSize.height - 0.05;
      } else if (name.includes("360 Kamera")) {
        y = 0.75;
      } else if (name === "Qapı") {
        y = 1.0;
      } else if (name === "Pəncərə") {
        y = 1.5;
      }
      
      return { x, y, z };
    }
    
    if (name === "Qapı") {
      return { x: 0, y: 1.0, z: -roomSize.length / 2 };
    } else if (name === "Pəncərə") {
      return { x: 0, y: 1.5, z: -roomSize.length / 2 };
    } else {
      return { 
        x: 0, 
        y: name.includes("Lüstr") ? roomSize.height - 0.3 : name.includes("360 Kamera") ? 0.75 : 0.5, 
        z: 0 
      };
    }
  };

  const addModel = (name: string, url: string, scale: number = 1) => {
    saveHistory();
    const id = `model-${Date.now()}`;
    
    // Qiymət hesablamaları
    let price = 50;
    if (name.includes("360 Kamera")) price = 0;
    else if (name === "Otaq Qutusu") price = 1200;
    else if (name.includes("Masası")) price = 150;
    else if (name.includes("Kreslo")) price = 90;
    else if (name.includes("Divan")) price = 450;
    else if (name.includes("Yataq")) price = 600;
    else if (name.includes("Qarderob")) price = 500;
    else if (name.includes("Televizor")) price = 800;
    else if (name.includes("Bitki")) price = 25;
    else if (name.includes("Spot")) price = 15;
    else if (name.includes("Lüstr")) price = 120;
    else if (name.includes("LED")) price = 25;

    const isLightItem = name.includes("Spot") || name.includes("Lüstr") || name.includes("LED");
    const spawnPos = getSpawnPosition(name);
    const isRoom = name === "Otaq Qutusu";

    useStore.setState((state) => ({
      furnitureLayers: [
        ...state.furnitureLayers,
        {
          id, name, modelUrl: url,
          type: isRoom ? "room" : name.includes("360 Kamera") ? "camera" : "furniture",
          position: isRoom ? { x: spawnPos.x, y: 0, z: spawnPos.z } : spawnPos, 
          rotation: { x: 0, y: 0, z: 0 }, 
          scale: isRoom ? { x: 10, y: 3, z: 10 } : { x: scale, y: scale, z: scale },
          color: isRoom ? "#e5e5e5" : "#ffffff",
          floorColor: isRoom ? "#8b5a2b" : undefined,
          floor: currentFloor, // Cari mərtəbəyə əlavə edirik
          price,
          nodeId: appMode === "360-photo" ? (currentTourNodeId || undefined) : undefined,
          ...(isLightItem ? {
            lightColor: name.includes("Lüstr") ? "#ffddaa" : name.includes("LED") ? "#00ffff" : "#ffffff",
            lightIntensity: name.includes("Lüstr") ? 3.0 : name.includes("LED") ? 1.5 : 2.0,
            lightDistance: 12,
            lightAngle: name.includes("Spot") ? Math.PI / 4 : Math.PI
          } : {})
        }
      ],
      selectedId: id,
    }));
    setTimeout(() => pushUpdate(), 200);
  };

  const addDoor = () => {
    saveHistory();
    const id = Date.now().toString();
    const spawnPos = getSpawnPosition("Qapı");
    useStore.setState((state) => ({
      furnitureLayers: [
        ...state.furnitureLayers,
        {
          id,
          name: "Qapı",
          modelUrl: "",
          type: "door",
          position: spawnPos,
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1.1, y: 2.1, z: 0.2 },
          color: "#8b5a2b",
          floor: state.currentFloor,
          nodeId: appMode === "360-photo" ? (currentTourNodeId || undefined) : undefined
        },
      ],
      selectedId: id,
    }));
    setTimeout(() => pushUpdate(), 200);
  };

  const addWindow = () => {
    saveHistory();
    const id = Date.now().toString();
    const spawnPos = getSpawnPosition("Pəncərə");
    useStore.setState((state) => ({
      furnitureLayers: [
        ...state.furnitureLayers,
        {
          id,
          name: "Pəncərə",
          modelUrl: "",
          type: "window",
          position: spawnPos,
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1.2, y: 1.2, z: 0.15 },
          color: "#ffffff",
          floor: state.currentFloor,
          nodeId: appMode === "360-photo" ? (currentTourNodeId || undefined) : undefined
        },
      ],
      selectedId: id,
    }));
    setTimeout(() => pushUpdate(), 200);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.glb') && !file.name.toLowerCase().endsWith('.gltf')) {
      alert("Xahiş edirik yalnız .glb və ya .gltf formatında 3D fayl yükləyin.");
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
      } catch (err) {
        fileUrl = URL.createObjectURL(file);
      }

      addModel("Şəxsi Model", fileUrl, 1);
    } catch (error) {
      console.error(error);
      alert("Fayl yüklənərkən xəta baş verdi.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFloorplanUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && !/\.(jpg|jpeg|png|webp|heic)$/i.test(file.name)) {
      alert("Xahiş edirik yalnız şəkil formatında (JPG, PNG) 2D çertyoj yükləyin.");
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
      } catch (err) {
        fileUrl = URL.createObjectURL(file);
      }

      useStore.getState().setFloorplanImage(fileUrl);
      setIs2DView(true);
    } catch (error) {
      console.error(error);
      alert("Fayl yüklənərkən xəta baş verdi.");
    } finally {
      if (floorplanInputRef.current) floorplanInputRef.current.value = "";
    }
  };

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState<string | null>(null);

  const handlePanoUploadWithCompression = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/') && !/\.(jpg|jpeg|png|webp|heic|bmp)$/i.test(file.name)) {
        alert("Xahiş edirik yalnız JPG və ya PNG formatında şəkillər yükləyin.");
        return;
      }
    }

    setIsUploading(true);
    saveHistory();
    
    try {
      const newCameras: any[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgressText(`⚡ Şəkil ${i + 1}/${files.length} optimal ölçüdə sıxlaşdırılır və yüklənir...`);
        
        let compressedBlob: Blob = file;
        try {
          compressedBlob = await compressImage(file, 4096, 2048, 0.85);
        } catch (cErr) {
          console.warn("Sıxlaşdırma xətası:", cErr);
        }

        let fileUrl = "";
        try {
          const formData = new FormData();
          formData.append("file", new File([compressedBlob], file.name, { type: "image/jpeg" }));
          const res = await fetch("/api/upload", { method: "POST", body: formData });
          const data = await res.json();
          if (res.ok && data.success && data.url) {
            fileUrl = data.url;
          } else {
            fileUrl = URL.createObjectURL(compressedBlob);
          }
        } catch (uploadErr) {
          console.warn("Server upload fallback, local Blob URL istifadə olunur:", uploadErr);
          fileUrl = URL.createObjectURL(compressedBlob);
        }

        const roomName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        const id = `camera-${Date.now()}-${i}`;
        
        newCameras.push({
          id,
          name: roomName,
          modelUrl: "",
          type: "camera",
          position: { 
            x: (i - (files.length - 1) / 2) * 2.0,
            y: 0.75, 
            z: 0 
          }, 
          rotation: { x: 0, y: 0, z: 0 }, 
          scale: { x: 1, y: 1, z: 1 },
          color: "#ffffff",
          floor: currentFloor,
          price: 0,
          panoramaUrl: fileUrl
        });
      }

      if (newCameras.length > 0) {
        useStore.setState((state) => ({
          furnitureLayers: [
            ...state.furnitureLayers,
            ...newCameras
          ]
        }));
        
        setPanoramaImage(newCameras[0].panoramaUrl);
        useStore.setState({ selectedId: newCameras[0].id });
        setAppMode('360-photo');
        
        setTimeout(() => pushUpdate(), 200);
      }
    } catch (error: any) {
      console.error("Şəkil yükləmə fallback:", error);
    } finally {
      setIsUploading(false);
      setUploadProgressText(null);
      if (panoInputRef.current) panoInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!session) return alert("Zəhmət olmasa layihəni yadda saxlamaq üçün yuxarıdan giriş edin! 🔐");
    const state = useStore.getState();
    const res = await fetch("/api/projects/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: state.projectId,
        name: "Yeni Otaq " + new Date().toLocaleTimeString(),
        data: state.furnitureLayers,
        wallColor: state.wallColor,
        floorColor: state.floorColor
      })
    });
    if (res.ok) {
      const data = await res.json();
      useStore.getState().setProjectId(data.id);
      alert("Layihə uğurla Bulud Bazasına (Database) yazıldı! ☁️💾");
      return data.id;
    } else {
      alert("Xəta baş verdi.");
      return null;
    }
  };

  const handleShare = async () => {
    let id = useStore.getState().projectId;
    if (!id) {
      id = await handleSave();
    }
    if (id) {
      const url = `${window.location.origin}/editor?id=${id}`;
      navigator.clipboard.writeText(url);
      alert(`Paylaşım linki kopyalandı:\n\n${url}\n\nBu linki dostlarına göndər!`);
    }
  };

  const handleLoad = () => {
    if (!session) return alert("Zəhmət olmasa layihələri görmək üçün yuxarıdan giriş edin! 🔐");
    window.location.href = "/dashboard";
  };



  const loadProjectData = (p: any) => {
    useStore.setState({
      projectId: p.id,
      furnitureLayers: JSON.parse(p.data),
      wallColor: p.wallColor,
      floorColor: p.floorColor,
      selectedId: null,
      pastLayers: [],
      futureLayers: []
    });
    setShowProjects(false);
    alert(`"${p.name}" layihəsi uğurla yükləndi! 🚀`);
  };

  const handleExport2D = () => {
    const gl = (window as any).__THREE_RENDERER__;
    const scene = (window as any).__THREE_SCENE__;
    const camera = (window as any).__THREE_CAMERA__;

    if (gl && scene && camera) {
      gl.render(scene, camera);
      const url = gl.domElement.toDataURL("image/png");
      const link = document.createElement('a');
      link.download = 'spacecraft-3d-render.png';
      link.href = url;
      link.click();
    } else {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const url = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.download = 'spacecraft-3d-render.png';
        link.href = url;
        link.click();
      }
    }
  };

  const sanitizeAzText = (text: string): string => {
    if (!text) return "";
    const map: Record<string, string> = {
      'ə': 'e', 'Ə': 'E',
      'ı': 'i', 'I': 'I', 'İ': 'I',
      'ö': 'o', 'Ö': 'O',
      'ğ': 'g', 'Ğ': 'G',
      'ü': 'u', 'Ü': 'U',
      'ş': 's', 'Ş': 'S',
      'ç': 'c', 'Ç': 'C'
    };
    return text.replace(/[əƏıIİöÖğĞüÜşŞçÇ]/g, (match) => map[match] || match);
  };

  const handleExportSmeta = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");
      
      const doc = new jsPDF();
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(30, 41, 59);
      doc.text("SpaceCraft 3D - LAYIHE SMETASI", 14, 20);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Tarix: ${new Date().toLocaleDateString()}`, 14, 28);
      doc.text(`Valyuta: ${selectedCurrency}`, 14, 33);
      doc.text(`Mertebe sayi: ${floors.length}`, 14, 38);
      
      const tableRows: any[] = [];
      let totalAmount = 0;
      const rate = currencyRates[selectedCurrency] || 1.0;
      const currencySymbol = selectedCurrency === "AZN" ? "AZN" : selectedCurrency === "USD" ? "$" : selectedCurrency === "EUR" ? "EUR" : selectedCurrency === "TRY" ? "TL" : "RUB";

      // 3D Mebellər
      furnitureLayers.forEach((f, idx) => {
        const itemFloor = floors[f.floor ?? 0] || "1. Mertebe";
        const basePrice = f.price || 50;
        const convertedPrice = basePrice * rate;
        totalAmount += convertedPrice;
        
        tableRows.push([
          idx + 1,
          sanitizeAzText(f.name),
          sanitizeAzText(itemFloor),
          "1 eded",
          `${convertedPrice.toFixed(2)} ${currencySymbol}`,
          `${convertedPrice.toFixed(2)} ${currencySymbol}`
        ]);
      });
      
      // Xüsusi Smeta Xərcləri
      customSmetaItems.forEach((ci, idx) => {
        const basePrice = (ci.price || 0) * (ci.quantity || 1);
        const convertedPrice = basePrice * rate;
        const unitPriceConverted = (ci.price || 0) * rate;
        totalAmount += convertedPrice;

        tableRows.push([
          furnitureLayers.length + idx + 1,
          sanitizeAzText(ci.name),
          sanitizeAzText(ci.category || "Xidmet"),
          `${ci.quantity || 1} ${sanitizeAzText(ci.unit || "eded")}`,
          `${unitPriceConverted.toFixed(2)} ${currencySymbol}`,
          `${convertedPrice.toFixed(2)} ${currencySymbol}`
        ]);
      });

      // Döşəmə materialı
      const floorArea = roomSize.width * roomSize.length;
      const floorPricePerM2 = 25; // 25 AZN per m2
      const convertedFloorPrice = floorArea * floorPricePerM2 * rate;
      totalAmount += convertedFloorPrice;
      tableRows.push([
        tableRows.length + 1,
        "Doseme Materiali (Taxta/Parket)",
        "Umumi sahe",
        `${floorArea.toFixed(1)} m2`,
        `${(floorPricePerM2 * rate).toFixed(2)} ${currencySymbol}`,
        `${convertedFloorPrice.toFixed(2)} ${currencySymbol}`
      ]);

      autoTable(doc, {
        startY: 45,
        head: [["S/S", "Ad / Aciqlama", "Yerlesme / Kategoriya", "Miqdar", "Vahid Qiymet", "Cemi"]],
        body: tableRows,
        theme: "striped",
        headStyles: { fillColor: [79, 70, 229] },
        foot: [["", "", "", "", "CEMI:", `${totalAmount.toFixed(2)} ${currencySymbol}`]],
        footStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: "bold" }
      });
      
      doc.save(`spacecraft-smeta-${selectedCurrency}.pdf`);
    } catch (e) {
      console.error(e);
      alert("PDF çıxarışı zamanı xəta baş verdi.");
    }
  };

  const handleExport3D = async () => {
    try {
      const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js');
      const scene = (window as any).__THREE_SCENE__; // We need to expose scene to window or access it differently
      if (!scene) {
        alert("Səhnə tapılmadı. Lütfən biraz gözləyin və təkrar yoxlayın.");
        return;
      }
      const exporter = new GLTFExporter();
      exporter.parse(
        scene,
        function (gltf: any) {
          const blob = new Blob([gltf], { type: 'application/octet-stream' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.style.display = 'none';
          link.href = url;
          link.download = 'spacecraft-room.glb';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        },
        function (error: any) {
          console.error(error);
          alert("Xəta baş verdi.");
        },
        { binary: true } // Export as GLB
      );
    } catch (e) {
      console.error(e);
      alert("Export modulunu yükləmək mümkün olmadı.");
    }
  };

  const { isSidebarOpen, setIsSidebarOpen } = useStore();

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}
      <div className={`fixed lg:relative top-0 left-0 h-full z-50 lg:z-20 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? 'w-[300px] sm:w-[340px]' : 'w-0'}`}>
      <div className={`absolute top-0 left-0 w-[300px] sm:w-[340px] h-full bg-[#0a0a0a]/95 backdrop-blur-3xl border-r border-white/5 p-4 sm:p-6 flex flex-col text-neutral-100 shadow-[4px_0_24px_rgba(0,0,0,0.5)] transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="mb-6 flex items-center justify-between gap-2 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent tracking-tighter drop-shadow-sm truncate">SpaceCraft</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-neutral-400 text-[9px] font-bold tracking-[0.2em] uppercase whitespace-nowrap">Pro 3D Editor</p>
            {useStore.getState().projectId && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0" title="Avtomatik olaraq digər istifadəçilərlə sinxronlaşır">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                AUTO-SYNC
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-1 sm:gap-1.5 shrink-0">
          <button onClick={() => setIsPresentationMode(true)} title="Təqdimat Rejimi (Play)" className="p-1.5 sm:p-2 bg-emerald-500/10 hover:bg-emerald-500/30 text-emerald-400 hover:text-white rounded-xl transition-all border border-emerald-500/20">
            <Play className="w-4 h-4 fill-emerald-500/20" />
          </button>
          <button onClick={() => setShowSmeta(true)} title="Smeta Fakturasını Göstər" className="p-1.5 sm:p-2 bg-indigo-500/10 hover:bg-indigo-500/30 text-indigo-400 hover:text-white rounded-xl transition-all border border-indigo-500/20">
            <FileText className="w-4 h-4" />
          </button>
          <button onClick={handleExport2D} title="Şəkil Kimi Yüklə (Render)" className="p-1.5 sm:p-2 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white rounded-xl transition-all border border-white/10">
            <Camera className="w-4 h-4" />
          </button>
          <Link href="/" title="Ana Səhifəyə Qayıt" className="p-1.5 sm:p-2 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white rounded-xl transition-all border border-white/10 flex items-center justify-center">
            <Home className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Profil və Giriş */}
      <div className="mb-6 flex items-center justify-between bg-transparent hover:bg-white/[0.02] p-2 -mx-2 rounded-xl border border-transparent hover:border-white/5 transition-all relative">
        {session?.user ? (
          <div className="flex items-center justify-between w-full">
            <Link href="/settings" className="flex items-center gap-3">
              <img src={session.user.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="avatar" className="w-8 h-8 rounded-full border border-white/10" />
              <div>
                <div className="text-xs font-bold text-white leading-tight">{session.user.name}</div>
                <div className="text-[10px] text-emerald-400 font-medium">Pro Plan</div>
              </div>
            </Link>
            <button onClick={() => signOut()} title="Çıxış Et" className="p-1.5 text-neutral-500 hover:text-white hover:bg-white/10 rounded-lg transition-all">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => signIn()}
            className="w-full bg-white text-black font-bold text-xs py-2.5 rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            Sistemə Giriş
          </button>
        )}
      </div>

      {/* REJİM SEÇİMİ (3D / 360) */}
      <div className="flex p-1 mb-6 bg-black/30 rounded-lg border border-white/5">
        <button 
          onClick={() => setAppMode('3d-room')}
          className={`flex-1 py-1.5 rounded-md text-[11px] font-bold transition-all ${appMode === '3d-room' ? 'bg-white/10 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          📦 3D Otaq
        </button>
        <button 
          onClick={() => {
            useStore.setState({ is2DView: false, isWalkthrough: false, isDollhouseMode: false, appMode: '360-photo' });
            setIsInstructionsOpen(true);
          }}
          className={`flex-1 py-1.5 rounded-md text-[11px] font-bold transition-all ${appMode === '360-photo' ? 'bg-white/10 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          🌍 360° Foto
        </button>
      </div>

      {appMode === "360-photo" && (
        <div className="bg-indigo-950/20 border border-indigo-500/10 rounded-xl p-3 mb-4 shrink-0 transition-all select-none">
          <div 
            onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
            className="flex justify-between items-center cursor-pointer hover:opacity-80 transition-opacity"
          >
            <h3 className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <Camera className="w-3.5 h-3.5 animate-pulse" /> 📸 Təlimat & Şəkil Yüklə
            </h3>
            <span className="text-[9px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              {isInstructionsOpen ? "GİZLƏ 🔼" : "GÖSTƏR 🔽"}
            </span>
          </div>

          {isInstructionsOpen && (
            <div className="mt-3 space-y-3 pt-3 border-t border-white/5">
              <p className="text-[9px] text-neutral-400 leading-relaxed space-y-1">
                1. <strong>3D Otaq</strong> rejimində kataloqdan <strong>"360 Kamera"</strong> yerləşdirin.<br />
                2. Bu <strong>360° Foto</strong> rejimində həmin nöqtələrdən gəzin.<br />
                3. Döşəmədəki parıldayan <strong>yaşıl halqalar</strong> vasitəsilə keçidlər edin.<br />
                4. Yüklədiyiniz panorama şəkillərində köhnə mebelləri silib, yeni 3D mebellər yerləşdirin.
              </p>
              <div className="w-full h-px bg-white/5 my-1"></div>
              <button 
                onClick={() => panoInputRef.current?.click()}
                disabled={isUploading}
                className="w-full bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 py-2.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-50 cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{uploadProgressText || "Şəkillər Yüklənir..."}</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Çoxlu 360° Foto Yüklə</span>
                  </>
                )}
              </button>
              <input type="file" ref={panoInputRef} onChange={handlePanoUploadWithCompression} accept="image/jpeg, image/png" multiple className="hidden" />
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between gap-2 mb-6 border-b border-white/10 w-full">
        <button 
          onClick={() => setActiveMainTab("kataloq")} 
          className={`flex-1 text-center pb-2 text-[10px] font-bold uppercase tracking-wider transition-all relative ${activeMainTab === "kataloq" ? "text-white" : "text-neutral-500 hover:text-neutral-300"}`}
        >
          Kataloq
          {activeMainTab === "kataloq" && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-white rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setActiveMainTab("material")} 
          className={`flex-1 text-center pb-2 text-[10px] font-bold uppercase tracking-wider transition-all relative ${activeMainTab === "material" ? "text-white" : "text-neutral-500 hover:text-neutral-300"}`}
        >
          Material
          {activeMainTab === "material" && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-white rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setActiveMainTab("ai")} 
          className={`flex-1 text-center pb-2 text-[10px] font-bold uppercase tracking-wider transition-all relative ${activeMainTab === "ai" ? "text-white" : "text-neutral-500 hover:text-neutral-300"}`}
        >
          Süni İntellekt
          {activeMainTab === "ai" && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-white rounded-t-full"></div>}
        </button>
      </div>

      {activeMainTab === "ai" && (
        <div className="flex flex-col gap-4">
          {/* Card 1: Layout generator */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4 rounded-2xl border border-indigo-500/20 relative overflow-hidden flex flex-col gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h2 className="text-xs text-white font-bold uppercase tracking-widest">Avtomatik Qur (Şablon)</h2>
            </div>
            <p className="text-[11px] text-indigo-200/60 leading-relaxed">
              Otağı sıfırdan dizayn edin. Şablonlarımızı yazın və AI saniyələr içində bütün mebelləri yerləşdirməyə çalışsın.
            </p>
            <div className="flex flex-col gap-2">
              <input 
                type="text" 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Məs: Modern bir yataq otağı yığ" 
                className="w-full bg-black/40 text-white text-xs px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-neutral-600 shadow-inner"
                onKeyDown={(e) => e.key === 'Enter' && handleAiDesign()}
              />
              <button 
                onClick={handleAiDesign}
                disabled={isAiLoading || !aiPrompt}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs py-3 rounded-xl transition-all disabled:opacity-50 disabled:hover:from-purple-600 disabled:hover:to-indigo-600 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/25 cursor-pointer"
              >
                {isAiLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Wand2 className="w-4 h-4" />}
                {isAiLoading ? "DİZAYN EDİLİR..." : "AVTOMATİK QUR"}
              </button>
            </div>
          </div>

          {/* Card 2: AI Commander */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-4 rounded-2xl border border-emerald-500/20 relative overflow-hidden flex flex-col gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs text-white font-bold uppercase tracking-widest">Əmr ilə İdarəetmə (Asistent)</h2>
            </div>
            <p className="text-[11px] text-emerald-200/60 leading-relaxed">
              Otağı təbii dildə əmrlərlə dəyişin (məs. mebel əlavə edin, rəngləri, teksturaları və ya otaq ölçülərini dəyişin).
            </p>
            <div className="flex flex-col gap-2">
              <input 
                type="text" 
                value={aiCommand}
                onChange={(e) => setAiCommand(e.target.value)}
                placeholder="Məs: Divarları beton tekstura et və bitki qoy" 
                className="w-full bg-black/40 text-white text-xs px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-neutral-600 shadow-inner"
                onKeyDown={(e) => e.key === 'Enter' && handleAiCommand()}
              />
              <button 
                onClick={handleAiCommand}
                disabled={isCommandLoading || !aiCommand}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs py-3 rounded-xl transition-all disabled:opacity-50 disabled:hover:from-emerald-600 disabled:hover:to-teal-600 flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/25 cursor-pointer"
              >
                {isCommandLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isCommandLoading ? "İCRA OLUNUR..." : "ƏMRİ İCRA ET"}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeMainTab === "kataloq" && (
        <div className="flex-1 overflow-y-auto space-y-5 pr-2 custom-scrollbar mb-4">
          
          {/* MƏRTƏBƏ MENECERİ */}
          <div className="mb-4 flex items-center justify-between gap-3 bg-transparent border border-white/10 px-3 py-2 rounded-lg min-w-0">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className="text-[11px] font-bold text-neutral-300 truncate" title={floors[currentFloor] || "1. Mərtəbə"}>🏢 {floors[currentFloor] || "1. Mərtəbə"}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {floors.length > 1 && (
                <button onClick={() => removeFloor(currentFloor)} className="p-1 hover:bg-white/10 text-neutral-400 hover:text-red-400 rounded transition-colors" title="Cari Mərtəbəni Sil">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              {floors.map((flName, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentFloor(idx)}
                  className={`w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold transition-all ${currentFloor === idx ? 'bg-white text-black' : 'hover:bg-white/10 text-neutral-400'}`}
                  title={flName}
                >
                  {idx + 1}
                </button>
              ))}
              <div className="w-px h-4 bg-white/10 my-auto mx-1"></div>
              <button onClick={addFloor} className="p-1 hover:bg-white/10 text-neutral-400 hover:text-white rounded transition-colors" title="Yeni Mərtəbə">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          
          {/* Category Selector Tabs */}
          <div 
            className="flex gap-1.5 overflow-x-auto pb-3 mb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {["Hamısı", "Salon", "Yataq Otağı", "Ofis", "İşıqlandırma", "Digər"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCatalogCategory(cat)}
                className={`px-3 py-1 rounded-full text-[9px] font-bold transition-all border whitespace-nowrap uppercase tracking-wider ${
                  selectedCatalogCategory === cat
                    ? "bg-indigo-500 text-white border-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.3)] animate-pulse"
                    : "bg-white/5 text-neutral-400 border-white/5 hover:text-white hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mb-4 relative">
            <input 
              type="text" 
              placeholder="Model axtar..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-white text-xs pl-0 pr-4 py-2 border-b border-white/10 focus:outline-none focus:border-white/50 transition-colors placeholder:text-neutral-600"
            />
          </div>

          <div className="flex flex-col">
            {CATALOG_ITEMS
              .filter(item => selectedCatalogCategory === "Hamısı" || item.category === selectedCatalogCategory)
              .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.tags.includes(searchQuery.toLowerCase()))
              .map((item, index) => (
              <div key={index} onClick={() => addModel(item.name, item.url, item.defaultScale)} className="group cursor-pointer py-2.5 px-2 hover:bg-white/[0.03] transition-colors rounded-lg flex items-center justify-between border-b border-white/5 last:border-0">
                <span className="font-medium text-[13px] text-neutral-300 group-hover:text-white transition-colors">{item.name}</span>
                <Plus className="text-neutral-600 group-hover:text-white w-4 h-4 transition-colors" />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <div onClick={() => fileInputRef.current?.click()} className="flex-1 bg-white/[0.03] hover:bg-white/[0.06] transition-colors cursor-pointer rounded-lg p-2.5 flex flex-col items-center justify-center border border-white/5 gap-1.5 text-center">
              <Upload className="text-neutral-400 w-3.5 h-3.5" />
              <span className="font-medium text-[9px] text-neutral-400 uppercase tracking-widest">3D Model</span>
            </div>
            <div onClick={() => floorplanInputRef.current?.click()} className="flex-1 bg-white/[0.03] hover:bg-white/[0.06] transition-colors cursor-pointer rounded-lg p-2.5 flex flex-col items-center justify-center border border-white/5 gap-1.5 text-center">
              <Map className="text-neutral-400 w-3.5 h-3.5" />
              <span className="font-medium text-[9px] text-neutral-400 uppercase tracking-widest">2D Plan</span>
            </div>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".glb,.gltf" className="hidden" />
          <input type="file" ref={floorplanInputRef} onChange={handleFloorplanUpload} accept="image/*" className="hidden" />
          
          {useStore.getState().floorplanImage && (
            <div className="mt-2 p-3 bg-cyan-900/20 border border-cyan-500/20 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-cyan-300 font-bold">Çertyoj Tənzimləmələri</span>
                <button onClick={() => useStore.getState().setFloorplanImage(null)} className="text-red-400 hover:text-red-300 text-xs font-bold">Sil</button>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-neutral-400 flex justify-between">Şəffaflıq <span>{useStore.getState().floorplanOpacity}</span></label>
                <input type="range" min="0.1" max="1" step="0.1" value={useStore.getState().floorplanOpacity} onChange={e => useStore.getState().setFloorplanOpacity(parseFloat(e.target.value))} className="w-full accent-cyan-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-neutral-400 flex justify-between">Ölçü (Miqyas) <span>{useStore.getState().floorplanScale}x</span></label>
                <input type="range" min="1" max="50" step="1" value={useStore.getState().floorplanScale} onChange={e => useStore.getState().setFloorplanScale(parseFloat(e.target.value))} className="w-full accent-cyan-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
              </div>
            </div>
          )}
        </div>
      )}

      {activeMainTab === "material" && (
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">İşıqlandırma</h3>
            <div className="flex items-center gap-2">
              <Moon className="w-3 h-3 text-indigo-400" />
              <input type="range" min="0" max="2" step="0.1" value={ambientLightIntensity} onChange={(e) => setAmbientLightIntensity(parseFloat(e.target.value))} className="w-16 accent-indigo-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
              <Sun className="w-3 h-3 text-amber-400" />
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Saat (Günəş)</h3>
            <div className="flex items-center gap-2">
              <input type="range" min="0" max="24" step="0.5" value={timeOfDay} onChange={(e) => useStore.setState({ timeOfDay: parseFloat(e.target.value) })} className="w-20 accent-amber-500 h-1 bg-gradient-to-r from-indigo-500 via-amber-500 to-indigo-900 rounded-lg appearance-none cursor-pointer" />
              <span className="text-[10px] font-bold w-8 text-right">{Math.floor(timeOfDay).toString().padStart(2, '0')}:{(timeOfDay % 1) * 60 === 0 ? '00' : '30'}</span>
            </div>
          </div>
          
          <div className="bg-black/40 p-3 rounded-xl border border-white/5 mb-4">
            <h3 className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-3">Otaq Ölçüləri (m)</h3>
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-neutral-400">En (X)</span>
                <input type="range" min="4" max="20" step="0.5" value={roomSize.width} onChange={(e) => useStore.setState({ roomSize: { ...roomSize, width: parseFloat(e.target.value) } })} className="w-24 accent-indigo-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                <span className="text-[10px] font-bold w-6 text-right">{roomSize.width}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-neutral-400">Uzunluq (Z)</span>
                <input type="range" min="4" max="20" step="0.5" value={roomSize.length} onChange={(e) => useStore.setState({ roomSize: { ...roomSize, length: parseFloat(e.target.value) } })} className="w-24 accent-indigo-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                <span className="text-[10px] font-bold w-6 text-right">{roomSize.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-neutral-400">Hündürlük (Y)</span>
                <input type="range" min="2" max="6" step="0.1" value={roomSize.height} onChange={(e) => useStore.setState({ roomSize: { ...roomSize, height: parseFloat(e.target.value) } })} className="w-24 accent-indigo-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                <span className="text-[10px] font-bold w-6 text-right">{roomSize.height}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 pb-3 border-t border-white/5">
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Xarici Shell-i Gizlə</span>
              <button 
                onClick={() => setHideOuterShell(!hideOuterShell)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                  hideOuterShell 
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]' 
                    : 'bg-white/5 text-neutral-400 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {hideOuterShell ? "GİZLİDİR 👁️‍🗨️" : "GÖSTƏR 👀"}
              </button>
            </div>

            <div className="flex gap-2 mb-3 pt-3 border-t border-white/5">
              <button onClick={() => setActiveTab("wall")} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${activeTab === 'wall' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:bg-white/5'}`}>Divar</button>
              <button onClick={() => setActiveTab("floor")} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${activeTab === 'floor' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:bg-white/5'}`}>Döşəmə</button>
            </div>
            
            <div className="flex items-center justify-between mb-3 bg-white/5 p-2 rounded-lg">
              <span className="text-[10px] text-neutral-400 font-medium">Boya (Rəng)</span>
              <input 
                type="color" 
                value={activeTab === 'wall' ? wallColor : floorColor} 
                onChange={(e) => {
                  const color = e.target.value;
                  if (activeTab === 'wall') {
                    setRoomColors({ wallColor: color });
                    setRoomTextures({ wallTexture: null });
                  } else {
                    setRoomColors({ floorColor: color });
                    setRoomTextures({ floorTexture: null });
                  }
                }} 
                className="w-5 h-5 rounded cursor-pointer bg-transparent border-0 p-0" 
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {TEXTURES.map((tex, idx) => {
                const isSelected = activeTab === 'wall' ? wallTexture === tex.url : floorTexture === tex.url;
                return (
                  <div 
                    key={idx} 
                    onClick={() => {
                      if (activeTab === 'wall') setRoomTextures({ wallTexture: tex.url });
                      else setRoomTextures({ floorTexture: tex.url });
                    }}
                    className={`group relative cursor-pointer rounded-lg overflow-hidden border aspect-video ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/50' : 'border-white/10 hover:border-white/30'}`}
                  >
                    <img src={tex.url} alt={tex.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-black/70 backdrop-blur-sm p-1 text-center">
                      <span className="text-[8px] font-bold text-white uppercase tracking-wider">{tex.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER ACTIONS */}
      <div className="pt-4 border-t border-white/5 mt-auto">
        <div className="flex gap-2 relative">
          <button onClick={handleSave} title="Layihəni Saxla" className="bg-white/5 hover:bg-white/10 text-neutral-300 p-2.5 rounded-lg border border-white/5 transition-colors">
            <Cloud className="w-4 h-4" />
          </button>
          <button onClick={handleShare} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-2 border border-white/5">
            <LinkIcon className="w-3.5 h-3.5" />
            Link Göndər
          </button>
          <button onClick={handleLoad} title="Saxlanılmış Layihələr" className="bg-white/5 hover:bg-white/10 text-neutral-300 p-2.5 rounded-lg border border-white/5 transition-colors">
            <FolderOpen className="w-4 h-4" />
          </button>
          <button 
            onClick={() => {
              if ((window as any).exportSceneToGLTF) {
                (window as any).exportSceneToGLTF();
              } else {
                alert("3D İxrac Modulu hələ hazır deyil.");
              }
            }} 
            title="3D Səhnəni İxrac Et (GLB)" 
            className="bg-indigo-600/25 hover:bg-indigo-600/40 text-indigo-300 p-2.5 rounded-lg border border-indigo-500/30 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>

          {showProjects && (
        <div className="absolute bottom-full mb-2 right-0 w-full bg-neutral-900 border border-white/10 rounded-xl shadow-2xl p-2 z-50 max-h-48 overflow-y-auto">
              {projects.length === 0 ? (
                <div className="text-xs text-neutral-500 text-center py-4">Layihə tapılmadı</div>
              ) : (
                projects.map(p => (
                  <div key={p.id} onClick={() => loadProjectData(p)} className="p-3 hover:bg-white/10 rounded-lg cursor-pointer transition-colors border-b border-white/5 last:border-0">
                    <div className="text-sm font-semibold text-white">{p.name}</div>
                    <div className="text-[10px] text-neutral-500 mt-1">{new Date(p.updatedAt).toLocaleString()}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute top-1/2 -translate-y-1/2 w-6 h-14 bg-[#1a1a24] border border-white/10 border-l-0 rounded-r-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 z-50 shadow-xl transition-all cursor-pointer"
        style={{ right: '-24px' }}
        title={isSidebarOpen ? "Menyunu Gizlət" : "Menyunu Göstər"}
      >
        <div className={`transition-transform duration-300 ${isSidebarOpen ? '' : 'rotate-180'}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </div>
      </button>
    </div>
  </div>

  {showSmeta && (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[999] p-4 animate-fade-in">
        <div className="bg-[#0f0f15] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl p-6">
          
          {/* Modal Header */}
          <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" /> Ağıllı Smeta (Faktura)
              </h2>
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Layihə Xərcləri və Materiallar</p>
            </div>
            <button 
              onClick={() => setShowSmeta(false)} 
              className="text-neutral-400 hover:text-white text-2xl font-bold bg-white/5 hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center transition-all"
            >
              &times;
            </button>
          </div>

          {/* Currency Selector & Add Custom Action */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-white/5 p-3 rounded-2xl border border-white/5 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-300">Valyuta:</span>
              <div className="flex flex-wrap gap-1.5">
                {["AZN", "USD", "EUR", "TRY", "RUB"].map(cur => (
                  <button
                    key={cur}
                    onClick={() => setCurrency(cur)}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap shrink-0 ${selectedCurrency === cur ? 'bg-indigo-600 text-white' : 'bg-white/5 text-neutral-400 hover:bg-white/10'}`}
                  >
                    {cur === "AZN" ? "₼ AZN" : cur === "USD" ? "$ USD" : cur === "EUR" ? "€ EUR" : cur === "TRY" ? "₺ TRY" : "₽ RUB"}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => setShowAddCustomItemForm(!showAddCustomItemForm)}
              className="bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              {showAddCustomItemForm ? "Formu Bağla" : "Xüsusi Xərc Əlavə Et"}
            </button>
          </div>

          {/* Form for adding Custom Smeta Item */}
          {showAddCustomItemForm && (
            <div className="mb-4 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-4 space-y-3 animate-fade-in">
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Yeni Xüsusi Xərc / Material</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Xərcin / Materialın adı (məs: Usta haqqı)"
                  value={newCustomName}
                  onChange={(e) => setNewCustomName(e.target.value)}
                  className="bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 col-span-1 sm:col-span-2"
                />
                <input
                  type="text"
                  placeholder="Kateqoriya (məs: Təmir, Xidmət)"
                  value={newCustomCategory}
                  onChange={(e) => setNewCustomCategory(e.target.value)}
                  className="bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                />
                <div className="flex gap-1">
                  <input
                    type="number"
                    min="1"
                    placeholder="Miqdar"
                    value={newCustomQty}
                    onChange={(e) => setNewCustomQty(parseFloat(e.target.value) || 1)}
                    className="w-1/2 bg-black/60 border border-white/10 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="Vahid"
                    value={newCustomUnit}
                    onChange={(e) => setNewCustomUnit(e.target.value)}
                    className="w-1/2 bg-black/60 border border-white/10 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <input
                  type="number"
                  min="0"
                  placeholder="Vahid Qiymət (AZN)"
                  value={newCustomPrice}
                  onChange={(e) => setNewCustomPrice(parseFloat(e.target.value) || 0)}
                  className="bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => {
                    if (!newCustomName.trim()) return alert("Zəhmət olmasa xərc adını daxil edin.");
                    addCustomSmetaItem({
                      name: newCustomName,
                      category: newCustomCategory || "Xidmət",
                      quantity: newCustomQty || 1,
                      unit: newCustomUnit || "ədəd",
                      price: newCustomPrice || 0
                    });
                    setNewCustomName("");
                    setNewCustomPrice(100);
                    setShowAddCustomItemForm(false);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Smetaya Əlavə Et
                </button>
              </div>
            </div>
          )}

          {/* Table / Content */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400 uppercase tracking-widest text-[9px] font-bold">
                  <th className="py-2 pr-2">Ad / Açıqlama</th>
                  <th className="py-2 px-2 text-left">Yerləşmə</th>
                  <th className="py-2 px-2 text-right">Miqdar</th>
                  <th className="py-2 px-2 text-right">Vahid Qiymət</th>
                  <th className="py-2 pl-2 text-right">Cəmi</th>
                  <th className="py-2 pl-2 text-center w-8">Əməl</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {/* 3D Mebellər */}
                {furnitureLayers.map(f => {
                  const rate = currencyRates[selectedCurrency] || 1.0;
                  const priceAZN = f.price ?? 50;
                  const priceVal = priceAZN * rate;
                  const symbol = selectedCurrency === "AZN" ? "₼" : selectedCurrency === "USD" ? "$" : selectedCurrency === "EUR" ? "€" : selectedCurrency === "TRY" ? "₺" : "₽";
                  return (
                    <tr key={f.id} className="text-neutral-200 group hover:bg-white/[0.02]">
                      <td className="py-2.5 pr-2 font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-500/60 shrink-0"></span>
                        {f.name}
                      </td>
                      <td className="py-2.5 px-2 text-neutral-400">{floors[f.floor ?? 0] || "1. Mərtəbə"}</td>
                      <td className="py-2.5 px-2 text-right text-neutral-400">1 ədəd</td>
                      <td className="py-2.5 px-2 text-right">
                        <input
                          type="number"
                          min="0"
                          value={priceAZN}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            updateFurniture(f.id, { price: isNaN(val) ? 0 : val });
                          }}
                          className="w-20 bg-black/50 border border-white/10 hover:border-indigo-500/50 focus:border-indigo-500 rounded-lg px-2 py-1 text-right text-xs text-indigo-200 font-mono focus:outline-none transition-all"
                          title="Qiyməti yenilə (AZN ilə)"
                        />
                      </td>
                      <td className="py-2.5 pl-2 text-right font-mono font-bold text-indigo-300">{priceVal.toFixed(2)} {symbol}</td>
                      <td className="py-2.5 pl-2 text-center">
                        <button
                          onClick={() => deleteFurniture(f.id)}
                          className="p-1 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                          title="Smetadan və səhnədən sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {/* Xüsusi Smeta Xərcləri */}
                {customSmetaItems.map(ci => {
                  const rate = currencyRates[selectedCurrency] || 1.0;
                  const priceAZN = ci.price ?? 0;
                  const totalAZN = priceAZN * (ci.quantity || 1);
                  const priceVal = totalAZN * rate;
                  const symbol = selectedCurrency === "AZN" ? "₼" : selectedCurrency === "USD" ? "$" : selectedCurrency === "EUR" ? "€" : selectedCurrency === "TRY" ? "₺" : "₽";
                  return (
                    <tr key={ci.id} className="text-neutral-200 group hover:bg-white/[0.02]">
                      <td className="py-2.5 pr-2 font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500/60 shrink-0"></span>
                        {ci.name}
                      </td>
                      <td className="py-2.5 px-2 text-emerald-400/80 text-[11px] font-medium">{ci.category || "Xidmət"}</td>
                      <td className="py-2.5 px-2 text-right">
                        <input
                          type="number"
                          min="1"
                          value={ci.quantity || 1}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            updateCustomSmetaItem(ci.id, { quantity: isNaN(val) ? 1 : val });
                          }}
                          className="w-14 bg-black/50 border border-white/10 hover:border-emerald-500/50 focus:border-emerald-500 rounded-lg px-1.5 py-1 text-right text-xs text-emerald-200 font-mono focus:outline-none transition-all"
                        /> <span className="text-[10px] text-neutral-400">{ci.unit || 'ədəd'}</span>
                      </td>
                      <td className="py-2.5 px-2 text-right">
                        <input
                          type="number"
                          min="0"
                          value={priceAZN}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            updateCustomSmetaItem(ci.id, { price: isNaN(val) ? 0 : val });
                          }}
                          className="w-20 bg-black/50 border border-white/10 hover:border-emerald-500/50 focus:border-emerald-500 rounded-lg px-2 py-1 text-right text-xs text-emerald-200 font-mono focus:outline-none transition-all"
                        />
                      </td>
                      <td className="py-2.5 pl-2 text-right font-mono font-bold text-emerald-300">{priceVal.toFixed(2)} {symbol}</td>
                      <td className="py-2.5 pl-2 text-center">
                        <button
                          onClick={() => deleteCustomSmetaItem(ci.id)}
                          className="p-1 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                          title="Smetadan sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {/* Döşəmə Materialı */}
                <tr className="text-neutral-200">
                  <td className="py-2.5 pr-2 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500/60 shrink-0"></span>
                    Döşəmə Materialı (Taxta/Parket)
                  </td>
                  <td className="py-2.5 px-2 text-neutral-400">Ümumi Sahə</td>
                  <td className="py-2.5 px-2 text-right text-neutral-400">{(roomSize.width * roomSize.length).toFixed(1)} m²</td>
                  <td className="py-2.5 px-2 text-right text-neutral-400 font-mono">25.00 ₼</td>
                  <td className="py-2.5 pl-2 text-right font-mono font-bold text-indigo-300">
                    {((roomSize.width * roomSize.length) * 25 * (currencyRates[selectedCurrency] || 1.0)).toFixed(2)} {selectedCurrency === "AZN" ? "₼" : selectedCurrency === "USD" ? "$" : selectedCurrency === "EUR" ? "€" : selectedCurrency === "TRY" ? "₺" : "₽"}
                  </td>
                  <td className="py-2.5 pl-2"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total Sum & Actions */}
          <div className="pt-4 border-t border-white/10 mt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest block">Ümumi Yekun Qiymət</span>
              <span className="text-2xl font-black text-emerald-400 font-mono whitespace-nowrap">
                {(
                  (
                    furnitureLayers.reduce((acc, f) => acc + (f.price ?? 50), 0) +
                    customSmetaItems.reduce((acc, ci) => acc + ((ci.price ?? 0) * (ci.quantity ?? 1)), 0) +
                    (roomSize.width * roomSize.length * 25)
                  ) * 
                  (currencyRates[selectedCurrency] || 1.0)
                ).toFixed(2)} {selectedCurrency === "AZN" ? "₼" : selectedCurrency === "USD" ? "$" : selectedCurrency === "EUR" ? "€" : selectedCurrency === "TRY" ? "₺" : "₽"}
              </span>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button 
                onClick={handleExportSmeta}
                className="flex-1 sm:flex-initial bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" /> PDF Yüklə
              </button>
              <button 
                onClick={() => setShowSmeta(false)}
                className="flex-1 sm:flex-initial bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 font-bold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer text-center"
              >
                Bağla
              </button>
            </div>
          </div>

        </div>
      </div>
    )}
    </>
  );
}
