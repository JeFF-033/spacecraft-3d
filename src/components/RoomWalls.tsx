import * as THREE from "three";
import { useStore } from "@/store/useStore";
import { useTexture } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import React, { Suspense, useRef } from "react";
import { Geometry, Base, Subtraction } from "@react-three/csg";
import { useFrame } from "@react-three/fiber";
import { getAllRoomBounds } from "@/lib/roomSystem";

function FadingWall({ 
  children, 
  position, 
  rotation, 
  roomSize, 
  center,
  isWalkthrough,
  isDividingWall,
  appMode
}: { 
  children: React.ReactNode; 
  position: [number, number, number]; 
  rotation?: [number, number, number]; 
  roomSize: any; 
  center: [number, number, number]; 
  isWalkthrough: boolean;
  isDividingWall?: boolean;
  appMode?: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const currentOpacityRef = useRef(1);
  
  useFrame(({ camera }) => {
    if (groupRef.current) {
      // 360° Foto rejimində divarlar həmişə 100% bütöv və opaq (solid) qalmalıdır
      if (appMode === "360-photo") {
        currentOpacityRef.current = 1;
        groupRef.current.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const material = (child as THREE.Mesh).material;
            if (material) {
              const updateMat = (m: any) => {
                if (m.transparent) {
                  m.transparent = false;
                  m.opacity = 1;
                  m.depthWrite = true;
                  m.needsUpdate = true;
                }
              };
              if (Array.isArray(material)) material.forEach(updateMat);
              else updateMat(material);
            }
          }
        });
        return;
      }

      // 3D Otaq rejimində kamera bucağına görə qabaqdakı divar pəncərə kimi şəffaflaşsın (glass effect)
      const centerVec = new THREE.Vector3(center[0], center[1], center[2]);
      const distToCenter = camera.position.distanceTo(centerVec);
      const wallPos = new THREE.Vector3(position[0], position[1], position[2]);
      const distToWall = camera.position.distanceTo(wallPos);
      
      const minDim = Math.min(roomSize.width, roomSize.length) / 2;
      const isInside = Math.abs(camera.position.x - center[0]) < minDim && 
                       Math.abs(camera.position.z - center[2]) < minDim;

      let targetOpacity = 1;
      if (!isDividingWall && !isInside && distToWall < distToCenter) {
        targetOpacity = 0.15; // Kamera tərəfə baxan divar pəncərə/glass effekti alsın
      }

      if (Math.abs(currentOpacityRef.current - targetOpacity) < 0.005) {
        currentOpacityRef.current = targetOpacity;
      } else {
        currentOpacityRef.current = THREE.MathUtils.lerp(currentOpacityRef.current, targetOpacity, 0.1);
      }
      
      groupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const material = (child as THREE.Mesh).material;
          if (material) {
            const updateMaterial = (m: any) => {
              const targetDepthWrite = currentOpacityRef.current > 0.9;
              let changed = false;
              
              if (currentOpacityRef.current < 0.99) {
                if (!m.transparent) {
                  m.transparent = true;
                  changed = true;
                }
              } else {
                if (m.transparent) {
                  m.transparent = false;
                  changed = true;
                }
              }

              if (m.opacity !== currentOpacityRef.current) {
                m.opacity = currentOpacityRef.current;
              }

              if (m.depthWrite !== targetDepthWrite) {
                m.depthWrite = targetDepthWrite;
                changed = true;
              }

              if (changed) {
                m.needsUpdate = true;
              }
            };

            if (Array.isArray(material)) {
              material.forEach(updateMaterial);
            } else {
              updateMaterial(material);
            }
          }
        }
      });
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {children}
    </group>
  );
}

function TexturedMaterial({ 
  color, 
  textureObj, 
  bumpMap, 
  roughnessMap, 
  roughness, 
  metalness, 
  side, 
  transparent, 
  opacity 
}: { 
  color: string; 
  textureObj: THREE.Texture; 
  bumpMap: THREE.Texture | null; 
  roughnessMap: THREE.Texture | null; 
  roughness: number; 
  metalness: number; 
  side?: any; 
  transparent?: boolean; 
  opacity?: number; 
}) {
  return (
    <meshStandardMaterial 
      color={color} 
      map={textureObj}
      bumpMap={bumpMap}
      roughnessMap={roughnessMap}
      roughness={roughness}
      metalness={metalness}
      side={side || THREE.FrontSide}
      transparent={transparent}
      opacity={opacity}
      envMapIntensity={1.5}
    />
  );
}

