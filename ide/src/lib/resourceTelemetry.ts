import { create } from 'zustand';

export interface ResourceUsage {
  buildMinutesUsed: number;
  buildMinutesLimit: number;
  storageUsed: number; // in MB
  storageLimit: number; // in MB
  lastUpdated: string;
}

interface ResourceTelemetryState extends ResourceUsage {
  isUpdating: boolean;
  fetchUsage: () => Promise<void>;
  updateAfterBuild: (minutes: number) => void;
}

export const useResourceTelemetry = create<ResourceTelemetryState>((set) => ({
  buildMinutesUsed: 895, // Near 90% of 1000
  buildMinutesLimit: 1000,
  storageUsed: 1540,
  storageLimit: 2000,
  lastUpdated: new Date().toISOString(),
  isUpdating: false,

  fetchUsage: async () => {
    set({ isUpdating: true });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({
      lastUpdated: new Date().toISOString(),
      isUpdating: false,
    });
  },

  updateAfterBuild: (minutes: number) => {
    set((state) => ({
      buildMinutesUsed: Math.min(state.buildMinutesLimit, state.buildMinutesUsed + minutes),
      lastUpdated: new Date().toISOString(),
    }));
  },
}));
