"use client";

import React, { useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Grid, TransformControls, useGLTF, Html, PerspectiveCamera, OrthographicCamera, useHelper, PointerLockControls, Line, useTexture, ContactShadows, Environment, SoftShadows, RoundedBox } from "@react-three/drei";
import { EffectComposer, N8AO, Bloom, SMAA } from "@react-three/postprocessing";
import { useStore } from "@/store/useStore";
import * as THREE from "three";
import gsap from "gsap";
import RoomWalls from "@/components/RoomWalls";
import TourViewer from "@/components/TourViewer";
import { useMultiplayer } from "@/hooks/useMultiplayer";
import { getRoomAtPosition, clampPositionToRoom, getRulerDistancesForRoom } from "@/lib/roomSystem";

// Süni gecikmə
const delayCache = new Set();
function simulateNetworkDelay(url: string) {
  if (!delayCache.has(url)) {
    throw new Promise((resolve) => {
      setTimeout(() => {
        delayCache.add(url);
        resolve(true);
      }, 500); // Gecikməni test üçün biraz azaltdıq
    });
  }
}

function ModelLoader() {
  return (
    <Html center>
      <div className="px-4 py-2 bg-neutral-900/80 text-white rounded-full text-xs font-mono whitespace-nowrap border border-neutral-700 backdrop-blur-md">
        <span className="animate-pulse">⏳ Yüklənir...</span>
      </div>
    </Html>
  );
}

function GltfModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  React.useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as any).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [clonedScene]);

  return <primitive object={clonedScene} />;
}