function SingleRoomBox({
  roomId,
  centerX,
  centerZ,
  roomSize,
  floorColor,
  wallColor,
  floorTextureUrl,
  wallTextureUrl,
  openings,
  appMode,
  isDollhouseMode,
  isWalkthrough,
  cameras
}: {
  roomId?: string;
  centerX: number;
  centerZ: number;
  roomSize: { width: number; length: number; height: number };
  floorColor: string;
  wallColor: string;
  floorTextureUrl: string;
  wallTextureUrl: string;
  openings: any[];
  appMode: string;
  isDollhouseMode: boolean;
  isWalkthrough: boolean;
  cameras: any[];
}) {
  const { furnitureLayers, currentFloor } = useStore();
  const { width, length, height } = roomSize;

  const floorTextureObj = useLoader(THREE.TextureLoader, floorTextureUrl);
  const wallTextureObj = useLoader(THREE.TextureLoader, wallTextureUrl);

  const isDefaultWood = floorTextureUrl.includes("wood.png");
  const isBrick = wallTextureUrl.includes("brick");

  const [woodBump, woodRoughness] = useTexture(["/textures/pbr/wood_bump.jpg", "/textures/pbr/wood_roughness.jpg"]);
  const [brickBump, brickRoughness] = useTexture(["/textures/pbr/brick_bump.jpg", "/textures/pbr/brick_roughness.jpg"]);

  React.useEffect(() => {
    if (floorTextureObj) {
      floorTextureObj.wrapS = floorTextureObj.wrapT = THREE.RepeatWrapping;
      floorTextureObj.repeat.set(width / 2, length / 2);
      floorTextureObj.needsUpdate = true;
    }
    if (wallTextureObj) {
      wallTextureObj.wrapS = wallTextureObj.wrapT = THREE.RepeatWrapping;
      wallTextureObj.repeat.set(width / 2, height / 2);
      wallTextureObj.needsUpdate = true;
    }
    
    [woodBump, woodRoughness].forEach(tex => {
      if (tex) {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(width / 2, length / 2);
        tex.needsUpdate = true;
      }
    });

    [brickBump, brickRoughness].forEach(tex => {
      if (tex) {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(width / 2, height / 2);
        tex.needsUpdate = true;
      }
    });
  }, [floorTextureObj, wallTextureObj, width, length, height, woodBump, woodRoughness, brickBump, brickRoughness]);

  // Find camera nodes that sit inside this room box
  const camerasInRoom = cameras.filter(c => 
    Math.abs(c.position.x - centerX) <= width / 2 && 
    Math.abs(c.position.z - centerZ) <= length / 2
  );
  const cameraIds = camerasInRoom.map(c => c.id);

  // Filter openings for this specific room box (linked by nodeId or by proximity)
  const localOpenings = openings.filter((op) => {
    if (roomId && op.nodeId === roomId) return true;
    if (op.nodeId && cameraIds.includes(op.nodeId)) return true;
    if (op.nodeId) return false; // belongs to another room node
    return Math.abs(op.position.x - centerX) <= width / 2 + 0.5 && 
           Math.abs(op.position.z - centerZ) <= length / 2 + 0.5;
  });

  const renderCSGWall = (
    wallWidth: number,
    wallHeight: number,
    snappedOpenings: any[],
    wallType: 'back' | 'front' | 'left' | 'right'
  ) => {
    const material = (
      <TexturedMaterial
        color={wallColor}
        textureObj={wallTextureObj}
        bumpMap={isBrick ? brickBump : null}
        roughnessMap={isBrick ? brickRoughness : null}
        roughness={0.9}
        metalness={0.05}
        side={THREE.DoubleSide}
      />
    );

    if (snappedOpenings.length === 0) {
      return (
        <mesh receiveShadow castShadow>
          <boxGeometry args={[wallWidth, wallHeight, 0.2]} />
          {material}
        </mesh>
      );
    }

    // Əgər divarda keçid/qapı/pəncərə kəsiyi varsa, onu fiziki divar hissələrinə (Sol, Sağ, Üst Lintel və Alt Sill) bölərək render edirik
    const op = snappedOpenings[0];
    const isWindow = op.name?.includes("Pəncərə") || op.type === "window";
    const openingWidth = op.scale?.x || (isWindow ? 1.2 : 1.1);
    const openingHeight = op.scale?.y || (isWindow ? 1.2 : 2.1);
    
    const defaultCenterY = isWindow ? 1.4 : 1.05;
    const openingCenterY = op.position?.y !== undefined && op.position?.y !== 0 ? op.position.y : defaultCenterY;

    let doorLocalX = 0;
    if (wallType === 'back') {
      doorLocalX = op.position.x - centerX;
    } else if (wallType === 'front') {
      doorLocalX = -(op.position.x - centerX);
    } else if (wallType === 'left') {
      doorLocalX = -(op.position.z - centerZ);
    } else if (wallType === 'right') {
      doorLocalX = op.position.z - centerZ;
    }

    const wallHalf = wallWidth / 2;
    const doorMin = doorLocalX - openingWidth / 2;
    const doorMax = doorLocalX + openingWidth / 2;

    const leftSectionWidth = Math.max(0, doorMin - (-wallHalf));
    const rightSectionWidth = Math.max(0, wallHalf - doorMax);

    const bottomY = isWindow ? Math.max(0, openingCenterY - openingHeight / 2) : 0;
    const topY = isWindow ? Math.min(wallHeight, openingCenterY + openingHeight / 2) : Math.min(wallHeight, openingHeight);

    const topSectionHeight = Math.max(0, wallHeight - topY);
    const bottomSectionHeight = Math.max(0, bottomY);

    const leftCenterX = -wallHalf + leftSectionWidth / 2;
    const rightCenterX = doorMax + rightSectionWidth / 2;
    const topCenterY = (topY + wallHeight) / 2 - wallHeight / 2;
    const bottomCenterY = bottomY / 2 - wallHeight / 2;

    return (
      <group>
        {/* Sol divar hissəsi */}
        {leftSectionWidth > 0.02 && (
          <mesh position={[leftCenterX, 0, 0]} receiveShadow castShadow>
            <boxGeometry args={[leftSectionWidth, wallHeight, 0.2]} />
            {material}
          </mesh>
        )}

        {/* Sağ divar hissəsi */}
        {rightSectionWidth > 0.02 && (
          <mesh position={[rightCenterX, 0, 0]} receiveShadow castShadow>
            <boxGeometry args={[rightSectionWidth, wallHeight, 0.2]} />
            {material}
          </mesh>
        )}

        {/* Qapı/Pəncərə üstündəki divar hissəsi (Lintel) */}
        {topSectionHeight > 0.02 && (
          <mesh position={[doorLocalX, topCenterY, 0]} receiveShadow castShadow>
            <boxGeometry args={[openingWidth, topSectionHeight, 0.2]} />
            {material}
          </mesh>
        )}

        {/* Pəncərə altındakı divar hissəsi (Sill) */}
        {bottomSectionHeight > 0.02 && (
          <mesh position={[doorLocalX, bottomCenterY, 0]} receiveShadow castShadow>
            <boxGeometry args={[openingWidth, bottomSectionHeight, 0.2]} />
            {material}
          </mesh>
        )}
      </group>
    );
  };

  const snapDist = 1.5;

  // All room bounds
  const rightEdge = centerX + width / 2;
  const leftEdge = centerX - width / 2;
  const topEdge = centerZ - length / 2;
  const bottomEdge = centerZ + length / 2;

  const allRooms = getAllRoomBounds(furnitureLayers, roomSize, currentFloor);
  const currentRoomId = roomId || "main-room";

  // Check adjacency in 4 directions
  const hasRightAdjacent = allRooms.some(r => r.id !== currentRoomId && Math.abs(r.minX - rightEdge) < 0.5 && Math.abs(r.centerZ - centerZ) < length / 2 + 0.5);
  const hasLeftAdjacent = allRooms.some(r => r.id !== currentRoomId && Math.abs(r.maxX - leftEdge) < 0.5 && Math.abs(r.centerZ - centerZ) < length / 2 + 0.5);
  const hasFrontAdjacent = allRooms.some(r => r.id !== currentRoomId && Math.abs(r.minZ - bottomEdge) < 0.5 && Math.abs(r.centerX - centerX) < width / 2 + 0.5);
  const hasBackAdjacent = allRooms.some(r => r.id !== currentRoomId && Math.abs(r.maxZ - topEdge) < 0.5 && Math.abs(r.centerX - centerX) < width / 2 + 0.5);

  // Filter openings for each of the 4 walls (include openings within snapDist of wall position)
  const backWallOpenings = localOpenings.filter((op) => Math.abs(op.position.z - topEdge) < snapDist);
  const frontWallOpenings = localOpenings.filter((op) => Math.abs(op.position.z - bottomEdge) < snapDist);
  const leftWallOpenings = localOpenings.filter((op) => Math.abs(op.position.x - leftEdge) < snapDist);
  const rightWallOpenings = localOpenings.filter((op) => Math.abs(op.position.x - rightEdge) < snapDist);

  // Effective openings (add auto-door for adjacent walls if no manual door exists)
  const effectiveRightOpenings = [...rightWallOpenings];
  if (hasRightAdjacent && rightWallOpenings.length === 0) {
    effectiveRightOpenings.push({
      id: `auto-door-right-${centerX}-${centerZ}`,
      position: { x: rightEdge, y: 1.1, z: centerZ },
      scale: { x: 1.1, y: 2.1, z: 0.5 }
    });
  }

  const effectiveLeftOpenings = [...leftWallOpenings];
  if (hasLeftAdjacent && leftWallOpenings.length === 0) {
    effectiveLeftOpenings.push({
      id: `auto-door-left-${centerX}-${centerZ}`,
      position: { x: leftEdge, y: 1.1, z: centerZ },
      scale: { x: 1.1, y: 2.1, z: 0.5 }
    });
  }

  const effectiveFrontOpenings = [...frontWallOpenings];
  if (hasFrontAdjacent && frontWallOpenings.length === 0) {
    effectiveFrontOpenings.push({
      id: `auto-door-front-${centerX}-${centerZ}`,
      position: { x: centerX, y: 1.1, z: bottomEdge },
      scale: { x: 1.1, y: 2.1, z: 0.5 }
    });
  }

  const effectiveBackOpenings = [...backWallOpenings];
  if (hasBackAdjacent && backWallOpenings.length === 0) {
    effectiveBackOpenings.push({
      id: `auto-door-back-${centerX}-${centerZ}`,
      position: { x: centerX, y: 1.1, z: topEdge },
      scale: { x: 1.1, y: 2.1, z: 0.5 }
    });
  }

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[centerX, 0, centerZ]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <TexturedMaterial 
          color={floorColor} 
          textureObj={floorTextureObj} 
          bumpMap={isDefaultWood ? woodBump : null} 
          roughnessMap={isDefaultWood ? woodRoughness : null} 
          roughness={isDefaultWood ? 0.4 : 0.9} 
          metalness={isDefaultWood ? 0.2 : 0.05} 
          side={THREE.FrontSide} 
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[centerX, -0.01, centerZ]}>
        <planeGeometry args={[width, length]} />
        <meshBasicMaterial color="#050505" />
      </mesh>

      {/* Ceiling */}
      {((appMode === '360-photo' && !isDollhouseMode) || isWalkthrough) && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[centerX, height, centerZ]} receiveShadow>
          <planeGeometry args={[width, length]} />
          <meshStandardMaterial color="#fafafa" roughness={0.95} metalness={0.01} side={THREE.FrontSide} />
        </mesh>
      )}

      {/* Back Wall (Z-) */}
      <FadingWall 
        position={[centerX, height / 2, topEdge]} 
        roomSize={roomSize} 
        center={[centerX, 0, centerZ]} 
        isWalkthrough={isWalkthrough}
        isDividingWall={hasBackAdjacent}
        appMode={appMode}
      >
        {renderCSGWall(width, height, effectiveBackOpenings, 'back')}
      </FadingWall>

      {/* Front Wall (Z+) */}
      <FadingWall 
        position={[centerX, height / 2, bottomEdge]} 
        rotation={[0, Math.PI, 0]} 
        roomSize={roomSize} 
        center={[centerX, 0, centerZ]} 
        isWalkthrough={isWalkthrough}
        isDividingWall={hasFrontAdjacent}
        appMode={appMode}
      >
        {renderCSGWall(width, height, effectiveFrontOpenings, 'front')}
      </FadingWall>

      {/* Left Wall (X-) */}
      <FadingWall 
        position={[leftEdge, height / 2, centerZ]} 
        rotation={[0, Math.PI / 2, 0]} 
        roomSize={roomSize} 
        center={[centerX, 0, centerZ]} 
        isWalkthrough={isWalkthrough}
        isDividingWall={hasLeftAdjacent}
        appMode={appMode}
      >
        {renderCSGWall(length, height, effectiveLeftOpenings, 'left')}
      </FadingWall>

      {/* Right Wall (X+) */}
      <FadingWall 
        position={[rightEdge, height / 2, centerZ]} 
        rotation={[0, -Math.PI / 2, 0]} 
        roomSize={roomSize} 
        center={[centerX, 0, centerZ]} 
        isWalkthrough={isWalkthrough}
        isDividingWall={hasRightAdjacent}
        appMode={appMode}
      >
        {renderCSGWall(length, height, effectiveRightOpenings, 'right')}
      </FadingWall>
    </group>
  );
}

