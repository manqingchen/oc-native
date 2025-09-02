import { getEnvParams, getTokenAccountBalance } from "@/fof_fund_sdk/src";
import { useFofStore } from "@/stores/fof.store";
import { PublicKey } from "@solana/web3.js";
import { useWalletStore } from "@/stores/wallet.store";
import { useWalletState } from "./useWallet";
import { useEffect } from "react";
import { CURRENT_ENV } from "@/lib/config";
import { usePhantomWallet } from '@/stores/phantomWalletStore';
import { ProductService } from '@/services/product.service'

export function useWalletBalance() {
  // const { address:publicKey } = useWalletState()
  const { wallet } = usePhantomWallet()
  const { address: publicKey } = wallet || {}
  const { setBalance, setAssetBalance, setLoading } = useWalletStore();
  const { fof } = useFofStore()
  const connection = fof?.getConnection()
  const params = getEnvParams(CURRENT_ENV)

  const getFofBalance = async (_fundName: string) => {

    try {
      const params = {
        userAddress: publicKey as string,
        fundName: _fundName
      }
      const res = await ProductService.getUserFundBalance(params)
      const balance = (res)?.data?.balance || 0
      setAssetBalance({ balance })
    } catch (error) {
      setAssetBalance({ balance: 0 })
      console.log(`getFofBalance error in query ${_fundName} balance ===================>>>>>>>>>>> `, error);
    }

  }
  const getUserBalance = async () => {
    if (!publicKey || !connection) return;
    console.log('getUserbalance publicKey ===================>>>>>>>>>>> ', publicKey);
    const owner = new PublicKey(publicKey);
    setLoading(true);

    try {
      let balance = await getTokenAccountBalance(connection as any, params.cashMint, owner)
      console.log('getUserbalance balance ===================>>>>>>>>>>> ', balance);
      const f = 10000
      balance = Math.floor(balance * f) / f;
      // balance = formatNav(balance)
      setBalance({ balance });

    } catch (err) {
      console.error("", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (publicKey) {
      getUserBalance();
    }
  }, [publicKey]);

  return {
    getFofBalance
  }
} 