// Procedural (Ağıllı) 3D Modellər generatoru - HomeByMe keyfiyyətində detallı yığım
function SmartModel({ name, color, modelUrl, scale, doorStyle }: { name: string; color: string; modelUrl: string | null; scale?: any; doorStyle?: string }) {
  const { appMode } = useStore();

  if (modelUrl) {
    return <GltfModel url={modelUrl} />;
  }
  
  // 1. İŞ MASASI (Desk)
  if (name.includes("Masa") || name.includes("Stol")) {
    return (
      <group>
        {/* Cilalanmış Taxta Masa Üstü */}
        <RoundedBox args={[2.0, 0.06, 1.0]} radius={0.01} smoothness={4} position={[0, 0.73, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
        </RoundedBox>
        
        {/* Metalik Elegant Ayaqlar */}
        <mesh position={[-0.9, 0.35, -0.4]} castShadow receiveShadow><cylinderGeometry args={[0.03, 0.015, 0.7]} /><meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} /></mesh>
        <mesh position={[0.9, 0.35, -0.4]} castShadow receiveShadow><cylinderGeometry args={[0.03, 0.015, 0.7]} /><meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} /></mesh>
        <mesh position={[-0.9, 0.35, 0.4]} castShadow receiveShadow><cylinderGeometry args={[0.03, 0.015, 0.7]} /><meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} /></mesh>
        <mesh position={[0.9, 0.35, 0.4]} castShadow receiveShadow><cylinderGeometry args={[0.03, 0.015, 0.7]} /><meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} /></mesh>
        
        {/* Çəkməcə Bloku (Masanın altında) */}
        <RoundedBox args={[0.4, 0.4, 0.8]} radius={0.015} smoothness={4} position={[0.6, 0.45, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </RoundedBox>
        {/* Çəkməcə Qulpu */}
        <RoundedBox args={[0.15, 0.02, 0.02]} radius={0.005} smoothness={4} position={[0.6, 0.52, 0.41]} castShadow receiveShadow>
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} /> {/* Qızılı qulp */}
        </RoundedBox>
      </group>
    );
  }

  // 2. KRESLO / STUL (Chair)
  if (name.includes("Kreslo") || name.includes("Stul")) {
    return (
      <group>
        {/* Oturacaq (Yumşaq) */}
        <RoundedBox args={[0.55, 0.08, 0.55]} radius={0.02} smoothness={4} position={[0, 0.45, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.8} />
        </RoundedBox>
        
        {/* Erqonomik Arxalıq */}
        <RoundedBox args={[0.5, 0.5, 0.06]} radius={0.02} smoothness={4} position={[0, 0.75, -0.22]} rotation={[0.05, 0, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.8} />
        </RoundedBox>
        
        {/* Metalik Dəstək və Təkərlər */}
        <mesh position={[0, 0.22, 0]} castShadow receiveShadow><cylinderGeometry args={[0.03, 0.03, 0.4]} /><meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} /></mesh>
        {/* 5-Ulduz Ucları */}
        <RoundedBox args={[0.5, 0.03, 0.05]} radius={0.005} smoothness={4} position={[0, 0.05, 0]} rotation={[0, 0, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#222" />
        </RoundedBox>
        <RoundedBox args={[0.5, 0.03, 0.05]} radius={0.005} smoothness={4} position={[0, 0.05, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#222" />
        </RoundedBox>
      </group>
    );
  }

  // 3. İKİ NƏFƏRLİK YATAQ (Double Bed)
  if (name.includes("Yataq")) {
    return (
      <group>
        {/* Yataq Karkası (Taxta) */}
        <RoundedBox args={[1.7, 0.2, 2.1]} radius={0.015} smoothness={4} position={[0, 0.1, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#3e2723" roughness={0.6} /> {/* Tünd taxta */}
        </RoundedBox>
        
        {/* Başlıq (Baş tərəfi) */}
        <RoundedBox args={[1.75, 1.0, 0.1]} radius={0.02} smoothness={4} position={[0, 0.6, -1.0]} castShadow receiveShadow>
          <meshStandardMaterial color="#3e2723" roughness={0.6} />
        </RoundedBox>
        
        {/* Döşək (Yumşaq Ağ) */}
        <RoundedBox args={[1.6, 0.3, 1.95]} radius={0.03} smoothness={4} position={[0, 0.32, 0.05]} castShadow receiveShadow>
          <meshStandardMaterial color="#fcfcfc" roughness={0.9} />
        </RoundedBox>
        
        {/* Yorğan / Çarşaf (Yatağın üstü) */}
        <RoundedBox args={[1.62, 0.28, 1.3]} radius={0.02} smoothness={4} position={[0, 0.34, 0.3]} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.8} />
        </RoundedBox>
        
        {/* Yastıqlar (2 ədəd) */}
        <RoundedBox args={[0.6, 0.12, 0.4]} radius={0.03} smoothness={4} position={[-0.4, 0.5, -0.7]} rotation={[0.15, 0, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#f0f0f0" roughness={0.95} />
        </RoundedBox>
        <RoundedBox args={[0.6, 0.12, 0.4]} radius={0.03} smoothness={4} position={[0.4, 0.5, -0.7]} rotation={[0.15, 0, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#f0f0f0" roughness={0.95} />
        </RoundedBox>
 
        {/* Tumboçkalar (Komodin - Sol və Sağ) */}
        <group position={[-1.1, 0.2, -0.9]}>
          <RoundedBox args={[0.4, 0.4, 0.4]} radius={0.015} smoothness={4} castShadow receiveShadow>
            <meshStandardMaterial color="#3e2723" />
          </RoundedBox>
          <RoundedBox args={[0.1, 0.02, 0.02]} radius={0.003} smoothness={4} position={[0, 0.1, 0.21]} castShadow receiveShadow>
            <meshStandardMaterial color="#d4af37" metalness={0.9} />
          </RoundedBox>
        </group>
        <group position={[1.1, 0.2, -0.9]}>
          <RoundedBox args={[0.4, 0.4, 0.4]} radius={0.015} smoothness={4} castShadow receiveShadow>
            <meshStandardMaterial color="#3e2723" />
          </RoundedBox>
          <RoundedBox args={[0.1, 0.02, 0.02]} radius={0.003} smoothness={4} position={[0, 0.1, 0.21]} castShadow receiveShadow>
            <meshStandardMaterial color="#d4af37" metalness={0.9} />
          </RoundedBox>
        </group>
      </group>
    );
  }

  // 4. DİVAN (Sofa)
  if (name.includes("Divan")) {
    return (
      <group>
        {/* Alt Karkas */}
        <RoundedBox args={[2.0, 0.1, 0.8]} radius={0.01} smoothness={4} position={[0, 0.15, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#2d1c14" roughness={0.7} />
        </RoundedBox>
        
        {/* Taxta Silindrik Ayaqlar (Angled) */}
        <mesh position={[-0.9, 0.05, 0.3]} rotation={[0.1, 0, -0.1]} castShadow receiveShadow><cylinderGeometry args={[0.03, 0.02, 0.1]} /><meshStandardMaterial color="#e0a96d" roughness={0.4} /></mesh>
        <mesh position={[0.9, 0.05, 0.3]} rotation={[0.1, 0, 0.1]} castShadow receiveShadow><cylinderGeometry args={[0.03, 0.02, 0.1]} /><meshStandardMaterial color="#e0a96d" roughness={0.4} /></mesh>
        <mesh position={[-0.9, 0.05, -0.3]} rotation={[-0.1, 0, -0.1]} castShadow receiveShadow><cylinderGeometry args={[0.03, 0.02, 0.1]} /><meshStandardMaterial color="#e0a96d" roughness={0.4} /></mesh>
        <mesh position={[0.9, 0.05, -0.3]} rotation={[-0.1, 0, 0.1]} castShadow receiveShadow><cylinderGeometry args={[0.03, 0.02, 0.1]} /><meshStandardMaterial color="#e0a96d" roughness={0.4} /></mesh>
 
        {/* 3 Ədəd Oturacaq Yastığı (Cushions) */}
        <RoundedBox args={[0.58, 0.15, 0.7]} radius={0.025} smoothness={4} position={[-0.6, 0.26, 0.05]} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.85} />
        </RoundedBox>
        <RoundedBox args={[0.58, 0.15, 0.7]} radius={0.025} smoothness={4} position={[0, 0.26, 0.05]} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.85} />
        </RoundedBox>
        <RoundedBox args={[0.58, 0.15, 0.7]} radius={0.025} smoothness={4} position={[0.6, 0.26, 0.05]} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.85} />
        </RoundedBox>
        
        {/* Qollar (Armrests) */}
        <RoundedBox args={[0.15, 0.35, 0.8]} radius={0.025} smoothness={4} position={[-0.95, 0.35, 0.05]} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.85} />
        </RoundedBox>
        <RoundedBox args={[0.15, 0.35, 0.8]} radius={0.025} smoothness={4} position={[0.95, 0.35, 0.05]} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.85} />
        </RoundedBox>
        
        {/* Arxalıq Yastıqları */}
        <RoundedBox args={[0.58, 0.5, 0.15]} radius={0.03} smoothness={4} position={[-0.6, 0.6, -0.3]} rotation={[-0.1, 0, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.85} />
        </RoundedBox>
        <RoundedBox args={[0.58, 0.5, 0.15]} radius={0.03} smoothness={4} position={[0, 0.6, -0.3]} rotation={[-0.1, 0, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.85} />
        </RoundedBox>
        <RoundedBox args={[0.58, 0.5, 0.15]} radius={0.03} smoothness={4} position={[0.6, 0.6, -0.3]} rotation={[-0.1, 0, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.85} />
        </RoundedBox>
        
        {/* Divan Arxası Dəstək Paneli */}
        <RoundedBox args={[2.0, 0.5, 0.1]} radius={0.015} smoothness={4} position={[0, 0.45, -0.38]} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.85} />
        </RoundedBox>
 
        {/* Dekorativ Balışlar (Throw Pillows - Sarı/Narıncı) */}
        <RoundedBox args={[0.3, 0.3, 0.1]} radius={0.03} smoothness={4} position={[-0.72, 0.38, 0.2]} rotation={[0, 0.4, 0.3]} castShadow receiveShadow>
          <meshStandardMaterial color="#e0a96d" roughness={0.9} />
        </RoundedBox>
        <RoundedBox args={[0.3, 0.3, 0.1]} radius={0.03} smoothness={4} position={[0.72, 0.38, 0.2]} rotation={[0, -0.4, -0.3]} castShadow receiveShadow>
          <meshStandardMaterial color="#e0a96d" roughness={0.9} />
        </RoundedBox>
      </group>
    );
  }
 
  // 5. QARDEROB / ŞKAF (Cabinet)
  if (name.includes("Şkaf") || name.includes("Qarderob")) {
    return (
      <group>
         {/* Əsas Gövdə (Taxta) */}
         <RoundedBox args={[1.2, 2.0, 0.6]} radius={0.015} smoothness={2} position={[0, 1.0, 0]} castShadow receiveShadow>
           <meshStandardMaterial color={color} roughness={0.5} />
         </RoundedBox>
         
         {/* Şüşə/Güzgü Panelləri (Qapılarda) */}
         <mesh position={[-0.28, 1.0, 0.305]} castShadow receiveShadow>
           <boxGeometry args={[0.5, 1.8, 0.01]} />
           <meshStandardMaterial color="#ffffff" metalness={0.95} roughness={0.05} transparent opacity={0.6} />
         </mesh>
         <mesh position={[0.28, 1.0, 0.305]} castShadow receiveShadow>
           <boxGeometry args={[0.5, 1.8, 0.01]} />
           <meshStandardMaterial color={color} roughness={0.6} />
         </mesh>
         
         {/* Zərif Qızılı Qulplar (Vertical Handles) */}
         <mesh position={[-0.05, 1.0, 0.32]} castShadow receiveShadow>
           <boxGeometry args={[0.02, 0.3, 0.02]} />
           <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
         </mesh>
         <mesh position={[0.05, 1.0, 0.32]} castShadow receiveShadow>
           <boxGeometry args={[0.02, 0.3, 0.02]} />
           <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
         </mesh>
      </group>
    )
  }
 
  // 6. TELEVİZOR (Television)
  if (name.includes("Televizor") || name.includes("TV")) {
    return (
      <group>
         {/* Çərçivə (Bezel - Slate Grey) */}
         <RoundedBox args={[1.6, 0.9, 0.04]} radius={0.008} smoothness={4} position={[0, 0.5, 0]} castShadow receiveShadow>
           <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.8} />
         </RoundedBox>
         {/* Glossy Parlaq Ekran */}
         <RoundedBox args={[1.56, 0.86, 0.01]} radius={0.002} smoothness={4} position={[0, 0.5, 0.021]} castShadow receiveShadow>
           <meshStandardMaterial color="#050505" roughness={0.05} metalness={0.9} />
         </RoundedBox>
         
         {/* Metal Altlıq Stendi */}
         <RoundedBox args={[0.5, 0.02, 0.3]} radius={0.005} smoothness={4} position={[0, 0.03, 0]} castShadow receiveShadow>
           <meshStandardMaterial color="#111" metalness={0.8} />
         </RoundedBox>
         <mesh position={[0, 0.08, 0]} castShadow receiveShadow><cylinderGeometry args={[0.03, 0.03, 0.1]} /><meshStandardMaterial color="#111" metalness={0.8} /></mesh>
      </group>
    )
  }
 
  // 7. DEKORATİV BİTKİ (Plant)
  if (name.includes("Bitki")) {
    return (
      <group>
         {/* Seramik Keramika Dibçək */}
         <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
           <cylinderGeometry args={[0.22, 0.16, 0.4, 16]} />
           <meshStandardMaterial color="#f5f5f5" roughness={0.1} /> {/* Parlaq ağ seramik */}
         </mesh>
         
         {/* Dibçək Torpağı */}
         <mesh position={[0, 0.38, 0]} receiveShadow><cylinderGeometry args={[0.2, 0.2, 0.02]} /><meshStandardMaterial color="#3e2723" roughness={0.9} /></mesh>
         
         {/* Yarpaqlar (Lush Greenery - Fərqli açılarda yığılmış kürə və konuslar) */}
         <group position={[0, 0.4, 0]}>
           <mesh position={[0, 0.2, 0]} castShadow receiveShadow><sphereGeometry args={[0.25]} /><meshStandardMaterial color="#2e5c30" roughness={0.8} /></mesh>
           <mesh position={[0.15, 0.35, 0.15]} castShadow receiveShadow><sphereGeometry args={[0.2]} /><meshStandardMaterial color="#3a753d" roughness={0.8} /></mesh>
           <mesh position={[-0.18, 0.3, -0.1]} castShadow receiveShadow><sphereGeometry args={[0.18]} /><meshStandardMaterial color="#448a48" roughness={0.8} /></mesh>
           <mesh position={[0.1, 0.45, -0.15]} castShadow receiveShadow><sphereGeometry args={[0.15]} /><meshStandardMaterial color="#2e5c30" roughness={0.8} /></mesh>
         </group>
      </group>
    )
  }
 
  // 8. SPOT İŞIQ (Spotlight)
  if (name.includes("Spot")) {
    return (
      <group>
        {/* Metalik Silindr Gövde (Tavandan asılan spot) */}
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow><cylinderGeometry args={[0.08, 0.08, 0.3, 16]} /><meshStandardMaterial color="#111111" metalness={0.9} roughness={0.2} /></mesh>
        {/* Parlayan Lens */}
        <mesh position={[0, 0.045, 0]}><cylinderGeometry args={[0.07, 0.07, 0.01, 16]} /><meshBasicMaterial color={color} /></mesh>
      </group>
    );
  }
 
  // 9. LÜSTR / ÇILÇIQ (Chandelier)
  if (name.includes("Lüstr") || name.includes("Çılçıq")) {
    return (
      <group>
        {/* Tavandan asılan nazik metal ip */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow><cylinderGeometry args={[0.005, 0.005, 1.0]} /><meshStandardMaterial color="#d4af37" metalness={0.9} /></mesh>
        
        {/* Elegant Qızılı Çəmbər Frame */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <torusGeometry args={[0.4, 0.02, 16, 48]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* 3 Ədəd Parlayan Kürə Lampaları */}
        <mesh position={[0.3, 0, 0.2]} castShadow receiveShadow><sphereGeometry args={[0.08]} /><meshBasicMaterial color="#ffffff" /></mesh>
        <mesh position={[-0.3, 0, 0.2]} castShadow receiveShadow><sphereGeometry args={[0.08]} /><meshBasicMaterial color="#ffffff" /></mesh>
        <mesh position={[0, 0, -0.35]} castShadow receiveShadow><sphereGeometry args={[0.08]} /><meshBasicMaterial color="#ffffff" /></mesh>
      </group>
    );
  }
 
  // 10. LED LENT (LED Strip)
  if (name.includes("LED")) {
    return (
      <group>
        {/* Nazik LED lent mesh-i */}
        <RoundedBox args={[1.5, 0.015, 0.015]} radius={0.002} smoothness={4} position={[0, 0, 0]} castShadow receiveShadow>
          <meshBasicMaterial color={color} />
        </RoundedBox>
      </group>
    );
  }
 
  // Daxili Bölmə Divarı
  if (name === "Daxili Divar") {
    const dist = scale?.x || 1;
    const thickness = scale?.z || 0.15;
    return (
      <group>
        <RoundedBox args={[1, 1, 1]} radius={0.005} smoothness={4} position={[0, 0, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.9} metalness={0.05} />
        </RoundedBox>
        {/* Sol künc (Pillar) - overlapping-i gizlətmək üçün */}
        <mesh castShadow receiveShadow position={[-0.5, 0, 0]} scale={[1 / dist, 1, 1 / thickness]}>
          <cylinderGeometry args={[thickness / 2, thickness / 2, 1, 16]} />
          <meshStandardMaterial color={color} roughness={0.9} metalness={0.05} />
        </mesh>
        {/* Sağ künc (Pillar) */}
        <mesh castShadow receiveShadow position={[0.5, 0, 0]} scale={[1 / dist, 1, 1 / thickness]}>
          <cylinderGeometry args={[thickness / 2, thickness / 2, 1, 16]} />
          <meshStandardMaterial color={color} roughness={0.9} metalness={0.05} />
        </mesh>
      </group>
    );
  }

  // 11. QAPI (Full 3D Architectural Door Frame & 6 Modern Styles)
  if (name.includes("Qapı")) {
    const is360 = appMode === "360-photo";
    
    // 360° Foto rejimində qapı çərçivəsini və panelini silirik (yalnız divardakı qapı oyuğu/kəsiyi qalır)
    if (is360) {
      return null;
    }

    const doorColor = color && color !== "#ffffff" ? color : "#8b5a2b";
    const style = doorStyle || "classic-wood";

    return (
      <group scale={[1 / 1.1, 1 / 2.1, 1 / 0.2]}>
        {/* 1. MODERN AĞ QAPI (Modern Sleek White) */}
        {style === "modern-white" && (
          <group>
            {/* Çərçivə (Mat Ağ) */}
            <RoundedBox args={[0.08, 2.1, 0.22]} radius={0.005} smoothness={4} position={[-0.52, 1.05, 0]} castShadow receiveShadow>
              <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.05} side={THREE.DoubleSide} />
            </RoundedBox>
            <RoundedBox args={[0.08, 2.1, 0.22]} radius={0.005} smoothness={4} position={[0.52, 1.05, 0]} castShadow receiveShadow>
              <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.05} side={THREE.DoubleSide} />
            </RoundedBox>
            <RoundedBox args={[1.12, 0.08, 0.22]} radius={0.005} smoothness={4} position={[0, 2.06, 0]} castShadow receiveShadow>
              <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.05} side={THREE.DoubleSide} />
            </RoundedBox>

            {/* Qapı Paneli (Parlaq/Mat Ağ + Xrom Zolaq) */}
            <group position={[0, 1.0, 0]}>
              <RoundedBox args={[0.96, 2.0, 0.04]} radius={0.005} smoothness={4} castShadow receiveShadow>
                <meshStandardMaterial color="#f8f9fa" roughness={0.2} metalness={0.05} side={THREE.DoubleSide} />
              </RoundedBox>
              {/* Vertikal Xrom Zolaq */}
              <mesh position={[-0.2, 0, 0.022]} castShadow receiveShadow>
                <boxGeometry args={[0.02, 1.95, 0.002]} />
                <meshStandardMaterial color="#e5e7eb" metalness={0.95} roughness={0.1} side={THREE.DoubleSide} />
              </mesh>
              {/* Silver Handle */}
              <group position={[0.38, 0, 0]}>
                <mesh position={[0, 0, 0.03]} castShadow receiveShadow>
                  <boxGeometry args={[0.02, 0.14, 0.015]} />
                  <meshStandardMaterial color="#d1d5db" metalness={0.9} roughness={0.1} side={THREE.DoubleSide} />
                </mesh>
                <mesh position={[0.04, 0.02, 0.05]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
                  <cylinderGeometry args={[0.01, 0.01, 0.1]} />
                  <meshStandardMaterial color="#d1d5db" metalness={0.9} roughness={0.1} side={THREE.DoubleSide} />
                </mesh>
              </group>
            </group>
          </group>
        )}

        {/* 2. İKİ TAYLI ŞÜŞƏLİ QAPI (Modern Double Glass) */}
        {style === "modern-double-glass" && (
          <group>
            {/* Qara Alüminium Çərçivə */}
            <RoundedBox args={[0.08, 2.1, 0.22]} radius={0.005} smoothness={4} position={[-0.52, 1.05, 0]} castShadow receiveShadow>
              <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.8} side={THREE.DoubleSide} />
            </RoundedBox>
            <RoundedBox args={[0.08, 2.1, 0.22]} radius={0.005} smoothness={4} position={[0.52, 1.05, 0]} castShadow receiveShadow>
              <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.8} side={THREE.DoubleSide} />
            </RoundedBox>
            <RoundedBox args={[1.12, 0.08, 0.22]} radius={0.005} smoothness={4} position={[0, 2.06, 0]} castShadow receiveShadow>
              <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.8} side={THREE.DoubleSide} />
            </RoundedBox>

            {/* Sol və Sağ Şüşə Taylar */}
            <group position={[0, 1.0, 0]}>
              {/* Sol Tay */}
              <group position={[-0.24, 0, 0]}>
                <RoundedBox args={[0.47, 1.98, 0.04]} radius={0.005} smoothness={4} castShadow receiveShadow>
                  <meshStandardMaterial color="#1f2937" roughness={0.3} metalness={0.7} side={THREE.DoubleSide} />
                </RoundedBox>
                <mesh position={[0, 0, 0]} receiveShadow>
                  <planeGeometry args={[0.38, 1.85]} />
                  <meshStandardMaterial color="#38bdf8" transparent opacity={0.35} roughness={0.05} metalness={0.9} side={THREE.DoubleSide} />
                </mesh>
                <mesh position={[0.18, 0, 0.03]} castShadow receiveShadow>
                  <boxGeometry args={[0.02, 0.4, 0.02]} />
                  <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.1} />
                </mesh>
              </group>
              {/* Sağ Tay */}
              <group position={[0.24, 0, 0]}>
                <RoundedBox args={[0.47, 1.98, 0.04]} radius={0.005} smoothness={4} castShadow receiveShadow>
                  <meshStandardMaterial color="#1f2937" roughness={0.3} metalness={0.7} side={THREE.DoubleSide} />
                </RoundedBox>
                <mesh position={[0, 0, 0]} receiveShadow>
                  <planeGeometry args={[0.38, 1.85]} />
                  <meshStandardMaterial color="#38bdf8" transparent opacity={0.35} roughness={0.05} metalness={0.9} side={THREE.DoubleSide} />
                </mesh>
                <mesh position={[-0.18, 0, 0.03]} castShadow receiveShadow>
                  <boxGeometry args={[0.02, 0.4, 0.02]} />
                  <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.1} />
                </mesh>
              </group>
            </group>
          </group>
        )}

        {/* 3. TAXTA & BUZLU ŞÜŞƏ ZOLAQLI QAPI (Wood & Frosted Glass Stripe) */}
        {style === "wood-frosted-glass" && (
          <group>
            <RoundedBox args={[0.08, 2.1, 0.22]} radius={0.005} smoothness={4} position={[-0.52, 1.05, 0]} castShadow receiveShadow>
              <meshStandardMaterial color={doorColor} roughness={0.6} side={THREE.DoubleSide} />
            </RoundedBox>
            <RoundedBox args={[0.08, 2.1, 0.22]} radius={0.005} smoothness={4} position={[0.52, 1.05, 0]} castShadow receiveShadow>
              <meshStandardMaterial color={doorColor} roughness={0.6} side={THREE.DoubleSide} />
            </RoundedBox>
            <RoundedBox args={[1.12, 0.08, 0.22]} radius={0.005} smoothness={4} position={[0, 2.06, 0]} castShadow receiveShadow>
              <meshStandardMaterial color={doorColor} roughness={0.6} side={THREE.DoubleSide} />
            </RoundedBox>

            <group position={[0, 1.0, 0]}>
              <RoundedBox args={[0.96, 2.0, 0.04]} radius={0.005} smoothness={4} castShadow receiveShadow>
                <meshStandardMaterial color={doorColor} roughness={0.6} side={THREE.DoubleSide} />
              </RoundedBox>
              {/* Ortadakı Vertikal Buzlu Şüşə Zolaq */}
              <mesh position={[0, 0, 0]} receiveShadow>
                <boxGeometry args={[0.15, 1.8, 0.042]} />
                <meshStandardMaterial color="#e0f2fe" transparent opacity={0.55} roughness={0.2} metalness={0.8} side={THREE.DoubleSide} />
              </mesh>
              <group position={[0.38, 0, 0]}>
                <mesh position={[0, 0, 0.03]} castShadow receiveShadow>
                  <boxGeometry args={[0.02, 0.12, 0.02]} />
                  <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
                </mesh>
              </group>
            </group>
          </group>
        )}

        {/* 4. ANTRASİT GİZLİ ÇƏRÇİVƏLİ QAPI (Anthracite Flush) */}
        {style === "anthracite-flush" && (
          <group>
            <group position={[0, 1.0, 0]}>
              <RoundedBox args={[0.98, 2.02, 0.04]} radius={0.002} smoothness={4} castShadow receiveShadow>
                <meshStandardMaterial color="#282a36" roughness={0.4} metalness={0.2} side={THREE.DoubleSide} />
              </RoundedBox>
              {/* Horizontal Oyuq Xətlər */}
              {[-0.6, -0.2, 0.2, 0.6].map((yPos, idx) => (
                <mesh key={idx} position={[0, yPos, 0.021]}>
                  <boxGeometry args={[0.85, 0.008, 0.002]} />
                  <meshStandardMaterial color="#111" metalness={0.9} />
                </mesh>
              ))}
              <group position={[0.4, 0, 0]}>
                <mesh position={[0, 0, 0.03]} castShadow receiveShadow>
                  <boxGeometry args={[0.015, 0.15, 0.015]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.95} roughness={0.05} />
                </mesh>
              </group>
            </group>
          </group>
        )}

        {/* 5. FRANSIZ TORLU QAPI (French Steel Grid) */}
        {style === "french-grid" && (
          <group>
            <RoundedBox args={[0.08, 2.1, 0.22]} radius={0.005} smoothness={4} position={[-0.52, 1.05, 0]} castShadow receiveShadow>
              <meshStandardMaterial color="#111111" roughness={0.3} metalness={0.9} side={THREE.DoubleSide} />
            </RoundedBox>
            <RoundedBox args={[0.08, 2.1, 0.22]} radius={0.005} smoothness={4} position={[0.52, 1.05, 0]} castShadow receiveShadow>
              <meshStandardMaterial color="#111111" roughness={0.3} metalness={0.9} side={THREE.DoubleSide} />
            </RoundedBox>
            <RoundedBox args={[1.12, 0.08, 0.22]} radius={0.005} smoothness={4} position={[0, 2.06, 0]} castShadow receiveShadow>
              <meshStandardMaterial color="#111111" roughness={0.3} metalness={0.9} side={THREE.DoubleSide} />
            </RoundedBox>

            <group position={[0, 1.0, 0]}>
              <RoundedBox args={[0.96, 2.0, 0.04]} radius={0.005} smoothness={4} castShadow receiveShadow>
                <meshStandardMaterial color="#111111" roughness={0.3} metalness={0.9} side={THREE.DoubleSide} />
              </RoundedBox>
              {/* Şüşə Ekran */}
              <mesh position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[0.82, 1.86]} />
                <meshStandardMaterial color="#ffffff" transparent opacity={0.25} roughness={0.05} metalness={0.95} side={THREE.DoubleSide} />
              </mesh>
              {/* Grid mullions */}
              <mesh position={[0, 0, 0.021]}>
                <boxGeometry args={[0.02, 1.86, 0.002]} />
                <meshStandardMaterial color="#111111" metalness={0.9} />
              </mesh>
              <mesh position={[0, 0.3, 0.021]}>
                <boxGeometry args={[0.82, 0.02, 0.002]} />
                <meshStandardMaterial color="#111111" metalness={0.9} />
              </mesh>
              <mesh position={[0, -0.3, 0.021]}>
                <boxGeometry args={[0.82, 0.02, 0.002]} />
                <meshStandardMaterial color="#111111" metalness={0.9} />
              </mesh>
            </group>
          </group>
        )}

        {/* 6. KLASSİK TAXTA QAPI (Classic Wood) */}
        {(style === "classic-wood" || !["modern-white", "modern-double-glass", "wood-frosted-glass", "anthracite-flush", "french-grid"].includes(style)) && (
          <group>
            <RoundedBox args={[0.08, 2.1, 0.24]} radius={0.005} smoothness={4} position={[-0.52, 1.05, 0]} castShadow receiveShadow>
              <meshStandardMaterial color={doorColor} roughness={0.5} metalness={0.05} side={THREE.DoubleSide} />
            </RoundedBox>
            <RoundedBox args={[0.08, 2.1, 0.24]} radius={0.005} smoothness={4} position={[0.52, 1.05, 0]} castShadow receiveShadow>
              <meshStandardMaterial color={doorColor} roughness={0.5} metalness={0.05} side={THREE.DoubleSide} />
            </RoundedBox>
            <RoundedBox args={[1.12, 0.08, 0.24]} radius={0.005} smoothness={4} position={[0, 2.06, 0]} castShadow receiveShadow>
              <meshStandardMaterial color={doorColor} roughness={0.5} metalness={0.05} side={THREE.DoubleSide} />
            </RoundedBox>

            <group position={[0, 1.0, 0]}>
              <RoundedBox args={[0.96, 2.0, 0.05]} radius={0.005} smoothness={4} position={[0, 0, 0]} castShadow receiveShadow>
                <meshStandardMaterial color={doorColor} roughness={0.6} metalness={0.1} side={THREE.DoubleSide} />
              </RoundedBox>

              <group position={[0.38, 0, 0]}>
                <mesh position={[0, 0, 0.04]} castShadow receiveShadow>
                  <boxGeometry args={[0.03, 0.12, 0.02]} />
                  <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} side={THREE.DoubleSide} />
                </mesh>
                <mesh position={[0.04, 0.02, 0.06]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
                  <cylinderGeometry args={[0.01, 0.01, 0.1]} />
                  <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} side={THREE.DoubleSide} />
                </mesh>

                <mesh position={[0, 0, -0.04]} castShadow receiveShadow>
                  <boxGeometry args={[0.03, 0.12, 0.02]} />
                  <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} side={THREE.DoubleSide} />
                </mesh>
                <mesh position={[0.04, 0.02, -0.06]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
                  <cylinderGeometry args={[0.01, 0.01, 0.1]} />
                  <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} side={THREE.DoubleSide} />
                </mesh>
              </group>
            </group>
          </group>
        )}
      </group>
    );
  }
 
  // 12. PƏNCƏRƏ (Window Frame & Glass)
  if (name.includes("Pəncərə")) {
    return (
      <group>
        {/* Alt/Üst çərçivə */}
        <RoundedBox args={[1.2, 0.1, 0.22]} radius={0.005} smoothness={4} position={[0, -0.55, 0]} castShadow receiveShadow><meshStandardMaterial color={color} roughness={0.5} /></RoundedBox>
        <RoundedBox args={[1.2, 0.1, 0.22]} radius={0.005} smoothness={4} position={[0, 0.55, 0]} castShadow receiveShadow><meshStandardMaterial color={color} roughness={0.5} /></RoundedBox>
        
        {/* Sol/Sağ çərçivə */}
        <RoundedBox args={[0.1, 1.0, 0.22]} radius={0.005} smoothness={4} position={[-0.55, 0, 0]} castShadow receiveShadow><meshStandardMaterial color={color} roughness={0.5} /></RoundedBox>
        <RoundedBox args={[0.1, 1.0, 0.22]} radius={0.005} smoothness={4} position={[0.55, 0, 0]} castShadow receiveShadow><meshStandardMaterial color={color} roughness={0.5} /></RoundedBox>
 
        {/* Orta bölmə */}
        <RoundedBox args={[0.05, 1.0, 0.22]} radius={0.002} smoothness={4} position={[0, 0, 0]} castShadow receiveShadow><meshStandardMaterial color={color} roughness={0.5} /></RoundedBox>
 
        {/* Şüşə (Glass) */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[1.1, 1.0]} />
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.3} roughness={0.05} metalness={0.9} side={THREE.DoubleSide} />
        </mesh>
      </group>
    );
  }

  // 13. 360 KAMERA / KAMERA NÖQTƏSİ
  if (name.includes("360 Kamera") || name.includes("Kamera Nöqtəsi")) {
    return (
      <group>
        {/* Tripod Ayaqlar */}
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.7]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[-0.1, 0.15, -0.1]} rotation={[0.2, 0, 0.2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.45]} />
          <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.1, 0.15, -0.1]} rotation={[0.2, 0, -0.2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.45]} />
          <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.15, 0.14]} rotation={[-0.2, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.45]} />
          <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Kamera Başlığı (Glowing Sphere) */}
        <mesh position={[0, 0.75, 0]} castShadow>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial color="#4f46e5" emissive="#4f46e5" emissiveIntensity={0.8} roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Kamera Linza Halqaları */}
        <mesh position={[0.09, 0.75, 0]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.04, 0.01, 8, 32]} /><meshStandardMaterial color="#ffffff" metalness={0.9} /></mesh>
        <mesh position={[-0.09, 0.75, 0]} rotation={[0, -Math.PI / 2, 0]}><torusGeometry args={[0.04, 0.01, 8, 32]} /><meshStandardMaterial color="#ffffff" metalness={0.9} /></mesh>
        <mesh position={[0, 0.75, 0.09]} rotation={[0, 0, 0]}><torusGeometry args={[0.04, 0.01, 8, 32]} /><meshStandardMaterial color="#ffffff" metalness={0.9} /></mesh>
        <mesh position={[0, 0.75, -0.09]} rotation={[0, 0, 0]}><torusGeometry args={[0.04, 0.01, 8, 32]} /><meshStandardMaterial color="#ffffff" metalness={0.9} /></mesh>

        {/* Neon Yaşıl Halqa */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.2, 0.25, 32]} />
          <meshBasicMaterial color="#10b981" side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      </group>
    );
  }
 
  // Default obyekt
  return (
    <RoundedBox args={[1, 1, 1]} radius={0.05} smoothness={4} position={[0, 0.5, 0]} castShadow receiveShadow>
      <meshStandardMaterial color={color} />
    </RoundedBox>
  );
}

