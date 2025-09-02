import { OnchainDocSection } from "@/constants/oc.doc";
import { RefObject } from "react";
import { create } from "zustand";

interface ScrollStore {
  sectionRefs: Map<string, RefObject<any>>;
  sectionTops: Map<string, number>;
  setSectionRef: (id: string, ref: RefObject<any>) => void;
  setSectionTop: (id: string, y: number) => void;
  scrollToSection: (id: string) => void;
}

export const useScrollStore = create<ScrollStore>((set, get) => ({
  sectionRefs: new Map<string, RefObject<any>>(),
  sectionTops: new Map<string, number>(),
  setSectionRef: (id: string, ref: RefObject<any>) => {
    set((state) => {
      const next = new Map(state.sectionRefs);
      next.set(id, ref);
      return { sectionRefs: next };
    });
  },
  setSectionTop: (id: string, y: number) => {
    set((state) => {
      const next = new Map(state.sectionTops);
      next.set(id, y);
      return { sectionTops: next };
    });
  },
  scrollToSection: (id: string) => {
    const wrapperRef = get().sectionRefs.get(OnchainDocSection.WRAPPER);
    const y = get().sectionTops.get(id);
    console.log(wrapperRef, 'wrapperRef 🔥🔥🔥🔥');
    console.log(y, 'target y 💦💦💦💦');
    if (wrapperRef?.current && typeof y === 'number') {
      wrapperRef.current.scrollTo({ y, animated: true });
    }
  },
}));