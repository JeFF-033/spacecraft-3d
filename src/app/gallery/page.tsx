"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Eye, Download, Filter } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const projects = [
    {
      id: 1,
      title: "Minimalist Yataq Otağı",
      category: "bedroom",
      image: "/images/gallery_bedroom.png",
      designer: "Sarah Jenkins",
      likes: "1.2k"
    },
    {
      id: 2,
      title: "Japandi Sakitlik Konsepti",
      category: "japandi",
      image: "/images/gallery_japandi.png",
      designer: "Alex Rivera",
      likes: "2.4k"
    },
    {
      id: 3,
      title: "Lüks Mətbəx & Ada",
      category: "kitchen",
      image: "/images/gallery_kitchen.png",
      designer: "Elena Rostova",
      likes: "3.1k"
    },
    {
      id: 4,
      title: "Modern Lofts & Studio",
      category: "bedroom",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      designer: "Marco Polo",
      likes: "980"
    },
    {
      id: 5,
      title: "Cyberpunk Night Penthouse",
      category: "japandi",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      designer: "Devon Chen",
      likes: "1.8k"
    },
    {
      id: 6,
      title: "Skandinaviya Qonaq Otağı",
      category: "kitchen",
      image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
      designer: "Astrid Lindgren",
      likes: "4.2k"
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
            Dünyanın dörd bir yanından memarlar tərəfindən SpaceCraft platformasında yaradılmış canlı 3D layihələr.
          </p>
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
              activeCategory === "all"
                ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30"
                : "bg-neutral-900 text-neutral-400 border-white/10 hover:text-white"
            }`}
          >
            Bütün Layihələr
          </button>
          <button
            onClick={() => setActiveCategory("bedroom")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
              activeCategory === "bedroom"
                ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30"
                : "bg-neutral-900 text-neutral-400 border-white/10 hover:text-white"
            }`}
          >
            Yataq Otağı
          </button>
          <button
            onClick={() => setActiveCategory("japandi")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
              activeCategory === "japandi"
                ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30"
                : "bg-neutral-900 text-neutral-400 border-white/10 hover:text-white"
            }`}
          >
            Japandi & Minimalist
          </button>
          <button
            onClick={() => setActiveCategory("kitchen")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
              activeCategory === "kitchen"
                ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30"
                : "bg-neutral-900 text-neutral-400 border-white/10 hover:text-white"
            }`}
          >
            Mətbəx & Qonaq Otağı
          </button>
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
              className="group relative rounded-3xl overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl aspect-[4/3]"
            >
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 flex flex-col justify-end">
                <span className="text-xs font-mono text-indigo-400">Dizayner: {item.designer}</span>
                <h4 className="text-xl font-bold text-white mt-1">{item.title}</h4>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10 text-xs text-neutral-400">
                  <span>❤️ {item.likes} bəyənmə</span>
                  <Link 
                    href="/editor" 
                    className="text-white hover:text-indigo-300 font-bold flex items-center gap-1"
                  >
                    <span>Remix Et</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </main>
    </div>
  );
}