function FurnitureItem({ data }: { data: any }) {
  const { selectedId, setSelectedId, updateFurniture, deleteFurniture, duplicateFurniture, saveHistory, transformMode, isWalkthrough, isGridSnapEnabled, gridSnapSize, furnitureLayers, currentFloor, appMode, isTransforming } = useStore();
  const { pushUpdate } = useMultiplayer();
  const isSelected = selectedId === data.id;
  const meshRef = useRef<THREE.Group>(null);
  
  // Ölçülər üçün referanslar
  const widthRef = useRef<HTMLSpanElement>(null);
  const heightRef = useRef<HTMLSpanElement>(null);
  const depthRef = useRef<HTMLSpanElement>(null);
  const htmlGroupRef = useRef<THREE.Group>(null);
  const box3 = useMemo(() => new THREE.Box3(), []);
  
  // Ruler refs
  const [distances, setDistances] = React.useState({ left: 0, right: 0, front: 0, back: 0 });

  // Keyboard Shortcuts for Delete and Duplicate
  React.useEffect(() => {
    if (!isSelected) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        saveHistory();
        deleteFurniture(data.id);
        pushUpdate();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
        saveHistory();
        duplicateFurniture(data.id);
        pushUpdate();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSelected, data.id, deleteFurniture, duplicateFurniture, saveHistory, pushUpdate]);

  // useHelper ref hazır olduqda avtomatik işə düşür (null crash-in qarşısını alır)
  useHelper(isSelected ? (meshRef as any) : null, THREE.BoxHelper, "#ffff00");

  useFrame(() => {
    if (isSelected && meshRef.current) {
      box3.setFromObject(meshRef.current);
      const size = new THREE.Vector3();
      box3.getSize(size);
      
      // Çox kiçik dəyərləri sıfırlayırıq və sm-ə çeviririk (1 birim = 100 sm)
      if (widthRef.current) widthRef.current.innerText = `${(size.x * 100).toFixed(0)} sm`;
      if (heightRef.current) heightRef.current.innerText = `${(size.y * 100).toFixed(0)} sm`;
      if (depthRef.current) depthRef.current.innerText = `${(size.z * 100).toFixed(0)} sm`;

      if (htmlGroupRef.current) {
        htmlGroupRef.current.position.y = size.y / 2 + 0.8;
      }
      
      // Ruler hesablamaları
      const { roomSize, furnitureLayers, currentFloor } = useStore.getState();
      const pos = meshRef.current.position;
      const currentRoom = getRoomAtPosition(pos, data.nodeId, furnitureLayers, roomSize, currentFloor);

      setDistances(getRulerDistancesForRoom(pos, currentRoom));
    }
  });

  return (
    <>
      <group
        ref={meshRef}
        position={[data.position.x, data.position.y, data.position.z]}
        rotation={[data.rotation.x, data.rotation.y, data.rotation.z]}
        scale={[data.scale.x, data.scale.y, data.scale.z]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedId(data.id);
        }}
      >
        <Suspense fallback={<ModelLoader />}>
          <SmartModel name={data.type === "camera" ? "360 Kamera" : data.name} color={data.color} modelUrl={data.modelUrl} scale={data.scale} doorStyle={data.doorStyle} />
        </Suspense>

        {/* Canlı İşıqlandırma Mənbəyi (Spot, Lüstr, LED üçün) */}
        {data.lightIntensity !== undefined && (
          <pointLight 
            castShadow={appMode !== '360-photo'} 
            shadow-mapSize-width={512}
            shadow-mapSize-height={512}
            shadow-bias={-0.002}
            color={data.lightColor || "#ffffff"} 
            intensity={data.lightIntensity} 
            distance={data.lightDistance || 10}
            decay={2}
            position={[0, data.name.includes("Lüstr") ? -0.1 : 0.1, 0]} 
          />
        )}

        {isSelected && !isTransforming && (
          <group ref={htmlGroupRef}>
             <Html center zIndexRange={[100, 0]}>
                <div className="bg-black/40 hover:bg-black/85 backdrop-blur-md p-2.5 rounded-2xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col gap-1.5 min-w-[115px] select-none pointer-events-auto opacity-80 hover:opacity-100 transition-all">
                   <div className="flex items-center justify-between gap-1 mb-1 border-b border-white/10 pb-1.5">
                     <button onClick={() => { saveHistory(); duplicateFurniture(data.id); pushUpdate(); }} className="flex-1 bg-indigo-500/30 hover:bg-indigo-500/60 text-indigo-200 text-[10px] font-bold py-0.5 rounded transition-colors" title="Kopyala (Ctrl+C)">Kopyala</button>
                     <button onClick={() => { saveHistory(); deleteFurniture(data.id); pushUpdate(); }} className="flex-1 bg-red-500/30 hover:bg-red-500/60 text-red-300 text-[10px] font-bold py-0.5 rounded transition-colors" title="Sil (Delete)">Sil</button>
                     <button onClick={() => setSelectedId(null)} className="p-0.5 text-neutral-400 hover:text-white rounded" title="Bağla">✕</button>
                   </div>
                   <div className="text-[9px] font-black text-neutral-400 uppercase tracking-widest text-center pb-1 border-b border-white/5">Qabaritlər</div>
                   <div className="flex justify-between items-center gap-3 text-[11px] pointer-events-none">
                     <span className="text-neutral-400 font-medium">En:</span>
                     <span ref={widthRef} className="font-mono text-emerald-400 font-bold"></span>
                   </div>
                   <div className="flex justify-between items-center gap-3 text-[11px] pointer-events-none">
                     <span className="text-neutral-400 font-medium">Hün:</span>
                     <span ref={heightRef} className="font-mono text-amber-400 font-bold"></span>
                   </div>
                   <div className="flex justify-between items-center gap-3 text-[11px] pointer-events-none">
                     <span className="text-neutral-400 font-medium">Dər:</span>
                     <span ref={depthRef} className="font-mono text-blue-400 font-bold"></span>
                   </div>
                </div>
             </Html>
          </group>
        )}
      </group>

      {/* Rulers (Distance to walls) */}
      {isSelected && !isWalkthrough && (
        <group position={[data.position.x, 0.05, data.position.z]}>
          <Line points={[[0, 0, 0], [distances.right, 0, 0]]} color="#ef4444" lineWidth={2} dashed dashSize={0.1} gapSize={0.1} />
          <Html position={[distances.right / 2, 0, 0]} center><div className="bg-red-500 text-white text-[10px] font-bold px-1 rounded">{distances.right.toFixed(2)}m</div></Html>

          <Line points={[[0, 0, 0], [-distances.left, 0, 0]]} color="#ef4444" lineWidth={2} dashed dashSize={0.1} gapSize={0.1} />
          <Html position={[-distances.left / 2, 0, 0]} center><div className="bg-red-500 text-white text-[10px] font-bold px-1 rounded">{distances.left.toFixed(2)}m</div></Html>

          <Line points={[[0, 0, 0], [0, 0, distances.front]]} color="#3b82f6" lineWidth={2} dashed dashSize={0.1} gapSize={0.1} />
          <Html position={[0, 0, distances.front / 2]} center><div className="bg-blue-500 text-white text-[10px] font-bold px-1 rounded">{distances.front.toFixed(2)}m</div></Html>

          <Line points={[[0, 0, 0], [0, 0, -distances.back]]} color="#3b82f6" lineWidth={2} dashed dashSize={0.1} gapSize={0.1} />
          <Html position={[0, 0, -distances.back / 2]} center><div className="bg-blue-500 text-white text-[10px] font-bold px-1 rounded">{distances.back.toFixed(2)}m</div></Html>
        </group>
      )}
      
      {isSelected && !isWalkthrough && (
        <TransformControls 
          object={meshRef as any} 
          mode={transformMode} 
          translationSnap={isGridSnapEnabled ? gridSnapSize : null}
          rotationSnap={isGridSnapEnabled ? Math.PI / 4 : null}
          onMouseDown={() => {
            saveHistory();
            useStore.getState().setIsTransforming(true);
          }} 
          onChange={() => {
            if (meshRef.current) {
              const pos = meshRef.current.position;
              const rot = meshRef.current.rotation;
              const { roomSize, furnitureLayers, currentFloor } = useStore.getState();

              const currentRoom = getRoomAtPosition(pos, data.nodeId, furnitureLayers, roomSize, currentFloor);
              const minX = currentRoom.minX;
              const maxX = currentRoom.maxX;
              const minZ = currentRoom.minZ;
              const maxZ = currentRoom.maxZ;

              // Wall Snapping for Doors and Windows
              if (transformMode === 'translate' && (data.name.includes("Qapı") || data.name.includes("Pəncərə"))) {
                const snapDist = 0.8;
                if (Math.abs(pos.x - maxX) < snapDist) { pos.x = maxX; rot.y = Math.PI / 2; }
                else if (Math.abs(pos.x - minX) < snapDist) { pos.x = minX; rot.y = -Math.PI / 2; }
                else if (Math.abs(pos.z - maxZ) < snapDist) { pos.z = maxZ; rot.y = 0; }
                else if (Math.abs(pos.z - minZ) < snapDist) { pos.z = minZ; rot.y = Math.PI; }
              } 
              // Collision Detection, Wall Snapping and Object-to-Object Snapping
              else if (transformMode === 'translate') {
                const size = new THREE.Vector3();
                box3.setFromObject(meshRef.current);
                box3.getSize(size);
                
                const objHalfW = size.x / 2;
                const objHalfL = size.z / 2;
                
                const otherItems = furnitureLayers.filter(f => f.id !== data.id && (f.floor ?? 0) === currentFloor);
                let snappedX = false;
                let snappedZ = false;
                const snapGap = 0.15; // 15cm magnet snap threshold

                // 1. Mebel-Mebel Maqnit Yapışma (Object-to-Object snapping)
                for (const other of otherItems) {
                  // Mebellərin ölçülərini təxmin edirik (Zustand model-in original scale-inə uyğun)
                  const otherW = (other.scale?.x || 1.0) / 2;
                  const otherL = (other.scale?.z || 1.0) / 2;

                  // X oxunda yapışma
                  if (Math.abs((pos.x + objHalfW) - (other.position.x - otherW)) < snapGap) {
                    pos.x = other.position.x - otherW - objHalfW;
                    snappedX = true;
                  } else if (Math.abs((pos.x - objHalfW) - (other.position.x + otherW)) < snapGap) {
                    pos.x = other.position.x + otherW + objHalfW;
                    snappedX = true;
                  } else if (Math.abs(pos.x - other.position.x) < snapGap) {
                    pos.x = other.position.x;
                    snappedX = true;
                  }

                  // Z oxunda yapışma
                  if (Math.abs((pos.z + objHalfL) - (other.position.z - otherL)) < snapGap) {
                    pos.z = other.position.z - otherL - objHalfL;
                    snappedZ = true;
                  } else if (Math.abs((pos.z - objHalfL) - (other.position.z + otherL)) < snapGap) {
                    pos.z = other.position.z + otherL + objHalfL;
                    snappedZ = true;
                  } else if (Math.abs(pos.z - other.position.z) < snapGap) {
                    pos.z = other.position.z;
                    snappedZ = true;
                  }

                  if (snappedX && snappedZ) break;
                }

                // 2. Divara Maqnit Yapışma (Wall snapping)
                const wallSnapGap = 0.20; // 20cm divara yaxınlaşdıqda yapışma
                if (!snappedX) {
                  if (Math.abs((pos.x + objHalfW) - maxX) < wallSnapGap) {
                    pos.x = maxX - objHalfW;
                  } else if (Math.abs((pos.x - objHalfW) - minX) < wallSnapGap) {
                    pos.x = minX + objHalfW;
                  }
                }
                if (!snappedZ) {
                  if (Math.abs((pos.z + objHalfL) - maxZ) < wallSnapGap) {
                    pos.z = maxZ - objHalfL;
                  } else if (Math.abs((pos.z - objHalfL) - minZ) < wallSnapGap) {
                    pos.z = minZ + objHalfL;
                  }
                }

                // 3. Sərhəd Limiti (Central clampPositionToRoom helper)
                const clamped = clampPositionToRoom(pos, objHalfW, objHalfL, currentRoom);
                pos.x = clamped.x;
                pos.y = clamped.y;
                pos.z = clamped.z;
              }

              updateFurniture(data.id, { 
                position: { x: pos.x, y: pos.y, z: pos.z },
                rotation: { x: rot.x, y: rot.y, z: rot.z }
              });
            }
          }}
          onMouseUp={() => {
             useStore.getState().setIsTransforming(false);
             if (meshRef.current && transformMode === 'scale') {
                const scl = meshRef.current.scale;
                updateFurniture(data.id, { scale: { x: scl.x, y: scl.y, z: scl.z } });
             }
             // Auto-save on drop
             pushUpdate();
          }}
        />
      )}
    </>
  );
}

