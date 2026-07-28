export interface RoomBounds {
  id: string;
  name: string;
  centerX: number;
  centerZ: number;
  width: number;
  length: number;
  height: number;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

/**
 * Retrieves all room structures in the scene on the specified floor,
 * including the primary default room at (0, 0, 0) and any added room objects.
 */
export function getAllRoomBounds(
  furnitureLayers: any[],
  roomSize: { width: number; length: number; height: number },
  currentFloor: number = 0
): RoomBounds[] {
  const rooms: RoomBounds[] = [
    {
      id: "main-room",
      name: "Əsas Otaq",
      centerX: 0,
      centerZ: 0,
      width: roomSize.width,
      length: roomSize.length,
      height: roomSize.height,
      minX: -roomSize.width / 2,
      maxX: roomSize.width / 2,
      minZ: -roomSize.length / 2,
      maxZ: roomSize.length / 2,
    },
  ];

  const addedRooms = furnitureLayers.filter(
    (f) => f.type === "room" && (f.floor ?? 0) === currentFloor
  );

  addedRooms.forEach((r) => {
    const w = r.scale?.x || 6;
    const l = r.scale?.z || roomSize.length || 6;
    const h = r.scale?.y || roomSize.height || 3;
    const cx = r.position.x;
    const cz = r.position.z;

    rooms.push({
      id: r.id,
      name: r.name || "Otaq Kubu",
      centerX: cx,
      centerZ: cz,
      width: w,
      length: l,
      height: h,
      minX: cx - w / 2,
      maxX: cx + w / 2,
      minZ: cz - l / 2,
      maxZ: cz + l / 2,
    });
  });

  return rooms;
}

/**
 * Finds the room bounds containing or closest to the specified position.
 */
export function getRoomAtPosition(
  pos: Vector3D,
  nodeId: string | undefined | null,
  furnitureLayers: any[],
  roomSize: { width: number; length: number; height: number },
  currentFloor: number = 0
): RoomBounds {
  const rooms = getAllRoomBounds(furnitureLayers, roomSize, currentFloor);

  if (nodeId) {
    const matched = rooms.find((r) => r.id === nodeId);
    if (matched) return matched;
  }

  // Find room containing position with slight padding
  const insideRoom = rooms.find(
    (r) =>
      pos.x >= r.minX - 0.5 &&
      pos.x <= r.maxX + 0.5 &&
      pos.z >= r.minZ - 0.5 &&
      pos.z <= r.maxZ + 0.5
  );

  if (insideRoom) return insideRoom;

  // Closest room fallback based on distance to center
  let closest = rooms[0];
  let minDistance = Infinity;
  rooms.forEach((r) => {
    const dist = Math.hypot(pos.x - r.centerX, pos.z - r.centerZ);
    if (dist < minDistance) {
      minDistance = dist;
      closest = r;
    }
  });

  return closest;
}

/**
 * Clamps an object's position to stay safely inside its designated room bounds.
 */
export function clampPositionToRoom(
  pos: Vector3D,
  objHalfW: number,
  objHalfL: number,
  room: RoomBounds
): Vector3D {
  return {
    x: Math.max(room.minX + objHalfW, Math.min(room.maxX - objHalfW, pos.x)),
    y: Math.max(0, pos.y),
    z: Math.max(room.minZ + objHalfL, Math.min(room.maxZ - objHalfL, pos.z)),
  };
}

/**
 * Calculates wall ruler distances for an object inside its current room.
 */
export function getRulerDistancesForRoom(pos: Vector3D, room: RoomBounds) {
  return {
    right: Math.max(0, room.maxX - pos.x),
    left: Math.max(0, pos.x - room.minX),
    back: Math.max(0, room.maxZ - pos.z),
    front: Math.max(0, pos.z - room.minZ),
  };
}

export type AttachmentDirection = "right" | "left" | "front" | "back";

/**
 * Calculates the exact attached placement position for a new adjacent room cube
 * ensuring ZERO GAP attachment to the target room's specified wall (right, left, front, back).
 */
export function calculateAttachedRoomPosition(
  furnitureLayers: any[],
  roomSize: { width: number; length: number; height: number },
  smallWidth: number = 6,
  smallLength?: number,
  currentFloor: number = 0,
  direction: AttachmentDirection = "right",
  targetRoomId?: string
) {
  const targetLength = smallLength ?? roomSize.length;
  const rooms = getAllRoomBounds(furnitureLayers, roomSize, currentFloor);

  // Find parent target room or default to primary room / furthest bounding room
  let targetRoom = rooms.find((r) => r.id === targetRoomId);
  if (!targetRoom) {
    if (direction === "right") {
      let maxRight = -Infinity;
      rooms.forEach((r) => { if (r.maxX > maxRight) { maxRight = r.maxX; targetRoom = r; } });
    } else if (direction === "left") {
      let minLeft = Infinity;
      rooms.forEach((r) => { if (r.minX < minLeft) { minLeft = r.minX; targetRoom = r; } });
    } else if (direction === "front") {
      let maxFront = -Infinity;
      rooms.forEach((r) => { if (r.maxZ > maxFront) { maxFront = r.maxZ; targetRoom = r; } });
    } else if (direction === "back") {
      let minBack = Infinity;
      rooms.forEach((r) => { if (r.minZ < minBack) { minBack = r.minZ; targetRoom = r; } });
    }
  }

  const pRoom = targetRoom || rooms[0];

  let newRoomX = pRoom.centerX;
  let newRoomZ = pRoom.centerZ;
  let boundaryX = pRoom.centerX;
  let boundaryZ = pRoom.centerZ;

  if (direction === "right") {
    newRoomX = pRoom.maxX + smallWidth / 2;
    newRoomZ = pRoom.centerZ;
    boundaryX = pRoom.maxX;
  } else if (direction === "left") {
    newRoomX = pRoom.minX - smallWidth / 2;
    newRoomZ = pRoom.centerZ;
    boundaryX = pRoom.minX;
  } else if (direction === "front") {
    newRoomX = pRoom.centerX;
    newRoomZ = pRoom.maxZ + targetLength / 2;
    boundaryZ = pRoom.maxZ;
  } else if (direction === "back") {
    newRoomX = pRoom.centerX;
    newRoomZ = pRoom.minZ - targetLength / 2;
    boundaryZ = pRoom.minZ;
  }

  return {
    newRoomX,
    newRoomZ,
    smallWidth,
    smallLength: targetLength,
    boundaryX,
    boundaryZ,
    parentRoomId: pRoom.id,
    parentRoomName: pRoom.name
  };
}