export default function RoomWalls() {
  const { roomSize, wallColor, floorColor, wallTexture, floorTexture, furnitureLayers, currentFloor, appMode, isWalkthrough, isDollhouseMode } = useStore();

  const floorTextureUrl = floorTexture || "/textures/wood.png";
  const wallTextureUrl = wallTexture || "/textures/concrete.png";

  const openings = furnitureLayers.filter(
    (f) =>
      (f.name.includes("Qapı") || f.name.includes("Pəncərə")) &&
      (f.floor ?? 0) === currentFloor
  );

  const cameras = furnitureLayers.filter(
    (f) => (f.type === "camera" || f.name.includes("360 Kamera")) && (f.floor ?? 0) === currentFloor
  );

  // Filter out manual room boxes in the layers
  const rooms = furnitureLayers.filter(
    (f) => f.type === "room" && (f.floor ?? 0) === currentFloor
  );

  return (
    <Suspense fallback={null}>
      {/* Always render the main/default room box at (0, 0, 0) */}
      <SingleRoomBox
        centerX={0}
        centerZ={0}
        roomSize={roomSize}
        floorColor={floorColor}
        wallColor={wallColor}
        floorTextureUrl={floorTextureUrl}
        wallTextureUrl={wallTextureUrl}
        openings={openings}
        appMode={appMode}
        isDollhouseMode={isDollhouseMode}
        isWalkthrough={isWalkthrough}
        cameras={cameras}
      />

      {/* Render any additional manual room boxes */}
      {rooms.map((room) => (
        <SingleRoomBox
          key={room.id}
          roomId={room.id}
          centerX={room.position.x}
          centerZ={room.position.z}
          roomSize={{
            width: room.scale.x,
            length: room.scale.z,
            height: room.scale.y
          }}
          floorColor={room.floorColor || floorColor}
          wallColor={room.color}
          floorTextureUrl={room.floorTexture || floorTextureUrl}
          wallTextureUrl={room.wallTexture || wallTextureUrl}
          openings={openings}
          appMode={appMode}
          isDollhouseMode={isDollhouseMode}
          isWalkthrough={isWalkthrough}
          cameras={cameras}
        />
      ))}
    </Suspense>
  );
}