function FpsControls({ onLock }: { onLock: () => void }) {
  const { camera } = useThree();
  const [movement, setMovement] = React.useState({ forward: false, backward: false, left: false, right: false });
  const speedRef = useRef(5.0); // Default speed is 5.0

  React.useEffect(() => {
    // Set initial camera position for human eye level
    camera.position.set(0, 1.6, 3);
    camera.rotation.set(0, 0, 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyW') setMovement(m => ({ ...m, forward: true }));
      if (e.code === 'KeyS') setMovement(m => ({ ...m, backward: true }));
      if (e.code === 'KeyA') setMovement(m => ({ ...m, left: true }));
      if (e.code === 'KeyD') setMovement(m => ({ ...m, right: true }));
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'KeyW') setMovement(m => ({ ...m, forward: false }));
      if (e.code === 'KeyS') setMovement(m => ({ ...m, backward: false }));
      if (e.code === 'KeyA') setMovement(m => ({ ...m, left: false }));
      if (e.code === 'KeyD') setMovement(m => ({ ...m, right: false }));
    };

    const handleWheel = (e: WheelEvent) => {
      // e.deltaY: mənfi = yuxarı fırlatmaq (sürətləndirir), müsbət = aşağı fırlatmaq (yavaşladır)
      speedRef.current = Math.max(1.0, Math.min(20.0, speedRef.current - e.deltaY * 0.01));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [camera]);

  const velocity = React.useMemo(() => new THREE.Vector3(), []);
  const direction = React.useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const speed = speedRef.current;
    
    // Yalnız klaviatura basıldıqda hərəkət etdiririk
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    direction.z = Number(movement.forward) - Number(movement.backward);
    direction.x = Number(movement.right) - Number(movement.left);
    direction.normalize(); // Ensure consistent movement in all directions

    if (movement.forward || movement.backward) velocity.z -= direction.z * speed * delta;
    if (movement.left || movement.right) velocity.x -= direction.x * speed * delta;

    camera.translateX(-velocity.x);
    camera.translateZ(velocity.z);
    
    // Hündürlüyü sabit saxlamaq (uçmamaq üçün)
    camera.position.y = 1.6;
  });

  return <PointerLockControls selector="#fps-overlay" onLock={onLock} onUnlock={() => useStore.getState().setIsWalkthrough(false)} />;
}

