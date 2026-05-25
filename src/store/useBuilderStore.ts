import { create } from "zustand";

export interface LabelState {
  name: string;
  font: string;
  shape: string;
  color: string;
}

export interface PackagingState {
  type: string;
  finish: string;
  color: string;
  addons: string[];
}

export interface FragranceState {
  top: string[];
  middle: string[];
  base: string[];
  intensity: string;
}

export interface BuilderState {
  step: number;
  bottleMaterial: string;
  bottleSilhouette: string;
  bottleCapacity: string;
  capStyle: string;
  capColor: string;
  pumpType: string;
  bottleColor: string;
  label: LabelState;
  packaging: PackagingState;
  fragrance: FragranceState;
  quantity: number;

  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setBottleMaterial: (material: string) => void;
  setBottleSilhouette: (silhouette: string) => void;
  setBottleCapacity: (capacity: string) => void;
  setCapStyle: (style: string) => void;
  setCapColor: (color: string) => void;
  setPumpType: (pump: string) => void;
  setBottleColor: (color: string) => void;
  updateLabel: (label: Partial<LabelState>) => void;
  updatePackaging: (packaging: Partial<PackagingState>) => void;
  updateFragrance: (fragrance: Partial<FragranceState>) => void;
  setQuantity: (quantity: number) => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  step: 0,
  bottleMaterial: "Glass",
  bottleSilhouette: "Round",
  bottleCapacity: "100ml",
  capStyle: "Metallic Gold",
  capColor: "Transparent",
  pumpType: "Standard Spray",
  bottleColor: "Transparent",
  label: {
    name: "L'ELEGANCE",
    font: "Modern Sans",
    shape: "Rectangle",
    color: "#000000",
  },
  packaging: {
    type: "Standard Box",
    finish: "Matte",
    color: "#ffffff",
    addons: [],
  },
  fragrance: {
    top: [],
    middle: [],
    base: [],
    intensity: "Balanced",
  },
  quantity: 100,

  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 7) })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
  setBottleMaterial: (bottleMaterial) => set({ bottleMaterial }),
  setBottleSilhouette: (bottleSilhouette) => set({ bottleSilhouette }),
  setBottleCapacity: (bottleCapacity) => set({ bottleCapacity }),
  setCapStyle: (capStyle) => set({ capStyle }),
  setCapColor: (capColor) => set({ capColor }),
  setPumpType: (pumpType) => set({ pumpType }),
  setBottleColor: (bottleColor) => set({ bottleColor }),
  updateLabel: (label) =>
    set((state) => ({ label: { ...state.label, ...label } })),
  updatePackaging: (packaging) =>
    set((state) => ({ packaging: { ...state.packaging, ...packaging } })),
  updateFragrance: (fragrance) =>
    set((state) => ({ fragrance: { ...state.fragrance, ...fragrance } })),
  setQuantity: (quantity) => set({ quantity }),
}));
