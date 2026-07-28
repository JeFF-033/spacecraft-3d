import { create } from "zustand";

interface Position {
  x: number;
  y: number;
  z: number;
}

interface Furniture {
  id: string;
  name: string;
  modelUrl: string;
  type?: 'furniture' | 'door' | 'window' | 'camera' | 'room'; // Yeni Arxitektura tipi
  position: Position;
  rotation: Position;
  scale: Position;
  color: string;
  floor?: number; // Aid olduğu mərtəbə
  price?: number; // Qiymət (AZN ilə)
  nodeId?: string; // Bu mebelin aid olduğu otaq/kamera nöqtəsi
  
  // Ağıllı İşıqlandırma parametrləri (Yalnız işıq tipli obyektlər üçün)
  lightColor?: string;
  lightIntensity?: number;
  lightDistance?: number;
  lightAngle?: number;

  // 360 Kamera üçün əlavələr
  panoramaUrl?: string; // Bu kamera nöqtəsindən render edilmiş panorama şəkil
  rotationOffset?: number; // Panorama kalibrasiya fırlanma bucağı (radianda)
  floorColor?: string; // Otaq qutusu üçün döşəmə rəngi
  wallTexture?: string | null; // Otaq qutusu üçün divar teksturası
  floorTexture?: string | null; // Otaq qutusu üçün döşəmə teksturası
  doorStyle?: string; // Qapı modeli stili: classic-wood | modern-white | modern-double-glass | wood-frosted-glass | anthracite-flush | french-grid
}

export interface TourNode {
  id: string;
  name: string;
  panoramaUrl: string;
  originalUrl?: string; // Orijinal Mebelli Şəkil
  defurnishedUrl?: string; // AI ilə Təmizlənmiş Şəkil
  position?: { x: number; y: number; z: number };
  rotationOffset?: number;
}

export interface Hotspot {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  position: { x: number; y: number; z: number };
}

export interface Mattertag {
  id: string;
  nodeId: string;
  title: string;
  description: string;
  position: { x: number; y: number; z: number };
  color?: string;
}

export interface CustomSmetaItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
}

interface AppState {
  furnitureLayers: Furniture[];
  customSmetaItems: CustomSmetaItem[];
  addCustomSmetaItem: (item: Omit<CustomSmetaItem, 'id'>) => void;
  deleteCustomSmetaItem: (id: string) => void;
  updateCustomSmetaItem: (id: string, updates: Partial<CustomSmetaItem>) => void;
  pastLayers: Furniture[][];
  futureLayers: Furniture[][];
  selectedId: string | null;
  roomSize: { width: number; length: number; height: number };
  timeOfDay: number;
  wallColor: string;
  floorColor: string;
  wallTexture: string | null;
  floorTexture: string | null;
  transformMode: "translate" | "rotate" | "scale";
  ambientLightIntensity: number;
  is2DView: boolean;
  isWalkthrough: boolean;
  isGridSnapEnabled: boolean;
  isTransforming: boolean;
  isSidebarOpen: boolean;
  isPropertiesPanelOpen: boolean;
  isPresentationMode: boolean;
  projectId: string | null;
  
  floorplanImage: string | null;
  floorplanOpacity: number;
  floorplanScale: number;

  gridSnapSize: number;
  shadowQuality: "high" | "medium" | "low";
  cameraSensitivity: number;

  setProjectId: (id: string | null) => void;
  setGridSnapSize: (size: number) => void;
  setShadowQuality: (quality: "high" | "medium" | "low") => void;
  setCameraSensitivity: (val: number) => void;
  updateFurniture: (id: string, updates: Partial<Furniture>) => void;
  setSelectedId: (id: string | null) => void;
  setRoomColors: (colors: { wallColor?: string; floorColor?: string }) => void;
  setRoomTextures: (textures: { wallTexture?: string | null; floorTexture?: string | null }) => void;
  setTransformMode: (mode: "translate" | "rotate" | "scale") => void;
  setAmbientLightIntensity: (intensity: number) => void;
  setIs2DView: (val: boolean) => void;
  setIsWalkthrough: (val: boolean) => void;
  setIsGridSnapEnabled: (val: boolean) => void;
  setIsTransforming: (val: boolean) => void;
  setIsSidebarOpen: (val: boolean) => void;
  setIsPropertiesPanelOpen: (val: boolean) => void;
  setIsPresentationMode: (val: boolean) => void;
  duplicateFurniture: (id: string) => void;
  deleteFurniture: (id: string) => void;
  
