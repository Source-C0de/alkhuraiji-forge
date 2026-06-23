import { create } from "zustand";

export interface BuilderItem {
  id: number;
  name: string;
  category: string;
  active: boolean;
  image: string;
}

export interface NameItem {
  id: number;
  name: string;
  active: boolean;
}

export interface ColorItem {
  id: number;
  name: string;
  hex: string;
  active: boolean;
  // Optional price modifier for the public builder (defaults to 0).
  price?: number;
}

export type SectionKey =
  | "showBottleMaterials"
  | "showBottleCapacity"
  | "showBottleColor"
  | "showCapStyles"
  | "showPumpTypes"
  | "showCapColor";

interface AdminState {
  // Auth
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;

  // CMS Content
  heroTitle: string;
  heroSubtitle: string;
  setHeroContent: (title: string, subtitle: string) => void;

  // Builder — bottle silhouettes
  builderBottles: BuilderItem[];
  addBuilderBottle: (bottle: Omit<BuilderItem, "id">) => void;
  updateBuilderBottle: (id: number, bottle: Partial<BuilderItem>) => void;
  deleteBuilderBottle: (id: number) => void;

  // Builder — bottle step options
  builderMaterials: NameItem[];
  builderCapacities: NameItem[];
  builderColors: ColorItem[];
  addBuilderMaterial: (m: Omit<NameItem, "id">) => void;
  updateBuilderMaterial: (id: number, m: Partial<NameItem>) => void;
  deleteBuilderMaterial: (id: number) => void;
  addBuilderCapacity: (c: Omit<NameItem, "id">) => void;
  updateBuilderCapacity: (id: number, c: Partial<NameItem>) => void;
  deleteBuilderCapacity: (id: number) => void;
  addBuilderColor: (c: Omit<ColorItem, "id">) => void;
  updateBuilderColor: (id: number, c: Partial<ColorItem>) => void;
  deleteBuilderColor: (id: number) => void;

  // Builder — cap step options
  capStyles: NameItem[];
  pumpTypes: NameItem[];
  capColors: ColorItem[];
  addCapStyle: (s: Omit<NameItem, "id">) => void;
  updateCapStyle: (id: number, s: Partial<NameItem>) => void;
  deleteCapStyle: (id: number) => void;
  addPumpType: (p: Omit<NameItem, "id">) => void;
  updatePumpType: (id: number, p: Partial<NameItem>) => void;
  deletePumpType: (id: number) => void;
  addCapColor: (c: Omit<ColorItem, "id">) => void;
  updateCapColor: (id: number, c: Partial<ColorItem>) => void;
  deleteCapColor: (id: number) => void;

  // Whole-section visibility flags
  showBottleMaterials: boolean;
  showBottleCapacity: boolean;
  showBottleColor: boolean;
  showCapStyles: boolean;
  showPumpTypes: boolean;
  showCapColor: boolean;
  toggleSection: (key: SectionKey) => void;
}

// Default color palette — shared between bottle colors and cap colors so the
// admin starts with the same set the public builder has always offered.
// `price` matches the historical hardcoded values in routes/builder.tsx so
// the live configurator's price calculator stays accurate on first paint.
const DEFAULT_BOTTLE_COLORS: ColorItem[] = [
  { id: 1, name: "Transparent", hex: "transparent", active: true, price: 0 },
  { id: 2, name: "Black Frosted", hex: "#222", active: true, price: 15 },
  { id: 3, name: "Amber", hex: "#b45f06", active: true, price: 10 },
  { id: 4, name: "Emerald", hex: "#274e13", active: true, price: 12 },
  { id: 5, name: "Royal Blue", hex: "#0b5394", active: true, price: 12 },
  { id: 6, name: "Rose Gold", hex: "#b4a7d6", active: true, price: 25 },
  { id: 7, name: "White Matte", hex: "#f3f4f6", active: true, price: 15 },
  {
    id: 8,
    name: "Gradient Luxe",
    hex: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    active: true,
    price: 30,
  },
];

const DEFAULT_CAP_COLORS: ColorItem[] = DEFAULT_BOTTLE_COLORS.map((c) => ({
  ...c,
  price: 8, // cap colors share a flat price modifier regardless of bottle color tier
}));

