"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  LayoutDashboard, 
  Clock, 
  LogOut, 
  Trash2, 
  Search, 
  SlidersHorizontal, 
  Grid, 
  List as ListIcon, 
  Sparkles, 
  Box, 
  Layers, 
  FolderKanban,
  ExternalLink,
  Settings,
  ShieldCheck,
  Zap,
  ChevronRight,
  TrendingUp,
  Star
} from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");

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

  const filteredAndSortedProjects = useMemo(() => {
    return projects
      .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === "newest") return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        if (sortBy === "oldest") return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [projects, searchQuery, sortBy]);

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center text-white relative overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="relative flex flex-col items-center gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 animate-pulse blur-md"></div>
            <div className="relative w-full h-full bg-[#090D16] border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
              <Box className="w-7 h-7 text-indigo-400 animate-bounce" />
            </div>
          </div>
          <p className="text-sm font-semibold text-neutral-400 tracking-wider uppercase">Yüklənir...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-indigo-500/30 relative overflow-hidden font-sans">
      {/* Background Gradients & Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-indigo-600/15 via-purple-600/5 to-transparent rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-10 -left-40 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[160px] pointer-events-none"></div>
      
      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* Header / Navbar */}
      <nav className="border-b border-white/10 bg-[#030712]/70 backdrop-blur-2xl sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(99,102,241,0.4)] group-hover:scale-105 transition-transform duration-300 border border-white/20">
                <Box className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent tracking-tight">SpaceCraft</h1>
                  <span className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3 h-3 text-indigo-400 fill-indigo-400" /> PRO
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 font-medium">3D & VR Studio Studio Dashboard</p>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/settings" 
              className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/40 hover:bg-white/[0.06] transition-all group"
            >
              <div className="relative">
                <img 
                  src={session?.user?.image || "https://api.dicebear.com/7.x/avataaars/svg"} 
                  alt="User" 
                  className="w-9 h-9 rounded-xl border border-indigo-500/40 object-cover" 
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#030712] rounded-full"></span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-neutral-200 group-hover:text-indigo-300 transition-colors">{session?.user?.name || "İstifadəçi"}</p>
                <p className="text-[10px] text-neutral-400 truncate max-w-[120px]">{session?.user?.email}</p>
              </div>
              <Settings className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors ml-1 hidden sm:block" />
            </Link>

            <div className="w-px h-7 bg-white/10 hidden sm:block"></div>

            <button 
              onClick={() => signOut({ callbackUrl: "/" })} 
              className="p-2.5 bg-white/[0.03] border border-white/10 hover:border-red-500/40 hover:bg-red-500/10 text-neutral-400 hover:text-red-400 rounded-xl transition-all" 
              title="Sistemdən Çıx"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        
        {/* Banner / Stat Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-br from-indigo-900/40 via-indigo-950/20 to-neutral-900/40 border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden backdrop-blur-xl group hover:border-indigo-500/40 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
                <FolderKanban className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Aktiv
              </span>
            </div>
            <h3 className="text-3xl font-black text-white mb-1">{projects.length}</h3>
            <p className="text-xs font-medium text-neutral-400">Ümumi Yaratdığınız Layihələr</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 via-purple-950/20 to-neutral-900/40 border border-purple-500/20 rounded-3xl p-6 relative overflow-hidden backdrop-blur-xl group hover:border-purple-500/40 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full">
                Sonsuz 3D
              </span>
            </div>
            <h3 className="text-3xl font-black text-white mb-1">PRO Plan</h3>
            <p className="text-xs font-medium text-neutral-400">Ultra Yüksək Keyfiyyətli Render Mühərriki</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-900/30 via-emerald-950/20 to-neutral-900/40 border border-emerald-500/20 rounded-3xl p-6 relative overflow-hidden backdrop-blur-xl group hover:border-emerald-500/40 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                Təhlükəsiz
              </span>
            </div>
            <h3 className="text-3xl font-black text-white mb-1">100% Cloud</h3>
            <p className="text-xs font-medium text-neutral-400">Layihələr Buludda Avtomatik Saxlanılır</p>
          </div>
        </div>

        {/* Section Title & Controls Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 bg-white/[0.02] border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
          <div>
            <h2 className="text-2xl font-black text-white mb-1 flex items-center gap-2">
              Layihələrim 
              <span className="text-xs font-bold bg-white/10 px-2.5 py-0.5 rounded-full text-neutral-300">
                {filteredAndSortedProjects.length}
              </span>
            </h2>
            <p className="text-xs text-neutral-400">Bütün 3D daxili dizayn, memarlıq otaqları və virtual turlarınız.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Layihə axtar..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 text-xs text-white placeholder-neutral-500 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.07] transition-all"
              />
            </div>

            {/* Sort Select */}
            <select 
              value={sortBy} 
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-white/[0.04] border border-white/10 text-xs text-neutral-300 px-3 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500/60 transition-all cursor-pointer"
            >
              <option value="newest" className="bg-[#090D16]">Ən son yenilənənlər</option>
              <option value="oldest" className="bg-[#090D16]">Ən köhnələr</option>
              <option value="name" className="bg-[#090D16]">Ad sırasına görə</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-white/[0.04] border border-white/10 p-1 rounded-xl">
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-indigo-600 text-white shadow-md" : "text-neutral-400 hover:text-white"}`}
                title="Şəbəkə Görünüşü"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-indigo-600 text-white shadow-md" : "text-neutral-400 hover:text-white"}`}
                title="Siyahı Görünüşü"
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Create Project Button */}
            <Link 
              href="/editor" 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 flex items-center gap-2 ml-auto md:ml-0"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Otaq Yarat</span>
            </Link>
          </div>
        </div>

        {/* Projects List / Grid Rendering */}
        {filteredAndSortedProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 md:p-24 bg-gradient-to-b from-white/[0.03] to-transparent border border-white/10 rounded-3xl text-center relative overflow-hidden backdrop-blur-xl">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-3xl flex items-center justify-center mb-6 shadow-2xl relative group">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all"></div>
              <Box className="w-12 h-12 text-indigo-400 relative z-10" />
            </div>
            
            <h3 className="text-2xl font-black text-white mb-2">
              {searchQuery ? "Heç bir uyğun layihə tapılmadı" : "Hələ heç bir 3D layihəniz yoxdur"}
            </h3>
            <p className="text-sm text-neutral-400 mb-8 max-w-md">
              {searchQuery 
                ? "Daxil etdiyiniz axtarış sorğusuna uyğun heç bir nəticə yoxdur. Sorğunu dəyişməyə cəhd edin." 
                : "SpaceCraft 3D mühərrikindən istifadə edərək xəyallarınızdakı otağı və ya virtual mühiti anında dizayn etməyə başlayın."}
            </p>
            
            <Link 
              href="/editor" 
              className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-90 text-white px-8 py-3.5 rounded-2xl font-extrabold text-sm transition-all shadow-xl shadow-indigo-600/30 hover:scale-105 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              {searchQuery ? "Yeni Layihə Yarat" : "Dizayner Mühərrikinə Keçid Et"}
            </Link>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProjects.map((project) => (
              <Link 
                key={project.id} 
                href={`/editor?id=${project.id}`} 
                className="group relative bg-[#090D16]/80 border border-white/10 hover:border-indigo-500/60 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-[0_15px_45px_-10px_rgba(99,102,241,0.25)] hover:-translate-y-1.5 flex flex-col backdrop-blur-xl"
              >
                {/* Card Thumbnail Container */}
                <div className="aspect-video bg-gradient-to-br from-indigo-950/40 via-neutral-900 to-purple-950/30 flex items-center justify-center relative overflow-hidden border-b border-white/5">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Decorative 3D Wireframe Icon */}
                  <div className="relative p-4 rounded-2xl bg-white/[0.03] border border-white/10 group-hover:scale-110 group-hover:border-indigo-500/40 transition-all duration-500">
                    <Box className="w-10 h-10 text-indigo-400/70 group-hover:text-indigo-400 transition-colors" />
                  </div>

                  <span className="absolute top-3 left-3 bg-black/60 border border-white/10 text-[10px] text-neutral-300 font-semibold px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1">
                    <Layers className="w-3 h-3 text-indigo-400" /> 3D Otaq
                  </span>
                  
                  <button 
                    onClick={(e) => handleDelete(e, project.id)} 
                    className="absolute top-3 right-3 p-2 bg-black/60 border border-white/10 hover:bg-red-500/80 text-neutral-400 hover:text-white rounded-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200"
                    title="Layihəni Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="absolute bottom-3 right-3 bg-indigo-600/90 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-medium">
                      <Clock className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Yenilənib: {new Date(project.updatedAt).toLocaleDateString("az-AZ")}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-indigo-400 font-semibold">
                    <span>Redaktə et</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* List Mode Rendering */
          <div className="flex flex-col gap-3">
            {filteredAndSortedProjects.map((project) => (
              <Link 
                key={project.id} 
                href={`/editor?id=${project.id}`} 
                className="group bg-[#090D16]/80 border border-white/10 hover:border-indigo-500/50 p-4 rounded-2xl transition-all duration-200 hover:shadow-lg flex items-center justify-between backdrop-blur-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-950 to-neutral-900 border border-white/10 flex items-center justify-center group-hover:border-indigo-500/40 transition-colors">
                    <Box className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Son dəyişiklik: {new Date(project.updatedAt).toLocaleDateString("az-AZ")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => handleDelete(e, project.id)} 
                    className="p-2 bg-white/[0.03] border border-white/10 hover:bg-red-500/80 text-neutral-400 hover:text-white rounded-xl transition-all"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <ChevronRight className="w-4 h-4" />
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

