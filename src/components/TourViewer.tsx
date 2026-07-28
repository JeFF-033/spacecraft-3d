"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, useTexture, Line, useGLTF } from "@react-three/drei";
import { useStore, TourNode } from "@/store/useStore";
import * as THREE from "three";
import gsap from "gsap";

const textureCache = new Map<string, THREE.Texture>();
const failedUrls = new Set<string>();

function NodeSphere({ url, isDollhouseMode, baseOpacity = 1, position = [0, 0, 0], rotationOffset = 0, onPointerClick }: { url: string; isDollhouseMode?: boolean, baseOpacity?: number, position?: [number, number, number], rotationOffset?: number, onPointerClick?: (e: any) => void }) {
  const { gl } = useThree();
  const [texture, setTexture] = useState<THREE.Texture | null>(() => (url ? textureCache.get(url) || null : null));
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useEffect(() => {
    if (!url || url.trim() === "") {
      setTexture(null);
      return;
    }

    const cached = textureCache.get(url);
    if (cached) {
      setTexture(cached);
      return;
    }

    let active = true;
    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (tex) => {
        if (!active) return;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        try {
          gl.initTexture(tex);
        } catch (e) {
          console.warn("WebGLRenderer.initTexture failed in NodeSphere:", e);
        }
        textureCache.set(url, tex);
        setTexture(tex);
      },
      undefined,
      (err) => {
        console.error("Failed to load texture in NodeSphere:", url, err);
        failedUrls.add(url);
      }
    );

    return () => {
      active = false;
    };
  }, [url, gl]);
  
  useFrame((state, delta) => {
    if (materialRef.current) {
      const targetOpacity = isDollhouseMode ? 0 : baseOpacity;
      materialRef.current.opacity += (targetOpacity - materialRef.current.opacity) * delta * 8;
      materialRef.current.visible = materialRef.current.opacity > 0.01;
    }
  });

  if (!url || url.trim() === "" || !texture) return null;

  return (
    <mesh onClick={onPointerClick} position={position} rotation={[0, rotationOffset, 0]} renderOrder={-10}>
      <sphereGeometry args={[100, 64, 40]} />
      <meshBasicMaterial 
        ref={materialRef}
        map={texture} 
        side={THREE.BackSide} 
        transparent 
        depthWrite={false}
      />
    </mesh>
  );
}

// Dollhouse Modeli (3D Otaq Səhnəsi tərəfindən idarə olunur)
function DollhouseModel({ isDollhouseMode, onClick }: { isDollhouseMode: boolean, onClick?: () => void }) {
  if (!isDollhouseMode) return null;
  return null;
}