export const useAdminStore = create<AdminState>((set) => ({
  isAuthenticated: false,
  login: (password: string) => {
    if (password === "admin123") {
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },
  logout: () => set({ isAuthenticated: false }),

  // Default values matching dictionaries.ts
  heroTitle: "Private Label Perfume\n& Cosmetic Manufacturing",
  heroSubtitle:
    "Engineering world-class luxury cosmetics, OEM and private label perfume production for global brands. Precision formulations and premium packaging developed in our state-of-the-art facility.",

  setHeroContent: (title, subtitle) => set({ heroTitle: title, heroSubtitle: subtitle }),

  // Builder — bottle silhouettes
  builderBottles: [
    {
      id: 1,
      name: "Round",
      category: "Classic",
      active: true,
      image:
        "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 2,
      name: "Square",
      category: "Modern",
      active: true,
      image:
        "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 3,
      name: "Oval",
      category: "Luxury",
      active: true,
      image:
        "https://images.unsplash.com/photo-1585365321831-7e04a49db2ce?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 4,
      name: "Cylindrical",
      category: "Signature",
      active: true,
      image:
        "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=400&q=80",
    },
  ],
  addBuilderBottle: (bottle) =>
    set((state) => ({
      builderBottles: [...state.builderBottles, { ...bottle, id: Date.now() }],
    })),
  updateBuilderBottle: (id, bottle) =>
    set((state) => ({
      builderBottles: state.builderBottles.map((b) => (b.id === id ? { ...b, ...bottle } : b)),
    })),
  deleteBuilderBottle: (id) =>
    set((state) => ({
      builderBottles: state.builderBottles.filter((b) => b.id !== id),
    })),

  // Builder — bottle step options
  builderMaterials: [
    { id: 1, name: "Glass", active: true },
    { id: 2, name: "Plastic", active: true },
    { id: 3, name: "Frosted Glass", active: true },
    { id: 4, name: "Crystal", active: true },
    { id: 5, name: "Matte Glass", active: true },
    { id: 6, name: "Recycled", active: true },
  ],
  builderCapacities: [
    { id: 1, name: "10ml", active: true },
    { id: 2, name: "30ml", active: true },
    { id: 3, name: "50ml", active: true },
    { id: 4, name: "75ml", active: true },
    { id: 5, name: "100ml", active: true },
    { id: 6, name: "150ml", active: true },
    { id: 7, name: "250ml", active: true },
  ],
  builderColors: DEFAULT_BOTTLE_COLORS,
  addBuilderMaterial: (m) =>
    set((state) => ({
      builderMaterials: [...state.builderMaterials, { ...m, id: Date.now() }],
    })),
  updateBuilderMaterial: (id, m) =>
    set((state) => ({
      builderMaterials: state.builderMaterials.map((x) => (x.id === id ? { ...x, ...m } : x)),
    })),
  deleteBuilderMaterial: (id) =>
    set((state) => ({
      builderMaterials: state.builderMaterials.filter((x) => x.id !== id),
    })),
  addBuilderCapacity: (c) =>
    set((state) => ({
      builderCapacities: [...state.builderCapacities, { ...c, id: Date.now() }],
    })),
  updateBuilderCapacity: (id, c) =>
    set((state) => ({
      builderCapacities: state.builderCapacities.map((x) => (x.id === id ? { ...x, ...c } : x)),
    })),
  deleteBuilderCapacity: (id) =>
    set((state) => ({
      builderCapacities: state.builderCapacities.filter((x) => x.id !== id),
    })),
  addBuilderColor: (c) =>
    set((state) => ({
      builderColors: [...state.builderColors, { ...c, id: Date.now() }],
    })),
  updateBuilderColor: (id, c) =>
    set((state) => ({
      builderColors: state.builderColors.map((x) => (x.id === id ? { ...x, ...c } : x)),
    })),
  deleteBuilderColor: (id) =>
    set((state) => ({
      builderColors: state.builderColors.filter((x) => x.id !== id),
    })),

  // Builder — cap step options
  capStyles: [
    { id: 1, name: "Metallic Gold", active: true },
    { id: 2, name: "Matte Black", active: true },
    { id: 3, name: "Gloss Silver", active: true },
    { id: 4, name: "Wooden Luxury", active: true },
    { id: 5, name: "Crystal Crown", active: true },
    { id: 6, name: "Colored Cap", active: true },
  ],
  pumpTypes: [
    { id: 1, name: "Standard Spray", active: true },
    { id: 2, name: "Fine Mist", active: true },
    { id: 3, name: "Luxury Atomizer", active: true },
    { id: 4, name: "Oil Roller", active: true },
  ],
  capColors: DEFAULT_CAP_COLORS,
  addCapStyle: (s) =>
    set((state) => ({
      capStyles: [...state.capStyles, { ...s, id: Date.now() }],
    })),
  updateCapStyle: (id, s) =>
    set((state) => ({
      capStyles: state.capStyles.map((x) => (x.id === id ? { ...x, ...s } : x)),
    })),
  deleteCapStyle: (id) =>
    set((state) => ({
      capStyles: state.capStyles.filter((x) => x.id !== id),
    })),
  addPumpType: (p) =>
    set((state) => ({
      pumpTypes: [...state.pumpTypes, { ...p, id: Date.now() }],
    })),
  updatePumpType: (id, p) =>
    set((state) => ({
      pumpTypes: state.pumpTypes.map((x) => (x.id === id ? { ...x, ...p } : x)),
    })),
  deletePumpType: (id) =>
    set((state) => ({
      pumpTypes: state.pumpTypes.filter((x) => x.id !== id),
    })),
  addCapColor: (c) =>
    set((state) => ({
      capColors: [...state.capColors, { ...c, id: Date.now() }],
    })),
  updateCapColor: (id, c) =>
    set((state) => ({
      capColors: state.capColors.map((x) => (x.id === id ? { ...x, ...c } : x)),
    })),
  deleteCapColor: (id) =>
    set((state) => ({
      capColors: state.capColors.filter((x) => x.id !== id),
    })),

  // Whole-section visibility flags (all on by default)
  showBottleMaterials: true,
  showBottleCapacity: true,
  showBottleColor: true,
  showCapStyles: true,
  showPumpTypes: true,
  showCapColor: true,
  toggleSection: (key) => set((state) => ({ [key]: !state[key] }) as Partial<AdminState>),
}));
