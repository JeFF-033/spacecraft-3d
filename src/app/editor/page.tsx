"use client";

import React, { Component, Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import Sidebar from "@/components/Sidebar";
import PropertiesPanel from "@/components/PropertiesPanel";
import Minimap from "@/components/Minimap";
import ProjectLoader from "@/components/ProjectLoader";
import TourToolbar from "@/components/TourToolbar";
import TopToolbar from "@/components/TopToolbar";
import MatterportControls from "@/components/MatterportControls";
import MagicErasePanel from "@/components/MagicErasePanel";
import { useStore } from "@/store/useStore";
import { X, Menu, SlidersHorizontal } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const RoomScene = dynamic(() => import("@/components/RoomScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a] text-white z-10">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-neutral-300">3D Redaktor Yüklənir...</p>
      </div>
    </div>
  ),
});

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any | null;
}

class SceneErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("3D Səhnə Xətası Tutuldu:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0c] text-white p-6 z-30">
          <div className="bg-neutral-900 border border-white/10 p-6 rounded-2xl max-w-md text-center space-y-4 shadow-2xl">
            <div className="text-amber-400 text-3xl">⚠️</div>
            <h2 className="text-base font-bold">3D Vizuallaşdırma Yeniləndi</h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              3D səhnə render edilərkən WebGL resursları yenidən başladıldı. Səhnəni bərpa etmək üçün aşağıdakı düyməyə sıxın.
            </p>
            {this.state.error && (
              <div className="text-[10px] text-rose-400 bg-black/60 p-2.5 rounded-lg max-h-24 overflow-auto text-left font-mono border border-rose-500/20">
                {String((this.state.error as any)?.message || this.state.error)}
              </div>
            )}
            <button
              onClick={() => {
                useStore.setState({ appMode: "3d-room", view3DIn360: true, is2DView: false, isWalkthrough: false, isDollhouseMode: false });
                this.setState({ hasError: false, error: null });
              }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg cursor-pointer"
            >
              🔄 Səhnəni Yenidən Yüklə
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function EditorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { 
    isPresentationMode, setIsPresentationMode,
    isSidebarOpen, setIsSidebarOpen,
    isPropertiesPanelOpen, setIsPropertiesPanelOpen,
    appMode
  } = useStore();

  // Panelləri istifadəçi özü bağlasın, avtomatik gizlədib istifadəçini çaşdırmayaq

  // Escape basıldıqda təqdimatdan çıx
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && useStore.getState().isPresentationMode) {
        useStore.getState().setIsPresentationMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Avtomatik saxlama (Autosave) sistemi
  useEffect(() => {
    if (typeof window === "undefined") return;

    const intervalMinsStr = localStorage.getItem("spacecraft_autosave_interval") || "5";
    const intervalMins = parseFloat(intervalMinsStr);
    if (!intervalMins || intervalMins <= 0) return;

    const intervalMs = intervalMins * 60 * 1000;
    console.log(`Autosave is active. Interval: ${intervalMins} minutes.`);

    const autoSave = async () => {
      const state = useStore.getState();
      // Yalnız projectId olduqda və ya mebellər yaradıldıqda avtomatik saxla
      if (!state.projectId && state.furnitureLayers.length === 0) return;

      try {
        const res = await fetch("/api/projects/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId: state.projectId,
            name: state.projectId ? undefined : "Avtomatik Saxlanan Otaq",
            data: state.furnitureLayers,
            wallColor: state.wallColor,
            floorColor: state.floorColor
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.id && data.id !== state.projectId) {
            useStore.setState({ projectId: data.id });
          }
          console.log("Autosave successful at:", new Date().toLocaleTimeString());
        }
      } catch (err) {
        console.error("Autosave failed:", err);
      }
    };

    const timer = setInterval(autoSave, intervalMs);
    return () => clearInterval(timer);
  }, []);

  // Qorunma və 2FA yoxlanışı
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

  if (status === "loading" || status === "unauthenticated" || (status === "authenticated" && (session?.user as any)?.twoFactorEnabled && typeof window !== "undefined" && sessionStorage.getItem("spacecraft_2fa_verified") !== "true")) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="w-full h-screen overflow-hidden flex relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#13131a] to-black">
      <Suspense fallback={null}>
        <ProjectLoader />
      </Suspense>
      
      {/* Mobile Toggle Triggers */}
      {!isSidebarOpen && !isPresentationMode && (
        <button 
          onClick={() => setIsSidebarOpen(true)} 
          className="absolute top-4 left-4 z-40 p-2.5 bg-black/70 hover:bg-black/90 text-white rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl lg:hidden flex items-center gap-2 text-xs font-bold transition-all"
          title="Menyunu Aç"
        >
          <Menu className="w-4 h-4 text-indigo-400" />
          <span className="hidden sm:inline">Kataloq</span>
        </button>
      )}

      {!isPropertiesPanelOpen && !isPresentationMode && (
        <button 
          onClick={() => setIsPropertiesPanelOpen(true)} 
          className="absolute top-4 right-4 z-40 p-2.5 bg-black/70 hover:bg-black/90 text-white rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl lg:hidden flex items-center gap-2 text-xs font-bold transition-all"
          title="Xüsusiyyətləri Aç"
        >
          <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
          <span className="hidden sm:inline">Xüsusiyyətlər</span>
        </button>
      )}

      {!isPresentationMode && <Sidebar />}
      <div className="flex-1 relative w-full h-full overflow-hidden">
        <SceneErrorBoundary>
          <RoomScene />
        </SceneErrorBoundary>
        <TopToolbar />
        {!isPresentationMode && <MatterportControls />}
        {!isPresentationMode && <MagicErasePanel />}
        {!isPresentationMode && <TourToolbar />}
        {isPresentationMode && (
          <button 
            onClick={() => setIsPresentationMode(false)}
            className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/60 hover:bg-black/80 text-white px-6 py-3 rounded-full backdrop-blur-xl font-bold tracking-widest text-xs uppercase shadow-2xl z-50 flex items-center gap-2 border border-white/10 transition-all hover:scale-105 hover:border-white/30"
          >
            <X className="w-4 h-4" /> Təqdimatdan Çıx (ESC)
          </button>
        )}
      </div>
      <Minimap />
      {!isPresentationMode && <PropertiesPanel />}
    </main>
  );
}