function DynamicLighting() {
  const { timeOfDay, ambientLightIntensity, appMode } = useStore();
  
  // Angle: 6:00 is 0 (sunrise), 12:00 is PI/2 (noon), 18:00 is PI (sunset)
  const angle = ((timeOfDay - 6) / 12) * Math.PI;
  
  // Calculate Sun Position
  const sunX = Math.cos(angle) * -30;
  const sunY = Math.sin(angle) * 30;
  const sunZ = 15;

  const isNight = timeOfDay < 6 || timeOfDay > 18;
  // Intensity peaks at noon
  const intensity = isNight ? 0 : Math.sin(angle) * 3;

  const ambient = isNight ? ambientLightIntensity * 0.1 : ambientLightIntensity;

      const isMobile = typeof window !== "undefined" && (window.innerWidth < 768 || /Android|iPhone|iPad/i.test(navigator.userAgent));
      const shadowMapSize = isMobile ? 1024 : (appMode === '360-photo' ? 1024 : 2048);

      return (
        <>
          <ambientLight intensity={ambient} />
          
          <directionalLight 
            position={[sunX, sunY, sunZ]} 
            intensity={isNight ? 0 : intensity} 
            color="#ffffee"
            castShadow={!isNight} 
            shadow-mapSize-width={shadowMapSize} 
            shadow-mapSize-height={shadowMapSize} 
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
            shadow-bias={-0.001}
          />

      <directionalLight 
        position={[-20, 20, 20]} 
        intensity={isNight ? 0.3 : 0} 
        color="#6688cc"
        castShadow={false} 
      />

      {/* Indoor Center Light (Lamp) */}
      <pointLight 
        position={[0, 4, 0]} 
        intensity={isNight ? 1.5 : 0.4} 
        color={isNight ? "#ffcc88" : "#ffffff"} 
        castShadow={false} 
      />
    </>
  );
}

