"use client";

import React, { useEffect } from "react";
import { useStore } from "@/store/useStore";

export default function EditorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Editor Route Error Captured, auto-resetting:", error);
    try {
      useStore.setState({ is2DView: false, isWalkthrough: false, isDollhouseMode: false });
    } catch (e) {
      console.warn("Store reset error:", e);
    }
    const timer = setTimeout(() => {
      reset();
    }, 50);
    return () => clearTimeout(timer);
  }, [error, reset]);

  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] text-white flex flex-col items-center justify-center p-6 select-none">
      <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-3"></div>
      <p className="text-xs text-neutral-400 font-mono animate-pulse">Səhnə yenilənir...</p>
    </div>
  );
}
