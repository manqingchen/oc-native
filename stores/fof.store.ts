import { FofFundClient } from "@/fof_fund_sdk";
import { create } from "zustand";

interface FofStore {
  fof: FofFundClient | undefined;
  fundName: string; 
  setFundName: (fundName: string) => void;
  setFoF: (fof: FofFundClient) => void;
}

export const useFofStore = create<FofStore>((set) => ({
  fof: undefined,
  fundName: "",
  setFundName: (fundName: string) => set({ fundName }),
  setFoF: (fof: FofFundClient) => set({ fof }),
}));