function SceneExporter() {
  const { scene, gl, camera } = useThree();
  React.useEffect(() => {
    (window as any).__THREE_SCENE__ = scene;
    (window as any).__THREE_RENDERER__ = gl;
    (window as any).__THREE_CAMERA__ = camera;
  }, [scene, gl, camera]);

  useFrame(({ gl }) => {
    gl.autoClear = true;
  });

  return null;
}

function PanoEnvironment() {
  const { panoramaImage } = useStore();
  const { scene } = useThree();
  const texture = useTexture(panoramaImage || "/textures/sample-360.jpg");
  
  React.useEffect(() => {
    if (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      scene.background = texture;
      scene.environment = texture;
    }
    return () => {
      scene.background = null;
      scene.environment = null;
    };
  }, [texture, scene]);
  
  return null;
}

function ThreeSixtyZoom() {
  const { camera, gl } = useThree();
  const { appMode, is2DView } = useStore();

  React.useEffect(() => {
    if (appMode !== '360-photo' || is2DView) return;

    const handleWheel = (e: WheelEvent) => {
      if (!camera || !(camera as THREE.PerspectiveCamera).isPerspectiveCamera) return;
      e.preventDefault();
      const persCamera = camera as THREE.PerspectiveCamera;
      if (typeof persCamera.fov !== "number" || isNaN(persCamera.fov)) return;
      const zoomSpeed = 0.04;
      let newFov = persCamera.fov + e.deltaY * zoomSpeed;
      if (isNaN(newFov)) return;
      newFov = Math.max(20, Math.min(80, newFov)); // Zoom-in 20, Zoom-out 80 FOV
      persCamera.fov = newFov;
      persCamera.updateProjectionMatrix();
    };

    const dom = gl.domElement;
    if (dom) {
      dom.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (dom) {
        dom.removeEventListener('wheel', handleWheel);
      }
    };
  }, [camera, gl, appMode, is2DView]);

  return null;
}

