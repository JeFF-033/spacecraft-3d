"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Star, Quote, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

export default function TestimonialsPage() {
  const reviews = [
    {
      name: "Tural Məmmədov",
      role: "Baş Memar, Baku Design Studio",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      content: "SpaceCraft 3D sayəsində müştərilərimizə canlı 3D linləri göndəririk. Layihə təsdiqləmə müddətimiz 2 həftədən 2 günə endi!",
      rating: 5
    },
    {
      name: "Nərgiz Əliyeva",
      role: "İnteryer Dizayner",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
      content: "Gemini AI inteqrasiyası sadəcə möhtəşəmdir. Mətni yazan kimi divar rəngləri və mebel kombinasiyaları avtomatik tənzimlənir.",
      rating: 5
    },
    {
      name: "Elvin Qasımov",
      role: "Kreativ Direktor, SpaceArch",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      content: "Heç bir ağır proqram yükləmədən brauzerdə 4K render almaq böyük rahatlıqdır. Bütün komandamız artıq SpaceCraft-dadır.",
      rating: 5
    }
  ];

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
          className="text-center max-w-3xl mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900 border border-white/10 text-amber-400 text-xs font-semibold mb-6 shadow-2xl">
            <Star className="w-4 h-4 fill-current" /> Memarlar Ne Deyir?
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 uppercase">
            İstifadəçi <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-300">
              Rəyləri & Təcrübələr
            </span>
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-light">
            SpaceCraft 3D istifadə edən peşəkar memar və dizaynerlərin fikirləri.
          </p>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {reviews.map((rev, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -6 }}
              className="p-8 rounded-3xl bg-neutral-900/60 border border-white/10 flex flex-col justify-between shadow-2xl backdrop-blur-xl relative group"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-6">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-neutral-300 text-sm leading-relaxed font-light italic mb-8">
                  "{rev.content}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                <img 
                  src={rev.avatar} 
                  alt={rev.name}
                  className="w-11 h-11 rounded-full object-cover border border-white/20"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{rev.name}</h4>
                  <p className="text-[11px] text-neutral-400">{rev.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link
            href="/editor"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base transition-all shadow-xl shadow-indigo-600/30"
          >
            <span>Öz Dizaynınızı Yaradın</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </main>
    </div>
  );
}
