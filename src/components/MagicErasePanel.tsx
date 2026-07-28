"use client";

import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import { Sparkles, Eraser, Loader2, Undo2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function MagicErasePanel() {
  const { 
    appMode, panoramaImage, setPanoramaImage, 
    currentTourNodeId, tourNodes, setTourNodes, 
    isDefurnishedMode, setIsDefurnishedMode 
  } = useStore();
  
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMagicErase = async () => {
    if (!panoramaImage) return;
    
    // Əgər artıq təmizlənmiş rejimdəyiksə, originala qayıt
    if (isDefurnishedMode) {
      const currentNode = tourNodes.find(n => n.id === currentTourNodeId);
      if (currentNode && (currentNode.originalUrl || currentNode.panoramaUrl)) {
        setPanoramaImage(currentNode.originalUrl || currentNode.panoramaUrl);
        setIsDefurnishedMode(false);
      } else {
        alert("Orijinal şəkil tapılmadı.");
      }
      return;
    }

    // Təmizləmə prosesini başlat
    setIsProcessing(true);
    
    try {
      // Replicate GPU yaddaşının dolmaması (OOM) üçün şəkli kiçildirik (Max Genişlik: 1024)
      const resizedImage = await new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1024;
          let width = img.width;
          let height = img.height;
          
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/jpeg", 0.8));
          } else {
            reject("Canvas context not available");
          }
        };
        img.onerror = () => reject("Image load error");
        img.src = panoramaImage;
      });

      const res = await fetch("/api/inpaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          image: resizedImage
        })
      });
      const data = await res.json();
      
      if (data.success && data.url) {
        if (currentTourNodeId) {
          const updatedNodes = tourNodes.map(node => 
            node.id === currentTourNodeId ? { 
              ...node, 
              originalUrl: node.originalUrl || panoramaImage, 
              defurnishedUrl: data.url,
              panoramaUrl: data.url // Ensure legacy compatibility
            } : node
          );
          setTourNodes(updatedNodes);
        }
        
        // Avtomatik Mebelsiz rejimə keçid
        setIsDefurnishedMode(true);
        setPanoramaImage(data.url);
      } else {
        alert("Xəta: " + (data.error || "Bilinməyən xəta"));
      }
    } catch (e) {
      console.error(e);
      alert("AI bağlantısında xəta baş verdi.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (appMode !== "360-photo") return null;

  return (
    <>
      {/* 1-Click Toggle Button */}
      <button
        onClick={handleMagicErase}
        disabled={isProcessing}
        className={cn(
          "absolute top-28 md:top-24 right-3 sm:right-6 z-30 px-3.5 sm:px-5 py-2 sm:py-3 rounded-full flex items-center gap-1.5 sm:gap-2 font-bold text-xs sm:text-sm transition-all shadow-2xl border backdrop-blur-md",
          isDefurnishedMode 
            ? "bg-white/10 text-white border-white/20 hover:bg-white/20"
            : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-white/10 hover:shadow-indigo-500/25"
        )}
      >
        {isProcessing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isDefurnishedMode ? (
          <Undo2 className="w-5 h-5" />
        ) : (
          <Sparkles className="w-5 h-5" />
        )}
        {isProcessing ? "Təmizlənir..." : isDefurnishedMode ? "Orijinalı Qaytar" : "Mebeli Sil"}
      </button>

      {/* Full-screen Loading Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0f0f13]/80 backdrop-blur-md"
          >
            <div className="relative flex items-center justify-center">
               <div className="absolute w-32 h-32 bg-purple-500/30 rounded-full blur-2xl animate-pulse" />
               <Loader2 className="w-16 h-16 text-purple-400 animate-spin relative z-10" />
            </div>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 text-2xl font-bold text-white tracking-wide"
            >
              Otaq Təmizlənir...
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-3 text-neutral-400 text-sm font-medium max-w-sm text-center leading-relaxed"
            >
              Görən Süni İntellekt (LLaVa) otaqdakı bütün mebelləri təhlil edir və onları orijinal arxaplanla əvəz edir. Zəhmət olmasa 10-15 saniyə gözləyin.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
