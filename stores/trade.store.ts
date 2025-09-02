import { create } from "zustand";

interface TradeStore {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useTradeStore = create<TradeStore>((set) => ({
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
}))