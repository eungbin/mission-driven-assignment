import { create } from "zustand";

interface ToastStore {
  message: string | null;
  showToast: (message: string) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  message: null,
  showToast: (message: string) => {
    set({ message });
    // 3초 후 자동으로 숨김
    setTimeout(() => {
      set({ message: null });
    }, 3000);
  },
  hideToast: () => set({ message: null }),
}));

