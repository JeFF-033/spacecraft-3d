"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Settings as SettingsIcon, CreditCard, Bell, Shield, CheckCircle, AlertCircle, Camera as CameraIcon } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"account" | "billing" | "engine" | "notifications" | "security">("account");

  // Zustand store properties & actions
  const gridColor = useStore((state) => state.gridColor);
  const setGridColor = useStore((state) => state.setGridColor);
  const storeGridSnapSize = useStore((state) => state.gridSnapSize);
  const storeShadowQuality = useStore((state) => state.shadowQuality);
  const storeCameraSensitivity = useStore((state) => state.cameraSensitivity);

  // Profile fields state
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Sync profile fields when session is fetched
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setImage(session.user.image || "");
      setIs2faEnabled(!!(session.user as any).twoFactorEnabled);
      setIsEmail2faEnabled(!!(session.user as any).twoFactorEmailEnabled);
      setIsSms2faEnabled(!!(session.user as any).twoFactorSmsEnabled);
      setIsAuthenticator2faEnabled(!!(session.user as any).twoFactorAuthenticatorEnabled);
      setTwoFactorMethod((session.user as any).twoFactorMethod || "EMAIL");
      
      const savedPhone = (session.user as any).twoFactorPhone || "";
      setTwoFactorPhone(savedPhone);
      
      if (savedPhone) {
        const prefixes = ["+994", "+90", "+1", "+44", "+7", "+49", "+995"];
        let matched = false;
        for (const p of prefixes) {
          if (savedPhone.startsWith(p)) {
            setCountryCode(p);
            setRawPhoneNumber(savedPhone.substring(p.length));
            matched = true;
            break;
          }
        }
        if (!matched) {
          setCountryCode("+994");
          setRawPhoneNumber(savedPhone);
        }
      } else {
        setCountryCode("+994");
        setRawPhoneNumber("");
      }
    }
  }, [session]);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Billing state
  const [isBillingLoading, setIsBillingLoading] = useState(false);

  // Engine preferences state
  const [autosaveInterval, setAutosaveInterval] = useState("5");
  const [snapGridSize, setSnapGridSize] = useState(0.5);
  const [renderQuality, setRenderQuality] = useState<"high" | "medium" | "low">("high");
  const [cameraSensitivity, setCameraSensitivity] = useState(50);

  // Notification settings state
  const [emailReports, setEmailReports] = useState(true);
  const [collabAlerts, setCollabAlerts] = useState(true);
  const [marketingUpdates, setMarketingUpdates] = useState(false);

  // Security state (password change & 2FA)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isToggling2fa, setIsToggling2fa] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState<"EMAIL" | "SMS" | "AUTHENTICATOR">("EMAIL");
  const [twoFactorPhone, setTwoFactorPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+994");
  const [rawPhoneNumber, setRawPhoneNumber] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [setupCode, setSetupCode] = useState("");
  const [isSettingUpQr, setIsSettingUpQr] = useState(false);
  const [isVerifyingSetup, setIsVerifyingSetup] = useState(false);
  const [isEmail2faEnabled, setIsEmail2faEnabled] = useState(false);
  const [isSms2faEnabled, setIsSms2faEnabled] = useState(false);
  const [isAuthenticator2faEnabled, setIsAuthenticator2faEnabled] = useState(false);
  const [setupMethod, setSetupMethod] = useState<"EMAIL" | "SMS" | "AUTHENTICATOR" | null>(null);

  // Load preferences from localStorage/store on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setAutosaveInterval(localStorage.getItem("spacecraft_autosave_interval") || "5");
      setSnapGridSize(storeGridSnapSize);
      setRenderQuality(storeShadowQuality);
      setCameraSensitivity(storeCameraSensitivity);

      // Notification settings
      setEmailReports(localStorage.getItem("spacecraft_notif_reports") !== "false");
      setCollabAlerts(localStorage.getItem("spacecraft_notif_collab") !== "false");
      setMarketingUpdates(localStorage.getItem("spacecraft_notif_marketing") === "true");
    }
  }, [storeGridSnapSize, storeShadowQuality, storeCameraSensitivity]);

  // Yoxlanılmamış istifadəçini ana səhifəyə və ya 2FA-ya yönləndir
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated" && (session?.user as any)?.twoFactorEnabled) {
      const isVerified = sessionStorage.getItem("spacecraft_2fa_verified") === "true";
      if (!isVerified) {
        router.push("/auth/2fa");
      }
    }
  }, [status, session, router]);

  // Ref for camera image upload input
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (status === "unauthenticated" || status === "loading") {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-neutral-800 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const getTabButtonClass = (tab: typeof activeTab) => {
    const base = "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 cursor-pointer text-left text-sm ";
    if (activeTab === tab) {
      return base + "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] border border-indigo-400/30 scale-[1.02]";
    }
    return base + "text-neutral-400 hover:bg-white/[0.04] hover:text-white border border-transparent";
  };

  // Profile Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fayl yüklənə bilmədi");

      setImage(data.url);
      
      // Auto-save the new image to user profile in database
      const resUpdate = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image: data.url }),
      });
      if (resUpdate.ok) {
        await update({ name, image: data.url });
      }

      showToast("Profil şəkli yeniləndi!", "success");
    } catch (err: any) {
      showToast(err.message || "Yükləmə xətası baş verdi", "error");
    } finally {
      setIsUploading(false);
    }
  };

  // Save Account Info
  const handleSaveAccount = async () => {
    if (!name.trim()) return showToast("Ad və soyad boş ola bilməz.", "error");

    setIsSavingProfile(true);
    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Məlumatlar yadda saxlanılmadı");

      // Update local NextAuth session instantly
      await update({ name, image });

      showToast("Profil məlumatlarınız uğurla yeniləndi! 🚀", "success");
    } catch (err: any) {
      showToast(err.message || "Yadda saxlanılarkən xəta baş verdi", "error");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Stripe Billing Portal Redirect
  const handleStripePortal = async () => {
    setIsBillingLoading(true);
    try {
      const res = await fetch("/api/billing/portal", {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.code === "NO_CUSTOMER") {
          showToast("Ödəniş profiliniz yoxdur. Abunəlik səhifəsinə yönləndirilirsiniz...", "success");
          setTimeout(() => {
            router.push("/pricing");
          }, 1500);
          return;
        }
        throw new Error(data.error || "Portal açılarkən xəta");
      }

      window.location.href = data.url;
    } catch (err: any) {
      showToast(err.message || "Stripe billing portalı açılarkən xəta baş verdi", "error");
    } finally {
      setIsBillingLoading(false);
    }
  };

  // Save Engine Preferences
  const handleSaveEngine = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("spacecraft_autosave_interval", autosaveInterval);
      localStorage.setItem("spacecraft_snap_grid", snapGridSize.toString());
      localStorage.setItem("spacecraft_render_quality", renderQuality);
      localStorage.setItem("spacecraft_camera_sensitivity", cameraSensitivity.toString());

      setGridColor(gridColor);
      
      showToast("Mühərrik tənzimləmələri yadda saxlanıldı!", "success");
    }
  };

  // Save Notification Preferences
  const handleSaveNotifications = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("spacecraft_notif_reports", emailReports.toString());
      localStorage.setItem("spacecraft_notif_collab", collabAlerts.toString());
      localStorage.setItem("spacecraft_notif_marketing", marketingUpdates.toString());
      showToast("Bildiriş tənzimləmələri yeniləndi!", "success");
    }
  };

  // Change Password
  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return showToast("Bütün şifrə xanalarını doldurun.", "error");
    }
    if (newPassword !== confirmPassword) {
      return showToast("Yeni şifrələr üst-üstə düşmür.", "error");
    }
    if (newPassword.length < 6) {
      return showToast("Yeni şifrə ən azı 6 simvol olmalıdır.", "error");
    }

    setIsSavingPassword(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Şifrə dəyişdirilə bilmədi");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast("Şifrəniz uğurla yeniləndi! 🔐", "success");
    } catch (err: any) {
      showToast(err.message || "Xəta baş verdi", "error");
    } finally {
      setIsSavingPassword(false);
    }
  };

  // Setup Authenticator
  const handleSetupAuthenticator = async () => {
    setIsSettingUpQr(true);
    try {
      const res = await fetch("/api/user/2fa/setup", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authenticator hazırlana bilmədi");

      setQrCodeUrl(data.qrCodeUrl);
      if (data.secret) {
        await update({ twoFactorSecret: data.secret });
      }
    } catch (err: any) {
      showToast(err.message || "QR Kod yaradılarkən xəta baş verdi", "error");
    } finally {
      setIsSettingUpQr(false);
    }
  };

  // Send 2FA verification code
  const handleSend2faCode = async (method: "EMAIL" | "SMS") => {
    let fullPhone = "";
    if (method === "SMS") {
      const cleaned = rawPhoneNumber.trim();
      if (!cleaned) {
        showToast("Zəhmət olmasa telefon nömrənizi daxil edin.", "error");
        return false;
      }
      fullPhone = `${countryCode}${cleaned}`;
    }

    try {
      const res = await fetch("/api/user/2fa/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, phone: fullPhone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kod göndərilə bilmədi");

      showToast(data.message || `Kod ${method === "EMAIL" ? "e-poçt ünvanınıza" : "telefonunuza"} göndərildi.`, "success");
      return true;
    } catch (err: any) {
      showToast(err.message || "Xəta baş verdi", "error");
      return false;
    }
  };

  // Enable/Disable specific 2FA method
  const handleToggleMethod2fa = async (method: "EMAIL" | "SMS" | "AUTHENTICATOR", enable: boolean) => {
    let fullPhoneNumber = "";
    if (method === "SMS" && enable) {
      const cleaned = rawPhoneNumber.trim();
      if (!cleaned) {
        showToast("SMS 2FA üçün nömrə daxil etməlisiniz.", "error");
        return;
      }
      fullPhoneNumber = `${countryCode}${cleaned}`;
    }

    setIsToggling2fa(true);
    try {
      if (enable) {
        const verifyCode = setupCode.trim();
        if (!verifyCode) {
          showToast("Doğrulama kodunu daxil edin.", "error");
          setIsToggling2fa(false);
          return;
        }

        const verifyRes = await fetch("/api/user/2fa/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            code: verifyCode, 
            isSetup: true, 
            method: method, 
            phone: fullPhoneNumber 
          })
        });
        const verifyData = await verifyRes.json();
        if (!verifyRes.ok) {
          throw new Error(verifyData.error || "Daxil etdiyiniz doğrulama kodu yanlışdır.");
        }

        setIs2faEnabled(verifyData.enabled);
        setIsEmail2faEnabled(verifyData.emailEnabled);
        setIsSms2faEnabled(verifyData.smsEnabled);
        setIsAuthenticator2faEnabled(verifyData.authenticatorEnabled);
        
        // Update local session
        await update({ 
          twoFactorEnabled: verifyData.enabled,
          twoFactorEmailEnabled: verifyData.emailEnabled,
          twoFactorSmsEnabled: verifyData.smsEnabled,
          twoFactorAuthenticatorEnabled: verifyData.authenticatorEnabled,
          twoFactorPhone: verifyData.phone
        });

        if (typeof window !== "undefined") {
          localStorage.setItem("spacecraft_2fa_enabled", verifyData.enabled.toString());
          sessionStorage.setItem("spacecraft_2fa_verified", "true");
        }
        setSetupMethod(null);
        setSetupCode("");
        showToast(`${method} 2FA uğurla aktivləşdirildi! 🛡️`, "success");
      } else {
        // Söndür (Disable)
        const res = await fetch("/api/user/2fa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enabled: false, method }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "2FA statusu söndürülə bilmədi");

        setIs2faEnabled(data.enabled);
        setIsEmail2faEnabled(data.emailEnabled);
        setIsSms2faEnabled(data.smsEnabled);
        setIsAuthenticator2faEnabled(data.authenticatorEnabled);
        
        // Update local session
        await update({ 
          twoFactorEnabled: data.enabled,
          twoFactorEmailEnabled: data.emailEnabled,
          twoFactorSmsEnabled: data.smsEnabled,
          twoFactorAuthenticatorEnabled: data.authenticatorEnabled
        });

        if (typeof window !== "undefined") {
          localStorage.setItem("spacecraft_2fa_enabled", data.enabled.toString());
          if (!data.enabled) {
            sessionStorage.removeItem("spacecraft_2fa_verified");
          }
        }
        setSetupMethod(null);
        setSetupCode("");
        showToast(`${method} 2FA söndürüldü.`, "success");
      }
    } catch (err: any) {
      showToast(err.message || "Xəta baş verdi", "error");
    } finally {
      setIsToggling2fa(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      {/* Background Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-to-b from-indigo-600/15 via-purple-600/5 to-transparent rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none"></div>
      
      {/* Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all animate-bounce ${
          toast.type === "success" 
            ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-300" 
            : "bg-red-950/80 border-red-500/30 text-red-300"
        }`}>
          {toast.type === "success" ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-red-400" />}
          <span className="text-sm font-bold">{toast.message}</span>
        </div>
      )}

      {/* Hidden file input for avatar uploading */}
      <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

      {/* Header */}
      <nav className="border-b border-white/10 bg-[#030712]/70 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (typeof window !== "undefined" && window.history.length > 1) {
                  router.back();
                } else {
                  router.push("/dashboard");
                }
              }}
              className="w-10 h-10 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors rounded-xl flex items-center justify-center text-white cursor-pointer"
              title="Geri"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-xl font-black bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">Tənzimləmələr</span>
          </div>
          
          <div className="flex items-center gap-4">
            <img src={image || "https://api.dicebear.com/7.x/avataaars/svg"} alt="User" className="w-10 h-10 rounded-xl border border-indigo-500/40 object-cover" />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8 relative z-10">
        {/* Sidebar Menu */}
        <aside className="w-full md:w-64 space-y-2">
          <button onClick={() => setActiveTab("account")} className={getTabButtonClass("account")}>
            <User className="w-5 h-5" /> Hesabım
          </button>
          <button onClick={() => setActiveTab("billing")} className={getTabButtonClass("billing")}>
            <CreditCard className="w-5 h-5" /> Ödənişlər
          </button>
          <button onClick={() => setActiveTab("engine")} className={getTabButtonClass("engine")}>
            <SettingsIcon className="w-5 h-5" /> Mühərrik Ayarları
          </button>
          <button onClick={() => setActiveTab("notifications")} className={getTabButtonClass("notifications")}>
            <Bell className="w-5 h-5" /> Bildirişlər
          </button>
          <button onClick={() => setActiveTab("security")} className={getTabButtonClass("security")}>
            <Shield className="w-5 h-5" /> Təhlükəsizlik
          </button>
        </aside>

        {/* Content Area */}
        <div className="flex-1 bg-[#090D16]/80 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl">
          {activeTab === "account" && (
            <div>
              <h2 className="text-2xl font-black text-white mb-8">Şəxsi Məlumatlar</h2>
              
              <div className="flex items-center gap-6 mb-10 pb-10 border-b border-white/10">
                <div className="relative">
                  <img src={image || "https://api.dicebear.com/7.x/avataaars/svg"} alt="User" className="w-24 h-24 rounded-2xl border-2 border-indigo-500/50 object-cover shadow-2xl" />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="absolute -bottom-2 -right-2 bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl shadow-lg border-2 border-[#030712] transition-colors cursor-pointer flex items-center justify-center"
                  >
                    {isUploading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <CameraIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">{name}</h3>
                  <p className="text-sm text-neutral-400">{session?.user?.email}</p>
                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 rounded-full text-xs font-bold uppercase tracking-wider">
                    {(session?.user as any)?.subscriptionStatus || "STARTER"} Paket
                  </div>
                </div>
              </div>

              <div className="space-y-6 max-w-xl">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-2">Ad və Soyad</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-indigo-500 focus:bg-white/[0.07] outline-none transition-all font-medium text-white text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-2">E-poçt Ünvanı</label>
                  <input 
                    type="email" 
                    defaultValue={session?.user?.email || ""} 
                    disabled 
                    className="w-full px-4 py-3.5 rounded-xl bg-white/[0.02] border border-white/5 outline-none font-medium text-neutral-500 cursor-not-allowed text-sm" 
                  />
                  <p className="text-xs text-neutral-500 mt-2">E-poçt ünvanınızı dəyişmək üçün dəstək komandası ilə əlaqə saxlayın.</p>
                </div>
                <div className="pt-4 flex gap-4">
                  <button 
                    onClick={handleSaveAccount}
                    disabled={isSavingProfile}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer text-sm"
                  >
                    {isSavingProfile ? "Yadda Saxlanılır..." : "Yadda Saxla"}
                  </button>
                  <button onClick={() => signOut({ callbackUrl: "/" })} className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold rounded-xl transition-all cursor-pointer text-sm">
                    Sistemdən Çıx
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div>
              <h2 className="text-2xl font-black text-white mb-6">Ödənişlər və Abunəlik</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Plan Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-neutral-900 to-purple-950/40 border border-indigo-500/30 text-white shadow-2xl flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
                  <div>
                    <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">Cari Plan</span>
                    <h3 className="text-3xl font-black mt-2 text-white">
                      {(session?.user as any)?.subscriptionStatus || "STARTER"} Paket
                    </h3>
                    <p className="text-sm text-neutral-400 mt-1">
                      {(session?.user as any)?.subscriptionStatus && (session?.user as any)?.subscriptionStatus !== "STARTER" ? "Aylıq abunəlik (Aktiv)" : "Pulsuz limitli istifadə"}
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center">
                    <div className="text-xs text-neutral-400">Ödəniş profilinizi idarə edin</div>
                    <button 
                      onClick={handleStripePortal}
                      disabled={isBillingLoading}

                {/* Payment Method Card */}
                <div className="p-6 rounded-2xl border border-[#E5DCC5] bg-[#FAFAF8] flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold tracking-widest text-neutral-500 uppercase">Ödəniş Metodu</span>
                    <div className="flex items-center gap-3 mt-4">
                      <div className="w-12 h-8 bg-neutral-900 text-white rounded-md flex items-center justify-center font-bold text-xs">
                        CARD
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neutral-800">Mövcud Kart Məlumatları</p>
                        <p className="text-xs text-neutral-500">Stripe vasitəsilə qorunur</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex gap-3">
                    <button 
                      onClick={handleStripePortal}
                      disabled={isBillingLoading}
                      className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      {isBillingLoading ? "Gözləyin..." : "Kartı Yenilə"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "engine" && (
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-8">Mühərrik (Redaktor) Ayarları</h2>
              
              <div className="space-y-8 max-w-xl">
                {/* Auto-save frequency */}
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Avtomatik Saxlama Tezliyi</label>
                  <select 
                    value={autosaveInterval} 
                    onChange={(e) => setAutosaveInterval(e.target.value)} 
                    className="w-full px-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#E5DCC5] focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all font-medium text-neutral-900 cursor-pointer"
                  >
                    <option value="1">Hər 1 dəqiqədən bir</option>
                    <option value="5">Hər 5 dəqiqədən bir (Tövsiyə olunur)</option>
                    <option value="10">Hər 10 dəqiqədən bir</option>
                    <option value="0">Söndür</option>
                  </select>
                  <p className="text-xs text-neutral-500 mt-2">Dəyişikliklərinizin itməməsi üçün buludda tez-tez yadda saxlanılır.</p>
                </div>

                {/* Grid Snap Size */}
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Tor Üzrə Yapışma Həssaslığı (Snap Grid)</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[0.1, 0.2, 0.5].map((val) => (
                      <button 
                        key={val} 
                        onClick={() => setSnapGridSize(val)} 
                        className={`py-3 px-4 border rounded-xl font-bold text-sm transition-all cursor-pointer ${snapGridSize === val ? "border-neutral-900 bg-neutral-900 text-white" : "border-[#E5DCC5] hover:bg-[#F3EFE6] text-neutral-600"}`}
                      >
                        {val * 100} cm
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid Color Picker */}
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Tor Xətlərinin Rəngi (Grid Color)</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={gridColor} 
                      onChange={(e) => setGridColor(e.target.value)} 
                      className="w-12 h-10 rounded-xl border border-[#E5DCC5] bg-transparent cursor-pointer p-0.5" 
                    />
                    <span className="text-sm font-semibold font-mono text-neutral-700">{gridColor}</span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">Bu, 3D səhnədəki köməkçi tor xətlərinin rəngini dəyişir.</p>
                </div>

                {/* Render Shadow Quality */}
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Kölgə və Render Keyfiyyəti (3D Visuals)</label>
                  <select 
                    value={renderQuality} 
                    onChange={(e) => setRenderQuality(e.target.value as any)} 
                    className="w-full px-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#E5DCC5] focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all font-medium text-neutral-900 cursor-pointer"
                  >
                    <option value="high">Yüksək (Realist kölgələr)</option>
                    <option value="medium">Orta (Standart keyfiyyət)</option>
                    <option value="low">Aşağı (Performans üçün)</option>
                  </select>
                  <p className="text-xs text-neutral-500 mt-2">Cihazınızda 3D renderin axıcı işləməsi üçün bunu aşağı sala bilərsiniz.</p>
                </div>

                {/* Camera Sensitivity */}
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Kamera Həssaslığı</label>
                  <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={cameraSensitivity} 
                    onChange={(e) => setCameraSensitivity(parseInt(e.target.value))} 
                    className="w-full accent-neutral-900 h-1.5 bg-[#F3EFE6] rounded-lg appearance-none cursor-pointer" 
                  />
                  <div className="flex justify-between text-xs text-neutral-500 mt-1">
                    <span>Yavaş</span>
                    <span>Normal</span>
                    <span>Sürətli</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5DCC5]/60 flex gap-4">
                  <button 
                    onClick={handleSaveEngine}
                    className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl shadow-lg transition-colors cursor-pointer"
                  >
                    Ayarları Yadda Saxla
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-8">Bildiriş Ayarları</h2>
              
              <div className="space-y-6 max-w-xl">
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={emailReports} 
                      onChange={(e) => setEmailReports(e.target.checked)} 
                      className="mt-1 w-4 h-4 rounded border-[#E5DCC5] accent-neutral-900 cursor-pointer" 
                    />
                    <div>
                      <p className="text-sm font-bold text-neutral-850">E-poçt Hesabatları</p>
                      <p className="text-xs text-neutral-500">Həftəlik layihə statistikaları və yeniliklərin göndərilməsi.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={collabAlerts} 
                      onChange={(e) => setCollabAlerts(e.target.checked)} 
                      className="mt-1 w-4 h-4 rounded border-[#E5DCC5] accent-neutral-900 cursor-pointer" 
                    />
                    <div>
                      <p className="text-sm font-bold text-neutral-850">Əməkdaşlıq Bildirişləri</p>
                      <p className="text-xs text-neutral-500">Ortaq layihələrinizdə hər hansı dəyişiklik və ya dəvət olduqda xəbərdarlıq edin.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={marketingUpdates} 
                      onChange={(e) => setMarketingUpdates(e.target.checked)} 
                      className="mt-1 w-4 h-4 rounded border-[#E5DCC5] accent-neutral-900 cursor-pointer" 
                    />
                    <div>
                      <p className="text-sm font-bold text-neutral-850">Yeniliklər və Kampaniyalar</p>
                      <p className="text-xs text-neutral-500">Yeni alətlər, endirimlər və xüsusi təkliflərlə bağlı bildirişlər.</p>
                    </div>
                  </label>
                </div>

                <div className="pt-6 border-t border-[#E5DCC5]/60 flex gap-4">
                  <button 
                    onClick={handleSaveNotifications}
                    className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl shadow-lg transition-colors cursor-pointer"
                  >
                    Tercihləri Yadda Saxla
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-8">Təhlükəsizlik Ayarları</h2>
              
              <div className="space-y-6 max-w-xl">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-4">Şifrəni Yenilə</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-2">Cari Şifrə</label>
                      <input 
                        type="password" 
                        value={currentPassword} 
                        onChange={(e) => setCurrentPassword(e.target.value)} 
                        placeholder="Cari şifrəniz" 
                        className="w-full px-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#E5DCC5] focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all font-medium text-neutral-900" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-2">Yeni Şifrə</label>
                      <input 
                        type="password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        placeholder="Ən az 4 simvol" 
                        className="w-full px-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#E5DCC5] focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all font-medium text-neutral-900" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-2">Yeni Şifrənin Təsdiqi</label>
                      <input 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        placeholder="Yeni şifrəni yenidən yazın" 
                        className="w-full px-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#E5DCC5] focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all font-medium text-neutral-900" 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5DCC5]/60 space-y-6">
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">İki Faktorlu Autentifikasiya (2FA)</h3>
                  <p className="text-xs text-neutral-500 mb-6">Hesabınızın təhlükəsizliyini təmin etmək üçün əlavə qorunma qatı. İstədiyiniz metodları aktivləşdirə bilərsiniz.</p>

                  <div className="space-y-4">
                    {/* 1. E-poçt (Email) Card */}
                    <div className="p-5 border border-[#E5DCC5] rounded-2xl bg-[#FAFAF8] space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-neutral-800">E-poçt (Email) ilə Doğrulama</h4>
                          <p className="text-xs text-neutral-500">Giriş zamanı e-poçt ünvanınıza 6 rəqəmli kod göndərilir.</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${isEmail2faEnabled ? "bg-emerald-100 text-emerald-800" : "bg-neutral-200 text-neutral-600"}`}>
                            {isEmail2faEnabled ? "Aktivdir" : "Sönülüdür"}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleMethod2fa("EMAIL", !isEmail2faEnabled)}
                            disabled={isToggling2fa}
                            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${isEmail2faEnabled ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-neutral-900 text-white hover:bg-neutral-800"}`}
                          >
                            {isToggling2fa && setupMethod === "EMAIL" ? "Gözləyin..." : isEmail2faEnabled ? "Söndür" : "Aktivləşdir"}
                          </button>
                        </div>
                      </div>

                      {setupMethod === "EMAIL" && (
                        <div className="pt-3 border-t border-[#E5DCC5]/40 space-y-3 animate-fade-in">
                          <label className="block text-xs font-bold text-neutral-700">E-poçtunuza göndərilən 6 rəqəmli təhlükəsizlik kodunu daxil edin</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              maxLength={6}
                              value={setupCode}
                              onChange={(e) => setSetupCode(e.target.value.replace(/\D/g, ""))}
                              placeholder="Məsələn: 123456"
                              className="max-w-[200px] px-4 py-2.5 rounded-xl bg-white border border-[#E5DCC5] focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all font-medium text-neutral-900"
                            />
                            <button
                              type="button"
                              onClick={() => handleToggleMethod2fa("EMAIL", true)}
                              disabled={isToggling2fa}
                              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                            >
                              Kodu Təsdiqlə
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 2. SMS (Telefon) Card */}
                    <div className="p-5 border border-[#E5DCC5] rounded-2xl bg-[#FAFAF8] space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h4 className="text-sm font-bold text-neutral-800">SMS (Telefon) ilə Doğrulama</h4>
                          <p className="text-xs text-neutral-500">Giriş zamanı qeyd etdiyiniz mobil nömrəyə SMS kod göndərilir.</p>
                        </div>
                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${isSms2faEnabled ? "bg-emerald-100 text-emerald-800" : "bg-neutral-200 text-neutral-600"}`}>
                            {isSms2faEnabled ? "Aktivdir" : "Sönülüdür"}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleMethod2fa("SMS", !isSms2faEnabled)}
                            disabled={isToggling2fa}
                            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${isSms2faEnabled ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-neutral-900 text-white hover:bg-neutral-800"}`}
                          >
                            {isToggling2fa && setupMethod === "SMS" ? "Gözləyin..." : isSms2faEnabled ? "Söndür" : "Aktivləşdir"}
                          </button>
                        </div>
                      </div>

                      {/* Phone Input always visible */}
                      <div className="pt-2">
                        <label className="block text-xs font-bold text-neutral-700 mb-2">Telefon Nömrəsi</label>
                        <div className="flex gap-2 max-w-md">
                          <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            disabled={isSms2faEnabled}
                            className="px-3 py-3 rounded-xl bg-white border border-[#E5DCC5] focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all font-bold text-neutral-900 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            <option value="+994">🇦🇿 +994</option>
                            <option value="+90">🇹🇷 +90</option>
                            <option value="+1">🇺🇸 +1</option>
                            <option value="+44">🇬🇧 +44</option>
                            <option value="+49">🇩🇪 +49</option>
                            <option value="+7">🇷🇺 +7</option>
                            <option value="+995">🇬🇪 +995</option>
                          </select>
                          <input
                            type="text"
                            value={rawPhoneNumber}
                            onChange={(e) => setRawPhoneNumber(e.target.value.replace(/[^\d\s\-()]/g, ""))}
                            placeholder="Məsələn: 50 123 45 67"
                            disabled={isSms2faEnabled}
                            className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#E5DCC5] focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all font-medium text-neutral-900 disabled:opacity-60"
                          />
                        </div>
                      </div>

                      {setupMethod === "SMS" && (
                        <div className="pt-3 border-t border-[#E5DCC5]/40 space-y-3 animate-fade-in">
                          <label className="block text-xs font-bold text-neutral-700">Telefonunuza göndərilən 6 rəqəmli təhlükəsizlik kodunu daxil edin</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              maxLength={6}
                              value={setupCode}
                              onChange={(e) => setSetupCode(e.target.value.replace(/\D/g, ""))}
                              placeholder="Məsələn: 123456"
                              className="max-w-[200px] px-4 py-2.5 rounded-xl bg-white border border-[#E5DCC5] focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all font-medium text-neutral-900"
                            />
                            <button
                              type="button"
                              onClick={() => handleToggleMethod2fa("SMS", true)}
                              disabled={isToggling2fa}
                              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                            >
                              Kodu Təsdiqlə
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 3. Google Authenticator Card */}
                    <div className="p-5 border border-[#E5DCC5] rounded-2xl bg-[#FAFAF8] space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-neutral-800">Google Authenticator (Tətbiq)</h4>
                          <p className="text-xs text-neutral-500">Google Authenticator və ya digər tətbiqlərdəki 30 saniyəlik kodları tələb edir.</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${isAuthenticator2faEnabled ? "bg-emerald-100 text-emerald-800" : "bg-neutral-200 text-neutral-600"}`}>
                            {isAuthenticator2faEnabled ? "Aktivdir" : "Sönülüdür"}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (isAuthenticator2faEnabled) {
                                handleToggleMethod2fa("AUTHENTICATOR", false);
                              } else {
                                handleSetupAuthenticator();
                                setSetupMethod("AUTHENTICATOR");
                              }
                            }}
                            disabled={isToggling2fa}
                            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${isAuthenticator2faEnabled ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-neutral-900 text-white hover:bg-neutral-800"}`}
                          >
                            {isToggling2fa && setupMethod === "AUTHENTICATOR" && !qrCodeUrl ? "Gözləyin..." : isAuthenticator2faEnabled ? "Söndür" : "Aktivləşdir"}
                          </button>
                        </div>
                      </div>

                      {setupMethod === "AUTHENTICATOR" && !isAuthenticator2faEnabled && (
                        <div className="pt-3 border-t border-[#E5DCC5]/40 space-y-4 animate-fade-in">
                          <p className="text-xs font-bold text-neutral-700">QR Kodu tətbiqlə skan edin və ya gizli açarı əllə daxil edin:</p>
                          {isSettingUpQr ? (
                            <div className="w-40 h-40 bg-neutral-100 rounded-xl flex items-center justify-center text-xs text-neutral-500 animate-pulse">QR Kod Hazırlanır...</div>
                          ) : (
                            qrCodeUrl && (
                              <div className="flex flex-col sm:flex-row items-center gap-4">
                                <img src={qrCodeUrl} alt="Google Authenticator QR Code" className="w-36 h-36 border border-[#E5DCC5] rounded-xl bg-white p-1.5" />
                                <div className="space-y-1">
                                  <p className="text-xs text-neutral-500 font-medium">Quraşdırma Açarı:</p>
                                  <code className="block bg-[#F3EFE6] px-3 py-2 rounded-lg font-mono text-sm font-bold text-neutral-800 break-all select-all">
                                    {(session?.user as any)?.twoFactorSecret || "Gizli açar alınır..."}
                                  </code>
                                </div>
                              </div>
                            )
                          )}
                          <div className="space-y-3">
                            <label className="block text-xs font-bold text-neutral-700">Qurulumu təsdiqləmək üçün tətbiqdəki ilk 6 rəqəmli kodu daxil edin</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                maxLength={6}
                                value={setupCode}
                                onChange={(e) => setSetupCode(e.target.value.replace(/\D/g, ""))}
                                placeholder="Məsələn: 123456"
                                className="max-w-[200px] px-4 py-2.5 rounded-xl bg-white border border-[#E5DCC5] focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all font-medium text-neutral-900"
                              />
                              <button
                                type="button"
                                onClick={() => handleToggleMethod2fa("AUTHENTICATOR", true)}
                                disabled={isToggling2fa}
                                className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                              >
                                Təsdiqlə və Aktivləşdir
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#E5DCC5]/60 flex gap-4">
                  <button 
                    onClick={handlePasswordChange}
                    disabled={isSavingPassword}
                    className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl shadow-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSavingPassword ? "Dəyişdirilir..." : "Şifrəni Dəyiş"}
                  </button>
                </div>
              </div>
            )}
        </div>
      </main>
    </div>
  );
}
