import { create } from "zustand";

interface WalletStore {
  loading: boolean
  balance: number;
  assetBalance: number | '-';
  setBalance: (walletInfo: { balance: number; }) => void;
  setAssetBalance: (walletInfo: { balance: number }) => void;
  setLoading: (b: boolean) => void
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  loading: false,
  balance: 0,
  assetBalance: '-',
  setBalance: (walletInfo: { balance: number; }) => {
    set({
      balance: walletInfo.balance ?? get().balance,
    })
  },
  setAssetBalance: (walletInfo: { balance: number; }) => {
    set({
      assetBalance: walletInfo.balance
    })
  },
  setLoading: (loading: boolean) => {
    set({ loading })
  }
}));
