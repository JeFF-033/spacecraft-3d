"use client";

import React, { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Lock, Mail, User, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const errorParam = searchParams.get("error");

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (errorParam) {
      if (errorParam === "CredentialsSignin") {
        setErrorMessage("E-poçt və ya şifrə yanlışdır.");
      } else {
        setErrorMessage("Giriş zamanı xəta baş verdi. Yenidən cəhd edin.");
      }
    }
  }, [errorParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Zəhmət olmasa e-poçt və şifrəni daxil edin.");
      return;
    }

    if (mode === "signup" && !name.trim()) {
      setErrorMessage("Zəhmət olmasa adınızı daxil edin.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        name: mode === "signup" ? name : undefined,
        callbackUrl,
      });

      if (res?.error) {
        setErrorMessage(res.error === "CredentialsSignin" ? "E-poçt və ya şifrə yanlışdır." : res.error);
        setIsLoading(false);
      } else if (res?.ok) {
        router.push(callbackUrl);
      }
    } catch (err: any) {
      setErrorMessage("Gözlənilməyən xəta baş verdi.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    signIn("google", { callbackUrl });
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white flex flex-col lg:flex-row relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background Glow Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[30%] w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Left Column: Visual Showcase & Brand */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-between relative z-10 border-b lg:border-b-0 lg:border-r border-white/5 bg-white/[0.01]">
        <div>
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-11 h-11 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Box className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
                SpaceCraft <span className="text-indigo-400">3D</span>
              </span>
              <p className="text-[10px] font-semibold tracking-widest text-indigo-400/80 uppercase">Interior Studio</p>
            </div>
          </Link>
        </div>

        {/* Hero Section Banner inside Left Panel */}
        <div className="my-12 lg:my-0 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Süni İntellekt Dəstəkli 3D Dizayn Platforması</span>
          </div>

          <h1 className="text-3xl lg:text-5xl font-black tracking-tight leading-[1.15]">
            Məkanlarınızı <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
              Gələcəyin 3D Mühitində
            </span> Yaradın.
          </h1>

          <p className="text-neutral-400 text-sm lg:text-base leading-relaxed">
            Fotorealistik 360° virtual turlar, interaktiv mebel yerləşdirməsi və instant rendering alətləri ilə xəyallarınızdakı interyeri saniyələr ərzində dizayn edin.
          </p>

          {/* Feature Badges */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-xs font-semibold text-neutral-300">Ultra-HD Real-Time Render</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span className="text-xs font-semibold text-neutral-300">360° Virtual Tur generatoru</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
              <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span className="text-xs font-semibold text-neutral-300">İki Faktorlu Təhlükəsizlik</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
              <CheckCircle2 className="w-4 h-4 text-pink-400 flex-shrink-0" />
              <span className="text-xs font-semibold text-neutral-300">Kollektiv İşıqlandırma</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-neutral-500">
          © {new Date().getFullYear()} SpaceCraft 3D Studio. Bütün hüquqlar qorunur.
        </div>
      </div>

      {/* Right Column: Authentication Card Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md space-y-8">
          
          {/* Card Container */}
          <div className="bg-[#121624]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            {/* Subtle Gradient Accent Line at top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            {/* Mode Switcher Tabs */}
            <div className="flex p-1 bg-white/[0.05] border border-white/5 rounded-2xl mb-8">
              <button
                type="button"
                onClick={() => { setMode("signin"); setErrorMessage(""); }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  mode === "signin"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Giriş Et
              </button>
              <button
                type="button"
                onClick={() => { setMode("signup"); setErrorMessage(""); }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  mode === "signup"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Yeni Hesab
              </button>
            </div>

            {/* Form Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white tracking-tight">
                {mode === "signin" ? "Hesabınıza Daxil Olun" : "SpaceCraft Hesabı Yaradın"}
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                {mode === "signin"
                  ? "Daha öncə yaradılmış hesabınızla daxil olun"
                  : "Dərhal pulsuz hesab yaradıb dizayna başlayın"}
              </p>
            </div>

            {/* Google Quick Login Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading}
              className="w-full py-3.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl text-xs font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50 group mb-6 shadow-sm"
            >
              {isGoogleLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google ilə Daxil Ol</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-[#121624] px-3 text-[11px] font-semibold text-neutral-500 uppercase tracking-widest absolute">
                və ya E-poçt ilə
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                    Adınız və Soyadınız
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Məsələn: Həsən Əliyev"
                      className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                  E-poçt Ünvanı
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="adiniz@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                  Şifrə
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error Box */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full mt-2 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold rounded-2xl text-sm shadow-xl shadow-indigo-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{mode === "signin" ? "Daxil Ol" : "Qeydiyyatı Tamamla"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Security Note */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] text-neutral-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-bit SSL ilə şifrələnmiş təhlükəsiz bağlantı</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
