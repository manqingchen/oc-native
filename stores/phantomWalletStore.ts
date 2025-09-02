import { create } from 'zustand';
import { type UseDeeplinkWalletConnector } from '@privy-io/expo/connectors';

interface PhantomWalletStore {
  wallet: UseDeeplinkWalletConnector | undefined;
  setWallet: (wallet: UseDeeplinkWalletConnector | undefined) => void;
  initWallet: (address: string) => void;
}

export const usePhantomWallet = create<PhantomWalletStore>((set, get) => ({
  wallet: undefined,
  setWallet: (wallet) => set({ wallet }),
  initWallet: (address: string) => {
    const { wallet } = get()
    if (wallet) {

      wallet.address = address;
      wallet.isConnected = true
      set({ wallet })
    }
  }
}));