function CameraSetup({ controlsRef }: { controlsRef: React.RefObject<any> }) {
  const { appMode, isWalkthrough, is2DView, isDollhouseMode, currentTourNodeId } = useStore();
  const { camera } = useThree();
  const prevAppModeRef = React.useRef(appMode);

  React.useEffect(() => {
    useStore.setState({ cameraRef: camera });
    return () => {
      useStore.setState({ cameraRef: null });
    };
  }, [camera]);
  
  React.useEffect(() => {
    if (isWalkthrough) return;
    if (is2DView) return;
    
    const controls = controlsRef.current;
    
    if (appMode === '3d-room' || isDollhouseMode) {
      const layers = useStore.getState().furnitureLayers;
      const activeCam = layers.find(f => f.id === currentTourNodeId && (f.type === "camera" || f.name.includes("360 Kamera")));
      const centerX = activeCam ? activeCam.position.x : 0;
      const centerZ = activeCam ? activeCam.position.z : 0;

      gsap.to(camera.position, { 
        x: centerX, 
        y: 8, 
        z: centerZ + 12, 
        duration: 1.2, 
        ease: "power3.inOut",
        onUpdate: () => {
          camera.updateMatrixWorld();
          if (controls) controls.update();
        }
      });
      if (controls && controls.target) {
        gsap.to(controls.target, { 
          x: centerX, 
          y: 0, 
          z: centerZ, 
          duration: 1.2, 
          ease: "power3.inOut",
          onUpdate: () => {
            camera.updateMatrixWorld();
            if (controls) controls.update();
          }
        });
      }
    } else if (appMode === '360-photo' && !isDollhouseMode) {
      const { furnitureLayers: layers } = useStore.getState();
      const activeCam = layers.find(f => f.id === currentTourNodeId && (f.type === "camera" || f.name.includes("360 Kamera")));
      const posX = activeCam ? activeCam.position.x : 0;
      const posY = activeCam ? (activeCam.position.y + 0.75) : 1.5;
      const posZ = activeCam ? activeCam.position.z : 0;

      let targetLookX = 5.0;
      let targetLookZ = 0.0;
      if (posX > 2.0) {
        targetLookX = 0.0;
      }

      const dx = targetLookX - posX;
      const dz = targetLookZ - posZ;
      const len = Math.hypot(dx, dz) || 1;
      const dirX = (dx / len);
      const dirZ = (dz / len);

      const targetCamPos = new THREE.Vector3(posX, posY, posZ);
      const targetLookPos = new THREE.Vector3(posX + dirX * 2, posY, posZ + dirZ * 2);

      gsap.to(camera.position, { 
        x: targetCamPos.x, 
        y: targetCamPos.y, 
        z: targetCamPos.z, 
        duration: 0.8, 
        ease: "power2.inOut",
        onUpdate: () => {
          camera.updateMatrixWorld();
          if (controls) controls.update();
        }
      });

      if (controls && controls.target) {
        gsap.to(controls.target, { 
          x: targetLookPos.x, 
          y: targetLookPos.y, 
          z: targetLookPos.z, 
          duration: 0.8, 
          ease: "power2.inOut",
          onUpdate: () => {
            camera.updateMatrixWorld();
            if (controls) controls.update();
          }
        });
      }
    }
    
    prevAppModeRef.current = appMode;
  }, [appMode, camera, isWalkthrough, is2DView, isDollhouseMode, currentTourNodeId]);
  
  return null;
}

function TapeMeasureTool() {
  const { isMeasuring, measurements, addMeasurement, rulerColor } = useStore();
  const [currentPoint, setCurrentPoint] = React.useState<THREE.Vector3 | null>(null);
  const [mousePos, setMousePos] = React.useState<THREE.Vector3 | null>(null);

  if (!isMeasuring && measurements.length === 0) return null;

  const handlePointerDown = (e: any) => {
    if (!isMeasuring) return;
    e.stopPropagation();
    if (!currentPoint) {
      setCurrentPoint(e.point.clone());
    } else {
      addMeasurement({ id: `m-${Date.now()}`, p1: currentPoint, p2: e.point.clone() });
      setCurrentPoint(null);
      setMousePos(null);
    }
  };

  const handlePointerMove = (e: any) => {
    if (!isMeasuring || !currentPoint) return;
    setMousePos(e.point.clone());
  };

  return (
    <group>
      {/* Görünməz ölçü müstəvisi (Döşəmə səviyyəsində) */}
      {isMeasuring && (
        <mesh 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, 0.05, 0]} 
          onPointerDown={handlePointerDown} 
          onPointerMove={handlePointerMove}
          visible={false}
        >
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial />
        </mesh>
      )}

      {/* Saxlanılmış ölçülər */}
      {measurements.map((m: any) => {
        const p1 = new THREE.Vector3(m.p1.x, m.p1.y, m.p1.z);
        const p2 = new THREE.Vector3(m.p2.x, m.p2.y, m.p2.z);
        const dist = p1.distanceTo(p2);
        const mid = p1.clone().lerp(p2, 0.5);
        return (
          <group key={m.id}>
            <Line points={[p1, p2]} color={rulerColor} lineWidth={3} dashed={false} />
            <mesh position={p1}><sphereGeometry args={[0.08]} /><meshBasicMaterial color={rulerColor} /></mesh>
            <mesh position={p2}><sphereGeometry args={[0.08]} /><meshBasicMaterial color={rulerColor} /></mesh>
            <Html position={mid} center className="pointer-events-none">
              <div 
                className="text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap"
                style={{ backgroundColor: rulerColor, border: `1px solid ${rulerColor}` }}
              >
                {dist.toFixed(2)}m
              </div>
            </Html>
          </group>
        );
      })}

      {/* Aktiv çəkilən ölçü */}
      {isMeasuring && currentPoint && mousePos && (
        <group>
          <Line points={[currentPoint, mousePos]} color={rulerColor} lineWidth={3} dashed dashSize={0.2} gapSize={0.1} />
          <mesh position={currentPoint}><sphereGeometry args={[0.08]} /><meshBasicMaterial color={rulerColor} /></mesh>
          <Html position={currentPoint.clone().lerp(mousePos, 0.5)} center className="pointer-events-none">
            <div 
              className="text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap opacity-80"
              style={{ backgroundColor: rulerColor, border: `1px solid ${rulerColor}` }}
            >
              {currentPoint.distanceTo(mousePos).toFixed(2)}m
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}

function WebXRManager() {
  const { gl } = useThree();
  const [vrSupported, setVrSupported] = React.useState(false);
  const [arSupported, setArSupported] = React.useState(false);

  React.useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.xr) {
      navigator.xr.isSessionSupported("immersive-vr").then(setVrSupported);
      navigator.xr.isSessionSupported("immersive-ar").then(setArSupported);
    }
  }, []);

  const startSession = (mode: "immersive-vr" | "immersive-ar") => {
    if (typeof navigator === "undefined" || !navigator.xr) return;
    navigator.xr.requestSession(mode, {
      optionalFeatures: ["local-floor", "bounded-floor"]
    }).then(async (session) => {
      gl.xr.enabled = true;
      await gl.xr.setSession(session);
    });
  };

  if (!vrSupported && !arSupported) return null;

  return (
    <Html style={{ position: 'absolute', top: 16, right: 16, width: '220px', pointerEvents: 'auto' }} className="z-50">
      <div className="flex gap-2">
        {vrSupported && (
          <button 
            onClick={() => startSession("immersive-vr")}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg border-0 cursor-pointer transition-all"
          >
            VR Başlat 🥽
          </button>
        )}
        {arSupported && (
          <button 
            onClick={() => startSession("immersive-ar")}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg border-0 cursor-pointer transition-all"
          >
            AR Başlat 📱
          </button>
        )}
      </div>
    </Html>
  );
}

function WallDrawingTool() {
  const { isDrawingWall, currentFloor, furnitureLayers, saveHistory, currentTourNodeId, appMode } = useStore();
  const [currentPoint, setCurrentPoint] = React.useState<THREE.Vector3 | null>(null);
  const [mousePos, setMousePos] = React.useState<THREE.Vector3 | null>(null);

  if (!isDrawingWall) return null;

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    if (!currentPoint) {
      setCurrentPoint(e.point.clone());
    } else {
      const p1 = currentPoint;
      const p2 = e.point.clone();
      
      const distance = p1.distanceTo(p2);
      if (distance < 0.2) {
        setCurrentPoint(null);
        setMousePos(null);
        return;
      }
      
      // Divarın mərkəz nöqtəsi
      const mid = p1.clone().lerp(p2, 0.5);
      
      // Dönmə bucağı (Y oxu ətrafında)
      const angle = Math.atan2(p2.x - p1.x, p2.z - p1.z);
      
      saveHistory();
      
      // Divarı mebel siyahısına "Daxili Divar" olaraq əlavə edirik
      const newWall = {
        id: `wall-${Date.now()}`,
        name: "Daxili Divar",
        modelUrl: "",
        position: { x: mid.x, y: 1.5, z: mid.z }, // hündürlük 3m olduğuna görə Y = 1.5m
        rotation: { x: 0, y: angle + Math.PI / 2, z: 0 },
        scale: { x: distance, y: 3, z: 0.15 }, // En (uzunluq) = dist, Hün = 3m, Qalınlıq = 0.15m
        color: "#d4d4d4",
        floor: currentFloor,
        price: Math.round(distance * 35), // Hər metr üçün ~35 AZN təxmini qiymət
        nodeId: appMode === "360-photo" ? (currentTourNodeId || undefined) : undefined
      };
      
      useStore.setState({
        furnitureLayers: [...furnitureLayers, newWall],
        isDrawingWall: false
      });
      
      setCurrentPoint(null);
      setMousePos(null);
    }
  };

  const handlePointerMove = (e: any) => {
    if (!currentPoint) return;
    setMousePos(e.point.clone());
  };

  // Aktiv çəkilən divarın önizləməsi
  let previewMesh = null;
  if (currentPoint && mousePos) {
    const dist = currentPoint.distanceTo(mousePos);
    const mid = currentPoint.clone().lerp(mousePos, 0.5);
    const angle = Math.atan2(mousePos.x - currentPoint.x, mousePos.z - currentPoint.z);
    
    previewMesh = (
      <mesh position={[mid.x, 1.5, mid.z]} rotation={[0, angle + Math.PI / 2, 0]}>
        <boxGeometry args={[dist, 3, 0.15]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.4} wireframe />
      </mesh>
    );
  }

  return (
    <group>
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.05, 0]} 
        onPointerDown={handlePointerDown} 
        onPointerMove={handlePointerMove}
        visible={false}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial />
      </mesh>
      {previewMesh}
    </group>
  );
}