  setFloorplanImage: (url: string | null) => void;
  setFloorplanOpacity: (val: number) => void;
  setFloorplanScale: (val: number) => void;
  
  // History
  saveHistory: () => void;
  appMode: "3d-room" | "360-photo";
  setAppMode: (mode: "3d-room" | "360-photo") => void;
  panoramaImage: string | null;
  setPanoramaImage: (url: string | null) => void;

  // Virtual Tour (Matterport analoqu)
  tourNodes: TourNode[];
  hotspots: Hotspot[];
  mattertags: Mattertag[];
  currentTourNodeId: string | null;
  setTourNodes: (nodes: TourNode[]) => void;
  setHotspots: (hotspots: Hotspot[]) => void;
  setMattertags: (tags: Mattertag[]) => void;
  setCurrentTourNodeId: (id: string | null) => void;
  addTourNode: (node: TourNode) => void;
  addHotspot: (hotspot: Hotspot) => void;
  addMattertag: (tag: Mattertag) => void;
  
  isAutoTourPlaying: boolean;
  setIsAutoTourPlaying: (val: boolean) => void;

  tourBuilderMode: "idle" | "add-hotspot" | "add-tag";
  setTourBuilderMode: (mode: "idle" | "add-hotspot" | "add-tag") => void;

  isDollhouseMode: boolean;
  setIsDollhouseMode: (val: boolean) => void;

  isDefurnishedMode: boolean;
  setIsDefurnishedMode: (val: boolean) => void;

  view3DIn360: boolean;
  setView3DIn360: (val: boolean) => void;

  // Ruletka (Tape Measure)
  isMeasuring: boolean;
  setIsMeasuring: (measuring: boolean) => void;
  measurements: Array<{ id: string, p1: {x:number,y:number,z:number}, p2: {x:number,y:number,z:number} }>;
  addMeasurement: (m: { id: string, p1: {x:number,y:number,z:number}, p2: {x:number,y:number,z:number} }) => void;
  clearMeasurements: () => void;
  rulerColor: string;
  setRulerColor: (color: string) => void;
  gridColor: string;
  setGridColor: (color: string) => void;

  // AI Design
  applyAIDesign: (design: { furniture: any[], wallTexture: string, floorTexture: string }) => void;
  applyAICommand: (actions: Array<{
    type: "add_furniture" | "delete_furniture" | "set_properties";
    payload: any;
  }>) => void;

  // Tarixçə (Undo/Redo)
  undo: () => void;
  redo: () => void;

  // Çoxmərtəbəli Sistem
  floors: string[]; // Mərtəbələrin adları
  currentFloor: number; // Aktiv mərtəbə indeksi
  addFloor: () => void;
  removeFloor: (idx: number) => void;
  setCurrentFloor: (idx: number) => void;

  // Daxili Divar Çəkmə Rejimi
  isDrawingWall: boolean;
  setIsDrawingWall: (val: boolean) => void;
  
  // Valyutalar
  selectedCurrency: string;
  currencyRates: Record<string, number>; // AZN-ə nəzərən
  setCurrency: (currency: string) => void;
  fetchRates: () => Promise<void>;
  
  cameraRef: any | null;
  hideOuterShell: boolean;
  setHideOuterShell: (val: boolean) => void;
}

const getInitialGridSnapSize = () => {
  if (typeof window !== "undefined") {
    const size = localStorage.getItem("spacecraft_snap_grid");
    if (size) return parseFloat(size);
  }
  return 0.5;
};

const getInitialShadowQuality = () => {
  if (typeof window !== "undefined") {
    const q = localStorage.getItem("spacecraft_render_quality");
    if (q === "high" || q === "medium" || q === "low") return q;
  }
  return "high";
};

const getInitialCameraSensitivity = () => {
  if (typeof window !== "undefined") {
    const sens = localStorage.getItem("spacecraft_camera_sensitivity");
    if (sens) return parseFloat(sens);
  }
  return 50;
};

const getInitialGridColor = () => {
  if (typeof window !== "undefined") {
    const col = localStorage.getItem("spacecraft_grid_color");
    if (col) return col;
  }
  return "#4f46e5";
};

