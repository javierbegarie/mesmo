import { create } from 'zustand';

/**
 * Shell-level UI state. For now it only tracks whether the (future)
 * settings menu is open; the gear button in the top bar drives it.
 */
interface SettingsState {
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  toggleSettings: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  isSettingsOpen: false,
  openSettings: () => set({ isSettingsOpen: true }),
  closeSettings: () => set({ isSettingsOpen: false }),
  toggleSettings: () =>
    set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
}));
