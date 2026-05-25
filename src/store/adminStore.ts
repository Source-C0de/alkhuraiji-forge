import { create } from 'zustand';

export interface BuilderItem {
  id: number;
  name: string;
  category: string;
  active: boolean;
  image: string;
}

interface AdminState {
  // Auth
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  
  // CMS Content
  heroTitle: string;
  heroSubtitle: string;
  setHeroContent: (title: string, subtitle: string) => void;

  // Builder Content
  builderBottles: BuilderItem[];
  addBuilderBottle: (bottle: Omit<BuilderItem, "id">) => void;
  updateBuilderBottle: (id: number, bottle: Partial<BuilderItem>) => void;
  deleteBuilderBottle: (id: number) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  isAuthenticated: false,
  login: (password: string) => {
    if (password === 'admin123') {
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },
  logout: () => set({ isAuthenticated: false }),
  
  // Default values matching dictionaries.ts
  heroTitle: "Private Label Perfume\n& Cosmetic Manufacturing",
  heroSubtitle: "Engineering world-class luxury cosmetics, OEM and private label perfume production for global brands. Precision formulations and premium packaging developed in our state-of-the-art facility.",
  
  setHeroContent: (title, subtitle) => set({ heroTitle: title, heroSubtitle: subtitle }),

  // Builder Data
  builderBottles: [
    { id: 1, name: "Round", category: "Classic", active: true, image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=400&q=80" },
    { id: 2, name: "Square", category: "Modern", active: true, image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=400&q=80" },
    { id: 3, name: "Oval", category: "Luxury", active: true, image: "https://images.unsplash.com/photo-1585365321831-7e04a49db2ce?auto=format&fit=crop&w=400&q=80" },
    { id: 4, name: "Cylindrical", category: "Signature", active: true, image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=400&q=80" },
  ],
  addBuilderBottle: (bottle) => set((state) => ({ 
    builderBottles: [...state.builderBottles, { ...bottle, id: Date.now() }] 
  })),
  updateBuilderBottle: (id, bottle) => set((state) => ({
    builderBottles: state.builderBottles.map((b) => b.id === id ? { ...b, ...bottle } : b)
  })),
  deleteBuilderBottle: (id) => set((state) => ({
    builderBottles: state.builderBottles.filter((b) => b.id !== id)
  }))
}));