export const useStore = create<AppState>((set, get) => ({
  furnitureLayers: [],
  customSmetaItems: [],
  addCustomSmetaItem: (item) => set((state) => ({
    customSmetaItems: [...state.customSmetaItems, { ...item, id: `custom-${Date.now()}` }]
  })),
  deleteCustomSmetaItem: (id) => set((state) => ({
    customSmetaItems: state.customSmetaItems.filter(i => i.id !== id)
  })),
  updateCustomSmetaItem: (id, updates) => set((state) => ({
    customSmetaItems: state.customSmetaItems.map(i => i.id === id ? { ...i, ...updates } : i)
  })),
  pastLayers: [],
  futureLayers: [],
  selectedId: null,
  roomSize: { width: 10, length: 10, height: 3 },
  timeOfDay: 14,
  wallColor: "#ffffff",
  floorColor: "#8c8c8c",
  wallTexture: null,
  floorTexture: "/textures/wood.png",
  transformMode: "translate",
  ambientLightIntensity: 0.5,
  is2DView: false,
  isWalkthrough: false,
  isGridSnapEnabled: true,
  projectId: null,
  isTransforming: false,
  isSidebarOpen: true,
  isPropertiesPanelOpen: true,
  isPresentationMode: false,
  
  floorplanImage: null,
  floorplanOpacity: 0.5,
  floorplanScale: 10,

  gridSnapSize: getInitialGridSnapSize(),
  shadowQuality: getInitialShadowQuality(),
  cameraSensitivity: getInitialCameraSensitivity(),
  cameraRef: null,
  hideOuterShell: false,
  setHideOuterShell: (val) => set({ hideOuterShell: val }),

  setProjectId: (id) => set({ projectId: id }),
  saveHistory: () => set((state) => ({
    pastLayers: [...state.pastLayers, JSON.parse(JSON.stringify(state.furnitureLayers))],
    futureLayers: []
  })),

  appMode: "3d-room",
  setAppMode: (mode) => set({ appMode: mode }),
  panoramaImage: "/textures/sample-360.jpg",
  setPanoramaImage: (url) => set({ panoramaImage: url }),

  // Virtual Tour initial state
  tourNodes: [
    { id: "node-1", name: "Lounge Area", panoramaUrl: "/textures/pano1.jpg", position: { x: 0, y: 0, z: 0 } },
    { id: "node-2", name: "Small Empty Room", panoramaUrl: "/textures/pano2.jpg", position: { x: 5, y: 0, z: -2 } },
    { id: "node-3", name: "Artist Workshop", panoramaUrl: "/textures/pano3.jpg", position: { x: -4, y: 0, z: -3 } }
  ],
  hotspots: [
    { id: "hotspot-1", sourceNodeId: "node-1", targetNodeId: "node-2", position: { x: 0, y: -0.5, z: -4 } },
    { id: "hotspot-2", sourceNodeId: "node-2", targetNodeId: "node-1", position: { x: 0, y: -0.5, z: 4 } },
    { id: "hotspot-3", sourceNodeId: "node-1", targetNodeId: "node-3", position: { x: -4, y: -0.5, z: 0 } },
    { id: "hotspot-4", sourceNodeId: "node-3", targetNodeId: "node-1", position: { x: 4, y: -0.5, z: 0 } }
  ],
  mattertags: [
    { id: "tag-1", nodeId: "node-1", title: "Gözəl Mənzərə", description: "Bura polyhaven-dən yüklənmiş test otağıdır.", position: { x: -1.5, y: 0.8, z: -2 }, color: "#10b981" }
  ],
  currentTourNodeId: "node-1",
  setTourNodes: (nodes) => set({ tourNodes: nodes }),
  setHotspots: (hs) => set({ hotspots: hs }),
  setMattertags: (tags) => set({ mattertags: tags }),
  setCurrentTourNodeId: (id) => set({ currentTourNodeId: id }),
  addTourNode: (node) => set((state) => ({ tourNodes: [...state.tourNodes, node] })),
  addHotspot: (hs) => set((state) => ({ hotspots: [...state.hotspots, hs] })),
  addMattertag: (tag) => set((state) => ({ mattertags: [...state.mattertags, tag] })),

  isAutoTourPlaying: false,
  setIsAutoTourPlaying: (val) => set({ isAutoTourPlaying: val }),

  tourBuilderMode: "idle",
  setTourBuilderMode: (mode) => set({ tourBuilderMode: mode, isMeasuring: false, isDrawingWall: false }),

  isDollhouseMode: false,
  setIsDollhouseMode: (val) => set({ isDollhouseMode: val }),

  isDefurnishedMode: false,
  setIsDefurnishedMode: (val) => set({ isDefurnishedMode: val }),

  view3DIn360: true,
  setView3DIn360: (val) => set({ view3DIn360: val }),

  isMeasuring: false,
  setIsMeasuring: (val) => set({ isMeasuring: val, isDrawingWall: false }),
  measurements: [],
  addMeasurement: (m) => set((state) => ({ measurements: [...state.measurements, m] })),
  clearMeasurements: () => set({ measurements: [] }),
  rulerColor: "#eab308", // Yellow by default
  setRulerColor: (color) => set({ rulerColor: color }),
  gridColor: getInitialGridColor(),
  setGridColor: (color) => set({ gridColor: color }),
  setIsTransforming: (val) => set({ isTransforming: val }),

  applyAIDesign: (design) => set({
    furnitureLayers: design.furniture,
    wallTexture: design.wallTexture,
    floorTexture: design.floorTexture,
    selectedId: null,
    pastLayers: [],
    futureLayers: []
  }),

  applyAICommand: (actions) => set((state) => {
    state.saveHistory();
    let newFurniture = [...state.furnitureLayers];
    let newWallColor = state.wallColor;
    let newFloorColor = state.floorColor;
    let newWallTexture = state.wallTexture;
    let newFloorTexture = state.floorTexture;
    let newRoomSize = { ...state.roomSize };

    actions.forEach((action) => {
      if (action.type === "add_furniture") {
        const item = action.payload;
        const id = `model-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const isChandelier = item.name.includes("Lüstr") || item.name.includes("Çılçıq");
        const yPos = isChandelier ? newRoomSize.height - 0.3 : 0.5;
        
        let price = 50;
        if (item.name.includes("Masası")) price = 150;
        else if (item.name.includes("Kreslo")) price = 90;
        else if (item.name.includes("Divan")) price = 450;
        else if (item.name.includes("Yataq")) price = 600;
        else if (item.name.includes("Qarderob")) price = 500;
        else if (item.name.includes("Televizor")) price = 800;
        else if (item.name.includes("Bitki")) price = 25;

        const isLightItem = item.name.includes("Spot") || item.name.includes("Lüstr") || item.name.includes("LED");

        newFurniture.push({
          id,
          name: item.name,
          modelUrl: item.modelUrl || "",
          position: item.position || { x: 0, y: yPos, z: 0 },
          rotation: item.rotation || { x: 0, y: 0, z: 0 },
          scale: item.scale || { x: 1, y: 1, z: 1 },
          color: item.color || "#ffffff",
          floor: state.currentFloor,
          price,
          ...(isLightItem ? {
            lightColor: item.name.includes("Lüstr") ? "#ffddaa" : item.name.includes("LED") ? "#00ffff" : "#ffffff",
            lightIntensity: item.name.includes("Lüstr") ? 3.0 : item.name.includes("LED") ? 1.5 : 2.0,
            lightDistance: 12,
            lightAngle: item.name.includes("Spot") ? Math.PI / 4 : Math.PI
          } : {})
        });
      } else if (action.type === "delete_furniture") {
        const query = action.payload.name.toLowerCase();
        newFurniture = newFurniture.filter(f => !f.name.toLowerCase().includes(query));
      } else if (action.type === "set_properties") {
        const props = action.payload;
        if (props.wallColor) newWallColor = props.wallColor;
        if (props.floorColor) newFloorColor = props.floorColor;
        if (props.wallTexture !== undefined) newWallTexture = props.wallTexture;
        if (props.floorTexture !== undefined) newFloorTexture = props.floorTexture;
        if (props.roomSize) newRoomSize = { ...newRoomSize, ...props.roomSize };
      }
    });

    return {
      furnitureLayers: newFurniture,
      wallColor: newWallColor,
      floorColor: newFloorColor,
      wallTexture: newWallTexture,
      floorTexture: newFloorTexture,
      roomSize: newRoomSize
    };
  }),

  // Çoxmərtəbəli Sistem
  floors: ["1. Mərtəbə"],
  currentFloor: 0,
  addFloor: () => set((state) => {
    const nextFloorNum = state.floors.length + 1;
    return { floors: [...state.floors, `${nextFloorNum}. Mərtəbə`], currentFloor: nextFloorNum - 1 };
  }),
  removeFloor: (idx) => set((state) => {
    if (state.floors.length <= 1) return state;
    const newFloors = state.floors.filter((_, i) => i !== idx);
    const newIdx = Math.max(0, state.currentFloor - 1);
    // Həmin mərtəbədəki mebelləri də silirik
    const newFurniture = state.furnitureLayers.filter(f => (f.floor ?? 0) !== idx).map(f => {
      // Üst mərtəbələrdəki mebellərin mərtəbə indeksini azaldırıq
      if (f.floor && f.floor > idx) {
        return { ...f, floor: f.floor - 1 };
      }
      return f;
    });
    return { floors: newFloors, currentFloor: newIdx, furnitureLayers: newFurniture };
  }),
  setCurrentFloor: (idx) => set({ currentFloor: idx }),

  // Daxili Divar Çəkmə
  isDrawingWall: false,
  setIsDrawingWall: (val) => set({ isDrawingWall: val, isMeasuring: false }),

  // Valyutalar (Standart/Ehtiyat məzənnələr, API-dan yenilənəcək)
  selectedCurrency: "AZN",
  currencyRates: {
    "AZN": 1.0,
    "USD": 0.588, // 1 AZN = 0.588 USD
    "EUR": 0.540,
    "TRY": 19.34,
    "RUB": 51.52
  },
  setCurrency: (currency) => set({ selectedCurrency: currency }),
  fetchRates: async () => {
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/AZN");
      if (res.ok) {
        const data = await res.json();
        set({
          currencyRates: {
            "AZN": 1.0,
            "USD": data.rates.USD || 0.588,
            "EUR": data.rates.EUR || 0.540,
            "TRY": data.rates.TRY || 19.34,
            "RUB": data.rates.RUB || 51.52
          }
        });
      }
    } catch (e) {
      console.warn("Məzənnələr yüklənərkən xəta baş verdi:", e);
    }
  },

  undo: () => set((state) => {
    if (state.pastLayers.length === 0) return state;
    const previous = state.pastLayers[state.pastLayers.length - 1];
    const newPast = state.pastLayers.slice(0, -1);
    return {
      pastLayers: newPast,
      futureLayers: [JSON.parse(JSON.stringify(state.furnitureLayers)), ...state.futureLayers],
      furnitureLayers: previous,
      selectedId: null
    };
  }),

  redo: () => set((state) => {
    if (state.futureLayers.length === 0) return state;
    const next = state.futureLayers[0];
    const newFuture = state.futureLayers.slice(1);
    return {
      pastLayers: [...state.pastLayers, JSON.parse(JSON.stringify(state.furnitureLayers))],
      futureLayers: newFuture,
      furnitureLayers: next,
      selectedId: null
    };
  }),

  updateFurniture: (id, updates) => set((state) => ({
    furnitureLayers: state.furnitureLayers.map((f) =>
      f.id === id ? { ...f, ...updates } : f
    ),
  })),

  setSelectedId: (id) => set({ selectedId: id }),
  setRoomColors: (colors) => set((state) => ({ ...state, ...colors })),
  setRoomTextures: (textures) => set((state) => ({ ...state, ...textures })),
  setTransformMode: (mode) => set({ transformMode: mode }),
  setAmbientLightIntensity: (intensity) => set({ ambientLightIntensity: intensity }),
  setIs2DView: (val) => set({ is2DView: val, isWalkthrough: false }),
  setIsWalkthrough: (val) => set({ isWalkthrough: val, is2DView: false }),
  setIsGridSnapEnabled: (val) => set({ isGridSnapEnabled: val }),
  setIsSidebarOpen: (val) => set({ isSidebarOpen: val }),
  setIsPropertiesPanelOpen: (val) => set({ isPropertiesPanelOpen: val }),
  setIsPresentationMode: (val) => set({ isPresentationMode: val }),

  setFloorplanImage: (url) => set({ floorplanImage: url }),
  setFloorplanOpacity: (val) => set({ floorplanOpacity: val }),
  setFloorplanScale: (val) => set({ floorplanScale: val }),

  setGridSnapSize: (size) => set({ gridSnapSize: size }),
  setShadowQuality: (quality) => set({ shadowQuality: quality }),
  setCameraSensitivity: (val) => set({ cameraSensitivity: val }),

  duplicateFurniture: (id) => {
    const state = get();
    const item = state.furnitureLayers.find(f => f.id === id);
    if (!item) return;
    
    state.saveHistory();
    
    const newId = `model-${Date.now()}`;
    const newItem = JSON.parse(JSON.stringify(item));
    newItem.id = newId;
    // Obyektin tam üstünə düşməməsi üçün biraz kənara sürüşdürürük
    newItem.position.x += 1;
    newItem.position.z += 1;
    
    set({
      furnitureLayers: [...state.furnitureLayers, newItem],
      selectedId: newId
    });
  },

  deleteFurniture: (id) => {
    const state = get();
    state.saveHistory();
    set({
      furnitureLayers: state.furnitureLayers.filter(f => f.id !== id),
      selectedId: null
    });
  }
}));
