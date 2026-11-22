import { create } from 'zustand';

interface AdminUIState {
  sidebarCollapsed: boolean;
  mobileDrawerOpen: boolean;
  globalSearch: string;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileDrawerOpen: (open: boolean) => void;
  setGlobalSearch: (query: string) => void;
}

export const useAdminUIStore = create<AdminUIState>((set) => ({
  sidebarCollapsed: false,
  mobileDrawerOpen: false,
  globalSearch: '',
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setMobileDrawerOpen: (open) => set({ mobileDrawerOpen: open }),
  setGlobalSearch: (query) => set({ globalSearch: query }),
}));
