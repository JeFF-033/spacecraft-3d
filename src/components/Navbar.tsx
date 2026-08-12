"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { Box, ArrowRight, Menu, X, Sparkles } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/features", label: "Özəlliklər" },
    { href: "/how-it-works", label: "Necə İşləyir?" },
    { href: "/#showcase", label: "3D Önizləmə" },
    { href: "/gallery", label: "Qalereya" },
    { href: "/testimonials", label: "Rəylər" },
    { href: "/pricing", label: "Qiymətlər" },
  ];

  return (
    <header className="sticky top-4 z-50 w-full px-3 sm:px-6">
      <nav className="max-w-6xl mx-auto rounded-3xl sm:rounded-full border border-white/10 bg-zinc-950/90 backdrop-blur-xl shadow-2xl shadow-black/80 transition-all duration-300">
        <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo with Ambient Monochrome Glow */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 bg-gradient-to-tr from-zinc-100 via-zinc-300 to-zinc-400 rounded-xl flex items-center justify-center shadow-lg shadow-white/10 group-hover:scale-105 transition-transform">
              <Box className="w-5 h-5 text-zinc-950" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-zinc-200"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-zinc-300 transition-colors">
                SpaceCraft <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">3D</span>
              </span>
              <span className="hidden sm:inline text-[9px] font-mono text-zinc-400 -mt-1">Cloud Arch Platform</span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-zinc-400 flex-shrink-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-all hover:text-white relative py-1 ${
                    isActive ? "text-white font-bold" : ""
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {session ? (
              <Link
                href="/dashboard"
                className="hidden sm:inline text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white transition-colors whitespace-nowrap"
              >
                Dashboard
              </Link>
            ) : (
              <button
                onClick={() => signIn()}
                className="hidden sm:inline text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white transition-colors whitespace-nowrap px-3 py-1.5 rounded-lg hover:bg-white/5"
              >
                Giriş Et
              </button>
            )}

            <Link
              href={session ? "/editor" : "/auth/signin"}
              className="relative group overflow-hidden rounded-full p-[1px] font-bold text-xs"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white via-zinc-400 to-zinc-600 rounded-full animate-gradient-x"></span>
              <span className="relative px-5 py-2.5 rounded-full bg-zinc-950 text-white flex items-center gap-2 group-hover:bg-zinc-900 transition-all">
                <Sparkles className="w-3.5 h-3.5 text-zinc-300 animate-pulse" />
                <span>Dizayna Başla</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-300 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-zinc-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              title="Menyunu Aç"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 px-6 py-4 flex flex-col gap-3 text-xs font-semibold uppercase tracking-wider text-zinc-300 animate-fadeIn bg-zinc-950/95 rounded-b-3xl">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`py-1.5 ${isActive ? "text-white font-bold" : "hover:text-white"}`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              {session ? (
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-white font-bold">
                  Dashboard
                </Link>
              ) : (
                <button onClick={() => { setIsMobileMenuOpen(false); signIn(); }} className="text-white font-bold">
                  Giriş Et
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
