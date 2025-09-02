import { ModalType } from "@/constants/modal";
import { create } from "zustand";

type ModalState = {
  isOpen: boolean;
  modalType?: ModalType;
  open: (type: ModalType) => void;
  close: () => Promise<void>;
  modalProps: Record<string, any>;
};

export const useModal = create<ModalState>((set, get) => ({
  isOpen: false,
  modalType: undefined,
  modalProps: {},
  open: (type: ModalType, props?: Record<string, any>) =>
    set({ isOpen: true, modalType: type, modalProps: props || {} }),
  close: () =>
    new Promise<void>((resolve, reject) => {
      const { isOpen } = get();
      if (!isOpen) {
        reject();
      }
      set({ isOpen: false, modalType: undefined, modalProps: {} });
      resolve();
    }),
}));
