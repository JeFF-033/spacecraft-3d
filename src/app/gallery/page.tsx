"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Eye, Download, X, Heart, Share2, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const projects = [
    {
      id: 1,
      title: "Minimalist Yataq Otağı",
      category: "bedroom",
      image: "/images/gallery_bedroom.png",
      designer: "Sarah Jenkins",
      likes: 1240,
      renderRes: "4K UHD (3840x2160)",
      description: "Təbii ağac teksturları, gizli LED işıqlandırma və yapon minimalizmindən ilhamlanmış yataq otağı interyeri."
    },
    {
      id: 2,
      title: "Japandi Sakitlik Konsepti",
      category: "japandi",
      image: "/images/gallery_japandi.png",
      designer: "Alex Rivera",
      likes: 2430,
      renderRes: "4K UHD (3840x2160)",
      description: "Skandinaviya funksionallığı və Yapon estetikasının vəhdəti. Təbii çınqıl və ceviz tonları."
    },
    {
      id: 3,
      title: "Lüks Mətbəx & Ada",
      category: "kitchen",
      image: "/images/gallery_kitchen.png",
      designer: "Elena Rostova",
      likes: 3120,
      renderRes: "4K UHD (3840x2160)",
      description: "Carrara mərmər adası, mat qara kran vurğuları və daxili işıqlandırmalı şüşə vitrinlər."
    },
    {
      id: 4,
      title: "Modern Loft & Studio",
      category: "loft",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      designer: "Marco Polo",
      likes: 980,
      renderRes: "4K UHD (3840x2160)",
      description: "Hündür tavanlı loft interyeri, sənaye üslubunda kərpic divarlar və dəri mebel kombinasiyaları."
    },
    {
      id: 5,
      title: "Cyberpunk Night Penthouse",
      category: "loft",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      designer: "Devon Chen",
      likes: 1840,
      renderRes: "8K Ultra Render",
      description: "Şəhər mənzərəli lüks penthouse, neon ambians və ultra-müasir futuristik mebel dəsti."
    },
    {
      id: 6,
      title: "Skandinaviya Qonaq Otağı",
      category: "kitchen",
      image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
      designer: "Astrid Lindgren",
      likes: 4210,
      renderRes: "4K UHD (3840x2160)",
      description: "Geniş pəncərəli günəşli qonaq otağı, açıq meşə ağacı mebelləri və neytral parça rəngləri."
    }
  ];

  const filteredProjects = activeCategory === "all" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#09090B] text-neutral-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center relative z-10">
        
        {/* Ambient Glows */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[160px] pointer-events-none -z-10 animate-ambient-glow"></div>
        <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none -z-10 animate-ambient-glow"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900 border border-white/10 text-indigo-400 text-xs font-semibold mb-6 shadow-2xl">
            <Sparkles className="w-4 h-4" /> 4K Render Kolleksiyaları
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 uppercase">
            SpaceCraft 3D <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-300">
              İlham Qalereyası
            </span>
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-light">
            Dünyanın dörd bir yanından memarlar tərəfindən SpaceCraft platformasında yaradılmış canlı 3D layihələr. Şəkillərə klikləyərək böyük ölçüdə baxın və ya editor-da açın.
          </p>
        </motion.div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {[
            { id: "all", label: "Bütün Layihələr" },
            { id: "bedroom", label: "Yataq Otağı" },
            { id: "japandi", label: "Japandi & Minimalist" },
            { id: "kitchen", label: "Mətbəx & Qonaq Otağı" },
            { id: "loft", label: "Loft & Penthouse" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
                activeCategory === cat.id
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30 scale-105"
                  : "bg-neutral-900/80 text-neutral-400 border-white/10 hover:text-white hover:border-white/25"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {filteredProjects.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              onClick={() => setSelectedProject(item)}
              className="group relative rounded-3xl overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl aspect-[4/3] cursor-pointer"
            >
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 flex flex-col justify-end">
                <div className="flex items-center gap-2 text-xs font-mono text-indigo-300 mb-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Dizayner: {item.designer}</span>
                </div>
                <h4 className="text-xl font-bold text-white">{item.title}</h4>
                
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10 text-xs text-neutral-400">
                  <span className="flex items-center gap-1 text-rose-400 font-semibold">
                    <Heart className="w-3.5 h-3.5 fill-current" /> {item.likes}
                  </span>
                  <span className="text-indigo-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Böyük Bax</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </main>

      {/* 4K LIGHTBOX PREVIEW MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl rounded-3xl bg-neutral-900 border border-white/15 overflow-hidden shadow-2xl flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left Image Canvas */}
              <div className="w-full md:w-3/5 aspect-[4/3] md:aspect-auto relative bg-black flex items-center justify-center">
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title}
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Right Sidebar Details */}
              <div className="w-full md:w-2/5 p-6 sm:p-8 flex flex-col justify-between bg-neutral-950/90 border-l border-white/10">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                      {selectedProject.renderRes}
                    </span>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white flex items-center justify-center border border-white/10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">{selectedProject.title}</h3>
                  <p className="text-xs font-mono text-neutral-400 mb-4">Dizayner: {selectedProject.designer}</p>
                  
                  <p className="text-xs text-neutral-300 leading-relaxed mb-6 font-light border-t border-white/10 pt-4">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/editor"
                    className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                  >
                    <span>SpaceCraft Editor-da Aç & Remix Et</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href={selectedProject.image}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors border border-white/10 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>4K Render Şəklini Yüklə</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