function FloorplanPlane() {
  const { floorplanImage, floorplanOpacity, floorplanScale } = useStore();
  const [texture, setTexture] = React.useState<THREE.Texture | null>(null);

  React.useEffect(() => {
    if (floorplanImage) {
      new THREE.TextureLoader().load(floorplanImage, (tex) => {
        setTexture(tex);
      });
    } else {
      setTexture(null);
    }
  }, [floorplanImage]);

  if (!floorplanImage || !texture) return null;

  const aspect = texture.image ? (texture.image as any).width / (texture.image as any).height : 1;

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
      <planeGeometry args={[floorplanScale * aspect, floorplanScale]} />
      <meshBasicMaterial map={texture} transparent opacity={floorplanOpacity} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

function ExporterHelper() {
  const { scene } = useThree();

  React.useEffect(() => {
    (window as any).exportSceneToGLTF = () => {
      // Dinamik import vasitəsilə SSR xətalarının qarşısını alırıq
      import("three/examples/jsm/exporters/GLTFExporter.js")
        .then(({ GLTFExporter }) => {
          const exporter = new GLTFExporter();
          console.log("3D Səhnə ixrac edilir...");

          const invisibleTargets: THREE.Object3D[] = [];
          scene.traverse((child) => {
            // Helper-lər, Grid və idarəetmə elementlərini ixrac etməmək üçün müvəqqəti gizlədirik
            if (
              child.name === "grid" ||
              child.type === "Line" ||
              child.type === "GridHelper" ||
              child.type === "TransformControls" ||
              child.type === "DirectionalLightHelper" ||
              child.type === "PointLightHelper" ||
              child.type === "HemisphereLightHelper" ||
              child.name.toLowerCase().includes("helper") ||
              (child.userData && child.userData.isHelper)
            ) {
              if (child.visible) {
                child.visible = false;
                invisibleTargets.push(child);
              }
            }
          });

          exporter.parse(
            scene,
            (gltf) => {
              // Gizlədilmiş obyektləri yenidən görünən edirik
              invisibleTargets.forEach((obj) => {
                obj.visible = true;
              });

              let output: any;
              let filename = "spacecraft-3d-scene.glb";
              let mimeType = "application/octet-stream";

              if (gltf instanceof ArrayBuffer) {
                output = gltf;
              } else {
                output = JSON.stringify(gltf, null, 2);
                filename = "spacecraft-3d-scene.gltf";
                mimeType = "application/json";
              }

              const blob = new Blob([output], { type: mimeType });
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = filename;
              link.click();
              console.log("3D Səhnə uğurla yükləndi!");
            },
            (error) => {
              invisibleTargets.forEach((obj) => {
                obj.visible = true;
              });
              console.error("GLTF Export xətası:", error);
              alert("3D Səhnə ixrac edilərkən xəta baş verdi.");
            },
            {
              binary: true, // GLB olaraq ixrac etmək
              onlyVisible: true,
              animations: []
            }
          );
        })
        .catch((err) => {
          console.error("GLTFExporter yüklənə bilmədi:", err);
          alert("Eksport modulu yüklənərkən xəta baş verdi.");
        });
    };

    return () => {
      delete (window as any).exportSceneToGLTF;
    };
  }, [scene]);

  return null;
}

export default function RoomScene() {
  const { roomSize, furnitureLayers, setSelectedId, ambientLightIntensity, is2DView, isWalkthrough, appMode, isMeasuring, isDrawingWall, currentFloor, view3DIn360, currentTourNodeId, isTransforming, gridColor, isDollhouseMode, hideOuterShell } = useStore();
  const [isLocked, setIsLocked] = React.useState(false);
  const controlsRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (!isWalkthrough) setIsLocked(false);
  }, [isWalkthrough]);

  return (
    <div className="absolute inset-0 bg-transparent">
      {isWalkthrough && !isLocked && (
        <div 
          id="fps-overlay" 
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md cursor-pointer text-white flex-col gap-4"
        >
           <div className="text-4xl font-black tracking-widest text-emerald-400 uppercase drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">Gəzinti Rejimi</div>
           <div className="text-lg text-neutral-300 font-medium">Başlamaq üçün ekrana klikləyin</div>
           <div className="flex gap-4 mt-6">
             <div className="bg-white/10 border border-white/20 px-5 py-3 rounded-xl font-mono font-bold text-sm shadow-lg">W A S D - Hərəkət</div>
             <div className="bg-white/10 border border-white/20 px-5 py-3 rounded-xl font-mono font-bold text-sm shadow-lg">Siçan - Baxmaq</div>
             <div className="bg-white/10 border border-white/20 px-5 py-3 rounded-xl font-mono font-bold text-sm shadow-lg">ESC - Çıxış</div>
           </div>
        </div>
      )}

      {(() => {
        const isMobile = typeof window !== "undefined" && (window.innerWidth < 768 || /Android|iPhone|iPad/i.test(navigator.userAgent));
        return (
          <Canvas 
            shadows
            dpr={isMobile ? 1 : [1, 1.5]}
            camera={{ position: [0, 5, 8], fov: 60 }}
            className="w-full h-full"
            onPointerMissed={() => setSelectedId(null)}
          >
            <Suspense fallback={null}>
              <WebXRManager />
              {is2DView && !isWalkthrough ? (
                <OrthographicCamera makeDefault position={[0, 10, 0]} zoom={60} rotation={[-Math.PI/2, 0, 0]} />
              ) : (
                <PerspectiveCamera makeDefault position={[0, 3, 5]} fov={50} />
              )}

              <SceneExporter />
              {!is2DView && !isMobile && <SoftShadows size={2.5} samples={16} focus={0.5} />}
              
              <DynamicLighting />
              {!is2DView && <Environment preset="city" />}
              
              {appMode === '3d-room' && (
                <>
                  {!is2DView && !isMobile ? (
                    <EffectComposer multisampling={0}>
                      <N8AO halfRes aoRadius={0.5} intensity={1} color="black" />
                      <Bloom luminanceThreshold={1} mipmapBlur intensity={0.4} />
                      <SMAA />
                    </EffectComposer>
                  ) : (
                    <EffectComposer multisampling={0}>
                      <SMAA />
                    </EffectComposer>
                  )}
                </>
              )}
              {appMode === '360-photo' && (
                <TourViewer />
              )}

              <CameraSetup controlsRef={controlsRef} />
              <ThreeSixtyZoom />
              <ExporterHelper />
              {(appMode === '3d-room' || (appMode === '360-photo' && view3DIn360)) && (
                <>
                  <TapeMeasureTool />
                  <WallDrawingTool />
                  <FloorplanPlane />
                </>
              )}

              {!isWalkthrough ? (
                <OrbitControls 
                  ref={controlsRef}
                  makeDefault 
                  enableRotate={!is2DView && !isMeasuring && !isDrawingWall} 
                  enablePan={appMode !== '360-photo' && !isMeasuring && !isDrawingWall} 
                  enableZoom={appMode !== '360-photo'}
                />
              ) : (
                <FpsControls onLock={() => setIsLocked(true)} />
              )}

              {!hideOuterShell && (appMode === '3d-room' || (appMode === '360-photo' && (view3DIn360 || isDollhouseMode))) && <RoomWalls />}
              {!hideOuterShell && (appMode === '3d-room' || (appMode === '360-photo' && (view3DIn360 || isDollhouseMode))) && !is2DView && (
                <ContactShadows 
                  key={`${currentFloor}_${furnitureLayers.length}_${isTransforming}_${appMode}`}
                  position={[0, 0.01, 0]} 
                  opacity={0.6} 
                  scale={30} 
                  blur={2.0} 
                  far={4.5} 
                  resolution={appMode === '360-photo' ? 256 : 512}
                  frames={appMode === '360-photo' ? 1 : (isTransforming ? Infinity : 1)}
                />
              )}
              
              {(appMode === '3d-room' || (appMode === '360-photo' && view3DIn360)) && (
                <Grid 
                  position={[0, 0.02, 0]} 
                  args={[100, 100]} 
                  cellSize={0.5} 
                  cellThickness={0.7} 
                  cellColor="#2d2d30" 
                  sectionSize={2.5} 
                  sectionThickness={1.0} 
                  sectionColor={gridColor} 
                  fadeDistance={50} 
                  fadeStrength={1.0} 
                  followCamera={true} 
                  infiniteGrid={true}
                />
              )}
              
              {(appMode === '3d-room' || appMode === '360-photo') && furnitureLayers
                .filter(f => (f.floor ?? 0) === currentFloor && f.type !== "room")
                .filter(f => {
                  if (appMode !== '360-photo') return true;
                  if (f.type === "camera" || f.name.includes("360 Kamera")) return false;
                  if (isDollhouseMode) return true;

                  const activeCam = furnitureLayers.find(c => c.id === currentTourNodeId);
                  if (!activeCam) return f.nodeId === currentTourNodeId || !f.nodeId;

                  const rooms = furnitureLayers.filter(r => r.type === "room" && (r.floor ?? 0) === currentFloor);

                  if (rooms.length === 0) {
                    const isCamInDefault = Math.abs(activeCam.position.x) <= roomSize.width / 2 && 
                                           Math.abs(activeCam.position.z) <= roomSize.length / 2;
                    const isFurnitureInDefault = Math.abs(f.position.x) <= roomSize.width / 2 && 
                                                 Math.abs(f.position.z) <= roomSize.length / 2;

                    if (isCamInDefault && isFurnitureInDefault) return true;
                    return f.nodeId === currentTourNodeId || !f.nodeId;
                  } else {
                    const activeRoom = rooms.find(r => 
                      Math.abs(activeCam.position.x - r.position.x) <= r.scale.x / 2 && 
                      Math.abs(activeCam.position.z - r.position.z) <= r.scale.z / 2
                    );

                    if (activeRoom) {
                      const isFurnitureInRoom = Math.abs(f.position.x - activeRoom.position.x) <= activeRoom.scale.x / 2 && 
                                                Math.abs(f.position.z - activeRoom.position.z) <= activeRoom.scale.z / 2;
                      if (isFurnitureInRoom) return true;
                    }

                    return f.nodeId === currentTourNodeId || !f.nodeId;
                  }
                })
                .map((furniture) => (
                  <FurnitureItem key={furniture.id} data={furniture} />
                ))}
            </Suspense>
          </Canvas>
        );
      })()}
    </div>
  );
}
