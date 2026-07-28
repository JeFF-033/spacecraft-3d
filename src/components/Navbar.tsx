"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { Box, ArrowRight, Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/features", label: "Özəlliklər" },
    { href: "/how-it-works", label: "Necə İşləyir?" },
    { href: "/gallery", label: "Qalereya" },
    { href: "/testimonials", label: "Rəylər" },
    { href: "/pricing", label: "Qiymətlər" },
  ];

  return (
    <header className="sticky top-4 z-50 w-full px-3 sm:px-6">
      <nav className="max-w-6xl mx-auto rounded-3xl sm:rounded-full border border-neutral-200/50 bg-[#FAFAF8]/90 backdrop-blur-md shadow-md transition-all duration-300">
        <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-neutral-900 rounded-xl flex items-center justify-center shadow-md">
              <Box className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-base sm:text-lg font-black tracking-tight text-neutral-800">SpaceCraft</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-neutral-500 flex-shrink-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors whitespace-nowrap ${
                    isActive ? "text-neutral-900 font-bold" : "hover:text-neutral-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {session ? (
              <Link href="/dashboard" className="hidden sm:inline text-xs font-bold uppercase tracking-wider text-neutral-700 hover:text-neutral-900 transition-colors whitespace-nowrap">
                Dashboard
              </Link>
            ) : (
              <button onClick={() => signIn()} className="hidden sm:inline text-xs font-bold uppercase tracking-wider text-neutral-700 hover:text-neutral-900 transition-colors whitespace-nowrap">
                Giriş Et
              </button>
            )}
            <Link 
              href="/editor" 
              className="bg-neutral-900 hover:bg-neutral-800 text-[#FAFAF8] px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-neutral-900/10 hover:shadow-neutral-900/20 hover:scale-102 whitespace-nowrap"
            >
              <span className="hidden xs:inline">Dizayna</span> Başla <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="md:hidden p-2 text-neutral-700 hover:text-neutral-900 rounded-xl hover:bg-neutral-200/50 transition-colors"
              title="Menyunu Aç"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200/50 px-6 py-4 flex flex-col gap-3 text-xs font-semibold uppercase tracking-wider text-neutral-600 animate-fadeIn">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`py-1 ${isActive ? "text-neutral-900 font-bold" : "hover:text-neutral-900"}`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-neutral-200/40 flex items-center justify-between">
              {session ? (
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-neutral-900 font-bold">Dashboard</Link>
              ) : (
                <button onClick={() => { setIsMobileMenuOpen(false); signIn(); }} className="text-neutral-900 font-bold">Giriş Et</button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
