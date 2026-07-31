"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Box, ArrowRight, Loader2, Sparkles, Shield, Zap, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";

export default function PricingPage() {
  const { data: session } = useSession();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (plan: "PRO" | "ENTERPRISE") => {
    if (!session) {
      signIn();
      return;
    }

    setLoadingPlan(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, billingCycle }),
      });
      const data = await res.json();

      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Ödəniş sessiyası yaradıla bilmədi. Zəhmət olmasa təkrarlayın.");
      }
    } catch (err) {
      console.error(err);
      alert("Xəta baş verdi. Zəhmət olmasa bir az sonra yenidən cəhd edin.");
    } finally {
      setLoadingPlan(null);
    }
  };

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
            <Sparkles className="w-4 h-4" /> Şəffaf Və Sərfəli Qiymətlər
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 uppercase">
            Ehtiyacınıza Uyğun <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-300">
              Şəffaf Tariflər
            </span>
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-light">
            Heç bir gizli ödəniş yoxdur. İstədiyiniz planı seçin və 3D memarlıq imkanlarından tam istifadə edin.
          </p>
        </motion.div>

        {/* MONTHLY / YEARLY BILLING TOGGLE */}
        <div className="flex items-center gap-4 bg-neutral-900/90 p-1.5 rounded-full border border-white/15 mb-16 shadow-2xl backdrop-blur-md">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
              billingCycle === "monthly"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Aylıq Ödəniş
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              billingCycle === "yearly"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <span>İllik Ödəniş</span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
              20% Qənaət
            </span>
          </button>
        </div>

        {/* PRICING CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl items-stretch mb-24">
          
          {/* FREE PLAN */}
          <motion.div 
            whileHover={{ y: -6 }}
            className="p-8 rounded-3xl bg-neutral-900/60 border border-white/10 flex flex-col justify-between shadow-2xl backdrop-blur-xl"
          >
            <div>
              <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-2">Başlanğıc</div>
              <h3 className="text-2xl font-bold text-white mb-2">Həvəskar</h3>
              <p className="text-xs text-neutral-400 mb-6">Fərdi istifadə və sınaq dizaynları üçün</p>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-white">₼0</span>
                <span className="text-xs text-neutral-400 font-mono">/ həmişə pulsuz</span>
              </div>

              <ul className="space-y-3.5 text-xs text-neutral-300 border-t border-white/10 pt-6">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>3 Aktiv 3D Səhnə Layihəsi</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1080p Standart Render</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Əsas Mebel Kataloqu (1,000+ obyekt)</span>
                </li>
              </ul>
            </div>

            <Link 
              href="/editor" 
              className="mt-10 w-full py-3.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors text-center border border-white/10 block"
            >
              Pulsuz Başla
            </Link>
          </motion.div>

          {/* PRO PLAN - HIGHLIGHTED */}
          <motion.div 
            whileHover={{ y: -8 }}
            className="p-8 rounded-3xl bg-neutral-900/90 border-2 border-indigo-500 shadow-2xl shadow-indigo-600/25 backdrop-blur-xl relative flex flex-col justify-between"
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-[10px] uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
              ən populyar • pro memar
            </div>

            <div>
              <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest mb-2 mt-2">Peşəkar</div>
              <h3 className="text-2xl font-bold text-white mb-2">PRO Memar</h3>
              <p className="text-xs text-neutral-400 mb-6">Frilans memarlar və studiyalar üçün</p>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black text-white">
                  {billingCycle === "monthly" ? "₼39" : "₼31"}
                </span>
                <span className="text-xs text-neutral-400 font-mono">/ aylıq</span>
              </div>

              <ul className="space-y-3.5 text-xs text-neutral-200 border-t border-white/10 pt-6">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Sonsuz 3D Layihələr Və Səhnələr</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>4K Photorealistic Real-Time Render</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Sonsuz Gemini AI Generasiya</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Canlı Multiplayer Kollaborasiya</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Avtomatik Smeta Və PDF Export</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleCheckout("PRO")}
              disabled={loadingPlan === "PRO"}
              className="mt-10 w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loadingPlan === "PRO" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{session ? "PRO Plana Keç" : "Giriş Et Və Sifariş Et"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </motion.div>

          {/* ENTERPRISE PLAN */}
          <motion.div 
            whileHover={{ y: -6 }}
            className="p-8 rounded-3xl bg-neutral-900/60 border border-white/10 flex flex-col justify-between shadow-2xl backdrop-blur-xl"
          >
            <div>
              <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-2">Korporativ</div>
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
              <p className="text-xs text-neutral-400 mb-6">Böyük tikinti və dizayn şirkətləri üçün</p>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-white">
                  {billingCycle === "monthly" ? "₼129" : "₼99"}
                </span>
                <span className="text-xs text-neutral-400 font-mono">/ aylıq</span>
              </div>

              <ul className="space-y-3.5 text-xs text-neutral-300 border-t border-white/10 pt-6">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Bütün PRO Xüsusiyyətlər</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Xüsusi Şirkət Breandinqi Və Logo</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Xüsusi API Və Server Dəstəyi</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>7/24 Şəxsi Menecer Dəstəyi</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleCheckout("ENTERPRISE")}
              disabled={loadingPlan === "ENTERPRISE"}
              className="mt-10 w-full py-3.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors border border-white/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loadingPlan === "ENTERPRISE" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>Korporativ Sifariş Et</span>
              )}
            </button>
          </motion.div>

        </div>

        {/* DETAILED FEATURE COMPARISON MATRIX TABLE */}
        <div className="w-full max-w-5xl rounded-3xl border border-white/10 bg-neutral-900/80 backdrop-blur-xl p-8 shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-6 text-center">Planların Müqayisə Cədvəli</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400 font-mono uppercase text-[10px]">
                  <th className="py-3 px-4">Xüsusiyyətlər</th>
                  <th className="py-3 px-4 text-center">Həvəskar</th>
                  <th className="py-3 px-4 text-center text-indigo-400 font-bold">PRO Memar</th>
                  <th className="py-3 px-4 text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-neutral-300 font-light">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">3D Səhnə Limiti</td>
                  <td className="py-3.5 px-4 text-center">3 Səhnə</td>
                  <td className="py-3.5 px-4 text-center font-bold text-indigo-400">Sonsuz</td>
                  <td className="py-3.5 px-4 text-center">Sonsuz</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Render Keyfiyyəti</td>
                  <td className="py-3.5 px-4 text-center">1080p</td>
                  <td className="py-3.5 px-4 text-center font-bold text-indigo-400">4K Ultra HD</td>
                  <td className="py-3.5 px-4 text-center">8K Max UHD</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Gemini AI Dəstəyi</td>
                  <td className="py-3.5 px-4 text-center">Məhdud (5/gün)</td>
                  <td className="py-3.5 px-4 text-center font-bold text-indigo-400">Sonsuz</td>
                  <td className="py-3.5 px-4 text-center">Sonsuz + Custom AI</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Smeta Və PDF İxracı</td>
                  <td className="py-3.5 px-4 text-center">❌</td>
                  <td className="py-3.5 px-4 text-center font-bold text-emerald-400">✔ Var</td>
                  <td className="py-3.5 px-4 text-center font-bold text-emerald-400">✔ Var</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Multiplayer Canlı İş</td>
                  <td className="py-3.5 px-4 text-center">❌</td>
                  <td className="py-3.5 px-4 text-center font-bold text-emerald-400">✔ Var</td>
                  <td className="py-3.5 px-4 text-center font-bold text-emerald-400">✔ Var</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
