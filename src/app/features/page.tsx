"use client";

import React from "react";
import Link from "next/link";
import { 
  Sparkles, Users, Layers, Camera, FileText, Share2, 
  Zap, Shield, Cpu, Globe, ArrowRight, Check 
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

export default function FeaturesPage() {
  const featuresList = [
    {
      icon: Sparkles,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      title: "AI Dəstəkli Dizayn Motoru",
      description: "Otağınızın ölçülərini və istədiyiniz stili yazın, Gemini AI bir saniyədə ideal mebel yerləşimi və material kombinasiyalarını təklif etsin."
    },
    {
      icon: Users,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      title: "Canlı Multi-Player Kollaborasiya",
      description: "Eynilə Figma kimi, müştəriləriniz və ya komandanızla eyni 3D səhnədə eyni anda kursor hərəkətlərini görərək işləyin."
    },
    {
      icon: Layers,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      title: "2D Plan -> 3D Modelləmə",
      description: "2D floorplan çəkin və ya skan olunmuş planı yükləyin, SpaceCraft avtomatik olaraq divarları və 3D otaq hacmini generasiya etsin."
    },
    {
      icon: Zap,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      title: "Magic Erase (Ağıllı Silmə)",
      description: "İstəmədiyiniz obyektləri və ya mebelləri tək bir kliklə səhnədən silin, AI arxa fonu avtomatik bərpa etsin."
    },
    {
      icon: Camera,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      title: "4K Photorealistic Render",
      description: "Bulud serverlərinin gücü ilə saniyələr içində fotorealistik 4K renders hazırlayın və işıq effektlərini tənzimləyin."
    },
    {
      icon: FileText,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
      title: "Avtomatik Smeta Və PDF",
      description: "İstifadə olunan bütün mebel və materialların dəqiq smetasını, qiymət cədvəlini və PDF hesabatını tək kliklə ixrac edin."
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-neutral-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      <Navbar />

      {/* Hero Header */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center relative z-10">
        
        {/* Ambient Glows */}
        <div className="absolute top-10 left-1/3 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[160px] pointer-events-none -z-10 animate-ambient-glow"></div>
        <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none -z-10 animate-ambient-glow"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900 border border-white/10 text-indigo-400 text-xs font-semibold mb-6 shadow-2xl">
            <Sparkles className="w-4 h-4" /> SpaceCraft 3D Özəllikləri
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 uppercase">
            Sonsuz Memarlıq <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-300">
              İmkanları
            </span>
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-light">
            Hər bir detal peşəkar 3D interyer dizayn işinizi sürətləndirmək, müştərilərinizi heyran etmək və komanda ilə eyni anda işləmək üçün hazırlanmışdır.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {featuresList.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="p-8 rounded-3xl bg-neutral-900/60 border border-white/10 hover:border-indigo-500/40 transition-all shadow-2xl backdrop-blur-xl relative group"
              >
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${item.color}`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed font-light">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Call-to-action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-24 p-10 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-neutral-900 to-purple-950/80 border border-white/15 text-center max-w-4xl w-full shadow-2xl relative overflow-hidden"
        >
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
            Bütün bu alətləri brauzerinizdə pulsuz sınayın
          </h2>
          <p className="text-neutral-400 text-sm max-w-xl mx-auto mb-8">
            Heç bir yükləmə tələb olunmur. Saniyələr içində ilk 3D səhnənizi yaradın.
          </p>
          <Link
            href="/editor"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base transition-all shadow-xl shadow-indigo-600/30"
          >
            <span>Dizayn Editorunu Aç</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

      </main>
    </div>
  );
}
