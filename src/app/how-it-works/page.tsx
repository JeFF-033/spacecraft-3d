"use client";

import React from "react";
import Link from "next/link";
import { Box, ArrowRight, Sparkles, Layers, Wand2, Shield, Play } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      title: "Otaq Ölçülərini Və ya 2D Planı Daxil Edin",
      description: "Otağınızın kvadratını daxil edin və ya mövcud 2D plan şəklini yükləyin. SpaceCraft avtomatik olaraq 3D divarları və döşəməni formalaşdırır.",
      accent: "from-zinc-100 to-zinc-400 text-zinc-950"
    },
    {
      number: "02",
      title: "AI Və Ya Kataloqdan Mebelləri Seçin",
      description: "Gemini AI Asistentindən 'Modern Japandi stili' istəyin və ya 10,000+ peşəkar 3D mebel kataloqundan istədiyiniz parçaları səhnəyə sürüşdürüb yerləşdirin.",
      accent: "from-zinc-200 to-zinc-500 text-zinc-950"
    },
    {
      number: "03",
      title: "Material, Rəng Və İşıqlandırmanı Tənzimləyin",
      description: "Mərmər, ceviz ağacı, velvet parçalar və spetral işıqlandırma rejimləri ilə otağın atmosferini tam arzuladığınız formaya gətirin.",
      accent: "from-zinc-300 to-zinc-600 text-zinc-950"
    },
    {
      number: "04",
      title: "Canlı Nümayiş Və 4K Render Alın",
      description: "Müştərinizə canlı 3D linki göndərin və ya tək bir kliklə 4K fotorealistik render şəkillərini və smeta PDF hesabatını çıxarın.",
      accent: "from-white to-zinc-400 text-zinc-950"
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 font-sans selection:bg-white selection:text-zinc-950 relative overflow-x-hidden">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center relative z-10">
        
        {/* Ambient Glows */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[160px] pointer-events-none -z-10 animate-ambient-glow"></div>
        <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-zinc-400/5 rounded-full blur-[160px] pointer-events-none -z-10 animate-ambient-glow"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-zinc-300 text-xs font-semibold mb-6 shadow-2xl">
            <Wand2 className="w-4 h-4 text-zinc-300" /> 4 Sadə Addımda Dizayn
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 uppercase">
            SpaceCraft 3D <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-300 to-zinc-500">
              Necə İşləyir?
            </span>
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-light">
            Mürəkkəb 3D proqramlarını öyrənməyə aylar xərcləməyin. Brauzerinizdə dəqiqələr içində ilk peşəkar dizaynınızı tamamlayın.
          </p>
        </motion.div>

        {/* Step Timeline */}
        <div className="space-y-12 w-full max-w-4xl">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="p-8 sm:p-10 rounded-3xl bg-zinc-900/60 border border-white/10 hover:border-white/20 transition-all shadow-2xl backdrop-blur-xl relative flex flex-col md:flex-row items-start md:items-center gap-8 group"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${step.accent} flex items-center justify-center text-2xl font-black shrink-0 shadow-lg shadow-black/50 group-hover:scale-105 transition-transform`}>
                {step.number}
              </div>

              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-light">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <Link
            href="/editor"
            className="inline-flex items-center gap-3 px-9 py-4 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 font-extrabold text-base transition-all shadow-xl shadow-white/10 hover:scale-105"
          >
            <span>Dərhal Dizayna Başla</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </main>
    </div>
  );
}
