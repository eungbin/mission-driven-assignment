import { create } from "zustand";

interface ModalStore {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: (() => void) | null;
  openModal: (title: string, message: string, onConfirm: () => void) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  title: "",
  message: "",
  onConfirm: null,
  openModal: (title, message, onConfirm) =>
    set({ isOpen: true, title, message, onConfirm }),
  closeModal: () =>
    set({ isOpen: false, title: "", message: "", onConfirm: null }),
}));