function HotspotElement({ hotspot, targetName, onClick }: { hotspot: any, targetName: string, onClick: (pos: THREE.Vector3) => void }) {
  const [hovered, setHovered] = useState(false);
  const ringRef = useRef<THREE.Group>(null);
  const vec = new THREE.Vector3();
  
  useFrame((state) => {
    if (ringRef.current) {
      const scale = hovered ? 1.3 : 1;
      ringRef.current.scale.lerp(vec.set(scale, scale, 1), 0.15);
      ringRef.current.lookAt(state.camera.position);
    }
  });
  
  return (
    <group 
      position={[hotspot.position.x, hotspot.position.y || 0.1, hotspot.position.z]}
      renderOrder={50}
      onClick={(e) => {
        e.stopPropagation();
        onClick(new THREE.Vector3(hotspot.position.x, hotspot.position.y || 0.1, hotspot.position.z));
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Görünməz Böyük Klik Sahəsi */}
      <mesh>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      <group ref={ringRef}>
        {/* Çöl halqa */}
        <mesh>
          <ringGeometry args={[0.3, 0.42, 32]} />
          <meshBasicMaterial color="#10b981" transparent opacity={hovered ? 0.95 : 0.7} side={THREE.DoubleSide} depthTest={false} />
        </mesh>
        
        {/* İçəri dairə */}
        <mesh position={[0, 0, 0.01]}>
            <circleGeometry args={[0.18, 32]} />
            <meshBasicMaterial color="white" transparent opacity={hovered ? 1 : 0.8} side={THREE.DoubleSide} depthTest={false} />
        </mesh>
      </group>

      {/* Tooltip adı */}
      {hovered && (
        <Html center position={[0, 0.7, 0]} zIndexRange={[100, 0]}>
          <div className="bg-emerald-800/90 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap uppercase tracking-wider backdrop-blur-md pointer-events-none border border-emerald-400/40">
            🚪 {targetName}
          </div>
        </Html>
      )}
    </group>
  );
}

function MattertagElement({ tag }: { tag: any }) {
  const [hovered, setHovered] = useState(false);
  const color = tag.color || "#3b82f6";
  
  return (
    <group position={[tag.position.x, tag.position.y, tag.position.z]} renderOrder={50}>
      {/* 3D Nöqtə (Point) - Stem-in üstündə */}
      <mesh 
        position={[0, 0.4, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <circleGeometry args={[0.08, 32]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} depthTest={false} />
      </mesh>
      
      {/* Nöqtənin ətrafında halqa */}
      <mesh position={[0, 0.4, -0.01]}>
         <circleGeometry args={[0.12, 32]} />
         <meshBasicMaterial color="white" side={THREE.DoubleSide} depthTest={false} />
      </mesh>
      
      {/* Kiçik dikmə (Stem) - Yuxarıdan aşağı (0.4 -> 0) */}
      <Line points={[[0, 0.4, 0], [0, 0, 0]]} color="white" lineWidth={2} depthTest={false} />

      {/* HTML Məlumat Qutusu */}
      <Html center position={[0, 0.8, 0]} zIndexRange={[100, 0]}>
        <div 
          className={`flex flex-col transition-all duration-300 ease-out origin-bottom ${hovered ? "scale-100 opacity-100" : "scale-50 opacity-0 pointer-events-none"}`}
          style={{ width: '220px' }}
        >
          <div className="bg-neutral-900/90 text-white rounded-xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-md">
             <div className="px-4 py-2 border-b border-white/10 flex items-center gap-2" style={{ backgroundColor: color + '40' }}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                <h3 className="font-bold text-sm m-0">{tag.title}</h3>
             </div>
             <div className="p-4 text-xs text-neutral-300 leading-relaxed">
                {tag.description}
             </div>
          </div>
        </div>
      </Html>
    </group>
  );
}

function TeleportRing({ node, onClick }: { node: any; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const scaleRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const vec = new THREE.Vector3();

  useFrame((state) => {
    if (scaleRef.current) {
      const s = hovered ? 1.4 : 1.0;
      scaleRef.current.scale.lerp(vec.set(s, s, 1), 0.2);
    }
    if (pulseRef.current) {
      const t = (state.clock.getElapsedTime() * 2) % 1;
      pulseRef.current.scale.set(1 + t * 0.6, 1 + t * 0.6, 1);
      (pulseRef.current.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.5;
    }
  });

  return (
    <group 
      position={[node.position.x, 0.08, node.position.z]}
      renderOrder={50}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Görünməz Böyük Klik Sahəsi (Hit Area) - Kliklənmənin tam asanlaşdırılması üçün */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.7, 16]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      <group ref={scaleRef} rotation={[-Math.PI / 2, 0, 0]}>
        {/* Pulsasiya edən genişlənən dalğa halqası (Matterport stili) */}
        <mesh ref={pulseRef}>
          <ringGeometry args={[0.25, 0.38, 32]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.4} side={THREE.DoubleSide} depthTest={false} />
        </mesh>

        {/* Xarici Parlaq Yaşıl Halqa */}
        <mesh position={[0, 0, 0.005]}>
          <ringGeometry args={[0.25, 0.38, 32]} />
          <meshBasicMaterial color={hovered ? "#34d399" : "#10b981"} transparent opacity={hovered ? 1.0 : 0.75} side={THREE.DoubleSide} depthTest={false} />
        </mesh>

        {/* Daxili Dairə (Ağ Vurğu ilə) */}
        <mesh position={[0, 0, 0.01]}>
          <circleGeometry args={[0.15, 32]} />
          <meshBasicMaterial color={hovered ? "#ffffff" : "#10b981"} transparent opacity={hovered ? 0.9 : 0.4} side={THREE.DoubleSide} depthTest={false} />
        </mesh>
      </group>

      {/* Başlıq */}
      {hovered && (
        <Html center position={[0, 0.6, 0]} zIndexRange={[100, 0]}>
          <div className="bg-emerald-600/90 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xl pointer-events-none whitespace-nowrap uppercase tracking-wider backdrop-blur-md border border-emerald-300/40">
            📍 {node.name}
          </div>
        </Html>
      )}
    </group>
  );
}

export default function TourViewer() {
  const { 
    hotspots, mattertags, 
    currentTourNodeId, setCurrentTourNodeId, 
    isAutoTourPlaying, tourBuilderMode, setTourBuilderMode, 
    addHotspot, addMattertag,
    isDollhouseMode, setIsDollhouseMode,
    isDefurnishedMode,
    furnitureLayers,
    currentFloor,
    view3DIn360,
    roomSize
  } = useStore();
  const { camera, scene, controls } = useThree() as any;
  
  // Dinamik kamera qovşaqlarını otaqdakı 360 Kameralardan əldə edirik
  const dynamicTourNodes: TourNode[] = useMemo(() => {
    const cams = furnitureLayers.filter(
      f => (f.type === "camera" || f.name.includes("360 Kamera")) && (f.floor ?? 0) === currentFloor
    );
    if (cams.length === 0) {
      return [
        { id: "default-camera", name: "Mərkəz Nöqtəsi", panoramaUrl: "", position: { x: 0, y: 1.5, z: 0 } }
      ];
    }
    return cams.map((c, idx) => ({
      id: c.id,
      name: c.name || `Kamera ${idx + 1}`,
      panoramaUrl: c.panoramaUrl || "",
      originalUrl: c.panoramaUrl || "",
      position: { x: c.position.x, y: c.position.y + 0.75, z: c.position.z },
      rotationOffset: c.rotationOffset || 0
    }));
  }, [furnitureLayers, currentFloor]);

  // Əgər cari node etibarsızdırsa, avtomatik birincini təyin edirik. Şəkil yoxdursa Real 3D rejimini aktiv edirik.
  useEffect(() => {
    if (!currentTourNodeId || !dynamicTourNodes.find(n => n.id === currentTourNodeId)) {
      if (dynamicTourNodes.length > 0) {
        setCurrentTourNodeId(dynamicTourNodes[0].id);
      }
    }
    const curr = dynamicTourNodes.find(n => n.id === currentTourNodeId) || dynamicTourNodes[0];
    if (curr && (!curr.panoramaUrl || curr.panoramaUrl.trim() === "")) {
      useStore.setState({ view3DIn360: true });
    }
  }, [dynamicTourNodes, currentTourNodeId, setCurrentTourNodeId]);

  // Səhnənin arxa rəngini qaranlıq saxlayırıq (skybox olmadıqda gözəl görünsün)
  useEffect(() => {
    scene.background = new THREE.Color("#0a0a0c");
  }, [scene]);
  
  const currentNode = dynamicTourNodes.find(n => n.id === currentTourNodeId) || dynamicTourNodes[0];
  const currentHotspots = hotspots.filter(h => h.sourceNodeId === currentNode?.id);
  const currentTags = mattertags.filter(t => t.nodeId === currentNode?.id);

  // Digər kameraların siyahısı
  const otherCameras = useMemo(() => {
    return dynamicTourNodes.filter(n => n.id !== currentNode?.id);
  }, [dynamicTourNodes, currentNode]);

  const [activeUrl, setActiveUrl] = useState(
    (isDefurnishedMode && currentNode?.defurnishedUrl) 
      ? currentNode.defurnishedUrl 
      : (currentNode?.originalUrl || currentNode?.panoramaUrl || "")
  );
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [fade, setFade] = useState(1); 
  const [dollhouseOpacity, setDollhouseOpacity] = useState(0);
  const [cacheVersion, setCacheVersion] = useState(0);
  const [pendingHotspotPos, setPendingHotspotPos] = useState<{ x: number; y: number; z: number } | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Background preloader for all nodes
  const { gl } = useThree() as any;
  useEffect(() => {
    let active = true;
    const urlsToPreload: string[] = [];
    dynamicTourNodes.forEach((node) => {
      if (node.panoramaUrl) urlsToPreload.push(node.panoramaUrl);
      if (node.originalUrl) urlsToPreload.push(node.originalUrl);
      if (node.defurnishedUrl) urlsToPreload.push(node.defurnishedUrl);
    });

    const loader = new THREE.TextureLoader();

    urlsToPreload.forEach((url) => {
      if (!url || textureCache.has(url) || failedUrls.has(url)) return;

      loader.load(
        url,
        (texture) => {
          if (!active || !isMountedRef.current) return;
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.minFilter = THREE.LinearFilter;
          texture.generateMipmaps = false;
          try {
            if (gl && gl.isWebGLRenderer) {
              gl.initTexture(texture);
            }
          } catch (e) {
            console.warn("WebGLRenderer.initTexture failed during preloading:", e);
          }
          textureCache.set(url, texture);
          if (active && isMountedRef.current) {
            setCacheVersion((v) => v + 1);
          }
        },
        undefined,
        (err) => {
          if (!active || !isMountedRef.current) return;
          console.error("Failed to preload texture:", url, err);
          failedUrls.add(url);
          if (active && isMountedRef.current) {
            setCacheVersion((v) => v + 1);
          }
        }
      );
    });

    return () => {
      active = false;
    };
  }, [dynamicTourNodes, gl]);

  useEffect(() => {
    if (currentNode) {
      const targetUrl = (isDefurnishedMode && currentNode.defurnishedUrl) 
        ? currentNode.defurnishedUrl 
        : (currentNode.originalUrl || currentNode.panoramaUrl);
      
      if (targetUrl !== activeUrl) {
        setNextUrl(targetUrl || null);
      }
    }
  }, [currentNode, activeUrl, isDefurnishedMode]);

  useFrame((state, delta) => {
    // Sfera keçid animasiyası
    if (nextUrl) {
      // Növbəti şəkil tam yüklənib/hazır olana qədər animasiyanı başlatmırıq (qara ekrandan qaçmaq üçün)
      if (!textureCache.has(nextUrl) && !failedUrls.has(nextUrl)) {
        return;
      }

      setFade((prev) => Math.max(0, prev - delta * 1.5));
      if (fade <= 0) {
        setActiveUrl(nextUrl);
        setNextUrl(null);
        setFade(1);
      }
    }
  });

  const handleSphereClick = (e: any) => {
    e.stopPropagation();
    if (tourBuilderMode === "idle") {
      useStore.setState({ selectedId: null });
      return;
    }
    if (!currentNode) return;
    
    // Kamera ilə kəsişmə nöqtəsi arasındakı vektoru tapıb məsafəni 6 olaraq qısaltdıq (Çox uzaq olmasın deyə)
    const dir = e.point.clone().sub(camera.position).normalize();
    const placementPos = camera.position.clone().add(dir.multiplyScalar(6));

    if (tourBuilderMode === "add-hotspot") {
      const otherCameras = dynamicTourNodes.filter(n => n.id !== currentNode.id);
      if (otherCameras.length === 0) {
        alert("Keçid (Hotspot) yaratmaq üçün otaqda ən azı 2 ədəd '360 Kamera' olmalıdır. Zəhmət olmasa əvvəlcə Kataloqdan daha bir kamera əlavə edin (və ya aşağıdakı panel vasitəsilə yeni otaq şəkli yükləyin).");
        return;
      }
      setPendingHotspotPos({ x: placementPos.x, y: placementPos.y, z: placementPos.z });
    } else if (tourBuilderMode === "add-tag") {
      const title = prompt("Etiketin Başlığı:");
      if (title) {
        const desc = prompt("Etiketin Təsviri (Məlumatı):");
        addMattertag({
          id: `tag-${Date.now()}`,
          nodeId: currentNode.id,
          title: title,
          description: desc || "",
          position: { x: placementPos.x, y: placementPos.y, z: placementPos.z },
          color: "#3b82f6"
        });
        setTourBuilderMode("idle");
      }
    }
  };

  const handleFloorClick = (e: any) => {
    e.stopPropagation();
    if (tourBuilderMode === "idle") {
      useStore.setState({ selectedId: null });
      return;
    }
    if (!currentNode) return;
    
    // Kliklənilən nöqtəni birbaşa götürürük
    const placementPos = e.point.clone();
    placementPos.y = 0.05; // Z-fighting olmasın deyə yuxarı qaldırırıq

    if (tourBuilderMode === "add-hotspot") {
      const otherCameras = dynamicTourNodes.filter(n => n.id !== currentNode.id);
      if (otherCameras.length === 0) {
        alert("Keçid (Hotspot) yaratmaq üçün otaqda ən azı 2 ədəd '360 Kamera' olmalıdır. Zəhmət olmasa əvvəlcə Kataloqdan daha bir kamera əlavə edin (və ya aşağıdakı panel vasitəsilə yeni otaq şəkli yükləyin).");
        return;
      }
      setPendingHotspotPos({ x: placementPos.x, y: placementPos.y, z: placementPos.z });
    } else if (tourBuilderMode === "add-tag") {
      const title = prompt("Etiketin Başlığı:");
      if (title) {
        const desc = prompt("Etiketin Təsviri (Məlumatı):");
        addMattertag({
          id: `tag-${Date.now()}`,
          nodeId: currentNode.id,
          title: title,
          description: desc || "",
          position: { x: placementPos.x, y: placementPos.y, z: placementPos.z },
          color: "#3b82f6"
        });
        setTourBuilderMode("idle");
      }
    }
  };

  const handleHotspotClick = (targetId: string, pos: THREE.Vector3) => {
    // Hədəf kameranın şəklini dərhal (GSAP animasiyası zamanı) yükləyirik (Yüksək prioritet)
    const targetNode = dynamicTourNodes.find(n => n.id === targetId);
    if (targetNode) {
      const targetUrl = (isDefurnishedMode && targetNode.defurnishedUrl) 
        ? targetNode.defurnishedUrl 
        : (targetNode.originalUrl || targetNode.panoramaUrl);
      
      if (targetUrl && !textureCache.has(targetUrl) && !failedUrls.has(targetUrl)) {
        const loader = new THREE.TextureLoader();
        loader.load(
          targetUrl,
          (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.minFilter = THREE.LinearFilter;
            texture.generateMipmaps = false;
            try {
              gl.initTexture(texture);
            } catch (e) {
              console.warn("WebGLRenderer.initTexture failed on hotspot click:", e);
            }
            textureCache.set(targetUrl, texture);
            setCacheVersion((v) => v + 1);
          },
          undefined,
          (err) => {
            console.error("Failed to load target texture on hotspot click:", targetUrl, err);
            failedUrls.add(targetUrl);
            setCacheVersion((v) => v + 1);
          }
        );
      }
    }

    if (isDollhouseMode) {
      setIsDollhouseMode(false);
    }
    setCurrentTourNodeId(targetId);
  };

  if (!currentNode) return null;

  return (
    <group>
      {/* Real-time 3D rejimində döşəməyə klikləyərək hotspot və ya tag yerləşdirmək üçün şəffaf klik müstəvisi */}
      {view3DIn360 && tourBuilderMode !== "idle" && (
        <mesh 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, 0.02, 0]} 
          onClick={handleFloorClick}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'auto';
          }}
        >
          <planeGeometry args={[roomSize.width, roomSize.length]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      )}



      {/* Yalnız statik şəkil rejimində panorama sferasını göstəririk */}
      {!view3DIn360 && activeUrl && currentNode?.position && (
        <NodeSphere 
          url={activeUrl} 
          isDollhouseMode={isDollhouseMode} 
          baseOpacity={1} 
          position={[currentNode.position.x, 0, currentNode.position.z]} 
          rotationOffset={currentNode.rotationOffset || 0}
          onPointerClick={handleSphereClick} 
        />
      )}
      
      {!view3DIn360 && nextUrl && (
        <NodeSphere 
          url={nextUrl} 
          isDollhouseMode={isDollhouseMode} 
          baseOpacity={1 - fade} 
          position={(() => {
            const targetNode = dynamicTourNodes.find(n => (isDefurnishedMode && n.defurnishedUrl === nextUrl) || n.originalUrl === nextUrl || n.panoramaUrl === nextUrl);
            return targetNode?.position ? [targetNode.position.x, 0, targetNode.position.z] : [0, 0, 0];
          })()} 
          rotationOffset={(() => {
            const targetNode = dynamicTourNodes.find(n => (isDefurnishedMode && n.defurnishedUrl === nextUrl) || n.originalUrl === nextUrl || n.panoramaUrl === nextUrl);
            return targetNode?.rotationOffset || 0;
          })()}
        />
      )}

      {/* Digər 360 Kamera mövqelərinə keçmək üçün parıldayan Matterport halqaları */}
      {!nextUrl && otherCameras.map(node => node.position && (
        <TeleportRing 
          key={node.id} 
          node={node} 
          onClick={() => handleHotspotClick(node.id, new THREE.Vector3(node.position!.x, node.position!.y, node.position!.z))}
        />
      ))}

      {/* Əl ilə yerləşdirilmiş Hotspot-lar yalnız keçid bitdikdən sonra göstərilir */}
      {!nextUrl && currentHotspots.map(hotspot => {
        const targetNode = dynamicTourNodes.find(n => n.id === hotspot.targetNodeId);
        if (!targetNode) return null;
        
        return (
          <HotspotElement 
            key={hotspot.id} 
            hotspot={hotspot} 
            targetName={targetNode.name} 
            onClick={(pos) => handleHotspotClick(targetNode.id, pos)} 
          />
        );
      })}

      {/* Mattertags */}
      {!nextUrl && currentTags.map(tag => (
        <MattertagElement key={tag.id} tag={tag} />
      ))}

      {/* Floating Room Selector Overlay */}
      {pendingHotspotPos && (
        <Html center position={[pendingHotspotPos.x, pendingHotspotPos.y + 0.4, pendingHotspotPos.z]} zIndexRange={[120, 0]}>
          <div className="bg-[#0b0b0e]/95 backdrop-blur-md text-white border border-white/10 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-3 min-w-[220px] pointer-events-auto select-none">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Hədəf Otaq Seçin</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setPendingHotspotPos(null);
                  setTourBuilderMode("idle");
                }}
                className="text-[9px] font-bold text-rose-400 hover:text-rose-300 transition-colors uppercase tracking-widest px-1.5 py-0.5 rounded hover:bg-rose-500/10"
              >
                İmtina
              </button>
            </div>
            
            <div className="flex flex-col gap-1 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
              {otherCameras.length === 0 ? (
                <div className="text-[10px] text-neutral-400 text-center py-4">Digər kamera tapılmadı.</div>
              ) : (
                otherCameras.map((node) => (
                  <button
                    key={node.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      addHotspot({
                        id: `hotspot-${Date.now()}`,
                        sourceNodeId: currentNode.id,
                        targetNodeId: node.id,
                        position: { x: pendingHotspotPos.x, y: pendingHotspotPos.y, z: pendingHotspotPos.z }
                      });
                      setPendingHotspotPos(null);
                      setTourBuilderMode("idle");
                    }}
                    className="w-full text-left p-1.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.08] transition-all flex items-center gap-2 border border-white/5 group cursor-pointer"
                  >
                    {node.panoramaUrl ? (
                      <div className="w-10 h-7 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                        <img 
                          src={node.panoramaUrl} 
                          alt={node.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 text-[10px]">
                        📷
                      </div>
                    )}
                    <span className="text-[11px] font-bold text-neutral-200 group-hover:text-white truncate">
                      {node.name}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
