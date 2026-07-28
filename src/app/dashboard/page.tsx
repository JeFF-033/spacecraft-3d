"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Plus, LayoutDashboard, Clock, LogOut, Trash2 } from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
    
    if (status === "authenticated") {
      // 2FA yoxlanışı
      if ((session?.user as any)?.twoFactorEnabled) {
        const isVerified = sessionStorage.getItem("spacecraft_2fa_verified") === "true";
        if (!isVerified) {
          router.push("/auth/2fa");
          return;
        }
      }

      fetch("/api/projects")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setProjects(data);
          }
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [status, session, router]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (!confirm("Bu layihəni silmək istədiyinizə əminsiniz?")) return;
    
    const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30">
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">SpaceCraft</h1>
              <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold">Pro Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <Link href="/settings" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src={session?.user?.image || "https://api.dicebear.com/7.x/avataaars/svg"} alt="User" className="w-9 h-9 rounded-full border-2 border-indigo-500/30" />
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-neutral-200">{session?.user?.name}</p>
                <p className="text-xs text-neutral-500">{session?.user?.email}</p>
              </div>
            </Link>
            <div className="w-px h-8 bg-white/10"></div>
            <button onClick={() => signOut({ callbackUrl: "/" })} className="text-neutral-400 hover:text-red-400 transition-colors" title="Sistemdən Çıx">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Layihələrim</h2>
            <p className="text-neutral-400">Bütün 3D daxili dizayn və Matterport turlarınız buradadır.</p>
          </div>
          <Link href="/editor" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-0.5 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Yeni Otaq Yarat
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 bg-white/[0.02] border border-white/5 rounded-3xl text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <LayoutDashboard className="w-10 h-10 text-neutral-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Hələ heç bir layihəniz yoxdur</h3>
            <p className="text-neutral-400 mb-8 max-w-md">İlk 3D otağınızı yaradaraq dizayn etməyə və ya Matterport turu qurmağa başlayın.</p>
            <Link href="/editor" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all">
              Mühərrikə Keçid Et
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
              <Link key={project.id} href={`/editor?id=${project.id}`} className="group relative bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all hover:shadow-[0_10px_40px_-10px_rgba(99,102,241,0.2)] hover:-translate-y-1">
                <div className="aspect-video bg-[#111] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <LayoutDashboard className="w-12 h-12 text-white/10 group-hover:scale-110 transition-transform duration-500" />
                  
                  <button onClick={(e) => handleDelete(e, project.id)} className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-red-500 text-white/50 hover:text-white rounded-lg backdrop-blur opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{project.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Son dəyişiklik: {new Date(project.updatedAt).toLocaleDateString("az-AZ")}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
