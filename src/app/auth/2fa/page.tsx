"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Shield, KeyRound, AlertCircle, ArrowLeft, CheckCircle, Mail, Smartphone, RefreshCw } from "lucide-react";

export default function TwoFactorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [method, setMethod] = useState<"EMAIL" | "SMS" | "AUTHENTICATOR">("EMAIL");
  const [activeMethods, setActiveMethods] = useState<("EMAIL" | "SMS" | "AUTHENTICATOR")[]>([]);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Automatically trigger code send on mount for email and SMS
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    } 
    
    if (status === "authenticated") {
      if (!(session?.user as any)?.twoFactorEnabled) {
        router.push("/dashboard");
        return;
      }

      // If already verified in this session, go to dashboard
      if (typeof window !== "undefined" && sessionStorage.getItem("spacecraft_2fa_verified") === "true") {
        router.push("/dashboard");
        return;
      }

      // Find active methods
      const u = session.user as any;
      const methods: ("EMAIL" | "SMS" | "AUTHENTICATOR")[] = [];
      if (u.twoFactorEmailEnabled) methods.push("EMAIL");
      if (u.twoFactorSmsEnabled) methods.push("SMS");
      if (u.twoFactorAuthenticatorEnabled) methods.push("AUTHENTICATOR");

      // Fallback to legacy structures if none are explicitly set
      if (methods.length === 0) {
        methods.push(u.twoFactorMethod || "EMAIL");
      }

      setActiveMethods(methods);
      const defaultMethod = methods[0] || "EMAIL";
      setMethod(defaultMethod);

      if (defaultMethod === "EMAIL" || defaultMethod === "SMS") {
        sendCode(defaultMethod, false);
      } else {
        setInfoMessage("Google Authenticator tətbiqinizdə görünən 6 rəqəmli doğrulama kodunu daxil edin.");
      }
    }
  }, [status, session, router]);

  const sendCode = async (selectedMethod: "EMAIL" | "SMS" | "AUTHENTICATOR", isResend = false) => {
    if (isResend) setIsResending(true);
    setError("");

    try {
      const res = await fetch("/api/user/2fa/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: selectedMethod }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kod göndərilə bilmədi.");

      setInfoMessage(data.message || "Doğrulama kodu göndərildi.");
      if (isResend) {
        // Reset code fields
        setCode(Array(6).fill(""));
        inputRefs.current[0]?.focus();
      }
    } catch (err: any) {
      setError(err.message || "Kod göndərilərkən xəta baş verdi.");
    } finally {
      if (isResend) setIsResending(false);
    }
  };

  const handleSelectMethod = (selected: "EMAIL" | "SMS" | "AUTHENTICATOR") => {
    if (selected === method) return;
    setMethod(selected);
    setCode(Array(6).fill(""));
    setError("");
    
    if (selected === "EMAIL" || selected === "SMS") {
      sendCode(selected, false);
    } else {
      setInfoMessage("Google Authenticator tətbiqinizdə görünən 6 rəqəmli doğrulama kodunu daxil edin.");
    }
  };

  const handleChange = (index: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return; // Only allow digits

    const newCode = [...code];
    newCode[index] = val;
    setCode(newCode);
    setError("");

    // Auto-focus next input
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedData)) return setError("Zəhmət olmasa 6 rəqəmli kodu kopyalayın.");

    const digits = pastedData.split("");
    setCode(digits);
    setError("");
    inputRefs.current[5]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");

    if (fullCode.length < 6) {
      return setError("Zəhmət olmasa 6 rəqəmli doğrulama kodunu tam daxil edin.");
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/user/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: fullCode, method }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kod yoxlanılarkən xəta baş verdi.");

      setIsSuccess(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("spacecraft_2fa_verified", "true");
      }
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Kod doğrulana bilmədi. Zəhmət olmasa yenidən yoxlayın.");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-neutral-300 border-t-neutral-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderIcon = () => {
    switch (method) {
      case "EMAIL":
        return <Mail className="w-5 h-5 text-indigo-500 animate-pulse" />;
      case "SMS":
        return <Smartphone className="w-5 h-5 text-amber-500 animate-pulse" />;
      case "AUTHENTICATOR":
        return <Shield className="w-5 h-5 text-emerald-500 animate-pulse" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-neutral-900 font-sans selection:bg-[#E5DCC5] flex flex-col justify-center items-center p-6">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <div className="w-full max-w-md bg-white border border-[#E5DCC5] rounded-3xl p-8 shadow-xl relative overflow-hidden">
        {isSuccess ? (
          <div className="py-8 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-black text-neutral-900 mb-2">Giriş Təsdiqləndi!</h2>
            <p className="text-neutral-500">Müvəffəqiyyətlə daxil oldunuz. Yönləndirilirsiniz...</p>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-neutral-950 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-4">
                {renderIcon()}
              </div>
              <h1 className="text-2xl font-black tracking-tight text-neutral-950">İki Faktorlu Giriş</h1>
              
              {/* Method Selector Tabs if multiple are active */}
              {activeMethods.length > 1 && (
                <div className="flex justify-center gap-1 p-1 bg-neutral-100 rounded-xl max-w-xs mx-auto mb-4 border border-[#E5DCC5]/40">
                  {activeMethods.includes("EMAIL") && (
                    <button
                      type="button"
                      onClick={() => handleSelectMethod("EMAIL")}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${method === "EMAIL" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-900"}`}
                    >
                      📧 E-poçt
                    </button>
                  )}
                  {activeMethods.includes("SMS") && (
                    <button
                      type="button"
                      onClick={() => handleSelectMethod("SMS")}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${method === "SMS" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-900"}`}
                    >
                      📱 SMS
                    </button>
                  )}
                  {activeMethods.includes("AUTHENTICATOR") && (
                    <button
                      type="button"
                      onClick={() => handleSelectMethod("AUTHENTICATOR")}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${method === "AUTHENTICATOR" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-900"}`}
                    >
                      🔐 Tətbiq
                    </button>
                  )}
                </div>
              )}

              <p className="text-xs text-neutral-500 max-w-xs mx-auto min-h-[36px]">
                {infoMessage || "Təhlükəsizlik kodunu daxil edin."}
              </p>
            </div>

            <div className="space-y-4">
              <label className="block text-center text-xs font-bold uppercase tracking-wider text-neutral-500">
                Doğrulama Kodu (6 Rəqəm)
              </label>
              
              <div className="flex justify-center gap-2" onPaste={handlePaste}>
                {code.map((num, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={num}
                    ref={(el) => {
                      if (el) inputRefs.current[idx] = el;
                    }}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-[#E5DCC5] bg-[#FAFAF8] focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all"
                  />
                ))}
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold animate-shake">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading || isResending}
                className="w-full py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 text-indigo-400" />
                    Girişi Təsdiqlə
                  </>
                )}
              </button>

              {(method === "EMAIL" || method === "SMS") && (
                <button
                  type="button"
                  onClick={() => sendCode(method, true)}
                  disabled={isLoading || isResending}
                  className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`} />
                  {isResending ? "Göndərilir..." : "Kodu yenidən göndər"}
                </button>
              )}
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Başqa hesabla daxil ol
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
